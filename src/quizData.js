// ─── Final Assessment Questions ─────────────────────────────────────────────
// 4 questions per module = 20 total. Mix of concept, practical, scenario types.
// Each has an explanation shown immediately after answering.

export const QUIZ_QUESTIONS = [

  // ── Setup Cursor ────────────────────────────────────────────────────────────
  {
    module:  'Setup Cursor',
    type:    'concept',
    question: 'Which keyboard shortcut opens the AI inline editor in Cursor on Mac?',
    options:  ['Cmd+A', 'Cmd+K', 'Cmd+L', 'Cmd+Shift+P'],
    correct:  1,
    explanation: 'Cmd+K triggers the inline AI edit dialog directly in the file. Cmd+L opens the Chat panel instead. Cmd+A just selects all text.',
  },
  {
    module:  'Setup Cursor',
    type:    'practical',
    question: 'You want to rewrite a function to use async/await. What is the fastest approach in Cursor?',
    options: [
      'Edit each line manually to convert the syntax',
      'Select the function, press Cmd+K, and describe the change',
      'Copy the code into an external AI tool and paste it back',
      'Create a new file and rewrite the function from scratch',
    ],
    correct: 1,
    explanation: 'Selecting code and pressing Cmd+K lets you describe any transformation in plain English. The AI applies it in place — no copy-pasting or switching tools needed.',
  },
  {
    module:  'Setup Cursor',
    type:    'concept',
    question: 'Signing into Cursor with GitHub unlocks which two core AI features?',
    options: [
      'Dark mode and custom themes',
      'AI Tab completion and the Chat panel',
      'GitHub Actions integration and auto-save',
      'Cloud sync and version history',
    ],
    correct: 1,
    explanation: 'Signing in activates Tab completion (inline suggestions as you type) and the Chat panel (Cmd+L) for conversational assistance with your code.',
  },
  {
    module:  'Setup Cursor',
    type:    'scenario',
    question: "Your code throws an unfamiliar error. Which Cursor feature is most helpful?",
    options: [
      'The file explorer sidebar',
      'The extensions marketplace',
      'Cursor Chat (Cmd+L)',
      'The source control panel',
    ],
    correct: 2,
    explanation: 'Cursor Chat lets you paste the error or ask what it means in context. The AI explains the cause and typically suggests a direct fix without leaving your editor.',
  },

  // ── GitHub Basics ───────────────────────────────────────────────────────────
  {
    module:  'GitHub Basics',
    type:    'concept',
    question: 'Which command verifies that Git is installed on your machine?',
    options:  ['git status', 'git check', 'git --version', 'git init'],
    correct:  2,
    explanation: 'git --version prints the installed Git version number. git init creates a new repository, and git status shows uncommitted changes in an existing one.',
  },
  {
    module:  'GitHub Basics',
    type:    'practical',
    question: 'What does `git config --global user.email "you@example.com"` do?',
    options: [
      'Sets your GitHub account password',
      'Creates a new empty repository',
      'Stamps every future commit with your email address',
      'Connects your local repository to a remote origin',
    ],
    correct: 2,
    explanation: 'Git embeds the author name and email into every commit. Without configuring this, commits show a missing or incorrect identity that cannot be corrected after pushing.',
  },
  {
    module:  'GitHub Basics',
    type:    'concept',
    question: 'What is a GitHub repository?',
    options: [
      'A browser extension for tracking code changes',
      'A cloud storage bucket for any file type',
      'A project folder with its full change history tracked by Git',
      'A type of GitHub account designed for teams',
    ],
    correct: 2,
    explanation: 'A repository is a project directory where Git records every change you commit. GitHub hosts it remotely so others can clone, view, and collaborate on it.',
  },
  {
    module:  'GitHub Basics',
    type:    'scenario',
    question: "You committed code but it shows the wrong author name on GitHub. What was the root cause?",
    options: [
      'A bug in the GitHub web interface',
      'git config --global user.name was not set correctly before committing',
      'The repository was created without a README',
      'SSH keys were not configured properly',
    ],
    correct: 1,
    explanation: 'Every commit records the user.name and user.email from git config at the moment of commit. Running git config --global before your first commit prevents this.',
  },

  // ── First Project ───────────────────────────────────────────────────────────
  {
    module:  'First Project',
    type:    'concept',
    question: 'What does `git clone <url>` do?',
    options: [
      'Creates a brand-new empty repository on GitHub',
      'Downloads the full project and its history to your machine',
      'Pushes your local changes up to GitHub',
      'Opens the project folder directly in Cursor',
    ],
    correct: 1,
    explanation: 'git clone copies the entire repository — all files and commit history — to your machine. Unlike a manual download, it stays connected so you can push and pull later.',
  },
  {
    module:  'First Project',
    type:    'practical',
    question: 'What is the correct order of Git commands to save a change and publish it to GitHub?',
    options: [
      'git push → git commit → git add',
      'git commit → git add → git push',
      'git add → git commit → git push',
      'git clone → git add → git push',
    ],
    correct: 2,
    explanation: 'Stage files with git add, create a snapshot with git commit, then upload with git push. Skipping any step means your changes never reach GitHub.',
  },
  {
    module:  'First Project',
    type:    'concept',
    question: 'What does `git add .` do?',
    options: [
      'Commits all files directly to the repository',
      'Pushes the latest commit to GitHub',
      'Stages all modified and new files for the next commit',
      'Initializes a new Git repository in the current folder',
    ],
    correct: 2,
    explanation: 'git add . moves all changed files into the staging area — a holding zone that defines exactly what goes into the next commit. Use git add <filename> to stage selectively.',
  },
  {
    module:  'First Project',
    type:    'scenario',
    question: "You edited a file locally and ran `git push`, but the change isn't on GitHub. What step did you skip?",
    options: [
      'Running git status to check the working directory',
      'Running git add and git commit before pushing',
      'Running git clone to re-download the repo',
      'Running git branch to create a new branch first',
    ],
    correct: 1,
    explanation: 'git push only uploads existing commits. If you skipped git add and git commit, there is nothing to push — the edit lives only in your working directory, unsaved by Git.',
  },

  // ── APIs & Webhooks ─────────────────────────────────────────────────────────
  {
    module:  'APIs & Webhooks',
    type:    'concept',
    question: 'Which HTTP method is used to READ data from a REST API?',
    options:  ['POST', 'DELETE', 'PUT', 'GET'],
    correct:  3,
    explanation: 'REST APIs follow a convention: GET reads, POST creates, PUT updates, DELETE removes. Using the wrong method typically returns a "405 Method Not Allowed" error.',
  },
  {
    module:  'APIs & Webhooks',
    type:    'practical',
    question: 'Where do you configure a webhook for a GitHub repository?',
    options: [
      'Profile → Settings → Developer options',
      'Repository → Settings → Webhooks',
      'Code → Actions → Webhooks → Add webhook',
      'Issues → Milestones → Webhooks',
    ],
    correct: 1,
    explanation: 'Webhook settings live at the repository level, not the account level. Each repo independently controls which events it sends and to which server URL.',
  },
  {
    module:  'APIs & Webhooks',
    type:    'concept',
    question: 'What best describes a webhook?',
    options: [
      'A special GitHub branch used for automation',
      'An HTTP endpoint your server exposes to receive real-time events from another service',
      'A token used to authenticate outgoing API requests',
      'A scheduled task that polls an API on a fixed timer',
    ],
    correct: 1,
    explanation: 'A webhook is a "reverse API" — instead of you polling for updates, the service calls your server when an event occurs. Your server responds 200 OK to confirm receipt.',
  },
  {
    module:  'APIs & Webhooks',
    type:    'scenario',
    question: "Your server receives a GitHub webhook but the signature check fails every time. Most likely cause?",
    options: [
      'The webhook URL has a typo',
      'Your server is behind a firewall blocking GitHub IPs',
      "The webhook secret doesn't match between GitHub and your server",
      'GitHub only supports webhooks on public repositories',
    ],
    correct: 2,
    explanation: 'GitHub signs every payload with HMAC-SHA256 using the secret you configured. If the secret is missing, wrong, or not being verified on your end, the check will always fail.',
  },

  // ── Advanced Builds ─────────────────────────────────────────────────────────
  {
    module:  'Advanced Builds',
    type:    'concept',
    question: 'Where should you store API keys and secrets when working locally?',
    options: [
      'Directly in source code as string constants',
      'In a public GitHub Gist for easy sharing',
      'In `.env.local` — never committed to Git',
      'In the project README under Configuration',
    ],
    correct: 2,
    explanation: '.env.local is excluded by .gitignore so secrets never reach GitHub. Hardcoding secrets in source code is a critical risk — bots scan public repos for exposed keys continuously.',
  },
  {
    module:  'Advanced Builds',
    type:    'practical',
    question: 'When you connect a GitHub repo to Vercel and push to `main`, what happens automatically?',
    options: [
      'Nothing — all deploys must be triggered manually from the dashboard',
      'A staging environment is created for peer review',
      'A production deploy is triggered automatically',
      'The repository is archived pending approval',
    ],
    correct: 2,
    explanation: 'Vercel watches the connected branch. Every push to main triggers a build and, if successful, deploys to production. Pull request branches each get their own preview URL.',
  },
  {
    module:  'Advanced Builds',
    type:    'concept',
    question: 'What is the primary purpose of a CI/CD pipeline?',
    options: [
      'To replace manual code reviews with AI-generated feedback',
      'To automatically version and archive every release as a backup',
      'To run tests and deploy code automatically on every change',
      'To schedule database backups on a fixed interval',
    ],
    correct: 2,
    explanation: 'CI (Continuous Integration) runs your test suite on every push to catch regressions early. CD (Continuous Deployment) automates releases so passing code goes live without manual steps.',
  },
  {
    module:  'Advanced Builds',
    type:    'scenario',
    question: "Your CI pipeline passes locally but fails on GitHub Actions with 'environment variable not defined.' Most likely cause?",
    options: [
      'A syntax error was introduced in the last commit',
      "GitHub Actions doesn't support your version of Node.js",
      'The variable exists in your local .env.local but is not set in the CI environment',
      'The GitHub Actions runner uses a different operating system',
    ],
    correct: 2,
    explanation: '.env.local is never pushed to GitHub. CI environments start clean — you must add secrets in Repository → Settings → Secrets and Variables → Actions for them to be available.',
  },
]
