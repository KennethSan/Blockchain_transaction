# API Testing Guide

Base URL: `http://localhost:8000/api`

## 1. Create Transaction
```bash
curl -X POST http://localhost:8000/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "Alice",
    "receiver": "Bob",
    "amount": 100.50
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "id": 1,
    "sender": "Alice",
    "receiver": "Bob",
    "amount": "100.50",
    "status": "pending",
    "timestamp": "2025-10-14T12:00:00.000000Z"
  }
}
```

---

## 2. Get Pending Transactions
```bash
curl -X GET http://localhost:8000/api/transactions/pending
```

Expected Response:
```json
{
  "success": true,
  "data": [...],
  "count": 3
}
```

---

## 3. Mine Block
```bash
curl -X POST http://localhost:8000/api/block/mine
```

Expected Response:
```json
{
  "success": true,
  "message": "Block mined successfully",
  "data": {
    "id": 1,
    "index_no": 0,
    "previous_hash": "0",
    "current_hash": "00abc123...",
    "nonce": 12345,
    "timestamp": "2025-10-14T12:00:00.000000Z",
    "transactions": [...]
  }
}
```

---

## 4. Get All Blocks
```bash
curl -X GET http://localhost:8000/api/blocks
```

Expected Response:
```json
{
  "success": true,
  "data": [...],
  "count": 5
}
```

---

## 5. Validate Blockchain
```bash
curl -X GET http://localhost:8000/api/blockchain/validate
```

Expected Response:
```json
{
  "success": true,
  "is_valid": true,
  "message": "Blockchain is valid"
}
```

---

## 6. Get Statistics
```bash
curl -X GET http://localhost:8000/api/blockchain/statistics
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "total_blocks": 5,
    "total_transactions": 15,
    "pending_transactions": 3,
    "mined_transactions": 12,
    "is_valid": true
  }
}
```

---

## Testing Sequence

### Scenario 1: Basic Flow
```bash
# 1. Create first transaction
curl -X POST http://localhost:8000/api/transaction -H "Content-Type: application/json" -d '{"sender":"Alice","receiver":"Bob","amount":100}'

# 2. Create second transaction
curl -X POST http://localhost:8000/api/transaction -H "Content-Type: application/json" -d '{"sender":"Bob","receiver":"Charlie","amount":50}'

# 3. Check pending transactions
curl -X GET http://localhost:8000/api/transactions/pending

# 4. Mine block
curl -X POST http://localhost:8000/api/block/mine

# 5. Validate chain
curl -X GET http://localhost:8000/api/blockchain/validate

# 6. View all blocks
curl -X GET http://localhost:8000/api/blocks
```

---

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "errors": {
    "sender": ["The sender field is required."],
    "amount": ["The amount must be at least 0.01."]
  }
}
```

### No Pending Transactions (500)
```json
{
  "success": false,
  "message": "Mining failed",
  "error": "No pending transactions to mine"
}
```

### Invalid Chain (200)
```json
{
  "success": true,
  "is_valid": false,
  "message": "Blockchain validation failed"
}
```

---

## Using Postman

1. Import these endpoints as a collection
2. Set base URL as environment variable: `{{base_url}}`
3. Value: `http://localhost:8000/api`
4. Test each endpoint sequentially

---

## Using VS Code REST Client

Install "REST Client" extension, then create `test.http`:

```http
### Create Transaction
POST http://localhost:8000/api/transaction
Content-Type: application/json

{
  "sender": "Alice",
  "receiver": "Bob",
  "amount": 100
}

### Get Pending
GET http://localhost:8000/api/transactions/pending

### Mine Block
POST http://localhost:8000/api/block/mine

### Validate Chain
GET http://localhost:8000/api/blockchain/validate
```
