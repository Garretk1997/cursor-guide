// ─── Final Assessment Questions ───────────────────────────────────────────────
// 10 questions, 2 per module. Correct index is 0-based.

export const QUIZ_QUESTIONS = [
  {
    module:   'Setup Cursor',
    question: 'What keyboard shortcut opens the AI inline edit dialog in Cursor on Mac?',
    options:  ['Cmd+A', 'Cmd+K', 'Cmd+L', 'Cmd+E'],
    correct:  1,
  },
  {
    module:   'Setup Cursor',
    question: 'Signing into Cursor with GitHub unlocks which two core AI features?',
    options: [
      'Dark mode and custom themes',
      'AI Tab completion and the Chat panel',
      'GitHub Actions integration and auto-save',
      'Cloud sync and version history',
    ],
    correct: 1,
  },
  {
    module:   'GitHub Basics',
    question: 'Which command verifies that Git is installed on your machine?',
    options:  ['git status', 'git check', 'git --version', 'git init'],
    correct:  2,
  },
  {
    module:   'GitHub Basics',
    question: 'What does `git config --global user.email "you@example.com"` do?',
    options: [
      'Sets your GitHub account password',
      'Creates a new empty repository',
      'Stamps every future commit with your email address',
      'Connects your local repository to a remote origin',
    ],
    correct: 2,
  },
  {
    module:   'First Project',
    question: 'What does the command `git clone <url>` do?',
    options: [
      'Creates a brand new empty repository on GitHub',
      'Downloads the full project and its history to your machine',
      'Pushes your local changes up to GitHub',
      'Opens the project folder directly in Cursor',
    ],
    correct: 1,
  },
  {
    module:   'First Project',
    question: 'What is the correct order of Git commands to save and publish a change?',
    options: [
      'git push → git commit → git add',
      'git commit → git add → git push',
      'git add → git commit → git push',
      'git clone → git add → git push',
    ],
    correct: 2,
  },
  {
    module:   'APIs & Webhooks',
    question: 'Which HTTP method is used to READ data from a REST API?',
    options:  ['POST', 'DELETE', 'PUT', 'GET'],
    correct:  3,
  },
  {
    module:   'APIs & Webhooks',
    question: 'Where do you configure a webhook for a GitHub repository?',
    options: [
      'Profile → Settings → Developer options',
      'Repository → Settings → Webhooks',
      'Code → Actions → Webhooks → Add webhook',
      'Issues → Milestones → Webhooks',
    ],
    correct: 1,
  },
  {
    module:   'Advanced Builds',
    question: 'Where should you store API keys and secrets when working locally?',
    options: [
      'Directly in source code as string constants',
      'In a public GitHub Gist for easy sharing',
      'In `.env.local` — never committed to Git',
      'In the project README under Configuration',
    ],
    correct: 2,
  },
  {
    module:   'Advanced Builds',
    question: 'When you connect a GitHub repo to Vercel and push to `main`, what happens?',
    options: [
      'Nothing — all deploys must be triggered manually',
      'A staging environment is created for peer review',
      'A production deploy is triggered automatically',
      'The repository is archived pending approval',
    ],
    correct: 2,
  },
]
