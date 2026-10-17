/* ==========================================================================
   SERVICE CATALOGUE — what the client can choose.
   Each service is one checkbox; its `id` must match a key in PRICING (src/config.js).
   `includes` lists what a grouped service covers — shown as text, priced once.
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
        includes: ['Logo design / redesign', 'Brand identity'],
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
        includes: [
          'Services & capabilities — machinery, facilities, capacity and industries served',
          'Projects & portfolio — completed work and case studies',
          'Quality & certifications — standards, certifications and processes',
          'Company profile PDF — a designed, downloadable profile to share with clients',
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
        includes: [
          'AI Website Assistant — answers visitor questions about your company, any time',
          'AI Enquiry / RFQ Assistant — guides buyers to share the right details with their request',
          'Automated Email Response — sends a professional reply as soon as an enquiry arrives',
          'AI Quotation Assistant — helps prepare first-draft quotations from enquiries',
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
    // Shown as a note above the checkbox — complimentary, so nothing to tick.
    complimentary: {
      title: 'Maintenance & Technical Support',
      label: 'Complimentary for 6 months',
      text: 'Free for the first 6 months after launch.',
      notes: [
        'During the 6 months, any additions, deletions or changes beyond maintenance and technical checks are charged separately, based on the work.',
      ],
    },
    groups: [
      {
        id: 'supportAfter6Months',
        name: 'Support After 6 Months',
        description:
          'Tick if you’d like continued maintenance, technical support and content updates after the complimentary 6 months. Charged based on the scope of work.',
      },
    ],
  },
]

export const ALL_GROUPS = SECTIONS.flatMap((s) => s.groups)
