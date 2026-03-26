// ─── Challenge Mode — one challenge per module ───────────────────────────────
// No step-by-step instructions. The user must figure it out.

export const CHALLENGES = [
  {
    module: 'Setup Cursor',
    title:  'Build Without Typing',
    goal:   'Create a complete 3-section landing page — hero, features grid, and footer — using only Cursor AI commands. You may not type a single line of HTML, CSS, or JavaScript manually. Every character of code must come from AI prompts.',
    hints: [
      'Pressing Cmd+K on a completely empty file lets you describe the entire file you want and generate it in one shot — try describing the full page structure in one prompt.',
      'Each section can be generated independently. After the hero exists, select an empty line below it and use Cmd+K: "Add a 3-column features section below this with icon placeholders."',
      'For the stylesheet, create an empty style.css, press Cmd+K, and describe the full visual style: dark background, centered layout, violet accent. Use Cursor Chat to fix anything that looks wrong.',
    ],
    solution: `Open Cursor and create two empty files: index.html and style.css.

In index.html, press Cmd+K on the empty file and prompt:
"Generate a full HTML landing page with a hero section, a 3-column features section with icons, and a footer. Link to style.css."

In style.css, press Cmd+K and prompt:
"Write responsive CSS: dark #0a0a12 background, white text, violet (#7c3aed) accents, centered max-width container, CSS Grid for the features section."

For any element that looks wrong: select it in Cursor, press Cmd+K, and describe the issue. Fix iteratively using only prompts.`,
  },

  {
    module: 'GitHub Basics',
    title:  'Terminal-Only GitHub Setup',
    goal:   'Set up a new public GitHub repository, add 3 separate meaningful commits, and push everything — using only the terminal. You may not click a single button on the GitHub website. The repo must be publicly visible when you are done.',
    hints: [
      'The GitHub CLI (gh) lets you create repos from the terminal without touching the browser: look up "gh repo create" in the docs or run "gh repo create --help" to see the options.',
      'For 3 meaningful commits, make a distinct change in each — first commit adds a README, second adds a description section, third adds a code example block. Each should have a descriptive commit message.',
      'If you do not have the GitHub CLI, you can create a repo using the GitHub REST API with curl and a personal access token: POST to https://api.github.com/user/repos with a JSON body containing the repo name.',
    ],
    solution: `# Install GitHub CLI if needed
brew install gh && gh auth login

# Create local repo
mkdir terminal-challenge && cd terminal-challenge && git init

# Commit 1 — README
echo "# Terminal Challenge" > README.md
git add README.md && git commit -m "Initial commit: add README"

# Commit 2 — description
echo "## About" >> README.md
echo "This repo was set up entirely from the terminal." >> README.md
git add README.md && git commit -m "Add project description"

# Commit 3 — code example
echo "## Usage" >> README.md
echo "Run: git log --oneline" >> README.md
git add README.md && git commit -m "Add usage section"

# Create public repo and push
gh repo create terminal-challenge --public --source=. --push`,
  },

  {
    module: 'First Project',
    title:  'Resolve a Merge Conflict',
    goal:   'Create two branches that both modify the exact same line of the same file. Merge them together and resolve the conflict so the final result contains meaningful content from both branches. Push the resolved merge to GitHub.',
    hints: [
      'Create branch-a from main, change line 1 of README.md to something unique, and commit. Then go back to main, create branch-b, change that same line differently, and commit. Merge branch-a into main first, then branch-b — the second merge will conflict.',
      'When a conflict happens, Git adds markers directly into the file: <<<<<<< HEAD shows your current branch content, ======= is the divider, and >>>>>>> branch-name shows the incoming content. Edit the file to remove all markers and write combined content.',
      'After editing the file to resolve the conflict (no markers remaining), run git add on the resolved file and then git commit — Git auto-fills the merge commit message. Then push.',
    ],
    solution: `# Setup — two branches editing the same line
git checkout -b branch-a
# Edit README.md line 1: "# Perspective from Branch A"
git add README.md && git commit -m "Branch A: update title"

git checkout main
git checkout -b branch-b
# Edit README.md line 1: "# Perspective from Branch B"
git add README.md && git commit -m "Branch B: update title"

# Merge sequence
git checkout main
git merge branch-a    # fast-forward, no conflict
git merge branch-b    # CONFLICT on line 1

# Git marks the file like this:
# <<<<<<< HEAD
# # Perspective from Branch A
# =======
# # Perspective from Branch B
# >>>>>>> branch-b

# Edit to resolve — remove markers and combine:
# # Perspectives from Branch A and Branch B

git add README.md
git commit            # accepts auto-generated merge commit message
git push`,
  },

  {
    module: 'APIs & Webhooks',
    title:  'Dynamic GitHub Explorer',
    goal:   "Build a single self-contained HTML file with an input field and a search button. When the user types any GitHub username and clicks Search, fetch that user's public data and render their avatar, display name, bio, and public repo count — all without a page reload. Handle the case where the username does not exist.",
    hints: [
      'Attach your fetch logic to the button\'s click event using addEventListener. Read the input value with document.getElementById("inputId").value, then build the API URL: "https://api.github.com/users/" + username',
      'The GitHub API returns a 404 status for unknown users — check response.ok before calling .json(). If not ok, show an error message in the output area instead of trying to render profile data.',
      'Use document.createElement to build the avatar image element and set its src to the avatar_url from the API response. Append it to your output container. Clear the container first with textContent = "" so results do not stack.',
    ],
    solution: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background:#0a0a12; color:#fff; font-family:sans-serif;
           display:flex; flex-direction:column; align-items:center; padding:40px; gap:16px; }
    input { padding:10px 14px; border-radius:8px; border:1px solid #333;
            background:#111; color:#fff; font-size:14px; width:240px; }
    button { padding:10px 18px; background:#7c3aed; color:#fff;
             border:none; border-radius:8px; cursor:pointer; font-size:14px; }
    img { border-radius:50%; width:80px; height:80px; display:block; margin:0 auto 12px; }
  </style>
</head>
<body>
  <h1>GitHub Explorer</h1>
  <div style="display:flex;gap:8px">
    <input id="username" placeholder="GitHub username">
    <button id="btn">Search</button>
  </div>
  <div id="result" style="text-align:center;margin-top:20px"></div>

  <script>
    document.getElementById('btn').addEventListener('click', async function() {
      var username = document.getElementById('username').value.trim()
      var out = document.getElementById('result')
      out.textContent = ''
      if (!username) return
      try {
        var res = await fetch('https://api.github.com/users/' + username)
        if (!res.ok) { out.textContent = 'User not found.'; return }
        var d = await res.json()
        var img = document.createElement('img')
        img.src = d.avatar_url
        img.alt = d.login
        var name = document.createElement('h2')
        name.textContent = d.name || d.login
        var bio = document.createElement('p')
        bio.textContent = d.bio || 'No bio'
        var repos = document.createElement('p')
        repos.textContent = d.public_repos + ' public repos'
        out.appendChild(img)
        out.appendChild(name)
        out.appendChild(bio)
        out.appendChild(repos)
      } catch(e) { out.textContent = 'Error fetching data.' }
    })
  </script>
</body>
</html>`,
  },

  {
    module: 'Advanced Builds',
    title:  'Zero to CI/CD',
    goal:   'Add a GitHub Actions workflow to any of your repositories that runs automatically on every push to main. The workflow must include at least three named steps: one that prints a custom message, one that lists the repo files, and one that shows the current date. It must show a green check on the GitHub Actions tab before you mark this complete.',
    hints: [
      'GitHub Actions workflows are YAML files stored in .github/workflows/ inside your repo. Create the directory and a file like ci.yml — the filename is arbitrary but the extension must be .yml or .yaml.',
      'The on: key controls triggers. Use "on: push: branches: [main]" to run on every push to main. Each job needs a runs-on value (use ubuntu-latest) and a steps: list.',
      'Each step needs either uses: (to run a marketplace Action) or run: (to run a shell command). Use "- uses: actions/checkout@v4" first to make repo files available, then add run: steps for echo, ls, and date.',
    ],
    solution: `# Create the file at: .github/workflows/ci.yml

name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Print hello message
        run: echo "CI pipeline running successfully!"

      - name: List repository files
        run: ls -la

      - name: Show current date and time
        run: date

# Commit and push this file:
# git add .github/workflows/ci.yml
# git commit -m "Add CI workflow"
# git push
#
# Then visit: github.com/YOUR_USERNAME/YOUR_REPO/actions
# You should see a green check next to your latest commit.`,
  },
]
