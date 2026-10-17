/* ==========================================================================
   SERVICE CATALOGUE — what the client can choose.
   Each group's `id` must match a key in PRICING (src/config.js).
   Groups with several `items` are still priced once (see lib/pricing.js).
   ========================================================================== */

/** Everything already part of the complete website revamp — never selectable. */
export const INCLUDED = [
  { title: 'Complete new website', text: 'All the essential pages your business needs — home, about, services, contact and more.' },
  { title: 'Looks great on every device', text: 'Designed to work beautifully on mobile, tablet and desktop.' },
  { title: 'Enquiry & quotation forms', text: 'Simple forms so visitors can contact you or request a quote.' },
  { title: 'Call, email & WhatsApp buttons', text: 'One-tap ways for prospective clients to reach you.' },
  { title: 'Client testimonials', text: 'A section to show what your customers say about you.' },
  { title: 'Basic search visibility', text: 'Set up so Google can find and understand your website.' },
  { title: 'Testing & launch', text: 'Thoroughly checked, set up and launched for you.' },
  { title: '6 months of support', text: 'Maintenance and help for six months after launch.' },
]

export const SECTIONS = [
  {
    id: 'brand',
    letter: 'A',
    title: 'Branding & Visual Identity',
    intro: 'How your company looks — before anyone reads a word.',
    groups: [
      {
        id: 'branding',
        name: 'Logo & Brand Identity',
        description:
          'Create or refine the visual identity of your company, including logo direction, colors, typography and overall brand style.',
        items: [
          { id: 'logoDesign', label: 'Logo design / redesign' },
          { id: 'brandIdentity', label: 'Brand identity' },
        ],
        bonus: 'Brand guidelines included',
      },
      {
        id: 'uiux',
        name: 'Website UI/UX Design',
        description: 'Design a modern, premium and professional visual experience for your new website.',
      },
      {
        id: 'visualContent',
        name: 'Visual Content Design',
        description: 'Create or improve website banners, graphics and supporting visual assets.',
      },
    ],
  },
  {
    id: 'showcase',
    letter: 'B',
    title: 'Website & Business Showcase',
    intro: 'Show prospective clients exactly what you can do — and prove it.',
    groups: [
      {
        id: 'contentImageUpgrade',
        name: 'Content & Image Upgrade',
        description: 'Improve, restructure or enhance the content and imagery used across the website.',
      },
      {
        id: 'capabilitiesShowcase',
        name: 'Services & Capabilities Showcase',
        description: 'Professionally present your services, capabilities, facilities and industrial strengths.',
        items: [
          { id: 'services', label: 'Services' },
          { id: 'capabilities', label: 'Capabilities' },
          { id: 'machinery', label: 'Machinery' },
          { id: 'facilities', label: 'Facilities' },
          { id: 'capacity', label: 'Capacity' },
          { id: 'industriesServed', label: 'Industries served' },
        ],
      },
      {
        id: 'projectsPortfolio',
        name: 'Projects & Portfolio',
        description: 'Create a professional showcase for previous projects and completed work.',
        items: [
          { id: 'projectShowcase', label: 'Project showcase' },
          { id: 'portfolio', label: 'Portfolio gallery' },
          { id: 'caseStudies', label: 'Case studies' },
        ],
      },
      {
        id: 'qualityCertification',
        name: 'Quality & Certifications',
        description: 'Present quality standards, certifications, processes and trust factors professionally.',
      },
      {
        id: 'companyProfilePdf',
        name: 'Company Profile PDF',
        description:
          'Create a professionally designed downloadable company/capability profile that can also be shared directly with prospective clients.',
      },
      {
        id: 'customFeature',
        name: 'Custom Website Feature',
        description: 'Any additional website functionality or special requirement not covered above.',
        detailsPrompt: 'Please describe what you need.',
      },
    ],
  },
  {
    id: 'ai',
    letter: 'C',
    title: 'AI & Smart Features',
    intro: 'Help visitors get answers faster — and help your team respond faster.',
    groups: [
      {
        id: 'aiSmartFeatures',
        name: 'AI & Smart Features',
        description:
          'Add intelligent features that help visitors understand your business, submit better enquiries and streamline initial communication.',
        items: [
          { id: 'aiAssistant', label: 'AI Website Assistant', hint: 'Answers visitor questions about your company, any time.' },
          { id: 'aiRfq', label: 'AI Enquiry / RFQ Assistant', hint: 'Guides buyers to share the right details with their request.' },
          { id: 'autoEmail', label: 'Automated Email Response', hint: 'Sends a professional reply as soon as an enquiry arrives.' },
          { id: 'aiQuotation', label: 'AI Quotation Assistant', hint: 'Helps prepare first-draft quotations from enquiries.' },
        ],
        preferences: true,
      },
    ],
  },
  {
    id: 'growth',
    letter: 'D',
    title: 'Advanced Online Growth',
    intro: 'Basic search visibility is already included. These go further.',
    groups: [
      {
        id: 'localSEO',
        name: 'Local SEO',
        description: 'Improve visibility for customers searching for your business and services locally.',
      },
      {
        id: 'advancedSEO',
        name: 'Advanced SEO',
        description:
          'A more comprehensive SEO strategy designed to improve long-term organic visibility and search growth.',
      },
    ],
  },
  {
    id: 'ongoing',
    letter: 'E',
    title: 'Ongoing Services',
    intro: 'Website maintenance and support are already included for 6 months after launch.',
    groups: [
      {
        id: 'ongoingSEO',
        name: 'Ongoing SEO',
        description: 'Continue improving search visibility and organic growth after the initial website launch.',
      },
      {
        id: 'contentUpdates',
        name: 'Content Updates After 6 Months',
        description:
          'Continued updates to website content, images, services, projects and other website information after the included support period.',
      },
    ],
  },
]

export const ALL_GROUPS = SECTIONS.flatMap((s) => s.groups)

/** Items for a group — single-option groups use the group itself as their one item. */
export const itemsOf = (group) => group.items ?? [{ id: group.id, label: group.name }]

/** AI feature preference options (shown once any AI feature is chosen). */
export const AI_PREFERENCES = {
  channels: ['Email', 'WhatsApp', 'Both'],
  languages: ['English', 'Hindi', 'Gujarati', 'Other'],
}

export const IMAGE_OPTIONS = ['Yes', 'Some', 'No']
