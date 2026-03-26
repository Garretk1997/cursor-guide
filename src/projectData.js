// ─── Practice Projects — one per module ─────────────────────────────────────

export const PRACTICE_PROJECTS = [
  {
    module:    'Setup Cursor',
    title:     'AI-Assisted Landing Page',
    objective: "Use Cursor's AI features to build and style a basic landing page — without writing a single line of code manually.",
    steps: [
      'Create a new folder on your desktop called my-landing-page and open it in Cursor via File → Open Folder.',
      'Create a new file called index.html. Press Cmd+K (Ctrl+K on Windows) and type: "Generate a clean HTML landing page with a headline, short paragraph, and a CTA button."',
      'Press Cmd+K again on the <style> section and ask: "Style this page with a dark background, centered layout, and a violet CTA button."',
      'Select just the button HTML and press Cmd+K: "Add a hover effect that lightens the button color."',
      'Open index.html in your browser to see the live result. Use Cursor Chat (Cmd+L) if anything looks wrong and describe the issue.',
    ],
    outcome: 'A styled HTML landing page with a headline, paragraph, and hover-animated CTA button — built entirely through AI prompts in Cursor.',
  },
  {
    module:    'GitHub Basics',
    title:     'Your First Public Repository',
    objective: 'Create a polished GitHub repository with a professional README and a clean commit history.',
    steps: [
      'Log into GitHub and click the + icon → New repository. Name it my-first-project, add a short description, check "Add a README", and click Create repository.',
      'Click README.md → pencil icon to edit it. Add: a project title (H1), a one-paragraph description, a "Features" section with 3 bullet points, and a "Getting Started" section.',
      'Scroll down, write a commit message like "Add full README with project overview", and click Commit changes.',
      'Go to Settings → General and add a topic tag (e.g. learning or html). This makes your repo more discoverable.',
      'Visit your GitHub profile at github.com/YOUR_USERNAME — confirm the repository appears with the description and README preview.',
    ],
    outcome: 'A live public repository with a professional multi-section README and a visible commit history on your GitHub profile.',
  },
  {
    module:    'First Project',
    title:     'Clone, Edit & Push',
    objective: 'Complete the full Git workflow — clone your repo to your machine, edit a file in Cursor, then push the change live to GitHub.',
    steps: [
      'Open your my-first-project repo on GitHub. Click the green Code button and copy the HTTPS URL.',
      'Open your terminal and run: git clone <paste-url-here>. A new folder will appear on your machine.',
      'Open the cloned folder in Cursor. Edit README.md — add a new section called "## What I Learned" with 2–3 bullet points about what you covered in this module.',
      'Open Cursor\'s integrated terminal (Ctrl+`) and run: git add README.md',
      'Run: git commit -m "Add what I learned section to README"',
      'Run: git push — then refresh the repo on GitHub to confirm your new section is live.',
    ],
    outcome: 'A new commit visible on GitHub showing your README edit — your first complete local-to-remote Git workflow.',
  },
  {
    module:    'APIs & Webhooks',
    title:     'Live GitHub Profile Viewer',
    objective: "Call the GitHub REST API and render a user's public profile data on a webpage — no backend required.",
    steps: [
      'Create a new file called profile.html with a basic HTML structure: DOCTYPE, head, body, and a <div id="output">.',
      'Add a <script> tag at the bottom of body. Inside it, write: fetch("https://api.github.com/users/YOUR_USERNAME") .then(r => r.json()) .then(data => { ... })',
      'Replace YOUR_USERNAME with your actual GitHub username.',
      'Inside the .then(data => { }) block, set innerHTML to display: data.name, data.bio, data.public_repos, and data.avatar_url in an <img> tag.',
      'Open profile.html in your browser. Your GitHub name, bio, repo count, and avatar should all appear.',
      'Use Cursor Chat to ask: "How do I add error handling if the API call fails?" — apply the suggestion.',
    ],
    outcome: 'A working webpage that fetches your live GitHub profile data and renders your name, bio, repo count, and avatar.',
  },
  {
    module:    'Advanced Builds',
    title:     'Deploy Your Page to Vercel',
    objective: 'Push your landing page project to GitHub and deploy it live on the internet using Vercel — in under 10 minutes.',
    steps: [
      'Open your landing page folder in Cursor. Make sure all files (index.html etc.) are saved and looking good in the browser.',
      'In the integrated terminal, run: git init && git add . && git commit -m "Initial commit"',
      'Create a new public GitHub repo called my-live-site (no README this time). Copy the remote URL shown after creation.',
      'In your terminal run: git remote add origin <url> && git push -u origin main (use master if main fails).',
      'Go to vercel.com, sign in with GitHub, click Add New → Project, and import my-live-site. Keep all defaults and click Deploy.',
      'After the build completes (~30 seconds), click the generated URL — your page is now live on the internet.',
    ],
    outcome: 'A publicly accessible URL (e.g. your-site.vercel.app) hosted on Vercel\'s global CDN — your first real deployment.',
  },
]
