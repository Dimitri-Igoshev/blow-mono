# Blow Monorepo Deployment

Этот репозиторий содержит фронтенд (Next.js), бэкенд (Nest.js) и админку (React + Vite) проекта Blow, а также инфраструктуру для контейнеризации, обратного прокси Nginx и выдачи SSL-сертификатов с помощью Certbot.

## Структура

```
blow-fe/   # клиентское приложение (Next.js)
blow-be/   # API (Nest.js)
blow-ap/   # админка (Vite + React)
deploy/
  env/     # .env-файлы для docker-compose
  nginx/   # конфигурация Nginx
Dockerfile # в каждом приложении
```

Главная точка входа — `docker-compose.yml`, собирающая и запускающая все сервисы.

## Предварительные требования

* Ubuntu 22.04/24.04 (инструкции ниже протестированы на Timeweb Cloud).
* Настроенные DNS-записи A/AAAA для доменов `kutumba.ru`, `api.kutumba.ru`, `admin.kutumba.ru`, указывающие на IP сервера.
* Открытые порты 22, 80 и 443 в настройках фаервола/безопасности провайдера.

### Установка Docker и docker compose (Ubuntu)

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
printf "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

Дополнительно рекомендуется включить UFW и разрешить только нужные порты:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Подготовка окружения

1. Скопируйте корневой файл окружения:
   ```bash
   cp .env.example .env
   ```
   Заполните в `.env` значения для `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD` (сложный пароль), при необходимости обновите домены.

2. Обновите сервисные `.env`:
   ```bash
   cp deploy/env/backend.env.example deploy/env/backend.env
   cp deploy/env/frontend.env.example deploy/env/frontend.env
   cp deploy/env/admin.env.example deploy/env/admin.env
   ```
   Отредактируйте каждый файл, указав реальные значения (SMTP учётные данные, ключи YooMoney, адреса доменов и т.д.). Для production-значений можно создать файлы вида `backend.env.local` и прописать их в `.gitignore`, либо править существующие `.env` непосредственно на сервере.

3. При необходимости измените `deploy/nginx/conf.d/app.conf`, если домены отличаются от приведённых (`kutumba.ru`, `api.kutumba.ru`, `admin.kutumba.ru`).

## Сборка и запуск

```bash
# Старт в фоне
docker compose up -d --build

# Проверка статуса
docker compose ps
```

Сервисы:

* `frontend` – Next.js на порту 3000 внутри сети.
* `admin` – статическая сборка админки (Nginx) на порту 80 внутри сети.
* `backend` – Nest.js API на порту 4000.
* `mongo` – MongoDB 7 с томом `mongo_data`.
* `nginx` – обратный прокси (порты 80/443), подключён к `frontend`, `admin`, `backend`.
* `certbot` – вспомогательный контейнер для выдачи и продления сертификатов.

Постоянные данные размещаются в Docker-томах:

* `mongo_data` — база MongoDB.
* `uploads_data` — директория `/app/uploads` бэкенда (можно примонтировать как bind-volume, если требуется доступ с хоста).
* `certbot_certs` и `certbot_challenges` — сертификаты и webroot для Certbot.

## Получение SSL-сертификатов

После первого запуска Nginx уже обслуживает HTTP и отдаёт ACME challenge из `/var/www/certbot`. Выполните выдачу сертификата (запросы к портам 80/443 должны доходить до сервера):

```bash
docker compose run --rm certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d kutumba.ru -d www.kutumba.ru \
  -d api.kutumba.ru -d admin.kutumba.ru
```

После успешного получения сертификата перезапустите Nginx, чтобы он подхватил файлы:

```bash
docker compose restart nginx
```

### Автообновление сертификатов

Запланируйте обновление (например, с помощью cron):

```bash
# /etc/cron.d/certbot-renew
0 4 * * * root cd /opt/blow-mono && docker compose run --rm certbot certbot renew --quiet
5 4 * * * root cd /opt/blow-mono && docker compose exec nginx nginx -s reload
```

Перед добавлением cron-задачи можно выполнить тест:

```bash
docker compose run --rm certbot certbot renew --dry-run
```

## Обновление приложения

```bash
git pull
cp deploy/env/backend.env.local deploy/env/backend.env # при необходимости
cp deploy/env/frontend.env.local deploy/env/frontend.env
cp deploy/env/admin.env.local deploy/env/admin.env
docker compose pull
docker compose build
docker compose up -d
```

## Резервное копирование MongoDB

```bash
docker compose exec mongo mongodump --username "$MONGO_ROOT_USERNAME" --password "$MONGO_ROOT_PASSWORD" --authenticationDatabase admin --db blow --out /data/backup
```

Резервную копию можно затем извлечь командой `docker cp`.

## Особенности Timeweb Cloud

1. Создайте виртуальную машину (Ubuntu 22.04/24.04) с достаточными ресурсами (минимум 2 CPU, 4 ГБ RAM).
2. В панели Timeweb откройте порты 80 и 443 (раздел «Правила брандмауэра»).
3. Привяжите домен в панели (A-запись на IP сервера). Не забудьте поддомены `api` и `admin`.
4. Подключитесь по SSH и выполните шаги из раздела «Предварительные требования» и «Подготовка окружения».
5. Разместите репозиторий (например, `/opt/blow-mono`), заполните `.env` файлы и запустите `docker compose up -d --build`.
6. После выдачи сертификатов убедитесь, что сайты открываются по HTTPS.

## Отладка и логи

```bash
# Просмотр логов конкретного сервиса
docker compose logs -f backend

# Пересборка только одного сервиса
docker compose build frontend

# Остановка стека
docker compose down
```

## Дальнейшая настройка

* Отредактируйте `deploy/nginx/conf.d/app.conf`, если нужно проксировать дополнительные сервисы или подключить HTTP/2 push.
* Обновите переменные в `deploy/env/*.env`, чтобы указать реальные SMTP и YooMoney данные.
* Для production стоит заменить стандартные Docker-тома на bind-монтаж папок (`./data/mongo:/data/db` и т.п.), чтобы упростить резервное копирование.

При возникновении вопросов см. комментарии в `docker-compose.yml` и конфигурационных файлах Nginx.
