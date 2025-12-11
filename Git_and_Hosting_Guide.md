# 🛡️ Git & Hosting Guide for Creativity Boosters

This guide explains how to keep your work safe ("Backup") and how to put your dashboard online ("Hosting") without needing to be a coder.

---

## Part 1: The "Time Machine" (Git Backup)

We are using **Git**, which is like a save-game system for your files. It allows us to save "checkpoints" of your work. If you ever delete something by accident, we can go back to a previous checkpoint.

### How to "Save" Your Work
Open your terminal (in VS Code, press `Ctrl + ` ` ` `) and define a checkpoint by running these 3 commands:

1.  **`git add .`**
    *   *What it does:* Tells Git to look at ALL files in the folder (the "staging" area).
2.  **`git commit -m "Updated dashboard status"`**
    *   *What it does:* Saves the checkpoint with a message. You can write anything in the quotes.
3.  **`git push`**
    *   *What it does:* Uploads your checkpoint to the cloud (GitHub). This is your off-site backup.

> **💡 Pro Tip:** Do this at the end of every work session.

---

## Part 2: Hosting on GitHub Pages (The Shared Dashboard)

To let Nikhil see the dashboard, we will turn your folder into a website.

### Step-by-Step Setup
1.  Go to **[GitHub.com](https://github.com)** and sign in.
2.  Navigate to your repository (project page).
3.  Click on **Settings** (top right tab).
4.  On the left sidebar, scroll down and click **Pages**.
5.  Under **Branch**, select `main` (or `master`) and ensure the folder is `/(root)`.
6.  Click **Save**.

🎉 **Success!** Within 2-3 minutes, your site will be live at:
`https://yourusername.github.io/your-repo-name/dashboard/`

### How to Update the Site
Every time you run `git push` (from Part 1), the website will **automatically update** within a few minutes. You don't need to do anything else!
