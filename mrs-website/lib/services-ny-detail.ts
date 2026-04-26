// Per-service detail content for the six NY service pages.
// Mirrors lib/services-fl-detail.ts. Copy is hand-supplied by David and
// must be edited only with his approval — do not "improve" the wording.
//
// Each entry powers one route under app/ny/services/[slug]/page.tsx via
// the shared ServiceDetailPage template (which is now config-aware and
// renders both FL and NY routes from the same component).

import type { ServiceDetail } from "@/lib/services-fl-detail";

export const NY_SERVICE_DETAILS: ServiceDetail[] = [
  // ── 1. WATER DAMAGE RESTORATION ─────────────────────────────────────────
  {
    slug: "water-damage-restoration",
    title: "Water Damage Restoration in New York",
    metaTitle: "Water Damage Restoration NYC | 24/7 Response | MRS",
    metaDescription:
      "24/7 emergency water damage restoration across all five NYC boroughs. Frozen pipes, basement flooding, riser failures. IICRC certified. Fast response.",
    serviceType: "WaterDamageRestoration",
    schemaName: "Water Damage Restoration — New York",
    schemaDescription:
      "IICRC-certified water extraction, structural drying, and moisture monitoring across all five NYC boroughs. 24/7 emergency response for frozen pipe bursts, riser failures, basement flooding, and roof leaks.",
    heroIntro:
      "When water hits a New York building, the clock starts immediately. A frozen pipe burst on the 12th floor of a pre-war Manhattan co-op can reach the basement in under an hour. A washing machine line that fails in a Queens duplex can damage three apartments before anyone notices. Mitigation Restoration Services responds across all five boroughs — Manhattan, Brooklyn, Queens, The Bronx, and Staten Island — with IICRC-certified technicians, industrial extraction equipment, and direct experience navigating co-op boards, condo associations, and NYC's older building stock.",
    causesHeading: "Common Causes of NYC Water Damage",
    causes: [
      "Frozen pipe bursts during winter cold snaps (December through February)",
      "Riser pipe failures in pre-war buildings, often hidden inside walls until water appears two floors down",
      "Washing machine and dishwasher line failures in apartment buildings, where one unit's leak cascades through multiple floors below",
      "Basement and cellar flooding in flood-prone Queens and Staten Island neighborhoods",
      "Roof leaks during nor'easters and heavy spring rain",
      "HVAC condensate line clogs causing slow ceiling damage",
      "Hot water heater failures in older buildings with original equipment",
      "Sewer backups during heavy rain events that overwhelm NYC's combined sewer system",
    ],
    processHeading: "Our Water Damage Process",
    process: [
      "Emergency response and water source shutoff coordination",
      "Industrial water extraction with truck-mounted units",
      "Removal of damaged drywall, flooring, and wet building materials",
      "Industrial dehumidification and structural drying",
      "Daily moisture mapping and progress documentation",
      "Coordination with building management, co-op boards, or condo association as needed",
      "Direct insurance claim documentation submitted to your carrier",
    ],
    whyHeading: "Why New York Water Damage Is Different",
    whySFlParagraphs: [
      "New York buildings present water damage challenges that don't exist in other markets. The city's pre-war building stock — including brownstones, walk-up apartments, tenement-style buildings, and pre-war elevator buildings — uses original cast iron and galvanized riser pipes that are 80 to 120 years old. When these pipes fail, they don't fail gracefully. A single riser break can affect every unit on that vertical line, sometimes flooding 8 to 10 apartments before the water main is shut down. Drying these buildings requires understanding the difference between modern drywall, which dries predictably, and old plaster-and-lath, which holds moisture for weeks longer and grows mold beneath the surface.",
      "Winter water damage is its own category in New York. When temperatures drop below 20°F, unheated apartments — often vacant rentals or units with thermostats set too low — see pipe bursts at predictable rates. Ice dams on flat roofs in Brooklyn and Queens push water under shingles and through ceilings on the top floor. Steam radiator lines that haven't been bled in years develop pinhole leaks that release pressurized water for hours before anyone notices. We've responded to frozen pipe calls during every major winter freeze event, and the same protocols repeat: extract, dry aggressively, document moisture levels for the insurance carrier, and never assume a wall is dry until the meter confirms it.",
      "The insurance and approval side is also different here. Co-op boards often require their preferred contractors and detailed scope-of-work approval before reconstruction can begin. Condo associations typically need building management coordination for any work in common-area walls or ceilings. Tenants in rent-stabilized buildings have additional protections during restoration work that owners need to navigate carefully. We work directly with building management, co-op boards, and condo associations across the five boroughs, and we document everything to insurance-carrier standards from day one.",
    ],
    faq: [
      {
        q: "How fast do you respond in New York?",
        a: "Average response time across the five boroughs is under 60 minutes for emergency calls, with same-day arrival guaranteed. Manhattan and Brooklyn typically see fastest response. Outer borough response depends on traffic and time of day.",
      },
      {
        q: "Do you work with co-op boards and condo associations?",
        a: "Yes. We coordinate directly with building management, board members, and managing agents. We've worked with major NYC management companies and understand co-op approval workflows. We provide the documentation boards typically require — scope of work, insurance certificates, licensed contractor proof, and certificate of liability.",
      },
      {
        q: "What about frozen pipe damage during winter?",
        a: "Winter pipe bursts are a major part of our NYC work. We respond 24/7 during freeze events, can coordinate with plumbers for the source repair, and handle the water damage cleanup, drying, and rebuild. If you have a pipe burst, shut off the building's main water valve immediately, then call us.",
      },
      {
        q: "Will my building's insurance cover the damage?",
        a: "Most NYC building policies cover sudden and accidental water damage. Co-op shareholders and condo unit owners typically have their own HO-6 policies covering interior damage and improvements. We document everything to standards your carrier requires and can speak directly with adjusters. We do not use Assignment of Benefits contracts.",
      },
    ],
    heroPhoto: { src: "/photos/wall-demo-drying.jpeg", alt: "Opened wall with air mover running during NYC water damage drying" },
    photos: [
      { src: "/photos/dehumidifier-kitchen.jpeg", alt: "Commercial dehumidifier and air mover operating in NYC apartment kitchen after water loss" },
      { src: "/photos/water-air-movers.jpeg", alt: "Industrial air movers deployed during NYC water damage drying" },
      { src: "/photos/hallway-drying.jpeg", alt: "Industrial drying equipment deployed in NYC water-damaged hallway" },
    ],
  },

  // ── 2. FIRE & SMOKE DAMAGE ──────────────────────────────────────────────
  {
    slug: "fire-damage-restoration",
    title: "Fire & Smoke Damage Restoration in New York",
    metaTitle: "Fire & Smoke Damage Restoration NYC | 24/7 | MRS",
    metaDescription:
      "24/7 fire and smoke damage restoration across all 5 NYC boroughs. Kitchen fires, electrical fires, smoke remediation in pre-war buildings. IICRC certified.",
    serviceType: "FireDamageRestoration",
    schemaName: "Fire & Smoke Damage Restoration — New York",
    schemaDescription:
      "Emergency board-up, smoke and soot remediation, content cleaning, and full reconstruction across all five NYC boroughs — kitchen fires, electrical fires, heating fires, and lightning strikes.",
    heroIntro:
      "Fire damage in a New York building is a multi-layer problem. The fire itself is one piece. The smoke and soot that travel through walls, plenums, and shared ventilation systems often affect units far from the actual fire. The water damage from FDNY suppression efforts is a third layer. Mitigation Restoration Services handles all three across Manhattan, Brooklyn, Queens, The Bronx, and Staten Island — emergency board-up, smoke remediation in plaster-and-lath walls, content cleaning, deodorization, and full reconstruction.",
    causesHeading: "Common Fire Causes in NYC",
    causes: [
      "Kitchen fires (most common in NYC apartments — small kitchens mean rapid smoke spread)",
      "Electrical fires in older wiring, including knob-and-tube still present in some pre-war buildings",
      "Heating equipment fires during winter (space heaters, faulty boilers, radiator issues)",
      "Cigarette and smoking-related fires",
      "Cooking grease fires",
      "Lightning strikes during summer storms",
      "Building electrical panel failures",
      "Fires in shared utility chases that spread vertically through buildings",
    ],
    processHeading: "Our Fire & Smoke Process",
    process: [
      "Emergency board-up and tarping after FDNY clears the property",
      "Smoke and soot removal from walls, ceilings, and contents",
      "HVAC system cleaning to prevent smoke recirculation",
      "Industrial deodorization with thermal fogging and ozone treatment",
      "Content pack-out and off-site cleaning of salvageable items",
      "Structural assessment and repair of fire-damaged framing",
      "Full reconstruction including drywall, paint, flooring, and finishes",
    ],
    whyHeading: "Why New York Fire Damage Is Different",
    whySFlParagraphs: [
      "NYC fire damage spreads differently than fire damage elsewhere. The city's pre-war building stock uses plaster-and-lath wall construction, which is highly porous compared to modern drywall. Smoke and soot work into the plaster surface and require specialized cleaning techniques to remove. Buildings with original wood trim, hardwood floors, and ornamental moldings — the features that give NYC buildings their character — also absorb smoke odors deeply, and surface cleaning alone won't eliminate the smell. We use thermal fogging, hydroxyl generators, and ozone treatment to penetrate these materials and neutralize smoke at the molecular level.",
      "The shared infrastructure of NYC apartment buildings creates secondary damage zones that don't exist in single-family homes. A kitchen fire on the 4th floor can send smoke through the building's ventilation system, plumbing chases, and elevator shafts to units on every other floor. Tenants two floors away may have soot on their HVAC vents and persistent odor in their closets without ever being near the fire. Insurance claims for fire damage in NYC buildings often involve multiple units, multiple policies, and coordination between the building's master policy and individual HO-6 policies — we document everything for every affected unit and work directly with carriers across all involved policies.",
      "FDNY response is fast in NYC, which is good news for life safety but means more water damage from suppression. The volume of water used to extinguish a serious fire in a multi-unit building can soak the floor below as thoroughly as the fire damaged the unit above. We arrive equipped to handle both the smoke side and the water side simultaneously — extraction, drying, and smoke remediation running in parallel — because waiting to address the water until smoke work is done means mold growth in plaster walls within 48 hours.",
    ],
    faq: [
      {
        q: "Can smoke damage be fully removed from pre-war buildings?",
        a: "Yes, in most cases. Plaster-and-lath walls require thermal fogging or hydroxyl treatment to fully neutralize smoke odor — surface cleaning alone is not enough. Original hardwood floors and wood trim may need refinishing. We test air quality before declaring the job complete.",
      },
      {
        q: "What happens to the contents — furniture, clothing, electronics?",
        a: "Salvageable contents are packed out and taken to our facility for cleaning, deodorization, and storage during the rebuild. We provide a full inventory and document condition. Items beyond restoration are documented for insurance claims and disposed of properly.",
      },
      {
        q: "How long does fire restoration take in NYC?",
        a: "Mitigation typically takes 1-3 weeks. Full reconstruction depends on damage scope, insurance approval timeline, and co-op or condo board approvals — typical range is 6-16 weeks for a single unit, longer for multi-unit damage.",
      },
      {
        q: "Will my insurance cover fire damage?",
        a: "Standard homeowner, renter, and condo policies cover fire damage. Building master policies cover structural damage to common areas. We document everything for every involved policy and work with adjusters across all carriers.",
      },
    ],
    heroPhoto: { src: "/photos/services/fire-charred.jpg", alt: "Charred structural framing inside a NYC building after a fire" },
    photos: [
      { src: "/photos/services/fire-burning.jpg", alt: "Building engulfed in flames during an NYC structure fire" },
      { src: "/photos/services/fire-aftermath.jpg", alt: "Fire-damaged exterior of a NYC building after a structural blaze" },
      { src: "/photos/damage-ceiling.jpeg", alt: "Smoke and soot damage to a ceiling in a NYC apartment building" },
    ],
  },

  // ── 3. MOLD REMEDIATION ─────────────────────────────────────────────────
  {
    slug: "mold-remediation",
    title: "Mold Remediation & Testing in New York",
    metaTitle: "Mold Remediation NYC | NYS Code Rule 56 | MRS",
    metaDescription:
      "NYC mold remediation following NYS Code Rule 56. Basement mold, bathroom mold, post-water damage. IICRC certified. All 5 boroughs. 24/7 response.",
    serviceType: "MoldRemediation",
    schemaName: "Mold Remediation & Testing — New York",
    schemaDescription:
      "Mold inspection, air quality testing, NYS Code Rule 56–compliant remediation across all five NYC boroughs — basement mold, bathroom mold, post-water-damage mold, and pre-war building cavity mold.",
    heroIntro:
      "Mold in a New York building is rarely just a surface problem. By the time you can see it, it's usually been growing for weeks behind drywall, under flooring, or inside ventilation systems. New York's combination of dense urban housing, pre-war building stock, basement living spaces, and seasonal humidity swings creates ideal mold conditions year-round. Mitigation Restoration Services tests, identifies, contains, and remediates mold across all five boroughs following EPA and IICRC protocols, plus full compliance with New York State Code Rule 56 for projects requiring licensed remediation.",
    causesHeading: "What Drives NYC Mold",
    causes: [
      "Basement and cellar moisture, especially in Queens and Staten Island flood-zone homes",
      "Bathroom mold in compact apartment bathrooms with limited ventilation",
      "Radiator-line condensation during winter heating season",
      "AC sleeve and through-wall AC unit mold during summer humidity",
      "Hidden mold behind walls after water damage that wasn't fully dried",
      "Roof leaks and ice dam damage that wets ceiling cavities",
      "Crawl space moisture in older Brooklyn and Queens row houses",
      "HVAC system mold from clogged condensate lines",
    ],
    processHeading: "Our Mold Remediation Process",
    process: [
      "Mold inspection and air quality testing using third-party labs",
      "Containment with plastic barriers and negative air pressure",
      "HEPA filtration during all work to prevent spore spread",
      "Mold removal following NYS Code Rule 56 protocols where applicable",
      "Antimicrobial treatment of remaining surfaces",
      "Moisture source correction (this is where most mold jobs fail when it's skipped)",
      "Post-remediation clearance testing before declaring the area safe",
    ],
    whyHeading: "Why New York Mold Is Different",
    whySFlParagraphs: [
      "New York State has the strictest mold remediation regulations in the country. NYS Code Rule 56, enforced by the New York State Department of Labor, requires licensed mold assessors and licensed mold remediation contractors for any commercial project or any residential project over 10 square feet of contiguous mold. We hold the required NY licenses and work to Code Rule 56 standards on every job, including the smaller residential projects where it's not strictly required, because the protocols protect the homeowner's health and the integrity of the job. Many \"mold remediation\" companies in NYC operate outside Code Rule 56 standards — we don't, and we document compliance for your records.",
      "NYC mold is heavily concentrated in basement spaces. Cellar and basement apartments, basement laundry rooms, and below-grade storage areas are mold breeding grounds because of perimeter moisture, lack of natural ventilation, and the tendency for these spaces to be heated below 65°F. Brownstones, brick row houses, and pre-war buildings with original below-grade construction are especially vulnerable — perimeter waterproofing from 100 years ago is rarely effective today. We test before remediation to identify whether mold is surface-level or has penetrated wall cavities, framing, and concrete substrates, because the remediation approach is completely different for each.",
      "Tenant and HOA disputes around mold are common in NYC. Landlords and management companies sometimes paint over mold, install ceiling tiles to hide it, or claim the moisture issue has been resolved when it hasn't. Tenants who suspect mold often need third-party testing for HPD complaints or legal action. We provide independent mold assessment and clear documentation of moisture sources, mold species (where lab testing identifies it), and remediation scope. Whether you're a property owner trying to resolve a tenant complaint correctly, a tenant trying to document an unhealthy environment, or a co-op board navigating a unit-to-unit dispute, accurate documentation is what resolves the issue.",
    ],
    faq: [
      {
        q: "Do I need mold testing before remediation?",
        a: "For projects under 10 sq ft, testing is recommended but not legally required. For projects over 10 sq ft, NYS Code Rule 56 requires a licensed mold assessor to write a remediation plan before work begins. We provide both assessment and remediation but use separate licensed personnel as Code Rule 56 requires.",
      },
      {
        q: "Is black mold always dangerous?",
        a: "\"Black mold\" is a colloquial term — multiple mold species appear black or dark. Stachybotrys chartarum is the species most commonly referenced, and yes, it can cause respiratory issues and other health problems with prolonged exposure. We treat every mold finding seriously and remediate to clearance standards regardless of species.",
      },
      {
        q: "Will my landlord, HOA, or co-op cover mold remediation?",
        a: "It depends on the moisture source. If mold resulted from a building-side issue (roof leak, riser pipe, exterior water intrusion), the building or HOA is typically responsible. If it resulted from a unit-side issue (overflowing tub, neglected AC condensate line), the unit owner is typically responsible. We document the moisture source clearly to support the conversation.",
      },
      {
        q: "How long does mold remediation take?",
        a: "A small bathroom mold project takes 2-3 days. A basement project with 100+ sq ft of remediation can take 5-10 days. Larger projects with structural drying, demolition, and rebuild can run 3-4 weeks. We provide a clear timeline at the assessment stage.",
      },
    ],
    heroPhoto: { src: "/photos/services/mold-flood-ceiling.jpg", alt: "Ceiling collapse with mold damage from a NYC water intrusion event" },
    photos: [
      { src: "/photos/mold-testing.jpeg", alt: "Mold inspection and swab sampling on a wall in a NYC apartment" },
      { src: "/photos/services/mold-ceiling.jpg", alt: "Mold staining spreading across drywall ceiling in a NYC home" },
      { src: "/photos/thermal-imaging.jpeg", alt: "Thermal imaging camera detecting hidden moisture behind a wall in a NYC building" },
    ],
  },

  // ── 4. STORM & WINTER DAMAGE ────────────────────────────────────────────
  {
    slug: "storm-damage-repair",
    title: "Storm & Winter Damage Repair in New York",
    metaTitle: "Storm & Winter Damage Repair NYC | 24/7 | MRS",
    metaDescription:
      "NYC storm damage restoration — nor'easters, blizzards, frozen pipes, ice dams, summer storms. 24/7 emergency response. All 5 boroughs.",
    serviceType: "StormDamageRestoration",
    schemaName: "Storm & Winter Damage Repair — New York",
    schemaDescription:
      "Emergency response across all five NYC boroughs for nor'easter, blizzard, hurricane, ice-dam, and summer-storm damage — tarping, water extraction, debris cleanup, and full reconstruction.",
    heroIntro:
      "New York doesn't get hurricanes often, but when one does hit — Hurricane Sandy in 2012, Hurricane Ida in 2021 — the damage is severe and widespread. Far more frequent are nor'easters, winter blizzards, summer thunderstorms, and the cumulative damage from freeze-thaw cycles that hit NYC buildings every winter. Mitigation Restoration Services responds across all five boroughs to storm damage of every type — emergency tarping after wind damage, water extraction after basement flooding, frozen pipe repair, ice dam mitigation, and full reconstruction.",
    causesHeading: "Common Storm Damage in NYC",
    causes: [
      "Nor'easter wind damage to roofs, siding, and windows",
      "Winter blizzards and ice dams pushing water under shingles",
      "Frozen pipe bursts during deep cold snaps (December-February)",
      "Hurricane-force winds and tropical storm flooding (rare but severe)",
      "Summer thunderstorm wind, hail, and lightning damage",
      "Basement flooding during heavy rain events that overwhelm sewers",
      "Tree damage in outer boroughs (Queens, Staten Island, Bronx) where mature trees are common",
      "Storm surge in coastal areas of Brooklyn, Queens, and Staten Island",
    ],
    processHeading: "Our Storm Response Process",
    process: [
      "Emergency response and immediate damage assessment",
      "Roof tarping and emergency board-up of broken windows and doors",
      "Water extraction and drying for flood and rain intrusion",
      "Frozen pipe damage cleanup, drying, and coordination with plumbers",
      "Tree and debris removal coordination",
      "Insurance documentation including photos, moisture readings, and detailed scope",
      "Full structural repair and reconstruction",
    ],
    whyHeading: "Why New York Storm Damage Is Different",
    whySFlParagraphs: [
      "Winter is the dominant storm threat in New York, and it works completely differently than hurricane-driven storm damage in southern markets. When a major freeze hits — temperatures below 15°F for 24+ hours — pipe bursts cluster across the city in the same predictable buildings. Vacant rentals with thermostats turned down. Walk-up apartments with poorly insulated exterior walls. Pre-war buildings with original riser pipes and steam radiator lines. We see the pattern repeat every winter: the freeze peaks, calls flood in over 48-72 hours, and the same building types appear over and over. Knowing where the damage will happen lets us pre-position equipment and respond faster when calls come in.",
      "Ice dams are NYC-specific damage that homeowners in warmer climates never face. When snow accumulates on a roof and inadequate attic insulation lets warm air rise through the ceiling, snow melts at the roof surface, runs down to the eaves, and refreezes — building a dam of ice that traps water against the roof. The trapped water finds gaps in shingles or flashing and pushes into the building, causing ceiling damage, wall damage, and insulation saturation that often goes undetected until spring. We respond to ice dam damage all winter and into early spring as the dams release and the hidden damage emerges.",
      "Hurricane Sandy in 2012 still defines storm response in NYC, especially in coastal Brooklyn, Queens, and Staten Island. Many neighborhoods that flooded in Sandy will flood again in any major surge event — the FEMA flood maps are accurate, and properties in those zones face recurring exposure. Hurricane Ida in 2021 caused a different kind of damage: torrential rain overwhelming the combined sewer system, sending water up through basement drains and flooding below-grade spaces across the city. The two events represent the two storm threats NYC faces — coastal surge in flood zones, and rainfall flooding everywhere — and we respond to both with the same urgency.",
    ],
    faq: [
      {
        q: "When should I tarp my roof after storm damage?",
        a: "Within 24-48 hours, before the next weather event. We provide emergency tarping 24/7 and document the damage for insurance purposes before tarping covers the evidence.",
      },
      {
        q: "What about frozen pipe bursts during winter?",
        a: "Frozen pipe damage is a major part of our winter work. Shut off the building's main water valve immediately, then call us. We respond 24/7, coordinate with plumbers for source repair, and handle all water damage cleanup, drying, and rebuild.",
      },
      {
        q: "Is wind damage covered separately from flood damage?",
        a: "Yes — wind damage is covered under standard homeowner and building policies, but flood damage typically requires separate flood insurance through NFIP or private flood policies. We document the cause of damage clearly so the right policy responds. Properties in FEMA flood zones in Brooklyn, Queens, and Staten Island should carry flood coverage.",
      },
      {
        q: "How fast can you respond during a major storm?",
        a: "During major storms, response time may extend to 4-8 hours due to volume and travel conditions. We prioritize life-safety and active water intrusion calls first. Emergency tarping is typically same-day even during peak demand.",
      },
    ],
    heroPhoto: { src: "/photos/services/storm-trees.jpg", alt: "Storm-downed trees blocking a NYC home after a major weather event" },
    photos: [
      { src: "/photos/services/storm-lightning.jpg", alt: "Lightning storm over a NYC neighborhood during severe weather" },
      { src: "/photos/services/storm-flood.jpg", alt: "Storm-surge flooding in a NYC coastal neighborhood" },
      { src: "/photos/job-site-thumb.jpeg", alt: "Storm-response crew with full restoration equipment on a NYC job site" },
    ],
  },

  // ── 5. SEWAGE & BIOHAZARD ───────────────────────────────────────────────
  {
    slug: "biohazard-cleanup",
    title: "Sewage & Biohazard Cleanup in New York",
    metaTitle: "Biohazard & Sewage Cleanup NYC | 24/7 | Discreet | MRS",
    metaDescription:
      "NYC biohazard, sewage, and trauma scene cleanup. Discreet, certified, OSHA compliant. All 5 boroughs. 24/7 emergency response.",
    serviceType: "BiohazardCleanup",
    schemaName: "Sewage & Biohazard Cleanup — New York",
    schemaDescription:
      "Discreet biohazard, sewage, hoarding, and trauma scene cleanup across all five NYC boroughs — full PPE protocols, NYC DEP–compliant regulated waste handling, OSHA-compliant procedures.",
    heroIntro:
      "Biohazard situations in New York buildings — sewage backups, trauma scenes, hoarding cleanups, infectious disease decontamination — require specialized PPE, regulated waste disposal, and discretion. Mitigation Restoration Services handles every type of biohazard situation across Manhattan, Brooklyn, Queens, The Bronx, and Staten Island with full OSHA compliance, NYC DEP regulated waste handling, and the discretion these jobs always require.",
    causesHeading: "When You Need Biohazard Cleanup",
    causes: [
      "Sewage backups from blocked or overwhelmed building lines",
      "Toilet overflows that affect multiple floors in apartment buildings",
      "Combined sewer overflow during heavy rain events",
      "Category 3 (black water) flooding from external sources",
      "Trauma scenes requiring blood and biological decontamination",
      "Hoarding situations requiring full property cleanup",
      "Infectious disease decontamination",
      "Crime scene cleanup following police clearance",
    ],
    processHeading: "Our Biohazard Process",
    process: [
      "Hazard assessment and PPE deployment",
      "Containment to prevent contamination spread to other units or building areas",
      "Safe removal and disposal of contaminated materials per NYC and NYS regulations",
      "Industrial-grade disinfection with EPA-registered antimicrobials",
      "Odor elimination using thermal fogging and ozone treatment",
      "Air quality testing to confirm safe occupancy",
      "Restoration and rebuild of removed building materials",
    ],
    whyHeading: "Why New York Biohazard Cleanup Is Different",
    whySFlParagraphs: [
      "Sewage backups in NYC apartment buildings affect more units than they do in single-family homes. A blocked main sewer line can cause backflow into ground-floor units and basement apartments simultaneously, contaminating multiple living spaces with Category 3 black water that requires complete removal of affected drywall, flooring, and insulation. Combined sewer overflow during heavy rain — a known issue with NYC's older infrastructure — means sewage backups can happen during any major storm, not just plumbing failures. We respond fast and contain immediately to limit cross-contamination between units.",
      "Hoarding cleanup is unusually common in NYC compared to other markets. The combination of small apartments, decades of accumulated belongings, and tenants aging in place in rent-stabilized units creates situations where buildings discover hoarder conditions during inspections, lease enforcement, or after a tenant's passing. These jobs require sensitivity, time, and proper waste disposal. We work directly with property owners, family members, social services where involved, and APS (Adult Protective Services) when coordination is needed. Discretion is non-negotiable.",
      "Trauma scene cleanup in NYC buildings — following accidents, suicides, or unattended deaths — is work that requires both certification and emotional sensitivity. NYPD typically clears the scene first, then we handle the biological remediation. Affected building materials are removed and disposed of as regulated medical waste through licensed haulers. We document the work for insurance claims while never including details that violate the privacy of the deceased or the family. Every job is handled with respect.",
    ],
    faq: [
      {
        q: "Do you handle hoarding cleanup?",
        a: "Yes. Hoarding cleanup is a significant part of our work in NYC. We coordinate with property owners, family members, APS, and social workers where appropriate. Pricing is based on volume and condition. We provide a clear scope and timeline at the assessment stage.",
      },
      {
        q: "Is biohazard cleanup covered by insurance?",
        a: "Sewage backup is typically covered under standard homeowner, renter, and building policies — sometimes with sub-limits requiring a sewer backup endorsement. Trauma scene cleanup is often covered under \"loss of use\" or \"additional living expenses\" provisions. We document everything for insurance review.",
      },
      {
        q: "How quickly can you respond to a sewage backup?",
        a: "Same-day, typically within 2-4 hours of the call. Sewage contamination spreads rapidly and pathogens multiply, so faster response means less affected material to remove and less reconstruction needed.",
      },
      {
        q: "How do you handle privacy and discretion?",
        a: "Trucks are unmarked or minimally marked. Technicians do not discuss the nature of jobs with neighbors. We do not photograph faces, identifying details, or scene-specific imagery for marketing. Documentation is provided directly to the property owner and insurance carrier only.",
      },
    ],
    heroPhoto: { src: "/photos/services/bio-suit.jpg", alt: "Technician suiting up in protective gear before a NYC biohazard cleanup" },
    photos: [
      { src: "/photos/services/bio-spray.jpg", alt: "Technician in full PPE applying biohazard disinfection in a NYC residence" },
      { src: "/photos/services/bio-kitchen.jpg", alt: "Hazmat-suited worker decontaminating a NYC kitchen during biohazard cleanup" },
      { src: "/photos/damage-ceiling.jpeg", alt: "Damaged ceiling structure inside a NYC building requiring biohazard cleanup" },
    ],
  },

  // ── 6. RECONSTRUCTION & REBUILD ─────────────────────────────────────────
  {
    slug: "reconstruction-rebuild",
    title: "Reconstruction & Rebuild in New York",
    metaTitle: "Reconstruction & Rebuild NYC | Insurance Coordinated | MRS",
    metaDescription:
      "NYC reconstruction after water, fire, mold, or storm damage. Co-op approval, NYC DOB permits, full rebuild. All 5 boroughs. Insurance coordinated.",
    serviceType: "RestorationReconstruction",
    schemaName: "Reconstruction & Rebuild — New York",
    schemaDescription:
      "Full structural reconstruction after water, fire, mold, or storm damage across all five NYC boroughs — drywall, flooring, kitchens, bathrooms, paint, and finishes — with co-op approvals, NYC DOB permits, and insurance coordination.",
    heroIntro:
      "After mitigation work is complete, the rebuild is what gets a New York property back to livable condition — and rebuilds in NYC are rarely simple. Co-op board approval, condo association coordination, NYC Department of Buildings permits, Landmark District restrictions in historic neighborhoods, and Local Law 11 considerations all factor in. Mitigation Restoration Services handles the full rebuild process across Manhattan, Brooklyn, Queens, The Bronx, and Staten Island as one contractor, so unit owners and property managers don't have to manage multiple vendors through a stressful project.",
    causesHeading: "When You Need Reconstruction",
    causes: [
      "Post-water damage reconstruction (drywall, flooring, kitchen and bathroom rebuild)",
      "Post-fire structural repair and full unit reconstruction",
      "Storm damage reconstruction including roof, siding, and window replacement",
      "Post-mold remediation rebuild after wall and ceiling demolition",
      "Historic restoration matching original materials and finishes",
      "Co-op and condo unit interior rebuilds with board-approved scopes",
      "Commercial space buildout following damage events",
      "Insurance claim work coordinated with carriers from start to finish",
    ],
    processHeading: "Our Reconstruction Process",
    process: [
      "Damage assessment and detailed scope of work",
      "Insurance estimate coordination with the carrier and adjuster",
      "Co-op or condo board approval submission where required",
      "NYC DOB permit application where structural work is involved",
      "Framing and structural repairs",
      "Drywall, flooring, paint, and finishes",
      "Final inspection and walkthrough with owner",
    ],
    whyHeading: "Why New York Reconstruction Is Different",
    whySFlParagraphs: [
      "NYC permitting and approval timelines extend most reconstruction projects beyond what owners expect from other markets. NYC Department of Buildings permits for structural work can take 2-8 weeks depending on complexity and DOB workload. Co-op boards typically meet monthly, so submission timing matters — missing a board meeting can add 30 days to the project schedule. Condo associations vary widely but most require advance notice, certificate of insurance from the contractor, and a documented scope before work in walls or ceilings can begin. We track all of these timelines and submit documentation in the format each board and the DOB requires, because submission errors cause restarts.",
      "Historic and landmark district considerations apply throughout NYC. Park Slope, Brooklyn Heights, Greenwich Village, the Upper East Side Historic District, and many others have Landmarks Preservation Commission review requirements for any exterior work, window replacement, or facade modification. Even interior work in landmark buildings sometimes requires review when it affects building systems shared with the landmark exterior. We've worked in landmarked buildings across Manhattan and Brooklyn and know what triggers LPC review and how to design rebuild scopes that don't.",
      "Insurance coordination is heavier in NYC than in most markets because most damage events involve multiple policies. A unit owner in a co-op has their own HO-6 policy. The co-op corporation has a building master policy. The board may have separate policies for shared systems. A large damage event can involve all three, plus the unit owner's contents coverage. We document the work in detail, allocate scope to the policy responsible for each portion, and coordinate billing with all carriers and adjusters. Owners don't manage the paperwork — we do.",
    ],
    faq: [
      {
        q: "Do you handle the full rebuild after mitigation?",
        a: "Yes. We act as one contractor for both mitigation and reconstruction, so unit owners don't have to manage multiple vendors. We coordinate from emergency response through final walkthrough.",
      },
      {
        q: "Will you work with my insurance adjuster?",
        a: "Yes. We document everything to insurance-carrier standards and work directly with adjusters from start to finish. We provide line-item scope, photos, moisture readings, and progress documentation. We do not use Assignment of Benefits contracts.",
      },
      {
        q: "Do I need permits for rebuild work?",
        a: "For most cosmetic rebuilds (paint, drywall, flooring), no DOB permit is required. For structural work, plumbing changes, or electrical changes, NYC DOB permits are required. We handle the permit application and inspections on your behalf.",
      },
      {
        q: "How does co-op or condo board approval work?",
        a: "Most boards require a written scope of work, certificate of insurance from the contractor, and sometimes board interview before approving work. We provide all documentation in the format your board requires and can attend board interviews if needed.",
      },
    ],
    heroPhoto: { src: "/photos/services/recon-interior.jpg", alt: "Interior rebuild in progress with new drywall during a NYC reconstruction" },
    photos: [
      { src: "/photos/services/recon-framing.jpg", alt: "Exposed wood framing during a NYC home reconstruction" },
      { src: "/photos/kitchen-after.jpeg", alt: "Fully rebuilt kitchen after NYC water damage reconstruction" },
      { src: "/photos/water-air-movers.jpeg", alt: "Industrial drying equipment running during the mitigation phase before NYC reconstruction" },
    ],
  },
];

export const NY_SERVICE_DETAILS_BY_SLUG: Record<string, ServiceDetail> = Object.fromEntries(
  NY_SERVICE_DETAILS.map(s => [s.slug, s])
);
