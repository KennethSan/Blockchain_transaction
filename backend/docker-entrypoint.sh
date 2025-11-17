#!/bin/bash
set -e

# Install required system packages and PHP extensions once per container lifecycle
if [ ! -f /.backend_setup_done ]; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq --no-install-recommends libpq-dev zip unzip git curl postgresql-client >/dev/null
    docker-php-ext-install pdo pdo_pgsql pgsql >/dev/null 2>&1
    apt-get clean
    rm -rf /var/lib/apt/lists/*
    unset DEBIAN_FRONTEND
    touch /.backend_setup_done
fi

# Ensure Composer is available
if ! command -v composer >/dev/null 2>&1; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

cd /var/www/html

# Prepare storage directories
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R 775 storage bootstrap/cache || true

# Install PHP dependencies if needed
if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Ensure .env exists and has an application key
if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=' .env || grep -q '^APP_KEY=$' .env; then
    php artisan key:generate --force
fi

# Wait for PostgreSQL to become available before running migrations
echo "[Laravel] Waiting for PostgreSQL at ${DB_HOST:-postgres}:${DB_PORT:-5432}..."
until PGPASSWORD="${DB_PASSWORD:-blockchain_pass}" psql \
    -h "${DB_HOST:-postgres}" \
    -U "${DB_USERNAME:-blockchain_user}" \
    -d "${DB_DATABASE:-blockchain}" \
    -c "SELECT 1" >/dev/null 2>&1; do
    echo "[Laravel] PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "[Laravel] Running database migrations"
php artisan migrate --force

echo "[Laravel] Starting development server on 0.0.0.0:8000"
exec php artisan serve --host=0.0.0.0 --port=8000
#!/bin/bash
set -e

# Install required system packages and PHP extensions once per container lifecycle
if [ ! -f /.backend_setup_done ]; then
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq --no-install-recommends libpq-dev zip unzip git curl postgresql-client >/dev/null
    docker-php-ext-install pdo pdo_pgsql pgsql >/dev/null 2>&1
    apt-get clean
    rm -rf /var/lib/apt/lists/*
    unset DEBIAN_FRONTEND
    touch /.backend_setup_done
fi

# Ensure Composer is available
if ! command -v composer >/dev/null 2>&1; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi

cd /var/www/html

# Prepare storage directories
mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache
chmod -R 775 storage bootstrap/cache || true

# Install PHP dependencies if needed
if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Ensure .env exists and has an application key
if [ ! -f .env ]; then
    cp .env.example .env
fi

if ! grep -q '^APP_KEY=' .env || grep -q '^APP_KEY=$' .env; then
    php artisan key:generate --force
fi

# Wait for PostgreSQL to become available before running migrations
echo "[Laravel] Waiting for PostgreSQL at ${DB_HOST:-postgres}:${DB_PORT:-5432}..."
until PGPASSWORD="${DB_PASSWORD:-blockchain_pass}" psql \
    -h "${DB_HOST:-postgres}" \
    -U "${DB_USERNAME:-blockchain_user}" \
    -d "${DB_DATABASE:-blockchain}" \
    -c "SELECT 1" >/dev/null 2>&1; do
    echo "[Laravel] PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "[Laravel] Running database migrations"
php artisan migrate --force

echo "[Laravel] Starting development server on 0.0.0.0:8000"
exec php artisan serve --host=0.0.0.0 --port=8000

