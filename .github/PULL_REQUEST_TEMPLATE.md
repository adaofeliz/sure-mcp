## Summary

<!-- What does this PR do? -->

## Linked issue

Closes #

## QA

<!-- Paste MCP Inspector output for any new or changed tools -->

```
npx -y @modelcontextprotocol/inspector --cli node dist/index.js --method tools/list
```

## Checklist

- [ ] `bun run typecheck` passes
- [ ] `bun run build` succeeds
- [ ] No `console.log` in source files
- [ ] No secrets in diff (`grep -rE '[a-f0-9]{64}' src/` returns nothing)
- [ ] README updated if tools changed
