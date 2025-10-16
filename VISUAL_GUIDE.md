# 📊 BLOCKCHAIN APPLICATION - VISUAL GUIDE

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                     http://localhost:3000                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │ Transactions │  │   Blocks     │      │
│  │   Page       │  │    Page      │  │    Page      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│              ▲                                               │
│              │ Axios API Client                              │
└──────────────┼───────────────────────────────────────────────┘
               │
               │ REST API Calls
               ▼
┌─────────────────────────────────────────────────────────────┐
│                 LARAVEL BACKEND API                          │
│                http://localhost:8000/api                     │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ TransactionController│  │ BlockchainController │        │
│  └──────────┬───────────┘  └─────────┬────────────┘        │
│             │                         │                      │
│             └──────────┬──────────────┘                      │
│                        │                                     │
│                        ▼                                     │
│              ┌──────────────────┐                            │
│              │ BlockchainService│                            │
│              │  - generateHash  │                            │
│              │  - validateChain │                            │
│              │  - mineBlock     │                            │
│              └──────────┬───────┘                            │
│                         │                                    │
│                         ▼                                    │
│         ┌──────────────────────────────┐                     │
│         │   Eloquent ORM Models        │                     │
│         │  ┌──────────┐ ┌──────────┐  │                     │
│         │  │Transaction│ │  Block   │  │                     │
│         │  └──────────┘ └──────────┘  │                     │
│         └──────────────┬───────────────┘                     │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          │ SQL Queries
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                         │
│         ┌──────────────┐  ┌──────────────┐                 │
│         │ transactions │  │    blocks    │                  │
│         └──────────────┘  └──────────────┘                  │
│                 └────┬──────────┘                            │
│                      │                                       │
│              ┌───────▼─────────┐                             │
│              │block_transactions│                            │
│              │   (pivot table)  │                            │
│              └──────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Mining Process Flow

```
START: User clicks "Mine Block"
   │
   ▼
[Get Pending Transactions]
   │
   ├─ If none ──→ [Error: No transactions]
   │
   ▼
[Get Last Block]
   │
   ├─ If exists ──→ Use its hash as previous_hash
   └─ If none ───→ Use "0" as previous_hash (Genesis)
   │
   ▼
[Create New Block]
   - index_no = last_index + 1
   - previous_hash = from above
   - timestamp = now()
   - nonce = 0
   │
   ▼
[Attach Transactions to Block]
   │
   ▼
[START PROOF OF WORK LOOP]
   │
   ▼
┌──────────────────────┐
│ Generate Hash        │
│ = SHA256(           │
│     index_no +      │
│     previous_hash + │
│     timestamp +     │
│     transactions +  │
│     nonce           │
│   )                 │
└──────┬───────────────┘
       │
       ▼
   [Check Hash]
   Does it start with "00"?
       │
       ├─ NO ──→ nonce++, try again
       │         (loop back)
       │
       ├─ YES ──→ Valid hash found!
                  │
                  ▼
            [Save Block]
            - current_hash = valid hash
            - nonce = final nonce
                  │
                  ▼
      [Update Transactions]
      status: pending → mined
                  │
                  ▼
               [DONE]
         Block added to chain!
```

---

## 💾 Database Relationships

```
transactions                  block_transactions              blocks
┌──────────┐                 ┌──────────────┐              ┌──────────┐
│ id       │◄────────┐       │ id           │       ┌─────►│ id       │
│ sender   │         │       │ transaction_id│───────┘      │ index_no │
│ receiver │         └───────┤ block_id     │              │ prev_hash│
│ amount   │                 └──────────────┘              │ curr_hash│
│ status   │                       ▲                        │ nonce    │
│ timestamp│                       │                        │ timestamp│
└──────────┘                       │                        └──────────┘
                                   │
                          Many-to-Many
                         Pivot Table
```

**Relationship:**
- One Block can have MANY Transactions
- One Transaction can be in ONE Block
- block_transactions is the pivot table

---

## 🔐 Blockchain Structure

```
Block #0 (Genesis)                Block #1                     Block #2
┌──────────────────┐              ┌──────────────────┐        ┌──────────────────┐
│ Index: 0         │              │ Index: 1         │        │ Index: 2         │
│ Prev Hash: 0     │              │ Prev Hash:       │        │ Prev Hash:       │
│ Curr Hash: 00abc │◄─────────────│   00abc          │◄───────│   00def          │
│ Nonce: 12345     │              │ Curr Hash: 00def │        │ Curr Hash: 00xyz │
│ Transactions: 3  │              │ Nonce: 45678     │        │ Nonce: 78901     │
│ - Alice→Bob $100 │              │ Transactions: 2  │        │ Transactions: 1  │
│ - Bob→Charlie $50│              │ - Dave→Eve $200  │        │ - Alice→Dave $75 │
│ - Charlie→Alice  │              │ - Eve→Frank $150 │        │                  │
└──────────────────┘              └──────────────────┘        └──────────────────┘
```

**Chain Validation Checks:**
1. ✅ Block 0: prev_hash = "0" (genesis)
2. ✅ Block 1: prev_hash matches Block 0 curr_hash
3. ✅ Block 2: prev_hash matches Block 1 curr_hash
4. ✅ All hashes start with "00" (proof of work)
5. ✅ All hash calculations are correct

---

## 🎯 Transaction Lifecycle

```
1. CREATED
   [User submits form]
         │
         ▼
   ┌─────────────┐
   │  Database   │
   │ status:     │
   │  "pending"  │
   └─────────────┘
         │
         │ (waiting for mining)
         │
         ▼
2. PENDING
   [Visible in pending list]
         │
         │ (user clicks mine)
         │
         ▼
3. MINING
   [Included in new block]
   [Proof of work running]
         │
         ▼
4. MINED
   ┌─────────────┐
   │  Database   │
   │ status:     │
   │  "mined"    │
   └─────────────┘
         │
         ▼
5. IN BLOCKCHAIN
   [Immutable, part of chain]
   [Cannot be edited]
```

---

## 🖥️ Frontend Pages Layout

### Dashboard
```
┌─────────────────────────────────────────┐
│ 📊 Dashboard                            │
├─────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│ │  📦 │ │  💰 │ │  ⏳ │ │  ✅ │       │
│ │  5  │ │ 15  │ │  3  │ │Valid│       │
│ └─────┘ └─────┘ └─────┘ └─────┘       │
│                                         │
│ [⛏️ Mine Block] [🔍 Validate] [🔄]    │
│                                         │
│ 📝 Activity Log:                        │
│ ┌───────────────────────────────────┐  │
│ │[12:00:01] Mining started...       │  │
│ │[12:00:05] ✅ Block mined!         │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Transactions Page
```
┌─────────────────────────────────────────┐
│ 💸 Transactions                         │
├─────────────────────────────────────────┤
│ Create New Transaction                  │
│ ┌─────────────────────────────────────┐ │
│ │ Sender:   [____________]            │ │
│ │ Receiver: [____________]            │ │
│ │ Amount:   [____________]            │ │
│ │ [💸 Create Transaction]             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Pending Transactions (3)                │
│ ┌─────────────────────────────────────┐ │
│ │ ⏳ Alice → Bob      $100.00        │ │
│ │ ⏳ Bob → Charlie    $50.00         │ │
│ │ ⏳ Charlie → Dave   $25.00         │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Blocks Page
```
┌─────────────────────────────────────────┐
│ ⛓️ Blockchain                           │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🔷 Block #0        Nonce: 12345    │ │
│ │ Hash: 00abc123...                  │ │
│ │ Prev: 0 (Genesis)                  │ │
│ │ Transactions: 3                    │ │
│ │ - Alice→Bob $100                   │ │
│ │ - Bob→Charlie $50                  │ │
│ └─────────────────────────────────────┘ │
│            ⬇                            │
│ ┌─────────────────────────────────────┐ │
│ │ 🔷 Block #1        Nonce: 45678    │ │
│ │ Hash: 00def456...                  │ │
│ │ Prev: 00abc123...                  │ │
│ │ Transactions: 2                    │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🔑 Key Concepts Illustrated

### SHA256 Hashing
```
Input:                          Output:
┌───────────────────┐          ┌──────────────────────────┐
│ {                 │          │                          │
│   index: 0,       │          │ 00abc123def456789...     │
│   prev_hash: "0", │  SHA256  │                          │
│   nonce: 12345,   │  ──────► │ (64 character hash)      │
│   transactions    │          │                          │
│ }                 │          │                          │
└───────────────────┘          └──────────────────────────┘

- Same input = Same output (deterministic)
- Tiny change in input = Completely different output
- Cannot reverse engineer input from output
```

### Proof of Work
```
Try nonce = 0:    Hash = fa123abc... ❌ (doesn't start with 00)
Try nonce = 1:    Hash = 8b456def... ❌
Try nonce = 2:    Hash = 1c789012... ❌
...
Try nonce = 12345: Hash = 00abc123... ✅ (starts with 00!)

This "work" proves computational effort was spent.
Makes blockchain tamper-resistant.
```

---

## 📱 Responsive Design

The frontend uses TailwindCSS for responsive design:

```
Desktop (>768px)          Mobile (<768px)
┌─────────┬─────────┐    ┌─────────────┐
│  Stats  │  Stats  │    │   Stats     │
│  Card   │  Card   │    ├─────────────┤
├─────────┼─────────┤    │   Stats     │
│  Stats  │  Stats  │    ├─────────────┤
│  Card   │  Card   │    │   Stats     │
└─────────┴─────────┘    ├─────────────┤
                         │   Stats     │
                         └─────────────┘
```

---

This visual guide helps understand the complete system architecture!
