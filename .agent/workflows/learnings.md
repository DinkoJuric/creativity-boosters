---
description: Learnings from past projects to apply in future work
---

# Cross-Project Learnings

## Windows/PowerShell
- Use `;` to chain commands, NOT `&&` (Bash syntax)
- Use `Move-Item` instead of `mv` for file operations

## GitHub Pages
- `index.html` MUST be at repository root (not in subfolder)
- 404 errors usually mean file structure issue
- Wait 60s after push for changes to propagate

## Google Apps Script (Sheets API)
- Use `URLSearchParams` for form-encoded POST (avoids CORS preflight)
- Always `decodeURIComponent()` on received form data
- Must redeploy as "New Version" after code changes (old ID = old code)
- User must click "Advanced" → "Go to unsafe" for personal scripts

## User Communication
- When providing code snippets, warn not to copy markdown formatting (` ```javascript`)
- For IDs/keys, explicitly show "copy ONLY this part: `ABC123`"
- Test APIs directly in browser before debugging client code

## Git Workflow
- Commit frequently with descriptive messages
- Push after every significant change
- `.gitignore` entries take effect immediately if file not already tracked
