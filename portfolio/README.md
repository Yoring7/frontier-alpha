# Portfolio Tracking

## Directory Structure

```
portfolio/
├── holdings.json          # Real portfolio positions (authoritative state)
├── transactions.json      # Real portfolio trade history
├── sim_holdings.json      # Paper trading portfolio (agent-managed)
├── sim_transactions.json  # Paper trading trade log
├── snapshots/
│   ├── YYYY-MM-DD.json    # Real portfolio EOD snapshots
│   └── sim/
│       └── YYYY-MM-DD.json # Sim portfolio EOD snapshots
└── README.md
```

## File Schemas

### holdings.json (Real Portfolio)
The live portfolio state. Update after every trade or daily refresh via `longbridge positions`. **Read-only for the trading agent.**

### sim_holdings.json (Paper Trading)
The paper trading portfolio managed by the trading agent. Same schema as `holdings.json` plus `account_type: "paper"`, `initial_capital`, and `cash_balance` fields. Agent updates this after every sim trade.

### sim_transactions.json
Append-only trade log for paper trading. Each entry includes `session` (premarket/midsession/postmarket), `order_id`, and `reasoning` fields in addition to the standard transaction fields.

### holdings.json (Real Portfolio - Detail)

Key fields per position:
- `symbol` — Longbridge format: `TICKER.MARKET`
- `type` — `stock` | `etf_leveraged` | `option`
- `tags` — thematic labels for grouping (e.g. `ai`, `space`, `ev`, `crypto`)
- `avg_cost` — average cost price per share/contract
- `market_value` — quantity × last_price (null for options without live quote)
- `cost_basis` — total cost (for options: contracts × 100 × avg_cost)
- `unrealized_pnl` / `unrealized_pnl_pct`

Option positions include an `option` sub-object with: `underlying`, `option_type`, `strike`, `expiry`, `contracts`, `shares_per_contract`.

### transactions.json
Append-only trade log. Each entry:
```json
{
  "id": "TXN-001",
  "date": "YYYY-MM-DD",
  "time": "HH:MM:SS",
  "action": "buy | sell | option_buy | option_sell | option_expired | option_exercised",
  "symbol": "TICKER.MARKET",
  "quantity": 10,
  "price": 50.00,
  "amount": 500.00,
  "fees": 0.00,
  "currency": "USD",
  "realized_pnl": null,
  "notes": ""
}
```

### snapshots/YYYY-MM-DD.json
EOD snapshot of all positions. Used to compute daily P&L between dates.

## Refresh Workflow (for agents)

1. Pull latest positions: `longbridge positions`
2. Pull latest quotes: `longbridge quote SYMBOL1 SYMBOL2 ...`
3. Recompute `market_value`, `unrealized_pnl`, `unrealized_pnl_pct` for each position
4. Update `holdings.json` → `last_updated`
5. Save a new snapshot to `snapshots/YYYY-MM-DD.json`
6. Daily P&L = today's `stocks_market_value` − yesterday's `stocks_market_value`

## Theme Tags Reference

| Tag | Positions |
|-----|-----------|
| `ai` | NVDA, NBIS, CRWV, GOOG |
| `space` / `aerospace` | RKLB, ASTS, SATS, RKLX |
| `ev` | TSLA, NIO, XPEV |
| `china` | NIO, XPEV |
| `semiconductor` | NVDA, SOXL |
| `nuclear` | OKLO |
| `fintech` / `crypto` | HOOD, CRCL, CRML, BMNR |
| `leveraged_3x` | SOXL, TQQQ |
| `leveraged_2x` | RKLX |
| `options` | NIO270115C10000, HOOD270115C150000, HOOD260618C160000, CRWV270115C100000 |
