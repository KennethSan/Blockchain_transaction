#!/bin/sh
set -e

cd /app

# Install node dependencies only when missing
if [ ! -d node_modules ]; then
    echo "[React] Installing node dependencies"
    npm install
fi

export HOST=::
export PORT=3000
export CHOKIDAR_USEPOLLING=1

echo "[React] Starting development server on :::3000"
exec npm start

