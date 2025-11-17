<<<<<<< HEAD
# Blockchain_transaction
=======
# Blockchain Application with Laravel 12 & React

A simple blockchain application demonstrating proof-of-work mining, transaction management, and chain validation.

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Git (optional)

### Installation Steps

1. **Navigate to project directory:**
```bash
cd d:/block
```

2. **Start Docker containers:**
```bash
docker-compose up -d
```

This will start:
- Laravel backend on `http://localhost:8000`
- React frontend on `http://localhost:3000`
- PostgreSQL database on `localhost:5432`

3. **Install Laravel dependencies (first time only):**
```bash
docker exec -it blockchain_laravel bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
exit
```

4. **Install React dependencies (first time only):**
```bash
docker exec -it blockchain_react bash
npm install
exit
```

5. **Restart containers:**
```bash
docker-compose restart
```

6. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

---

## 📋 Features

### Backend (Laravel 12)
- ✅ Transaction management (create, pending, mined)
- ✅ Block mining with proof-of-work (hash must start with "00")
- ✅ Blockchain validation (integrity check)
- ✅ SHA256 hashing algorithm
- ✅ PostgreSQL database
- ✅ RESTful API endpoints

### Frontend (React)
- ✅ Dashboard with statistics and controls
- ✅ Transaction creation form
- ✅ Pending transactions list
- ✅ Blockchain visualization
- ✅ Real-time mining logs
- ✅ Chain validation status
- ✅ TailwindCSS styling

---

## 🔌 API Endpoints

### Transactions
- `POST /api/transaction` - Create new transaction
- `GET /api/transactions/pending` - Get pending transactions
- `GET /api/transactions` - Get all transactions

### Blockchain
- `POST /api/block/mine` - Mine a new block
- `GET /api/blocks` - Get all blocks
- `GET /api/blockchain/validate` - Validate blockchain
- `GET /api/blockchain/statistics` - Get blockchain stats

---

## 📊 Database Schema

### transactions
- id, sender, receiver, amount, timestamp, status, created_at, updated_at

### blocks
- id, index_no, previous_hash, current_hash, nonce, timestamp, created_at, updated_at

### block_transactions (pivot)
- id, block_id, transaction_id, created_at, updated_at

---

## 🎯 Sample Workflow

1. **Create Transactions:**
   - Go to "Transactions" page
   - Fill in sender, receiver, amount
   - Submit (status: pending)

2. **Mine Block:**
   - Go to "Dashboard"
   - Click "Mine Block"
   - System performs proof-of-work
   - Block added to chain
   - Transactions marked as "mined"

3. **Validate Chain:**
   - Click "Validate Chain"
   - System checks all hashes and links
   - Returns Valid/Invalid status

4. **View Blockchain:**
   - Go to "Blocks" page
   - See visual representation of chain
   - View transactions in each block

---

## 🛠️ Docker Commands

### View logs:
```bash
docker-compose logs -f
```

### Stop containers:
```bash
docker-compose down
```

### Rebuild containers:
```bash
docker-compose up -d --build
```

### Access Laravel container:
```bash
docker exec -it blockchain_laravel bash
```

### Access PostgreSQL:
```bash
docker exec -it blockchain_postgres psql -U blockchain_user -d blockchain
```

---

## 🔧 Development

### Backend Development
```bash
# Enter Laravel container
docker exec -it blockchain_laravel bash

# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear
php artisan config:clear

# View routes
php artisan route:list
```

### Frontend Development
```bash
# Enter React container
docker exec -it blockchain_react bash

# Install new package
npm install package-name

# Build for production
npm run build
```

---

## 📝 Important Notes

- **Mining Difficulty:** Set to 2 (hash must start with "00")
- **Immutability:** Blocks cannot be edited once mined
- **Validation:** Checks all hashes, links, and proof-of-work
- **Genesis Block:** First block has previous_hash = "0"
- **Auto-increment:** Block index automatically increments

---

## 🚨 Troubleshooting

### Port already in use:
Edit `docker-compose.yml` and change port mappings

### Database connection error:
Ensure PostgreSQL container is running:
```bash
docker-compose ps
```

### Laravel dependencies not installed:
```bash
docker exec -it blockchain_laravel composer install
```

### React dependencies not installed:
```bash
docker exec -it blockchain_react npm install
```

---

## 📅 Project Timeline
**Due Date:** October 24, 2025
**Status:** Ready for development

---

## 🎓 Learning Resources
- Laravel Documentation: https://laravel.com/docs
- React Documentation: https://react.dev
- Blockchain Basics: Understanding proof-of-work and hashing

---

## 📧 Support
For issues or questions, check the logs:
```bash
docker-compose logs -f laravel
docker-compose logs -f react
```

Happy coding! 🚀
>>>>>>> master
