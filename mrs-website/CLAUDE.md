@AGENTS.md

## Verification Protocol (mandatory)

After every task that creates, modifies, or deletes files:

1. Run `ls -la <path>` immediately after each write to confirm the file exists
2. For config/JSON files: `head -20 <file>` to confirm contents wrote
3. For code changes: show the diff, not a summary of the diff
4. For env vars: `cat .env.local | sed 's/=.*/=REDACTED/'` to confirm keys present
5. For TypeScript changes: run `npx tsc --noEmit` and include full stdout

Final summary must include:
- `pwd` showing the working directory when writes happened
- Raw output of each verification command, not a paraphrase
- Explicit PASS/FAIL per task, based on verification output (not intent)

Never claim success without showing the verification output that proves it.
Never summarize file creation — list exact paths as returned by `ls`.
If any verification fails, STOP and report; do not proceed to next task.
