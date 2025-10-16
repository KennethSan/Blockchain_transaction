#!/bin/sh
set -eu

cd /app

# Install node dependencies only when missing
if [ ! -d node_modules ]; then
    echo "[React] Installing node dependencies"
    npm install
fi

export HOST=0.0.0.0
export PORT=3000
export CHOKIDAR_USEPOLLING=1

echo "[React] Starting development server on 0.0.0.0:3000"
exec npm start
