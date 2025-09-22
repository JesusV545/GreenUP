#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" != "false" ]; then
  echo "Running database migrations..."
  npm run db:migrate
fi

exec "$@"