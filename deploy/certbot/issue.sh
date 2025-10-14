#!/usr/bin/env bash
set -euo pipefail

COMPOSE_CMD="${COMPOSE_CMD:-docker compose}"
CERT_NAME="blow.ru"

# shellcheck disable=SC2016
${COMPOSE_CMD} run --rm certbot /bin/sh -c '
  set -euo pipefail
  CERT_NAME="'"${CERT_NAME}"'"

  LIVE_DIR="/etc/letsencrypt/live/${CERT_NAME}"
  ARCHIVE_DIR="/etc/letsencrypt/archive/${CERT_NAME}"
  RENEWAL_FILE="/etc/letsencrypt/renewal/${CERT_NAME}.conf"

  if [ -d "$LIVE_DIR" ] && [ ! -f "$RENEWAL_FILE" ]; then
    echo "Placeholder certificates detected, removing to allow fresh issuance."
    rm -rf "$LIVE_DIR" "$ARCHIVE_DIR"
  fi

  certbot certonly \
    --webroot -w /var/www/certbot \
    -d blow.ru \
    -d www.blow.ru \
    -d api.blow.ru \
    -d admin.blow.ru \
    --cert-name "$CERT_NAME"
'
