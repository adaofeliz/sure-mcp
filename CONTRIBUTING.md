# Contributing to sure-mcp

Contributions are welcome. Please read this guide before opening a pull request.

## Development setup

```sh
```bash
```
git clone https://github.com/adaofeliz/sure-mcp.git
cd sure-mcp
bun install
bun run typecheck
bun run build
```

## Adding a new tool

1. Create `src/tools/<resource>/<operation>.ts` following the `ToolDefinition` shape in `src/tools/shared.ts`.
2. Export the tool from `src/tools/<resource>/index.ts`.
3. Update the `EXPECTED_TOOL_COUNT` constant in `src/tools/index.ts` if adding a new tool.
4. Update the tools table in `README.md`.
5. Verify with MCP Inspector: `npx -y @modelcontextprotocol/inspector --cli node dist/index.js --method tools/list`

## Commit style

Use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(tools): add list_budgets tool`
- `fix(client): handle 429 rate limit response`
- `docs: update README installation section`

## Before submitting a PR

- [ ] `bun run typecheck` passes
- [ ] `bun run build` succeeds
- [ ] No `console.log` in source files (use `console.error`)
- [ ] No secrets committed (`grep -rE '[a-f0-9]{64}' src/` returns nothing)
- [ ] MCP Inspector output included in PR description

## Tests

This project ships without an automated test suite by design. Agent-executed QA via MCP Inspector is the verification method. PRs adding a test framework are welcome but require maintainer discussion first.
