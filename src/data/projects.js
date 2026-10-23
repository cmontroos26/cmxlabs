/**
 * CMX Labs — Portfolio Data
 *
 * This is the single source of truth for all projects.
 * To add a new project: copy one of the objects below, give it a unique `slug`,
 * and set `status: 'published'` when ready to go live.
 *
 * status: 'published' | 'draft'   — drafts are never rendered on the site
 * featured: true                  — shows the project in the homepage Featured Work section
 */

export const projects = [
  {
    id: 'court-radar',
    slug: 'court-radar',
    name: 'Court-Radar',
    tagline: 'Smart court booking and sports facility management.',
    shortDesc:
      'A full-stack sports technology platform for court reservations, real-time scheduling, and business management.',
    category: 'SaaS Platform',
    filterCategory: 'saas',
    industry: 'Sports Technology',
    type: 'Web & Mobile Platform',
    role: 'Design & Full-Stack Development',
    year: 2026,
    status: 'published',
    featured: true,
    liveUrl: 'https://court-radar.app',
    appStoreUrl: null,
    playStoreUrl: null,
    tags: ['Sports Tech', 'SaaS', 'Booking', 'Payments'],
    services: [
      'Product Strategy',
      'UI/UX Design',
      'Full-Stack Development',
      'Payment Integration',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Vercel'],
    thumbnail: '/assets/courtradar-desktop.webp',
    desktopScreenshots: ['/assets/courtradar-desktop.webp'],
    mobileScreenshots: ['/assets/courtradar-mobile.webp'],
    description: `Court-Radar is a sports court booking and management platform built for sports facility owners and players. The platform handles everything from real-time court availability and online reservations to integrated payments and business reporting, giving facility operators a complete management solution and players a seamless booking experience.`,
    challenge: `Sports facility owners in the region were managing bookings manually: through phone calls, WhatsApp messages, and spreadsheets. This caused double-bookings, missed reservations, and no visibility into revenue. Players had no reliable way to know if a court was available, let alone book it online.`,
    solution: `We designed and built a full-stack SaaS platform that gives facility owners a real-time management dashboard and players a clean, fast booking experience. Stripe handles payments, Supabase powers the real-time database, and the platform is designed to scale across multiple facilities.`,
    features: [
      'Real-time court availability and booking calendar',
      'Integrated Stripe payment processing',
      'Facility owner management dashboard',
      'Multi-court and multi-facility support',
      'Booking confirmation and notification system',
      'Mobile-responsive experience for players and owners',
    ],
    results: null, // Add verified results here when available
    seo: {
      title: 'Court-Radar — Sports Booking Platform | CMX Labs Work',
      description:
        'How CMX Labs designed and built Court-Radar: a full-stack sports court booking and facility management platform.',
    },
  },

  {
    id: 'hilltop-villa',
    slug: 'hilltop-villa',
    name: 'Hilltop Villa Curaçao',
    tagline: 'Premium vacation rental website with direct booking.',
    shortDesc:
      'A modern hospitality website for a luxury vacation rental property in Curaçao, designed to attract international guests and drive direct bookings.',
    category: 'Business Website',
    filterCategory: 'website',
    industry: 'Hospitality & Travel',
    type: 'Booking Website',
    role: 'Design & Development',
    year: 2026,
    status: 'published',
    featured: false,
    liveUrl: 'https://hilltopvillacuracao.traha.app/',
    appStoreUrl: null,
    playStoreUrl: null,
    tags: ['Hospitality', 'Booking', 'Website', 'Tourism'],
    services: ['UI/UX Design', 'Web Development', 'Booking Integration'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    thumbnail: '/assets/hilltop-desktop.webp',
    desktopScreenshots: ['/assets/hilltop-desktop.webp'],
    mobileScreenshots: ['/assets/hilltop-desktop-mobile.webp'],
    description: `Hilltop Villa Curaçao is a premium vacation rental property that needed a digital presence matching the quality and experience of the property itself. We built a modern, conversion-focused website that showcases the villa beautifully and drives direct bookings, reducing dependence on third-party platforms.`,
    challenge: `The property was relying entirely on platforms like Airbnb and Booking.com, giving them limited control over their brand, pricing, and guest relationships. They needed a professional direct-booking website that reflected the premium nature of the property.`,
    solution: `We created an immersive, visually-led website with full-screen imagery, a clear showcase of amenities and experiences, and a streamlined direct booking flow. The design communicates the premium hospitality experience from the first scroll.`,
    features: [
      'Premium visual design with full-screen photography',
      'Direct booking functionality',
      'Property amenities and features showcase',
      'Location guide and nearby activities',
      'Gallery and virtual tour section',
      'Mobile-first responsive design',
    ],
    results: null,
    seo: {
      title: 'Hilltop Villa Curaçao — Hospitality Website | CMX Labs Work',
      description:
        'How CMX Labs built a premium direct-booking website for Hilltop Villa Curaçao to attract international guests.',
    },
  },

  {
    id: 'hair-by-jessica',
    slug: 'hair-by-jessica',
    name: 'Hair by Jessica',
    tagline: 'Boutique salon website with an editorial luxury aesthetic.',
    shortDesc:
      'A modern salon and beauty studio website for a Curaçao-based hairstylist, designed with a boutique editorial feel.',
    category: 'Business Website',
    filterCategory: 'website',
    industry: 'Beauty & Lifestyle',
    type: 'Business Website',
    role: 'Design & Development',
    year: 2026,
    status: 'published',
    featured: false,
    liveUrl: 'https://hairbyjessica.traha.app/',
    appStoreUrl: null,
    playStoreUrl: null,
    tags: ['Beauty', 'Lifestyle', 'Branding', 'Website'],
    services: ['Brand Design', 'UI/UX Design', 'Web Development'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    thumbnail: '/assets/hairbyjessica-desktop.webp',
    desktopScreenshots: ['/assets/hairbyjessica-desktop.jpg'],
    mobileScreenshots: ['/assets/hairbyjessica-mobile.jpg'],
    description: `Hair by Jessica needed a digital presence that reflected the craft, care, and premium nature of their salon experience. We designed a website with a strong editorial aesthetic: sophisticated typography, an elegant color palette, and a layout that lets the work speak for itself.`,
    challenge: `The salon had no website and relied entirely on social media and word-of-mouth for new clients. They needed a professional online presence that communicated quality, showcased their work, and made it easy for potential clients to book an appointment.`,
    solution: `We designed an editorial-inspired website with strong visual hierarchy, a curated portfolio section, and clear service and booking information. The design aesthetic was crafted specifically to attract the right clientele and reflect the salon's premium positioning.`,
    features: [
      'Editorial luxury design aesthetic',
      'Services showcase and pricing information',
      'Portfolio and gallery section',
      'Appointment booking call-to-action',
      'Brand story and about section',
      'Mobile-optimized experience',
    ],
    results: null,
    seo: {
      title: 'Hair by Jessica — Salon Website | CMX Labs Work',
      description:
        'How CMX Labs designed and built the Hair by Jessica salon website with a boutique editorial aesthetic.',
    },
  },

  {
    id: 'rdl-photography',
    slug: 'rdl-photography',
    name: 'RDL Photography',
    tagline: 'Portfolio website for a Curaçao-based photographer.',
    shortDesc:
      'A dark, editorial portfolio website for RDL Photography, showcasing events, portraits, and sports photography with a bold visual identity.',
    category: 'Business Website',
    filterCategory: 'website',
    industry: 'Photography & Creative',
    type: 'Portfolio Website',
    role: 'Design & Development',
    year: 2026,
    status: 'published',
    featured: false,
    liveUrl: 'https://rdlphotography.traha.app/',
    appStoreUrl: null,
    playStoreUrl: null,
    tags: ['Photography', 'Portfolio', 'Creative', 'Website'],
    services: ['UI/UX Design', 'Web Development', 'Brand Identity'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    thumbnail: '/assets/rdl-desktop.webp',
    desktopScreenshots: ['/assets/rdl-desktop.webp'],
    mobileScreenshots: ['/assets/rdl-mobile.webp'],
    description: `RDL Photography is a Curaçao-based photographer specializing in events, portraits, and sports. We designed and built a bold, editorial portfolio website that puts the photography front and center, with a dark aesthetic and immersive full-screen layouts that let the work speak for itself.`,
    challenge: `RDL Photography needed a professional online presence that matched the quality and style of their work. The site had to feel premium, load fast with large images, and make it easy for potential clients to explore the portfolio and book a session.`,
    solution: `We created a dark, full-bleed portfolio website with a strong typographic identity and a clean layout that keeps the focus on the photography. The site is designed to convert visitors into bookings, with clear calls to action and a seamless browsing experience across devices.`,
    features: [
      'Bold editorial design with full-screen photography',
      'Portfolio gallery organized by category',
      'Session booking call-to-action',
      'Services and pricing showcase',
      'About and story section',
      'Mobile-first responsive design',
    ],
    results: null,
    seo: {
      title: 'RDL Photography — Portfolio Website | CMX Labs Work',
      description:
        'How CMX Labs designed and built the RDL Photography portfolio website with a bold editorial aesthetic for a Curaçao-based photographer.',
    },
  },

  {
    id: 'xiara-journey',
    slug: 'xiara-journey',
    name: 'Xiara Journey',
    tagline: 'A fundraising campaign platform built to inspire action.',
    shortDesc:
      'A fundraising campaign website designed to tell a compelling story, build trust with donors, and make giving easy.',
    category: 'Campaign Platform',
    filterCategory: 'website',
    industry: 'Fundraising & Social Impact',
    type: 'Campaign Website',
    role: 'Design & Development',
    year: 2026,
    status: 'published',
    featured: false,
    liveUrl: 'https://xiarajourney.traha.app/',
    appStoreUrl: null,
    playStoreUrl: null,
    tags: ['Fundraising', 'Campaign', 'Social Impact'],
    services: ['UI/UX Design', 'Web Development', 'Donation Integration'],
    technologies: ['React', 'Next.js', 'Vercel'],
    thumbnail: '/assets/xiara-desktop.webp',
    desktopScreenshots: ['/assets/xiara-desktop.jpg'],
    mobileScreenshots: ['/assets/xiara-mobile.jpg'],
    description: `Xiara Journey is a fundraising campaign platform built to raise awareness for Xiara's cause and make it easy for supporters to contribute. The platform needed to communicate urgency and emotional impact while maintaining transparency and trust with donors.`,
    challenge: `The campaign needed a digital platform quickly: one that could tell a compelling human story, present the cause clearly, and give donors confidence that their contribution would matter. Generic fundraising pages on third-party platforms didn't give enough control over the narrative or design.`,
    solution: `We built a focused campaign website with a clear narrative arc, from introducing Xiara's story to explaining the impact of donations and making the giving process simple. The design balances emotional storytelling with clear, trustworthy information presentation.`,
    features: [
      'Campaign story and narrative design',
      'Donation information and guidance',
      'Impact communication and transparency',
      'Social sharing functionality',
      'Mobile-first responsive design',
      'Fast, optimized performance',
    ],
    results: null,
    seo: {
      title: 'Xiara Journey — Fundraising Campaign | CMX Labs Work',
      description:
        'How CMX Labs designed and built the Xiara Journey fundraising campaign platform to inspire donors to act.',
    },
  },
];

/**
 * Utility: get only published projects
 */
export function getPublishedProjects() {
  return projects.filter((p) => p.status === 'published');
}

/**
 * Utility: get featured published projects (for homepage)
 */
export function getFeaturedProjects() {
  return projects.filter((p) => p.status === 'published' && p.featured);
}

/**
 * Utility: find a project by slug
 */
export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug && p.status === 'published');
}

/**
 * Utility: get adjacent projects for case study navigation
 */
export function getAdjacentProjects(slug) {
  const published = getPublishedProjects();
  const idx = published.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? published[idx - 1] : published[published.length - 1],
    next: idx < published.length - 1 ? published[idx + 1] : published[0],
  };
}
