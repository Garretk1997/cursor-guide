// ─── Capstone Projects ────────────────────────────────────────────────────────
// No instructions. Just a spec and a rubric. Build something real.

export const CAPSTONE_PROJECTS = [
  {
    id: 'onboarding-ui',
    title: 'Developer Onboarding UI',
    tag: 'Frontend',
    difficulty: 'Intermediate',
    timeEstimate: '4–8 hrs',
    summary:
      'Design and build a complete multi-step onboarding wizard from scratch. No libraries, no templates — just your understanding of flow, state, and UX. This is the kind of feature every SaaS product ships.',
    requirements: [
      'At least 4 sequential steps in a wizard flow (e.g. account setup → profile → preferences → confirmation).',
      'A persistent step indicator visible at all times, accurately showing position in the flow.',
      'Client-side validation on every step — the user cannot advance with empty required fields.',
      'State persisted in localStorage — refreshing mid-wizard resumes from the current step with data intact.',
      'Animated transitions between steps (entry and exit).',
      'Fully responsive from 375 px to 1280 px — no layout breaks, no horizontal scroll.',
      'A final summary step that displays all entered data before the user submits.',
      'A success/completion screen shown after the final submit.',
    ],
    successCriteria: [
      'Clicking "Next" on an empty required field shows an inline error — not a browser alert.',
      'Navigating back and forward between steps preserves all entered values.',
      'A hard refresh at step 3 returns the user to step 3 with their data still present.',
      'Tab order through all form inputs is logical and keyboard-complete.',
      'Step indicator updates immediately on each step change, with no flicker.',
      'All transitions complete within 300 ms and have no layout shift.',
      'The completion screen is visually distinct from the form steps.',
      'Zero JavaScript console errors during normal use.',
    ],
  },

  {
    id: 'saas-dashboard',
    title: 'Mini SaaS Dashboard',
    tag: 'Full Stack',
    difficulty: 'Advanced',
    timeEstimate: '6–12 hrs',
    summary:
      'Build an admin dashboard for a fictional SaaS product. It must feel production-grade: real data, real interactivity, and layout that does not collapse under pressure. The data can be mocked — the code cannot.',
    requirements: [
      'Collapsible sidebar with at least 4 named sections (e.g. Overview, Users, Analytics, Settings).',
      'Overview page with a minimum of 3 KPI cards (e.g. total users, monthly revenue, churn rate).',
      'A data table on the Users page with at least 5 columns and pagination or virtual scroll for 50+ rows.',
      'Table sortable by at least 2 columns, toggling ascending and descending on repeated clicks.',
      'A real-time search or filter input that narrows table results without a page reload.',
      'At least one chart or data visualization (bar, line, or pie — library or canvas, your choice).',
      'A user profile area in the header (avatar, name, and a dropdown with at least 2 actions).',
      'All navigation must be single-page — no full reloads between sections.',
    ],
    successCriteria: [
      'Each sidebar section renders a distinct, content-filled view.',
      'KPI values update correctly when the underlying data changes (demonstrate with a toggle or mock refresh).',
      'Table sorts correctly in both directions — verify with numbers and strings.',
      'Search/filter narrows results with each keystroke, with no noticeable lag.',
      'Chart renders without overflow at 768 px, 1024 px, and 1440 px.',
      'Sidebar collapses to icon-only mode (or hides entirely) below 900 px, without breaking layout.',
      'Dropdown in the header closes when clicking outside it.',
      'No horizontal scroll at 768 px viewport width.',
    ],
  },

  {
    id: 'landing-page',
    title: 'Responsive Landing Page',
    tag: 'Frontend',
    difficulty: 'Intermediate',
    timeEstimate: '3–6 hrs',
    summary:
      'Build a high-conversion landing page for a fictional developer tool. Every section has a job — the hero converts, the features convince, the pricing closes. Ship something you could put in a real portfolio.',
    requirements: [
      'Navigation bar with logo, links to each page section, and a prominent CTA button.',
      'Hero section with a headline, subheadline, one primary CTA, and one secondary action.',
      'Features section with at least 3 items, each with a distinct icon or illustration and a description.',
      'Pricing section with at least 2 tiers, clearly listing what is included and excluded in each.',
      'Testimonials or social proof section with at least 2 real-looking entries (name, role, quote).',
      'Footer with navigation links, social links, and a copyright notice.',
      'Mobile hamburger menu that toggles open and closed — all nav links must be reachable on mobile.',
      'Smooth-scroll behavior when clicking nav links to in-page sections.',
    ],
    successCriteria: [
      'The primary CTA button is visible above the fold on 375 px, 768 px, and 1280 px screens.',
      'Smooth scroll lands on the correct section for every nav link.',
      'Hamburger menu opens, displays all nav links, and closes — with no layout bleed.',
      'Zero horizontal scroll at 375 px viewport width.',
      'All images and icons have descriptive alt text.',
      'Lighthouse performance score of 85 or above on desktop.',
      'Pricing section clearly communicates what is and is not included in each tier.',
      'Page is readable and functional with JavaScript disabled (progressive enhancement).',
    ],
  },
]
