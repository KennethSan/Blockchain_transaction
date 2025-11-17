## 🚀 QUICK START GUIDE

### Step 1: Start Docker
```bash
cd d:/block
docker-compose up -d
```

### Step 2: Setup Laravel (First Time Only)
```bash
docker exec -it blockchain_laravel bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
exit
```

### Step 3: Setup React (First Time Only)
```bash
docker exec -it blockchain_react bash
npm install
exit
```

### Step 4: Restart Everything
```bash
docker-compose restart
```

### Step 5: Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

---

## 🎯 How to Use

1. **Create Transactions** (http://localhost:3000/transactions)
   - Enter sender name
   - Enter receiver name
   - Enter amount
   - Click "Create Transaction"

2. **Mine Block** (http://localhost:3000)
   - Click "Mine Block" button
   - Wait for proof-of-work to complete
   - Block will be added to chain

3. **Validate Chain** (http://localhost:3000)
   - Click "Validate Chain" button
   - See if blockchain is valid

4. **View Blocks** (http://localhost:3000/blocks)
   - See all mined blocks
   - View transactions in each block
   - See hash connections

---

## 🛑 Stop Everything
```bash
docker-compose down
```

---

## 📌 Important Commands

### View Logs:
```bash
docker-compose logs -f
```

### Access Database:
```bash
docker exec -it blockchain_postgres psql -U blockchain_user -d blockchain
```

### Clear Laravel Cache:
```bash
docker exec -it blockchain_laravel php artisan cache:clear
```

### Rebuild Docker:
```bash
docker-compose up -d --build
```
