# sure-mcp

[![npm](https://img.shields.io/npm/v/@adflz/sure-mcp)](https://www.npmjs.com/package/@adflz/sure-mcp) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Node >=20](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org)

A Model Context Protocol (MCP) server for the [Sure](https://github.com/we-promise/sure) finance API. Exposes 16 typed tools for AI agents to read accounts, categories, and merchants; and full CRUD for transactions and tags. Designed for transaction-enrichment automation: let an agent look up merchant details on the web, assign categories, manage tags, and update transactions autonomously.

---

## Requirements

- Node.js 20 or higher
- A running [Sure](https://github.com/we-promise/sure) instance (self-hosted or cloud)
- An API key generated from your Sure account settings

---

## Installation

### Claude Desktop

Add the server to your Claude Desktop configuration file:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sure": {
      "command": "npx",
      "args": ["-y", "@adflz/sure-mcp"],
      "env": {
        "SURE_URL": "https://sure.example.com",
        "SURE_API_KEY": "<your-sure-api-key>"
      }
    }
  }
}
```

### Claude Code

Add the server to your MCP configuration:

- Project-level: `.claude/mcp.json`
- Global: `~/.claude/mcp.json`

```json
{
  "mcpServers": {
    "sure": {
      "command": "npx",
      "args": ["-y", "@adflz/sure-mcp"],
      "env": {
        "SURE_URL": "https://sure.example.com",
        "SURE_API_KEY": "<your-sure-api-key>"
      }
    }
  }
}
```

> **Note**: Any stdio-compatible MCP client can use this server. Use [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to debug MCP communication.

---

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `SURE_URL` | Base URL of your Sure instance (e.g., `https://sure.example.com`). Do not include `/api/v1` or trailing slashes. | Yes |
| `SURE_API_KEY` | API key generated from Sure account settings → API keys. Keep this secret; never commit it to source control. | Yes |

---

## Tools

The server exposes 16 typed tools across 5 resource types. All tools use the MCP request/response format.

| Tool | Resource | Operation | Annotations |
|------|----------|-----------|-------------|
| `list_transactions` | Transactions | List with filters | read-only |
| `get_transaction` | Transactions | Get by ID | read-only |
| `create_transaction` | Transactions | Create | — |
| `update_transaction` | Transactions | Update fields | idempotent |
| `delete_transaction` | Transactions | Delete | destructive, idempotent |
| `list_tags` | Tags | List all | read-only |
| `get_tag` | Tags | Get by ID | read-only |
| `create_tag` | Tags | Create | — |
| `update_tag` | Tags | Update name/color | idempotent |
| `delete_tag` | Tags | Delete | destructive, idempotent |
| `list_categories` | Categories | List with filters | read-only |
| `get_category` | Categories | Get by ID | read-only |
| `list_merchants` | Merchants | List all | read-only |
| `get_merchant` | Merchants | Get by ID | read-only |
| `list_accounts` | Accounts | List all | read-only |
| `get_account` | Accounts | Get by ID | read-only |

---

## Example workflows

### Enrich transactions

1. Call `list_transactions` with filters for recent uncategorized entries (e.g., `start_date` set to 30 days ago, `per_page=50`).
2. For each transaction, research the merchant name using external tools.
3. Call `update_transaction` with the resolved `category_id`, `merchant_id`, and `tag_ids`.
4. Repeat until all uncategorized transactions are enriched.

### Bulk re-tag

1. Call `list_transactions` filtered by a specific merchant ID.
2. For each transaction, call `update_transaction` to apply a new tag via `tag_ids`.
3. Optionally remove old tags by excluding them from subsequent updates.

### Monthly review

1. Call `list_transactions` with `start_date` and `end_date` for the previous month, `per_page=100`.
2. Aggregate results by category to produce spending summaries.
3. Export or store the summary for reporting.

---

## Limitations

- **Categories and merchants are read-only** via the Sure API. Create or edit them in the Sure web UI.
- **No automatic retry** is implemented. The server surfaces 429 (rate limit) and 5xx errors directly; the consuming agent decides how to proceed.
- **Transport**: stdio only. HTTP and SSE transports are not supported.

---

## Local development

```bash
# Clone the repository
git clone https://github.com/adaofeliz/sure-mcp.git
cd sure-mcp

# Install dependencies
bun install

# Typecheck
bun run typecheck

# Build
bun run build

# Smoke test (requires SURE_URL and SURE_API_KEY in environment)
npx -y @modelcontextprotocol/inspector --cli node dist/index.js --method tools/list
```

### Releasing

1. Update the version in `package.json`
2. Commit changes: `git commit -m "Release vX.Y.Z"`
3. Create and push a tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
4. GitHub Actions publishes to npm automatically. Ensure `NPM_TOKEN` is set in repository secrets.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Security

See [SECURITY.md](SECURITY.md).

---

## License

MIT — see [LICENSE](LICENSE)