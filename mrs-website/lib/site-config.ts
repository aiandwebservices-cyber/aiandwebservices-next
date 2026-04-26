// Location-specific site configuration.
// FL_CONFIG and NY_CONFIG are the two exports consumed by pages and components.
// All location-dependent values live here — nowhere else.

export type SchemaAddress = {
  streetAddress: string | null;
  addressLocality: string;
  addressRegion: string;
  postalCode: string | null;
  addressCountry: string;
};

export type SchemaGeo = {
  latitude: number;
  longitude: number;
} | null;

export type SchemaOrg = {
  type: 'LocalBusiness';
  name: string;
  telephone: string;
  email: string;
  url: string;
  description: string;
  address: SchemaAddress;
  geo: SchemaGeo;
  areaServed: string[];
};

export type Testimonial = {
  name: string;
  city: string;
  stars: number;
  quote: string;
};

export type WhyItem = {
  icon: string;
  title: string;
  desc: string;
};

export type ServiceItem = {
  id: string;
  icon: string;
  title: string;         // full title for services page
  cardDesc: string;      // short description for homepage card
  desc: string;          // full paragraph for services page
  href: string;
  causes: string[];
  process: string[];
  callWhen: string;
  photos: { src: string; alt: string }[];
};

export type FaqItem = {
  q: string;
  a: string;
};

export type StatItem = {
  num: string;
  label: string;
};

export type CertItem = {
  name: string;
  desc: string;
};

export type SiteConfig = {
  // Identity
  location: 'florida' | 'newYork';
  siteName: string;
  productionUrl: string;

  // Contact
  phone: string;
  phoneHref: string;
  email: string;

  // Physical presence
  address: string | null;               // null = "serving X metro, no office"
  addressOneLiner: string | null;       // formatted for footer display
  serviceAreaLabel: string;             // "South Florida" | "NYC Metro"
  serviceAreaDetail: string;            // prose paragraph for service area section
  serviceAreaCities: string[];          // chip list on homepage
  mapsEmbedUrl: string | null;          // null = omit map embed

  // SEO
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;

  // Hero section
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaPhone: string;                 // text on phone CTA button

  // Section copy
  servicesSectionSubhead: string;       // under "Our Restoration Services"
  seeOurWorkSubhead: string;            // under "See Our Work"
  whyTrustHeadline: string;             // "Why South Florida Trusts MRS"
  whyItems: WhyItem[];
  testimonialSubhead: string;           // under "What Our Customers Say"
  testimonials: Testimonial[];
  serviceAreaHeadline: string;          // "Proudly Serving All of South Florida"
  serviceAreaGetHelpCta: string;        // link text

  // Services (used by homepage cards + services page)
  services: ServiceItem[];

  // FAQ
  faqItems: FaqItem[];
  faqHeroSubhead: string;

  // About page
  aboutHeroSubhead: string;
  aboutStoryParagraphs: string[];
  stats: StatItem[];
  certs: CertItem[];
  missionStatement: string;

  // Contact page
  contactServiceAreaDetail: string;     // HTML-like formatted text for sidebar

  // Weather / risk angles (used in services + FAQ)
  weatherAngles: string[];              // short phrases used in copy

  // License / credentials
  licenseNumbers: string[] | null;

  // Footer
  footerTagline: string;
  footerServiceAreaLine: string;

  // Insurance copy (used in why-items and FAQ)
  insuranceSpecificLanguage: string;    // e.g. "Citizens Insurance, AOB, claim denials"

  // Form
  addressPlaceholder: string;           // EmergencyForm address field placeholder
  showSpanishBadge: boolean;            // "Se Habla Español" badge in header, footer, contact

  // Schema.org
  schema: SchemaOrg;
};

// ─── FL CONFIG ───────────────────────────────────────────────────────────────

export const FL_CONFIG: SiteConfig = {
  location: 'florida',
  siteName: 'Mitigation Restoration Services',
  productionUrl: 'https://mitigationrestorationservice.com',

  phone: '(754) 777-8956',
  phoneHref: 'tel:+17547778956',
  email: 'Sam@mitigationrestorationservice.co.site',

  address: '11322 Miramar Pkwy, Miramar, FL 33025',
  addressOneLiner: '11322 Miramar Pkwy, Miramar, FL 33025',
  serviceAreaLabel: 'South Florida',
  serviceAreaDetail:
    'From Boca Raton south through Fort Lauderdale and Broward County down to Miami and Miami-Dade — we cover all of South Florida with fast, local response times.',
  serviceAreaCities: [
    'Boca Raton', 'Deerfield Beach', 'Pompano Beach', 'Fort Lauderdale',
    'Hollywood', 'Hallandale Beach', 'Aventura', 'North Miami',
    'Miami Beach', 'Miami', 'Coral Gables', 'Homestead',
  ],
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d462248.8319642613!2d-80.24932!3d25.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1713200000000!5m2!1sen!2sus',

  metaTitle: 'Emergency Water Damage Miami | 24/7 Response <60min | (754) 777-8956',
  metaDescription:
    '24/7 emergency water, fire & mold restoration in Miami, Fort Lauderdale & Boca Raton. IICRC certified. <60min response. Call (754) 777-8956 now.',
  ogTitle: 'Mitigation Restoration Services | 24/7 Emergency Restoration South Florida',
  ogDescription: 'When disaster strikes, we respond. 24/7 emergency restoration for South Florida. Call (754) 777-8956.',
  keywords:
    'water damage restoration, mold remediation, fire damage restoration, storm damage, South Florida restoration, Fort Lauderdale, Miami, Boca Raton, IICRC certified, 24/7 emergency restoration',

  heroHeadline: 'When Disaster Strikes, We Respond.',
  heroSubheadline:
    '24/7 emergency water, fire, mold & storm damage restoration for South Florida — Boca Raton to Miami. Fast response. Licensed & insured.',
  heroCtaPhone: '📞 Call Now: (754) 777-8956',

  servicesSectionSubhead: 'Full-service property damage restoration for South Florida homes & businesses',
  seeOurWorkSubhead: 'Real South Florida jobs — water damage, mold, and full restoration',
  whyTrustHeadline: 'Why South Florida Trusts MRS',
  whyItems: [
    { icon: '🕐', title: '24/7 Emergency Response', desc: 'We answer every call, day or night, including holidays and hurricane season.' },
    { icon: '🏅', title: 'Licensed & IICRC Certified', desc: 'Fully licensed, insured, and certified to industry standards.' },
    { icon: '📋', title: 'Insurance Claim Specialist', desc: "We navigate Florida's complex insurance market — Citizens, AOB, claim denials." },
    { icon: '📍', title: 'Local South Florida Team', desc: 'We live and work here. Fast response from Boca Raton to Miami.' },
  ],
  testimonialSubhead: 'Real South Florida homeowners and property managers',
  testimonials: [
    { name: 'Maria G.', city: 'Fort Lauderdale', stars: 5, quote: 'After a pipe burst at 2am, MRS was at my door within 45 minutes. They saved my floors and handled everything with my insurance. Incredible service.' },
    { name: 'Robert T.', city: 'Miami Beach', stars: 5, quote: 'Hurricane Ian left serious water damage in our condo. MRS was professional, fast, and made the whole claim process painless. Highly recommend.' },
    { name: 'Sandra L.', city: 'Boca Raton', stars: 5, quote: 'Found mold behind our bathroom wall. The MRS team was thorough, explained everything, and the remediation was perfect. They even speak Spanish — huge plus!' },
  ],
  serviceAreaHeadline: 'Proudly Serving All of South Florida',
  serviceAreaGetHelpCta: 'Get Help in Your Area →',

  services: [
    {
      id: 'water',
      icon: '💧',
      title: 'Water Damage Restoration',
      cardDesc: 'Rapid extraction, drying & dehumidification 24/7.',
      desc: 'In South Florida, water damage strikes fast — hurricane storm surge in Miami-Dade, burst pipes in older Broward County homes, king tide flooding in coastal Boca Raton and Fort Lauderdale. Every hour matters. Our IICRC-certified technicians extract standing water, deploy industrial drying equipment, and monitor moisture levels until your property is fully dry.',
      href: '/services/water-damage-restoration',
      causes: ['Burst or leaking pipes', 'Hurricane flooding & storm surge', 'Appliance malfunctions', 'Roof leaks & heavy rain', 'Sewer backups', 'King tide & flash flooding (South Florida specific)'],
      process: ['Emergency water extraction', 'Industrial dehumidification & drying', 'Moisture mapping & monitoring', 'Mold prevention treatment', 'Structural drying & documentation', 'Full restoration & rebuild'],
      callWhen: "Immediately — water damage compounds rapidly. Mold can begin growing within 24–48 hours in South Florida's humid climate.",
      photos: [
        { src: '/photos/water-air-movers.jpeg', alt: 'Industrial air movers deployed during water damage drying' },
        { src: '/photos/wall-demo-drying.jpeg', alt: 'Opened wall with air mover running during water damage restoration' },
        { src: '/photos/job-site-thumb.jpeg', alt: 'Commercial hallway with full drying equipment deployed' },
      ],
    },
    {
      id: 'fire',
      icon: '🔥',
      title: 'Fire & Smoke Damage Restoration',
      cardDesc: 'Full fire & smoke damage cleanup and deodorization.',
      desc: 'Fire destroys structure; smoke and soot destroy everything else. From kitchen fires in Coral Gables condos to brush fire damage in Homestead, we handle emergency board-up, complete smoke odor elimination, soot removal, and full structural restoration across South Florida.',
      href: '/services/fire-damage-restoration',
      causes: ['Kitchen fires', 'Electrical fires', 'Grease fires', 'Lightning strikes', 'Wildfires (South Florida brush)'],
      process: ['Emergency board-up & tarping', 'Smoke & soot removal', 'Deodorization & air purification', 'Content pack-out & cleaning', 'Structural repairs', 'Full reconstruction'],
      callWhen: "Immediately after fire department clears the property. Don't touch soot — it sets into surfaces quickly.",
      photos: [
        { src: '/photos/services/fire-burning.jpg', alt: 'House fully engulfed in flames' },
        { src: '/photos/services/fire-aftermath.jpg', alt: 'Fire-damaged house exterior after blaze' },
        { src: '/photos/services/fire-charred.jpg', alt: 'Completely charred house structure after fire' },
      ],
    },
    {
      id: 'mold',
      icon: '🧫',
      title: 'Mold Remediation & Testing',
      cardDesc: 'Year-round mold testing, removal & prevention.',
      desc: "South Florida's humidity makes mold a year-round threat — not just after disasters. High-rise condos in Miami Beach, older homes in Fort Lauderdale, and flood-prone properties in Homestead are especially vulnerable. We test, identify, contain, and eliminate mold following EPA and IICRC protocols, then address the moisture source to prevent recurrence.",
      href: '/services/mold-remediation',
      causes: ['High humidity (South Florida year-round)', 'Water damage not fully dried', 'Roof leaks', 'Poor ventilation in bathrooms & AC systems', 'Flooding & storm damage'],
      process: ['Mold inspection & air quality testing', 'Containment to prevent spread', 'HEPA filtration & negative air pressure', 'Mold removal & antimicrobial treatment', 'Moisture source correction', 'Clearance testing'],
      callWhen: 'As soon as you see or smell mold. It spreads quickly and affects indoor air quality — especially dangerous for children, elderly, and those with respiratory issues.',
      photos: [
        { src: '/photos/mold-testing.jpeg', alt: 'MRS technician swab-testing mold growth on wall' },
        { src: '/photos/services/mold-ceiling.jpg', alt: 'Dark mold staining spreading across ceiling tile' },
        { src: '/photos/services/mold-flood-ceiling.jpg', alt: 'Ceiling collapse and mold damage from flood' },
      ],
    },
    {
      id: 'storm',
      icon: '🌀',
      title: 'Storm & Wind Damage Repair',
      cardDesc: 'Hurricane, wind & flood damage response.',
      desc: 'Hurricane season runs June through November — but South Florida storms can strike any time. From hurricane storm surge in Miami Beach to wind damage in Boca Raton and flash flooding in Broward County, we respond immediately with emergency tarping, board-up, water extraction, and full structural repairs.',
      href: '/services/storm-damage-repair',
      causes: ['Hurricanes & tropical storms', 'Tornadoes & microbursts', 'High winds (roof & window damage)', 'Heavy rain & flooding', 'Hail damage'],
      process: ['Emergency board-up & roof tarping', 'Water extraction & drying', 'Debris removal', 'Structural assessment', 'Insurance documentation support', 'Roof, window & structural repairs'],
      callWhen: "As soon as it's safe to do so after a storm. Quick action prevents water intrusion from causing mold and structural damage.",
      photos: [
        { src: '/photos/services/storm-lightning.jpg', alt: 'Lightning storm over South Florida neighborhood' },
        { src: '/photos/services/storm-trees.jpg', alt: 'Hurricane-downed trees blocking house entrance' },
        { src: '/photos/services/storm-flood.jpg', alt: 'Neighborhood flooding after hurricane storm surge' },
      ],
    },
    {
      id: 'biohazard',
      icon: '⚠️',
      title: 'Sewage & Biohazard Cleanup',
      cardDesc: 'Safe sewage & biohazard remediation.',
      desc: 'Sewage backups and biohazard situations require specialized protective equipment and disposal protocols. Serving South Florida homes and businesses from Boca Raton to Miami, we handle every situation safely, discreetly, and thoroughly — with full regulatory compliance.',
      href: '/services/biohazard-cleanup',
      causes: ['Sewage backups & overflows', 'Toilet & drain backups', 'Category 3 (black water) flooding', 'Trauma & crime scenes', 'Hoarding situations'],
      process: ['Hazard assessment & PPE deployment', 'Safe removal & disposal', 'Disinfection & decontamination', 'Odor elimination', 'Air quality testing', 'Restoration'],
      callWhen: 'Immediately — sewage contains dangerous pathogens. Do not attempt cleanup yourself.',
      photos: [
        { src: '/photos/services/bio-spray.jpg', alt: 'Technician in full protective suit disinfecting surface' },
        { src: '/photos/services/bio-kitchen.jpg', alt: 'Hazmat-suited worker decontaminating kitchen' },
        { src: '/photos/services/bio-suit.jpg', alt: 'Technician suiting up in protective gear before cleanup' },
      ],
    },
    {
      id: 'reconstruction',
      icon: '🔨',
      title: 'Reconstruction & Rebuild',
      cardDesc: 'Full rebuild and restoration after damage.',
      desc: 'After mitigation is complete, we handle the full rebuild — from drywall and flooring to complete structural reconstruction. Serving South Florida homeowners and businesses from Boca Raton to Miami, we act as one contractor for the entire job so you never have to manage multiple vendors.',
      href: '/services/reconstruction-rebuild',
      causes: ['Post-water damage rebuild', 'Post-fire structural repair', 'Storm damage reconstruction', 'Mold remediation follow-up repairs'],
      process: ['Damage assessment & scope of work', 'Insurance estimate coordination', 'Framing & structural repairs', 'Drywall, flooring & finishes', 'Painting & trim', 'Final inspection & walkthrough'],
      callWhen: 'After mitigation is complete. We coordinate directly with your insurance adjuster.',
      photos: [
        { src: '/photos/kitchen-after.jpeg', alt: 'Fully restored and rebuilt kitchen after water damage reconstruction' },
        { src: '/photos/services/recon-framing.jpg', alt: 'Exposed wood framing during home reconstruction' },
        { src: '/photos/services/recon-interior.jpg', alt: 'Interior rebuild in progress with ladders and new drywall' },
      ],
    },
  ],

  faqHeroSubhead: 'Answers to common questions about restoration services, insurance claims, and South Florida-specific concerns.',
  faqItems: [
    {
      q: 'How fast do you respond in South Florida?',
      a: "Our average response time is under 60 minutes throughout our South Florida service area — from Boca Raton to Miami. We're available 24/7/365, including during and after hurricane events.",
    },
    {
      q: 'Do you work with insurance companies?',
      a: "Yes. We work directly with all major insurance carriers and specialize in Florida's complex insurance market, including Citizens Insurance, HO-A policies, and cases involving Assignment of Benefits (AOB) disputes or claim denials. We document everything thoroughly to support your claim and can communicate directly with your adjuster.",
    },
    {
      q: 'My claim was denied — can you still help?',
      a: "Yes. Florida's insurance market is notoriously difficult, and claim denials are common. We help property owners document damage thoroughly for appeals and work with public adjusters when needed. Call us — don't give up on your claim.",
    },
    {
      q: 'How much does restoration cost?',
      a: 'Costs vary based on the type and extent of damage. For most insured losses, your insurance covers the work minus your deductible. We provide free estimates and work within your insurance scope. For uninsured work, we offer transparent pricing and can discuss payment options.',
    },
    {
      q: 'What should I do first after water damage?',
      a: "1) Ensure everyone is safe and the water source is stopped (turn off the water main if needed). 2) Call us immediately — (754) 777-8956. 3) Don't use electrical appliances in wet areas. 4) Remove valuables if safe to do so. 5) Document the damage with photos. Do NOT wait — in South Florida's humidity, mold can begin in 24 hours.",
    },
    {
      q: 'What should I do first after a fire?',
      a: "1) Wait for the fire department to clear the property. 2) Call us — we handle emergency board-up to secure the property. 3) Do not attempt to clean soot yourself — it sets into surfaces and can make remediation harder. 4) Call your insurance company to report the claim. We can assist with documentation.",
    },
    {
      q: 'Do I need to leave my home during restoration?',
      a: "It depends on the extent of the damage. Minor water or mold issues often allow you to remain at home. Significant damage, sewage backup, or extensive mold remediation typically requires temporary relocation. If needed, many homeowners' insurance policies include 'loss of use' coverage that pays for temporary housing — we'll help you navigate this.",
    },
    {
      q: 'Do you handle hurricane and storm damage?',
      a: "Absolutely — hurricane and storm damage response is one of our core services. South Florida is ground zero for hurricane season (June–November), and we're prepared for surge demand. We provide emergency tarping, board-up, water extraction, and full structural repairs. We recommend contacting us as soon as it's safe after a storm — restoration contractors fill up quickly after major events.",
    },
    {
      q: 'Do you serve my area?',
      a: 'We serve all of South Florida: southern Palm Beach County (Boca Raton, Deerfield Beach, Boynton Beach), all of Broward County (Pompano Beach, Fort Lauderdale, Dania Beach, Hollywood, Hallandale Beach), and all of Miami-Dade County (Aventura, North Miami, Miami Beach, Miami, Coral Gables, Kendall, Homestead). If you\'re unsure, just call us at (754) 777-8956.',
    },
    {
      q: 'Do you offer Spanish-speaking services?',
      a: 'Sí, hablamos español. We have Spanish-speaking staff available to assist Miami-Dade and Broward County customers throughout the restoration process — from initial assessment to insurance paperwork.',
    },
    {
      q: 'How does the mold remediation process work?',
      a: "We start with a thorough inspection and air quality testing to identify the type and extent of mold. We then set up containment barriers to prevent spread, use HEPA filtration and negative air pressure, physically remove affected materials, and apply EPA-registered antimicrobial treatments. Finally, we perform clearance testing to confirm the area is clean. In South Florida's humidity, addressing the moisture source (AC issues, leaks, ventilation) is critical to preventing recurrence.",
    },
    {
      q: 'Can you help with condo or HOA water damage disputes?',
      a: 'Yes — this is very common in South Florida. Condo water damage often involves disputes between unit owners and associations over responsibility. We document damage thoroughly and can work with both parties and their respective insurance carriers. We understand the specific challenges of condo restoration in Florida.',
    },
  ],

  aboutHeroSubhead: "South Florida's trusted property damage restoration team — available 24/7, hurricane season and beyond.",
  aboutStoryParagraphs: [
    "Mitigation Restoration Services was founded right here in South Florida by professionals who've spent their careers responding to the unique challenges this region throws at property owners — hurricanes that reshape coastlines overnight, humidity that never lets up, flooding that can turn a routine afternoon storm into a serious problem, and aging infrastructure that makes even minor water events worse than they should be.",
    "We started this company because we've seen too many homeowners and business owners get the runaround after a disaster — waiting days for someone to show up, getting passed between contractors who don't communicate, and fighting with insurance companies while the damage gets worse by the hour. MRS was built to be the opposite of that. One team that shows up fast, does the work right, and stays with you from the first phone call through the final insurance settlement.",
    "Our crews handle water extraction, mold remediation, structural drying, storm damage repair, and full-scale reconstruction. We document everything for your insurance claim, we communicate with your adjuster directly, and from Boca Raton to Homestead — whether it's a single-family home or a high-rise condo tower — we treat every job like it's our own home on the line.",
  ],
  stats: [
    { num: '10+', label: 'Years of Experience' },
    { num: '24/7', label: 'Emergency Availability' },
    { num: '< 60min', label: 'Average Response Time' },
    { num: '3', label: 'Counties Served' },
  ],
  certs: [
    { name: 'IICRC Certified', desc: 'Institute of Inspection, Cleaning and Restoration Certification — the gold standard in restoration.' },
    { name: 'FL Lic. #MRSR5155', desc: 'Florida state licensed for Mold Remediation — verified and compliant.' },
    { name: 'Residential & Commercial', desc: 'We serve both homeowners and commercial property owners across South Florida.' },
    { name: 'Fully Insured', desc: 'General liability and workers compensation coverage for your peace of mind.' },
  ],
  missionStatement: 'To restore South Florida properties and the peace of mind of the families and businesses we serve — with speed, integrity, and expertise, every time.',

  contactServiceAreaDetail: 'Serving all of South Florida:\n<strong>Palm Beach County</strong> (southern) — Boca Raton, Deerfield Beach\n<strong>Broward County</strong> — Pompano Beach, Fort Lauderdale, Hollywood, Hallandale Beach\n<strong>Miami-Dade County</strong> — Aventura, Miami Beach, Miami, Coral Gables, Homestead',

  weatherAngles: [
    'Hurricane season June–November',
    'Storm surge & flooding',
    'King tide & flash flooding',
    'Year-round humidity driving mold growth',
    'Tropical storm & heavy rain water intrusion',
    'Lightning & brush fire risk',
    'Appliance failures in high-humidity environments',
  ],

  licenseNumbers: ['FL Lic. #MRSR5155'],

  footerTagline: "South Florida's trusted property damage restoration experts.",
  footerServiceAreaLine: 'Serving Palm Beach, Broward & Miami-Dade Counties',

  insuranceSpecificLanguage: "Citizens Insurance, AOB, claim denials — we navigate Florida's complex insurance market.",

  addressPlaceholder: '123 Main St, Fort Lauderdale, FL 33301',
  showSpanishBadge: true,

  schema: {
    type: 'LocalBusiness',
    name: 'Mitigation Restoration Services',
    telephone: '+17547778956',
    email: 'Sam@mitigationrestorationservice.co.site',
    url: 'https://mitigationrestorationservice.com',
    description: '24/7 emergency property damage restoration serving South Florida — water damage, fire, mold, storm & biohazard cleanup.',
    address: {
      streetAddress: '11322 Miramar Pkwy',
      addressLocality: 'Miramar',
      addressRegion: 'FL',
      postalCode: '33025',
      addressCountry: 'US',
    },
    geo: { latitude: 25.9786, longitude: -80.2327 },
    areaServed: [
      'Boca Raton', 'Deerfield Beach', 'Pompano Beach', 'Fort Lauderdale',
      'Hollywood', 'Hallandale Beach', 'Aventura', 'North Miami',
      'Miami Beach', 'Miami', 'Coral Gables', 'Homestead',
      'Palm Beach County', 'Broward County', 'Miami-Dade County',
    ],
  },
};

// ─── NY CONFIG ───────────────────────────────────────────────────────────────

export const NY_CONFIG: SiteConfig = {
  location: 'newYork',
  siteName: 'Mitigation Restoration Services',
  productionUrl: 'https://mitigationrestorationservice.com/ny',

  phone: '(917) 288-9730',
  phoneHref: 'tel:+19172889730',
  email: 'Sam@mitigationrestorationservice.co.site',

  address: null,
  addressOneLiner: null,
  serviceAreaLabel: 'NYC Metro',
  serviceAreaDetail:
    'Serving all five boroughs — Manhattan, Brooklyn, Queens, the Bronx, and Staten Island — plus surrounding NYC metro areas. Fast local response when every minute counts.',
  serviceAreaCities: [
    'Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island',
  ],
  mapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d193595.15831953523!2d-74.11976390014451!3d40.69766374865766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1713200000001!5m2!1sen!2sus',

  metaTitle: 'Emergency Water Damage NYC | 24/7 Response <60min | MRS Restoration',
  metaDescription:
    '24/7 emergency water, fire, mold & storm damage restoration serving all five NYC boroughs — Manhattan, Brooklyn, Queens, the Bronx & Staten Island. Licensed & insured.',
  ogTitle: 'Mitigation Restoration Services | 24/7 Emergency Restoration NYC Metro',
  ogDescription: 'When disaster strikes, we respond. 24/7 emergency restoration for NYC Metro. Call (917) 288-9730.',
  keywords:
    'water damage restoration NYC, mold remediation New York, fire damage restoration Brooklyn, storm damage Queens, flood damage Manhattan, IICRC certified, 24/7 emergency restoration New York',

  heroHeadline: 'When Disaster Strikes, We Respond.',
  heroSubheadline:
    '24/7 emergency water, fire, mold & storm damage restoration for NYC Metro — all five boroughs. Fast response. Licensed & insured.',
  heroCtaPhone: '📞 Call Now: (917) 288-9730',

  servicesSectionSubhead: 'Full-service property damage restoration for NYC homes, apartments & businesses',
  seeOurWorkSubhead: 'Real restoration jobs — water damage, mold, and full reconstruction',
  whyTrustHeadline: 'Why NYC Trusts MRS',
  whyItems: [
    { icon: '🕐', title: '24/7 Emergency Response', desc: "We answer every call, day or night — nor'easters, frozen pipes, flash floods, any hour." },
    { icon: '🏅', title: 'Licensed & IICRC Certified', desc: 'Fully licensed, insured, and certified to industry standards across all five boroughs.' },
    { icon: '📋', title: 'Insurance Claim Specialist', desc: 'We work directly with your insurance carrier and document everything to support your claim.' },
    { icon: '📍', title: 'Local NYC Team', desc: 'Fast response across Manhattan, Brooklyn, Queens, the Bronx, and Staten Island.' },
  ],
  testimonialSubhead: 'Real NYC homeowners, condo owners, and property managers',
  // TODO(David) — These NY testimonials are PLACEHOLDER copy. Replace with real
  // customer quotes (with permission) before the NY route launches publicly.
  // The shape (name = first name + last initial, stars = 1–5, quote text, city
  // = NYC borough name) must stay identical to the FL testimonials structure.
  testimonials: [
    { name: 'James W.', city: 'Brooklyn', stars: 5, quote: 'Frozen pipe burst on a Sunday night and MRS was at my brownstone within 40 minutes. They extracted the water, set up drying equipment, and handled my insurance claim from start to finish. Saved my hardwood floors.' },
    { name: 'Lisa M.', city: 'Manhattan', stars: 5, quote: 'Water damage in my co-op from the unit above. MRS coordinated directly with building management and my insurance adjuster — I barely had to do anything. Professional and incredibly fast.' },
    { name: 'David T.', city: 'Queens', stars: 5, quote: 'Found mold in my basement after a nor\'easter. MRS found the moisture source, contained the mold, and did a full remediation. They gave me a clearance report for my insurance. Couldn\'t ask for better service.' },
  ],
  serviceAreaHeadline: 'Proudly Serving All of NYC Metro',
  serviceAreaGetHelpCta: 'Get Help in Your Borough →',

  services: [
    {
      id: 'water',
      icon: '💧',
      title: 'Water Damage Restoration',
      cardDesc: 'Rapid extraction, drying & dehumidification 24/7.',
      desc: "In NYC, water damage hits hardest in winter — frozen pipes bursting in Brooklyn brownstones, burst plumbing in Manhattan co-ops, sewer backups flooding Queens basements. Every hour matters. Our IICRC-certified technicians extract standing water, deploy industrial drying equipment, and monitor moisture levels until your property is fully dry.",
      href: '/ny/services#water',
      causes: ['Frozen & burst pipes (winter)', 'Snowmelt & thaw flooding', 'Appliance malfunctions', 'Roof leaks & heavy rain', 'Sewer backups', "Nor'easter flooding & storm surge"],
      process: ['Emergency water extraction', 'Industrial dehumidification & drying', 'Moisture mapping & monitoring', 'Mold prevention treatment', 'Structural drying & documentation', 'Full restoration & rebuild'],
      callWhen: 'Immediately — water damage compounds rapidly. Mold can begin growing within 24–48 hours, especially in poorly ventilated NYC apartments and basements.',
      photos: [
        { src: '/photos/water-air-movers.jpeg', alt: 'Industrial air movers deployed during water damage drying' },
        { src: '/photos/wall-demo-drying.jpeg', alt: 'Opened wall with air mover running during water damage restoration' },
        { src: '/photos/job-site-thumb.jpeg', alt: 'Commercial hallway with full drying equipment deployed' },
      ],
    },
    {
      id: 'fire',
      icon: '🔥',
      title: 'Fire & Smoke Damage Restoration',
      cardDesc: 'Full fire & smoke damage cleanup and deodorization.',
      desc: 'Fire destroys structure; smoke and soot destroy everything else. From space heater fires in the Bronx to kitchen fires in Staten Island apartments, we handle emergency board-up, complete smoke odor elimination, soot removal, and full structural restoration — including NYC multi-unit buildings and co-ops.',
      href: '/ny/services#fire',
      causes: ['Kitchen fires', 'Electrical fires', 'Grease fires', 'Space heater fires (winter)', 'Lightning strikes'],
      process: ['Emergency board-up & tarping', 'Smoke & soot removal', 'Deodorization & air purification', 'Content pack-out & cleaning', 'Structural repairs', 'Full reconstruction'],
      callWhen: "Immediately after fire department clears the property. Don't touch soot — it sets into surfaces quickly.",
      photos: [
        { src: '/photos/services/fire-burning.jpg', alt: 'House fully engulfed in flames' },
        { src: '/photos/services/fire-aftermath.jpg', alt: 'Fire-damaged house exterior after blaze' },
        { src: '/photos/services/fire-charred.jpg', alt: 'Completely charred house structure after fire' },
      ],
    },
    {
      id: 'mold',
      icon: '🧫',
      title: 'Mold Remediation & Testing',
      cardDesc: 'Professional mold testing, removal & prevention.',
      desc: "NYC's aging housing stock makes mold a persistent problem — Brooklyn brownstone basements, Manhattan pre-war apartments with poor ventilation, and Queens homes after nor'easter flooding are especially vulnerable. We test, identify, contain, and eliminate mold following EPA and IICRC protocols, then address the moisture source to prevent recurrence.",
      href: '/ny/services#mold',
      causes: ['High humidity (especially summer months)', 'Frozen pipe damage not fully dried', 'Roof leaks', 'Poor ventilation in basements & bathrooms', 'Flooding & storm damage'],
      process: ['Mold inspection & air quality testing', 'Containment to prevent spread', 'HEPA filtration & negative air pressure', 'Mold removal & antimicrobial treatment', 'Moisture source correction', 'Clearance testing'],
      callWhen: 'As soon as you see or smell mold. It spreads quickly and affects indoor air quality — especially dangerous in NYC apartments where units share walls, ceilings, and ventilation.',
      photos: [
        { src: '/photos/mold-testing.jpeg', alt: 'MRS technician swab-testing mold growth on wall' },
        { src: '/photos/services/mold-ceiling.jpg', alt: 'Dark mold staining spreading across ceiling tile' },
        { src: '/photos/services/mold-flood-ceiling.jpg', alt: 'Ceiling collapse and mold damage from flood' },
      ],
    },
    {
      id: 'storm',
      icon: '🌀',
      title: 'Storm & Wind Damage Repair',
      cardDesc: "Nor'easter, wind & flood damage response.",
      desc: "Nor'easters hit October through April, and summer storms bring flash flooding across all five boroughs — from basement flooding in the Bronx to roof damage in Staten Island. We respond immediately with emergency tarping, board-up, water extraction, and full structural repairs.",
      href: '/ny/services#storm',
      causes: ["Nor'easters & winter storms", 'Tropical storm remnants', 'High winds (roof & window damage)', 'Flash flooding & heavy rain', 'Ice dams & snowmelt'],
      process: ['Emergency board-up & roof tarping', 'Water extraction & drying', 'Debris removal', 'Structural assessment', 'Insurance documentation support', 'Roof, window & structural repairs'],
      callWhen: "As soon as it's safe to do so after a storm. Quick action prevents water intrusion from causing mold and structural damage.",
      photos: [
        { src: '/photos/services/storm-lightning.jpg', alt: 'Lightning storm over neighborhood' },
        { src: '/photos/services/storm-trees.jpg', alt: 'Storm-downed trees blocking house entrance' },
        { src: '/photos/services/storm-flood.jpg', alt: 'Neighborhood flooding after heavy storm' },
      ],
    },
    {
      id: 'biohazard',
      icon: '⚠️',
      title: 'Sewage & Biohazard Cleanup',
      cardDesc: 'Safe sewage & biohazard remediation.',
      desc: 'Sewage backups and biohazard situations require specialized equipment and strict disposal protocols. Serving all five NYC boroughs — from apartment buildings in the Bronx to commercial properties in Manhattan — we handle every situation safely, discreetly, and in full regulatory compliance.',
      href: '/ny/services#biohazard',
      causes: ['Sewage backups & overflows', 'Toilet & drain backups', 'Category 3 (black water) flooding', 'Trauma & crime scenes', 'Hoarding situations'],
      process: ['Hazard assessment & PPE deployment', 'Safe removal & disposal', 'Disinfection & decontamination', 'Odor elimination', 'Air quality testing', 'Restoration'],
      callWhen: 'Immediately — sewage contains dangerous pathogens. Do not attempt cleanup yourself.',
      photos: [
        { src: '/photos/services/bio-spray.jpg', alt: 'Technician in full protective suit disinfecting surface' },
        { src: '/photos/services/bio-kitchen.jpg', alt: 'Hazmat-suited worker decontaminating kitchen' },
        { src: '/photos/services/bio-suit.jpg', alt: 'Technician suiting up in protective gear before cleanup' },
      ],
    },
    {
      id: 'reconstruction',
      icon: '🔨',
      title: 'Reconstruction & Rebuild',
      cardDesc: 'Full rebuild and restoration after damage.',
      desc: 'After mitigation is complete, we handle the full rebuild — from drywall and flooring to complete structural reconstruction. We work across all five boroughs with experience in NYC co-ops, condos, brownstones, and multi-unit buildings, acting as one contractor for the entire job.',
      href: '/ny/services#reconstruction',
      causes: ['Post-water damage rebuild', 'Post-fire structural repair', 'Storm damage reconstruction', 'Mold remediation follow-up repairs'],
      process: ['Damage assessment & scope of work', 'Insurance estimate coordination', 'Framing & structural repairs', 'Drywall, flooring & finishes', 'Painting & trim', 'Final inspection & walkthrough'],
      callWhen: 'After mitigation is complete. We coordinate directly with your insurance adjuster.',
      photos: [
        { src: '/photos/kitchen-after.jpeg', alt: 'Fully restored and rebuilt kitchen after water damage reconstruction' },
        { src: '/photos/services/recon-framing.jpg', alt: 'Exposed wood framing during home reconstruction' },
        { src: '/photos/services/recon-interior.jpg', alt: 'Interior rebuild in progress with ladders and new drywall' },
      ],
    },
  ],

  faqHeroSubhead: 'Answers to common questions about restoration services, insurance claims, and NYC-specific concerns.',
  faqItems: [
    {
      q: 'How fast do you respond in NYC?',
      a: "Our average response time is under 60 minutes throughout our NYC Metro service area — all five boroughs. We're available 24/7/365, including during and after nor'easters and winter storm events.",
    },
    {
      q: 'Do you work with insurance companies?',
      a: 'Yes. We work directly with all major insurance carriers and document everything thoroughly to support your claim. We can communicate directly with your adjuster and help ensure nothing is missed in the damage assessment.',
    },
    {
      q: 'My claim was denied — can you still help?',
      a: "Yes. Claim denials happen, but they're not always the final word. We help property owners document damage thoroughly for appeals and work with public adjusters when needed. Call us — don't give up on your claim.",
    },
    {
      q: 'How much does restoration cost?',
      a: 'Costs vary based on the type and extent of damage. For most insured losses, your insurance covers the work minus your deductible. We provide free estimates and work within your insurance scope. For uninsured work, we offer transparent pricing and can discuss payment options.',
    },
    {
      q: 'What should I do first after water damage?',
      a: "1) Ensure everyone is safe and the water source is stopped (turn off the water main or contact building management). 2) Call us immediately — (917) 288-9730. 3) Don't use electrical appliances in wet areas. 4) Remove valuables if safe to do so. 5) Document the damage with photos. Do NOT wait — mold can begin in 24–48 hours.",
    },
    {
      q: 'What should I do first after a fire?',
      a: "1) Wait for the fire department to clear the property. 2) Call us — we handle emergency board-up to secure the property. 3) Do not attempt to clean soot yourself — it sets into surfaces and can make remediation harder. 4) Call your insurance company to report the claim. We can assist with documentation.",
    },
    {
      q: 'Do I need to leave my home during restoration?',
      a: "It depends on the extent of the damage. Minor water or mold issues often allow you to remain at home. Significant damage, sewage backup, or extensive mold remediation typically requires temporary relocation. Many homeowners' insurance policies include 'loss of use' coverage that pays for temporary housing — we'll help you navigate this.",
    },
    {
      q: "Do you handle nor'easter and storm damage?",
      a: "Absolutely — storm damage response is one of our core services. NYC's nor'easters can cause serious roof damage, ice dams, and water intrusion, and we're prepared to respond fast. We provide emergency tarping, board-up, water extraction, and full structural repairs. Contact us as soon as it's safe after a storm.",
    },
    {
      q: 'Do you serve my borough?',
      a: 'We serve all five NYC boroughs: Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. We also serve surrounding NYC metro areas. If you\'re unsure, just call us at (917) 288-9730.',
    },
    {
      q: 'Do you offer Spanish-speaking services?',
      a: 'Sí, hablamos español. We have Spanish-speaking staff available to assist customers throughout the restoration process — from initial assessment to insurance paperwork.',
    },
    {
      q: 'How does the mold remediation process work?',
      a: "We start with a thorough inspection and air quality testing to identify the type and extent of mold. We then set up containment barriers to prevent spread, use HEPA filtration and negative air pressure, physically remove affected materials, and apply EPA-registered antimicrobial treatments. Finally, we perform clearance testing to confirm the area is clean. In NYC apartments, addressing the moisture source (plumbing, ventilation, AC) is critical to preventing recurrence.",
    },
    {
      q: 'Can you help with co-op, condo, or building management water damage disputes?',
      a: "Yes — this is very common in NYC. Water damage in co-ops and condos often involves disputes between unit owners, boards, and building management over responsibility. We document damage thoroughly and can work with all parties and their respective insurance carriers.",
    },
  ],

  aboutHeroSubhead: "NYC Metro's trusted property damage restoration team — available 24/7, nor'easters and beyond.",
  aboutStoryParagraphs: [
    "Mitigation Restoration Services serves NYC Metro property owners who face a uniquely demanding environment — nor'easters that burst pipes overnight, summer humidity that breeds mold in basements and poorly ventilated apartments, flooding from aging infrastructure, and fire damage in densely built multi-unit buildings where one incident affects many residents.",
    "We built this company because we've seen too many property owners get the runaround after a disaster — waiting days for someone to show up, getting passed between contractors who don't communicate, and fighting with insurance companies while the damage gets worse by the hour. MRS is the opposite of that: one team that shows up fast, does the work right, and stays with you from the first phone call through the final insurance settlement.",
    "Our crews handle water extraction, mold remediation, structural drying, storm damage repair, and full-scale reconstruction. We document everything for your insurance claim, communicate with your adjuster directly, and from Manhattan to Staten Island — whether it's a brownstone, co-op, or commercial building — we treat every job like it's our own property on the line.",
  ],
  stats: [
    { num: '10+', label: 'Years of Experience' },
    { num: '24/7', label: 'Emergency Availability' },
    { num: '< 60min', label: 'Average Response Time' },
    { num: '5', label: 'Boroughs Served' },
  ],
  certs: [
    { name: 'IICRC Certified', desc: 'Institute of Inspection, Cleaning and Restoration Certification — the gold standard in restoration.' },
    { name: 'Residential & Commercial', desc: 'We serve homeowners, co-op & condo owners, and commercial property managers across all five boroughs.' },
    { name: 'Fully Insured', desc: 'General liability and workers compensation coverage for your peace of mind.' },
    { name: 'NYC Building Knowledge', desc: 'Experienced with co-ops, condos, brownstones, multi-unit buildings, and commercial properties.' },
  ],
  missionStatement: 'To restore NYC Metro properties and the peace of mind of the families and businesses we serve — with speed, integrity, and expertise, every time.',

  contactServiceAreaDetail: 'Serving all five NYC boroughs:\n<strong>Manhattan</strong> — all neighborhoods\n<strong>Brooklyn</strong> — all neighborhoods\n<strong>Queens</strong> — all neighborhoods\n<strong>The Bronx</strong> — all neighborhoods\n<strong>Staten Island</strong> — all neighborhoods',

  weatherAngles: [
    "Winter: frozen & burst pipes, ice dams, snowmelt flooding, heating failures leading to mold",
    "Spring: thaw flooding, rising water tables, basement water intrusion, winter-damaged roof leaks",
    "Summer: thunderstorms, flash flooding, tropical storm remnants, humidity-driven mold",
    "Fall: nor'easters, hurricane season tail end, clogged gutter & roof damage",
  ],

  licenseNumbers: null,

  footerTagline: "NYC Metro's trusted property damage restoration experts.",
  footerServiceAreaLine: 'Serving All Five Boroughs & NYC Metro',

  insuranceSpecificLanguage: 'We work with all major insurance carriers and document everything thoroughly to support your claim.',

  addressPlaceholder: '123 Main St, Brooklyn, NY 11201',
  showSpanishBadge: false,

  schema: {
    type: 'LocalBusiness',
    name: 'Mitigation Restoration Services',
    telephone: '+19172889730',
    email: 'Sam@mitigationrestorationservice.co.site',
    url: 'https://mitigationrestorationservice.com/ny',
    description: '24/7 emergency property damage restoration serving NYC Metro — water damage, fire, mold, storm & biohazard cleanup.',
    address: {
      streetAddress: null,
      addressLocality: 'New York',
      addressRegion: 'NY',
      postalCode: null,
      addressCountry: 'US',
    },
    geo: { latitude: 40.6977, longitude: -74.1198 },
    areaServed: [
      'Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island',
      'New York City', 'NYC Metro',
    ],
  },
};
