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
* Настроенные DNS-записи A/AAAA для доменов `blow.ru`, `api.blow.ru`, `admin.blow.ru`, указывающие на IP сервера.
* Открытые порты 22, 80 и 443 в настройках фаервола/безопасности провайдера.
* Аккаунт Docker Hub (для авторизации при сборке образов и избежания ограничения по анонимным скачиваниям).

### Установка Docker и docker compose (Ubuntu)

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
printf "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo apt install -y git
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

### Авторизация в Docker Hub

Timeweb и другие облачные провайдеры нередко делят публичный IP между несколькими клиентами. Без авторизации Docker Hub может
вернуть ошибку `429 Too Many Requests` при попытке скачать базовые образы (`node:20-alpine` и т.п.). После установки Docker
выполните вход в реестр (используя свой Docker Hub логин):

```bash
docker login
```

Команда сохранит токен в `~/.docker/config.json`, и дальнейшие `docker compose build`/`up` смогут скачивать образы без ограничений.

## Клонирование репозитория

На сервере удобнее всего держать монорепозиторий в каталоге `/opt/blow-mono` (права
на него будут у root и группы `docker`). Выполните:

```bash
sudo mkdir -p /opt/blow-mono
sudo chown $USER:$USER /opt/blow-mono
cd /opt/blow-mono
git clone https://github.com/<your-org>/blow-mono.git .
```

Если репозиторий приватный, предварительно добавьте SSH-ключ на сервер и
используйте URL вида `git@github.com:<your-org>/blow-mono.git`.

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
   Отредактируйте каждый файл, указав реальные значения (SMTP учётные данные, ключи YooMoney, адреса доменов и т.д.). Для фронтенда обязательно пропишите `API_INTERNAL_BASE=http://backend:4000/api`, чтобы контейнер Next.js направлял серверные запросы напрямую во внутренний сервис `backend` и не упирался в TLS-сертификаты Nginx. Для production-значений можно создать файлы вида `backend.env.local` и прописать их в `.gitignore`, либо править существующие `.env` непосредственно на сервере.

3. При необходимости измените `deploy/nginx/conf.d/app.conf`, если домены отличаются от приведённых (`blow.ru`, `api.blow.ru`, `admin.blow.ru`).

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
* `backend` – Nest.js API на порту 4000 (доступен с хоста по адресу http://localhost:4000 после проброса порта).
* `mongo` – MongoDB 7 с томом `mongo_data`.
* `nginx` – обратный прокси (порты 80/443), подключён к `frontend`, `admin`, `backend`.
* `certbot` – вспомогательный контейнер для выдачи и продления сертификатов.

Постоянные данные размещаются в Docker-томах:

* `mongo_data` — база MongoDB.
* `uploads_data` — директория `/app/uploads` бэкенда (можно примонтировать как bind-volume, если требуется доступ с хоста).
* `certbot_certs` и `certbot_challenges` — сертификаты и webroot для Certbot.

## Получение SSL-сертификатов

После первого запуска Nginx уже обслуживает HTTP и отдаёт ACME challenge из `/var/www/certbot`. Если реальных сертификатов ещё нет, контейнер автоматически подставит самоподписанную пару из `deploy/nginx/dev-certs` — это позволяет сервисам стартовать и дождаться выдачи Let’s Encrypt. Выполните выдачу сертификата (запросы к портам 80/443 должны доходить до сервера):

```bash
./deploy/certbot/issue.sh
```

Скрипт удаляет временные самоподписанные файлы в томе `certbot_certs`, если они ещё не были заменены реальными сертификатами Let’s Encrypt. Без этого шага Certbot может завершиться ошибкой `live directory exists for blow.ru`, потому что директория `/etc/letsencrypt/live/blow.ru` уже создана контейнером Nginx для заглушечных сертификатов.

После успешного получения сертификата перезапустите Nginx, чтобы он подхватил файлы:

```bash
docker compose restart nginx
```

> **Примечание.** Самоподписанные сертификаты предназначены только для локальной отладки и автоматического первого запуска. После получения Let’s Encrypt файлы в томе `certbot_certs` перезапишут заглушку, и Nginx начнёт обслуживать реальные домены по HTTPS.

### Автообновление сертификатов

Запланируйте обновление (например, с помощью cron):

```bash
# /etc/cron.d/certbot-renew
0 4 * * * root cd /opt/blow-mono && docker compose run --rm certbot renew --quiet
5 4 * * * root cd /opt/blow-mono && docker compose exec nginx nginx -s reload
```

Перед добавлением cron-задачи можно выполнить тест:

```bash
docker compose run --rm certbot renew --dry-run
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

## Устранение неполадок

### `failed to execute bake: signal: killed`

Во время `docker compose up -d --build` BuildKit может завершаться ошибкой `failed to execute bake: signal: killed`. Такое происходит,
когда процесс сборки контейнеров был принудительно остановлен ядром (обычно из‑за нехватки оперативной памяти или swap). Для решения:

1. Убедитесь, что Docker может использовать достаточно ресурсов: увеличьте лимиты RAM/CPU в панели провайдера или в настройках Docker Desktop.
2. Добавьте или увеличьте swap-файл на сервере, чтобы исключить OOM-killer при скачивании и распаковке больших образов.
3. При необходимости отключите параллельную сборку, выполнив `DOCKER_BUILDKIT=0 docker compose build`, либо собирайте образы по одному
   (`docker compose build frontend`, затем `backend`, `admin`).
4. После успешной сборки верните BuildKit, чтобы пользоваться кешированием слоёв и более быстрой сборкой.

Если после увеличения ресурсов проблема не исчезает, проверьте логи Docker (`docker logs <container>`/`journalctl -u docker.service`)
на предмет других ошибок.

## Перенос базы данных в контейнер MongoDB

Для копирования production-данных в контейнер `mongo` предусмотрен скрипт
`blow-be/scripts/migrate-database.js`. Он считывает документы из удалённой базы и
переносит их в локальную (контейнер должен быть запущен и доступен по
`mongodb://root:example@127.0.0.1:27017/blow?authSource=admin`, либо укажите
собственную строку подключения).

1. Убедитесь, что сервисы запущены: `docker compose up -d`.
2. Экспортируйте переменные окружения (пароль нужно URL-экранировать):

   ```bash
   export REMOTE_MONGO_URI='mongodb://gen_user:%7C1q:am&%25T7JZiD@109.73.205.45:27017/blow?authSource=admin'
   export LOCAL_MONGO_URI='mongodb://root:example@127.0.0.1:27017/blow?authSource=admin'
   export MONGO_DB_NAME='blow'
   ```

   export REMOTE_MONGO_URI='mongodb://gen_user:%7C1q%3Aam%26%25T7JZiD@109.73.205.45:27017/?authSource=admin'
export LOCAL_MONGO_URI='mongodb://root:example@127.0.0.1:27017/blow?authSource=admin'
export MONGO_DB_NAME='blow'

docker exec -it 782c6cb73cb3 bash -lc 'echo "Pinging local mongo..."; mongosh "mongodb://root:example@mongo:27017/blow?authSource=admin" --eval "db.runCommand({ping:1})"; echo "Running migrate"; npm run db:sync'


3. Выполните скрипт из каталога бэкенда:

   ```bash
   cd blow-be
   npm run db:sync
   ```

По умолчанию документы копируются пакетами по 500 записей. Измените размер
пакета, установив `MIGRATION_BATCH_SIZE`. Скрипт удаляет локальные коллекции
перед загрузкой данных и синхронизирует индексы.

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

docker compose down --remove-orphans && docker system prune -af && docker builder prune -af && docker compose build --no-cache && docker compose up -d

docker system prune -a

docker compose restart nginx

docker compose exec backend bash

ctrl + D (выйти)

docker compose down --remove-orphans
docker compose build --no-cache
docker compose up -d