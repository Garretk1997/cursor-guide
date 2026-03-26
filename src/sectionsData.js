// ─── Course Sections ──────────────────────────────────────────────────────────
// Each step has: title, description, hasImage, tip, quiz, task

export const SECTIONS = [
  {
    id: 'setup-cursor',
    title: 'Setup Cursor',
    description: 'Get your AI-powered code editor installed and configured.',
    steps: [
      {
        title: 'Download Cursor',
        description: 'Cursor is an AI-native code editor built on the VS Code foundation. It brings language models directly into your editing workflow — not as a sidebar plugin, but as a first-class collaborator that understands your codebase. Head to cursor.com and download the installer for your operating system. macOS, Windows, and Linux are all supported. The download is roughly 150–200 MB and takes under a minute on most connections.',
        hasImage: true,
        tip: 'Cursor releases updates frequently. After installing, check cursor.com/changelog — each release often ships meaningful AI improvements, not just bug fixes.',
        quiz: {
          question: 'Which operating systems does Cursor support?',
          options: ['macOS only', 'Windows and macOS only', 'macOS, Windows, and Linux', 'Linux only'],
          correct: 2,
        },
        task: 'Visit cursor.com, download the installer for your OS, and confirm the download completes. Note the version number shown on the site.',
      },
      {
        title: 'Install and Sign In',
        description: 'Run the installer and follow the setup prompts. When Cursor opens for the first time, you will be asked to sign in. You can use a GitHub account or create a free Cursor account with your email. Signing in unlocks AI Tab completion, the Chat panel, and your request quota. If you already use VS Code, look for the "Import VS Code settings" option during setup — it migrates your themes, keybindings, and extensions automatically so you are productive from minute one.',
        hasImage: true,
        tip: 'The "Import from VS Code" prompt only appears once. If you missed it, you can still manually copy your VS Code settings by pasting your settings.json content into Cursor\'s settings.',
        quiz: {
          question: 'What do you need to unlock AI Tab completion in Cursor?',
          options: ['A paid Pro subscription', 'A GitHub account or free Cursor account', 'An Anthropic API key', 'An enterprise license'],
          correct: 1,
        },
        task: 'Complete installation and sign in. Confirm you can see the Chat icon in the sidebar and the AI status indicator in the bottom status bar.',
      },
      {
        title: 'Connect an AI Model',
        description: 'Open Settings (Cmd+, on macOS, Ctrl+, on Windows) and navigate to Cursor → Models. Cursor comes with Claude and GPT-4o available out of the box — no API key required on the free tier. You can designate separate models for Chat and for Tab completions. Claude tends to excel at reasoning through complex code; GPT-4o is fast for quick edits. You can switch models on a per-conversation basis too, so pick whichever default fits your typical work.',
        hasImage: false,
        tip: 'You can switch models mid-conversation. Click the model name at the top of the Chat panel to pick a different one for a specific question without starting over.',
        quiz: {
          question: 'Where do you configure which AI model Cursor uses?',
          options: ['File → Preferences', 'Settings → Cursor → Models', 'View → AI Panel', 'Tools → Integrations'],
          correct: 1,
        },
        task: 'Open Settings → Cursor → Models. Set Claude as your default chat model. Close settings and confirm the model name appears at the top of the Chat panel.',
      },
      {
        title: 'Try Your First AI Edit',
        description: 'Select any block of code — or position your cursor anywhere in a file — and press Cmd+K (Mac) or Ctrl+K (Windows). A text input appears inline. Type what you want: "add error handling", "convert this to TypeScript", "write a docstring". Cursor rewrites the selection and shows you a diff. Accept with Tab, reject with Escape. This inline edit shortcut is separate from the Chat panel (Cmd+L), which is for longer conversations and questions about your codebase.',
        hasImage: false,
        tip: 'Cmd+K with no selection inserts new code at the cursor position. Use it to generate boilerplate: "create a React useState hook for a loading state" — no code selected needed.',
        quiz: {
          question: 'Which keyboard shortcut opens the inline AI edit panel?',
          options: ['Cmd+P / Ctrl+P', 'Cmd+L / Ctrl+L', 'Cmd+K / Ctrl+K', 'Cmd+Shift+P / Ctrl+Shift+P'],
          correct: 2,
        },
        task: 'Open any file in Cursor. Select 2–3 lines, press Cmd+K / Ctrl+K, and ask it to rewrite the selection in a different style (e.g. "add comments" or "make this more concise"). Accept the result with Tab.',
      },
    ],
  },

  {
    id: 'github-basics',
    title: 'GitHub Basics',
    description: 'Learn version control fundamentals with Git and GitHub.',
    steps: [
      {
        title: 'Create a GitHub Account',
        description: 'GitHub is where your code lives publicly (or privately) and where collaboration happens. Every commit you push, every pull request you open, every review you leave — all of it is tied to your GitHub username. Go to github.com, click Sign Up, and choose a username carefully. Most professional developers use their real name or a consistent handle they use across platforms. After signing up, add a profile photo and a short bio — it makes your profile look credible when you share it with employers or collaborators.',
        hasImage: true,
        tip: 'Your username appears on every commit, PR, and issue permanently. Pick something professional — most developers use their real name or a handle they\'re comfortable having public forever.',
        quiz: {
          question: 'Where does your GitHub username appear?',
          options: ['Only on your profile page', 'Only on pull requests', 'On commits, pull requests, and your public profile', 'Only in your README'],
          correct: 2,
        },
        task: 'Create a GitHub account at github.com if you don\'t have one already. Add a profile photo and a one-line bio to your profile.',
      },
      {
        title: 'Install Git',
        description: 'Git is the version control system that runs underneath GitHub. GitHub is the website; Git is the tool on your machine that tracks changes. On macOS, run `brew install git` in your terminal (install Homebrew first at brew.sh if you don\'t have it). On Windows, download the installer from git-scm.com — it includes Git Bash, a terminal with Unix-style commands. On Linux, use your package manager: `sudo apt install git` or `sudo dnf install git`. After installation, verify with `git --version`.',
        hasImage: false,
        tip: 'After installing, restart your terminal before running `git --version`. The shell loads PATH on startup, so a new session is required to find the newly installed binary.',
        quiz: {
          question: 'Which command confirms Git was installed successfully?',
          options: ['git check', 'git status', 'git --version', 'git init'],
          correct: 2,
        },
        task: 'Install Git for your OS. Open a fresh terminal window and run `git --version`. You should see output like `git version 2.x.x`.',
      },
      {
        title: 'Configure Your Identity',
        description: 'Before you make your first commit, tell Git who you are. Run these two commands in your terminal — substituting your real name and email:\n\n`git config --global user.name "Your Name"`\n`git config --global user.email "you@example.com"`\n\nThese values are baked into every commit you make, permanently and publicly. They don\'t have to match your GitHub account email, but consistency helps tools like GitHub correctly attribute commits to your profile. You can confirm what Git stored by running `git config --global --list`.',
        hasImage: false,
        tip: 'These values are embedded in every commit forever. If you contribute to open-source, use the identity you want public. You can use a no-reply GitHub email (Settings → Emails) to keep your real address private.',
        quiz: {
          question: 'What is the purpose of `git config --global user.email`?',
          options: ['To set your GitHub login credentials', 'To stamp your email on every commit you make', 'To subscribe to Git release notifications', 'To verify your identity with the GitHub API'],
          correct: 1,
        },
        task: 'Run both `git config` commands with your name and email. Then run `git config --global --list` to confirm both values were saved.',
      },
      {
        title: 'Create Your First Repository',
        description: 'On GitHub, click the "+" icon in the top right and choose "New repository". Give it a name like `my-first-repo`, set visibility to Public, and check "Add a README file". Click "Create repository". GitHub initializes the repo with a first commit containing the README — this is important because an empty repo has no history to clone from. Once created, copy the HTTPS URL from the green "Code" button. You will use this URL in the next module to clone the project to your local machine.',
        hasImage: true,
        tip: 'Always initialize with a README. It gives you a first commit immediately, so the repo is cloneable right away. An empty repo without a README requires extra steps to start working with.',
        quiz: {
          question: 'What does checking "Add a README file" when creating a repo do?',
          options: ['Creates a license file automatically', 'Gives you a first commit so the repo is immediately cloneable', 'Sets up GitHub Actions', 'Adds a .gitignore file'],
          correct: 1,
        },
        task: 'Create a new public repository on GitHub named `my-first-repo` with a README. Copy the HTTPS clone URL — you will need it in the next module.',
      },
    ],
  },

  {
    id: 'first-project',
    title: 'First Project',
    description: 'Clone a repo, make changes in Cursor, and push your first commit.',
    steps: [
      {
        title: 'Clone the Repository',
        description: 'Cloning downloads the entire repository — every file, every branch, every commit in its history — to your local machine. Open your terminal, navigate to where you store projects (e.g. `cd ~/Projects`), and run:\n\n`git clone <paste-your-repo-url-here>`\n\nGit creates a new folder with the repository name and downloads everything into it. Unlike just downloading a zip, cloning preserves the full version history. This means you can browse old commits, roll back changes, and sync with the remote at any time — even offline.',
        hasImage: true,
        tip: '`git clone` copies the full history, not just current files. You can roll back to any past state with `git checkout <commit-hash>` even without internet access.',
        quiz: {
          question: 'What does `git clone` do?',
          options: ['Creates a new empty repo on GitHub', 'Downloads the project and its full history to your machine', 'Uploads your local changes to GitHub', 'Creates a new branch from main'],
          correct: 1,
        },
        task: 'Run `git clone <your-repo-url>` in your terminal. After it completes, `cd` into the new folder and run `ls` to confirm your README.md is there.',
      },
      {
        title: 'Open in Cursor',
        description: 'Open Cursor and use File → Open Folder (or File → Open on macOS) to navigate to your cloned project folder. The Explorer panel on the left side shows your full file tree. You can also open Cursor from the terminal: navigate into your project folder and run `cursor .` (the dot means "open current folder"). Once open, you will see your README.md in the file tree. Click it to open the file in the editor. Notice how Cursor understands the whole project — if you open Chat (Cmd+L) and ask "What is this project?", it reads all your files before answering.',
        hasImage: true,
        tip: 'Run `cursor .` from any project folder in your terminal to open it instantly. Add the `cursor` command to your PATH during install so this works everywhere.',
        quiz: {
          question: 'Which panel in Cursor shows your project\'s file tree?',
          options: ['The Chat panel', 'The Terminal panel', 'The Explorer panel', 'The Source Control panel'],
          correct: 2,
        },
        task: 'Open your cloned repository in Cursor using File → Open Folder. Click README.md in the Explorer panel to confirm you can see its contents.',
      },
      {
        title: 'Make a Change',
        description: 'Open README.md in the editor. The file currently just has a title. Add a short description below it — explain what the project is or what you plan to use it for. If you are unsure what to write, press Cmd+L to open Cursor Chat and ask: "Help me write a short description for a developer learning project README." Cursor reads the existing content and generates something contextual. You can also use Tab to autocomplete as you type — start a sentence and Cursor will suggest how to finish it based on what is already in the file.',
        hasImage: false,
        tip: 'Cursor Chat (Cmd+L) has full read access to your project. Ask it "What does this file do?" or "How should I structure this README?" — it reads your actual code before answering.',
        quiz: {
          question: 'What does Cursor\'s Tab key do while you type?',
          options: ['Opens a new chat conversation', 'Autocompletes your code using AI suggestions', 'Runs your code in the terminal', 'Formats the current file'],
          correct: 1,
        },
        task: 'Add at least two lines of description to your README.md. Use Cursor Chat or Tab completion to help if you want. Save the file when done.',
      },
      {
        title: 'Commit and Push',
        description: 'With your change saved, it is time to send it to GitHub. In your terminal (or use Cursor\'s built-in terminal with Ctrl+`), run these three commands in order:\n\n`git add .` — stages all modified files\n`git commit -m "Update README with description"` — creates a snapshot with a message\n`git push` — sends the commit to GitHub\n\nAfter push completes, refresh your GitHub repository page in the browser. You will see your updated README immediately. The commit message appears in the history — this is why clear, descriptive messages matter.',
        hasImage: false,
        tip: 'Write commit messages in the imperative: "Add feature" not "Added feature". This matches how Git itself phrases things — "Merge branch main" not "Merged branch main".',
        quiz: {
          question: 'Which command stages all changed files for the next commit?',
          options: ['git push', 'git commit -m "..."', 'git add .', 'git status'],
          correct: 2,
        },
        task: 'Run `git add .`, `git commit -m "Update README"`, and `git push`. Refresh your GitHub repo page and verify your change is live.',
      },
    ],
  },

  {
    id: 'apis-webhooks',
    title: 'APIs & Webhooks',
    description: 'Connect your app to external services and respond to real-time events.',
    steps: [
      {
        title: 'Understanding REST APIs',
        description: 'An API (Application Programming Interface) is a contract that defines how software components communicate. REST APIs use standard HTTP methods over the internet. The four core operations map to what you can do with any data: GET retrieves it, POST creates it, PUT/PATCH updates it, DELETE removes it. APIs return data as JSON — a lightweight text format that both humans and machines can read. Every major service you use (GitHub, Stripe, Slack, OpenAI) exposes a REST API, which means you can build software that reads data from or takes actions in any of them.',
        hasImage: true,
        tip: 'When an API returns a 4xx error, the problem is your request — bad auth, wrong URL, missing field. When it returns a 5xx error, the problem is their server. This distinction alone saves hours of debugging.',
        quiz: {
          question: 'What does a GET request do in a REST API?',
          options: ['Creates new data on the server', 'Permanently deletes a resource', 'Reads or retrieves data', 'Updates an existing resource'],
          correct: 2,
        },
        task: 'Open your browser and visit `https://api.github.com/users/<your-github-username>`. Read the JSON response and identify three fields you recognize.',
      },
      {
        title: 'Make Your First API Call',
        description: 'The GitHub API requires no authentication for public data. Open your terminal and run:\n\n`curl https://api.github.com/users/<your-username>`\n\nYou get back a JSON object with your public profile: login, name, bio, follower count, public repo count, and more. `curl` is a command-line tool for making HTTP requests — it is available on macOS and Linux by default, and on Windows via Git Bash. For readable output, pipe it through `jq`: `curl https://api.github.com/users/you | jq`. Install jq with `brew install jq` on macOS.',
        hasImage: false,
        tip: 'Install `jq` for working with API responses: `brew install jq`. It formats JSON output with color and indentation, and lets you filter specific fields: `curl ... | jq \'.public_repos\'`.',
        quiz: {
          question: 'What data format does the GitHub API return?',
          options: ['XML', 'CSV', 'Plain text', 'JSON'],
          correct: 3,
        },
        task: 'Run `curl https://api.github.com/users/<your-username>` in your terminal. Find the `public_repos` field and note the number. If you have jq, pipe the output through it.',
      },
      {
        title: 'Set Up a Webhook',
        description: 'A webhook is the inverse of an API call. Instead of you requesting data from a service, the service pushes data to you when something happens. Go to your GitHub repository → Settings → Webhooks → Add webhook. The Payload URL is where GitHub will POST event data — use a placeholder for now (e.g. `https://example.com/webhook`). Set Content type to `application/json`. Under "Which events?", you can choose "Just the push event" to start. Every time someone pushes to your repo, GitHub will send an HTTP POST to your endpoint with the commit details.',
        hasImage: true,
        tip: 'Use smee.io or ngrok during development to expose your local server to the internet. GitHub needs a publicly reachable URL to send webhook payloads — localhost won\'t work.',
        quiz: {
          question: 'Where in GitHub do you configure webhooks for a repository?',
          options: ['Profile Settings → Integrations', 'Repository Settings → Webhooks → Add webhook', 'Actions tab → New workflow', 'Code tab → Add file'],
          correct: 1,
        },
        task: 'Go to your repo\'s Settings → Webhooks. Click "Add webhook", enter `https://example.com/webhook` as the URL, set content type to application/json, and save.',
      },
      {
        title: 'Handle Incoming Events',
        description: 'Your webhook endpoint needs to do three things: receive the POST request, validate it came from GitHub, and process the payload. GitHub includes an `X-Hub-Signature-256` header — a HMAC-SHA256 hash of the payload using your secret key. You must verify this before trusting the payload, or anyone can send fake events to your endpoint. The simplest handler in Node.js: receive the body, log it, respond 200. For any real use case, you would parse the JSON, check the event type from the `X-GitHub-Event` header, and run the appropriate logic.',
        hasImage: false,
        tip: 'Always verify the `X-Hub-Signature-256` header before processing a payload. Without this check, anyone who discovers your webhook URL can send arbitrary fake events to trigger your code.',
        quiz: {
          question: 'What HTTP status code should a webhook endpoint return on success?',
          options: ['201 Created', '200 OK', '204 No Content', '302 Found'],
          correct: 1,
        },
        task: 'Create a minimal POST endpoint in any language or framework that logs the request body and returns a 200 response. Test it locally with: `curl -X POST -H "Content-Type: application/json" -d \'{"test":true}\' http://localhost:3000/webhook`.',
      },
    ],
  },

  {
    id: 'advanced-builds',
    title: 'Advanced Builds',
    description: 'Automate deployments with CI/CD and ship with confidence.',
    steps: [
      {
        title: 'CI/CD Pipelines',
        description: 'CI/CD stands for Continuous Integration / Continuous Deployment. CI runs automated checks (linting, tests, type checks) on every push, catching issues before they reach production. CD deploys passing builds automatically. GitHub Actions is the built-in CI/CD system — you define workflows in YAML files stored in `.github/workflows/`. A minimal CI workflow installs your dependencies, runs your linter, and runs your test suite. The first time a PR fails CI, you will understand why teams invest in it — broken code never reaches main.',
        hasImage: true,
        tip: 'Start simple: install deps, lint, test. Add complexity only when you have a real need. A 30-second CI pipeline that runs on every PR catches 90% of real bugs.',
        quiz: {
          question: 'What file format does GitHub Actions use for workflow definitions?',
          options: ['JSON', 'TOML', 'YAML', 'XML'],
          correct: 2,
        },
        task: 'Create `.github/workflows/ci.yml` in your repo with a workflow that runs on push and executes `echo "CI passed"`. Commit and push it, then check the Actions tab to see it run.',
      },
      {
        title: 'Environment Variables',
        description: 'Secrets (API keys, database passwords, tokens) must never be committed to Git. Even in a private repo, rotating a leaked key is painful and deleting it from history is harder than it sounds. Store secrets in `.env.local` locally — a file you add to `.gitignore`. For deployed apps, use the platform\'s secrets management (Vercel dashboard, GitHub Actions secrets). A best practice: commit a `.env.example` file with placeholder values and no real secrets. New team members copy it to `.env.local` and fill in their own values. This communicates which variables the app needs without exposing any.',
        hasImage: false,
        tip: 'Commit a `.env.example` file with placeholder values — it documents which environment variables the app needs without exposing any secrets. New contributors copy it to `.env.local` and fill in their values.',
        quiz: {
          question: 'Which file should never be committed to Git?',
          options: ['package.json', '.gitignore', '.env', 'README.md'],
          correct: 2,
        },
        task: 'Create a `.env.local` file with one variable: `APP_NAME=MyProject`. Add `.env.local` to your `.gitignore`. Run `git status` to confirm it shows as ignored, not as a staged file.',
      },
      {
        title: 'Deploy to Vercel',
        description: 'Vercel is a cloud platform optimized for frontend and full-stack apps. Connect your GitHub repo at vercel.com — click New Project, import your repository, and Vercel detects your framework automatically. After the initial deploy, every push to `main` triggers a new production build. Every pull request gets its own preview URL — a live version of your app at that PR\'s code. This makes code review dramatically more useful: reviewers test the actual feature, not just read the diff. Environment variables from your Vercel dashboard are injected at build time, keeping secrets out of your codebase.',
        hasImage: true,
        tip: 'Every pull request on a Vercel-connected repo gets its own unique preview URL. Share it with reviewers or clients to get feedback on the actual running feature — not just the code diff.',
        quiz: {
          question: 'What happens automatically when you push to `main` in a GitHub repo connected to Vercel?',
          options: ['Nothing — you must deploy manually', 'Vercel sends you an email notification', 'A new production deployment is triggered automatically', 'You must click Deploy in the dashboard'],
          correct: 2,
        },
        task: 'Connect your GitHub repo to Vercel at vercel.com. Complete the initial deployment. Click the generated URL and confirm your app is live and accessible.',
      },
      {
        title: 'Monitor Your App',
        description: 'Shipping is not the end — it is the beginning of operational responsibility. Vercel provides built-in observability tools: Analytics tracks pageviews, visitor geography, and custom events. Speed Insights tracks Core Web Vitals — real performance data collected from actual users in the field, not synthetic benchmarks. Function logs show you server-side errors and execution times. Set up alerts so you know about problems before your users do. The goal of monitoring is to move from "we found out when users complained" to "we found out before users noticed".',
        hasImage: false,
        tip: 'Enable Speed Insights alongside Analytics. Analytics shows who visited; Speed Insights shows how fast the experience was for real users in the field — two different dimensions of the same deployment.',
        quiz: {
          question: 'What do Core Web Vitals measure?',
          options: ['Server uptime percentage', 'Real user performance metrics like load speed and layout shift', 'Lines of code deployed per release', 'Number of API calls per hour'],
          correct: 1,
        },
        task: 'Open your Vercel project dashboard. Navigate to the Analytics tab and enable Web Analytics. Visit your deployed URL once. Return to the dashboard and verify a data point was recorded.',
      },
    ],
  },
]
