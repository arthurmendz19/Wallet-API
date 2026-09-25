# Wallet API

A REST API that simulates an investment wallet. Users register buy/sell operations for assets, and the system calculates their current position, total invested, and profit/loss.

This project is part of my journey learning backend development (Node.js, TypeScript, Express), built as a portfolio piece — not a course project.

## Status

In progress — MVP phase.

## Roadmap

- [ ] **v1 — MVP**: core CRUD for assets and operations, in-memory data, fixed asset prices
- [ ] **v2 — Persistence**: migrate from in-memory storage to a real database (SQL)
- [ ] **v3 — Auth**: multiple users, each with their own isolated wallet (JWT authentication)
- [ ] **v4 — Real prices**: replace fixed prices with real quotes from an external API (currency/crypto)

## Entities

### Asset
Represents something that can be traded (e.g. a stock ticker or a cryptocurrency).

| Field | Type | Description |
|---|---|---|
| id | number | Unique identifier |
| ticker | string | Short code (e.g. "PETR4", "BTC") |
| name | string | Full name (e.g. "Petrobras") |
| currentPrice | number | Current price (fixed for now) |

### Operation
A single buy or sell transaction registered by the user.

| Field | Type | Description |
|---|---|---|
| id | number | Unique identifier |
| assetId | number | Reference to the traded asset |
| type | "buy" \| "sell" | Operation type |
| quantity | number | Amount traded |
| unitPrice | number | Price per unit at the time of the operation |
| date | string | Date of the operation |

## Planned Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/assets` | List all assets |
| POST | `/assets` | Create a new asset |
| GET | `/assets/:id` | Get a single asset |
| GET | `/operations` | List all operations |
| POST | `/operations` | Register a new operation |
| GET | `/operations/:id` | Get a single operation |
| DELETE | `/operations/:id` | Remove an operation |
| GET | `/wallet` | Calculate current position: total invested, quantity held per asset, and profit/loss |

## Tech Stack

- Node.js
- TypeScript
- Express
- (Phase v2) SQL database

## Running locally

```bash
npm install
npm start
```

Server runs on `http://localhost:3333`.
