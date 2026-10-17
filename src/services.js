/* ==========================================================================
   SERVICE CATALOGUE — what the client can choose.
   Each group's `id` must match a key in PRICING (src/config.js).
   Groups with several `items` are still priced once (see lib/pricing.js).
   ========================================================================== */

/** One line telling the client what they don't need to tick. */
export const INCLUDED_NOTE =
  'Already included in every website: all essential pages, a mobile-friendly design, enquiry & quotation forms, call / email / WhatsApp buttons, testimonials, basic SEO, testing, launch and 6 months of maintenance & technical support.'

export const SECTIONS = [
  {
    id: 'brand',
    letter: 'A',
    title: 'Branding & Design',
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
        bonus: 'Visual content design (banners & graphics) included — first iteration only',
      },
    ],
  },
  {
    id: 'showcase',
    letter: 'B',
    title: 'Website & Business Showcase',
    groups: [
      {
        id: 'contentImageUpgrade',
        name: 'Content & Image Upgrade',
        description: 'Improve, restructure or enhance the content and imagery used across the website.',
        // Rates are listed under the description from PRICING.contentImageUpgrade.rates
      },
      {
        id: 'businessShowcase',
        name: 'Business Showcase',
        description: 'Professionally present what you do, what you’ve delivered and why clients can trust you.',
        items: [
          { id: 'capabilitiesShowcase', label: 'Services & capabilities', hint: 'Machinery, facilities, capacity and industries served.' },
          { id: 'projectsPortfolio', label: 'Projects & portfolio', hint: 'Completed work and case studies.' },
          { id: 'qualityCertification', label: 'Quality & certifications', hint: 'Standards, certifications and processes.' },
          { id: 'companyProfilePdf', label: 'Company profile PDF', hint: 'A designed, downloadable profile to share with clients.' },
        ],
      },
      {
        id: 'customFeature',
        name: 'Custom Website Feature',
        description: 'Any additional website functionality or special requirement not covered above — describe it in the notes below.',
      },
    ],
  },
  {
    id: 'ai',
    letter: 'C',
    title: 'AI & Smart Features',
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
      },
    ],
  },
  {
    id: 'growth',
    letter: 'D',
    title: 'Online Growth',
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
          'Only needed if you want to grow through organic search traffic and viewership. A separate, longer-term service, priced based on your goals.',
      },
    ],
  },
  {
    id: 'support',
    letter: 'E',
    title: 'After Launch',
    groups: [
      {
        id: 'maintenance',
        name: 'Maintenance & Technical Support',
        description: 'Free for the first 6 months after launch.',
        notes: [
          'Content updates after 6 months are charged separately, based on the scope of work.',
          'During the 6 months, any additions, deletions or changes beyond maintenance and technical checks are charged separately, based on the work.',
        ],
      },
    ],
  },
]

export const ALL_GROUPS = SECTIONS.flatMap((s) => s.groups)

/** Items for a group — single-option groups use the group itself as their one item. */
export const itemsOf = (group) => group.items ?? [{ id: group.id, label: group.name }]
