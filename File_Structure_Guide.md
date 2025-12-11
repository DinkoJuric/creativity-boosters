# Project File Structure & Naming Conventions

## Overview
This document explains the folder structure and naming conventions used in the Creativity Boosters project.

---

## Folder Structure

```
pod-prep/
├── .agent/                    # Agent configuration & learnings
│   └── workflows/             # Reusable workflow templates
├── private/                   # GITIGNORED - not on GitHub
│   ├── scripts/               # Recording scripts (what hosts read)
│   └── research/              # Episode research & notes
├── index.html                 # Dashboard entry point
├── style.css                  # Dashboard styling
├── app.js                     # Dashboard logic + Sheets sync
├── Git_and_Hosting_Guide.md   # How to use Git & GitHub Pages
├── Google_Sheets_Sync_Guide.md # How to set up state sync
└── Episode_Overview.md        # High-level episode status
```

---

## Why This Structure?

### `private/` Folder (Gitignored)
**Why:** Scripts and research contain proprietary content (hooks, stories, sources) that shouldn't be public.

**Contents:**
- `scripts/` - The actual reading scripts for recording sessions
- `research/` - Background research, notes, and drafts

### Dashboard Files at Root
**Why:** GitHub Pages requires `index.html` at root to serve the website.

### `.agent/` Folder
**Why:** Stores learnings and workflows for AI agent collaboration across projects.

---

## File Naming Conventions

### Episode Files
| Pattern | Example | Location | Purpose |
|---------|---------|----------|---------|
| `Episode_XX_Topic_Name.md` | `Episode_01_First_Mover_Advantage.md` | `private/research/` | Research & notes |
| `Episode_XX_Topic_SCRIPT.md` | `Episode_01_First_Mover_SCRIPT.md` | `private/scripts/` | Recording script |

### Guide Files
| File | Purpose |
|------|---------|
| `*_Guide.md` | Step-by-step instructions for a process |

---

## Deleting Files

| File | Safe to Delete? | Notes |
|------|-----------------|-------|
| `Design_Guide` | ✅ Yes | Was used for initial design reference, no longer needed |
| `Episode_Overview.md` | ⚠️ Keep | Reference document, may be useful |
