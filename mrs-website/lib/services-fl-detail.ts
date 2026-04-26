// Per-service detail content for the six FL service pages.
// Each entry powers one route under app/(fl)/services/[slug]/page.tsx via
// the shared ServiceDetailPage template.
//
// Copy is hand-written per service — DO NOT template across entries. Each
// "Why South Florida X Is Different" block carries the local-SEO weight.
//
// NY equivalents will live in lib/services-ny-detail.ts when NY service
// pages ship in the next deploy.

export type ServiceDetailFaq = { q: string; a: string };

export type ServiceDetailPhoto = {
  src: string;
  alt: string;
  // human-readable note for David — where photo-2/3 placeholders need real
  // imagery dropped in. photo-1 references an existing /public/photos file.
  todoNote?: string;
};

export type ServiceDetail = {
  slug: string;
  title: string;             // H1
  metaTitle: string;
  metaDescription: string;
  serviceType: string;       // Schema.org Service.serviceType
  schemaName: string;
  schemaDescription: string;
  heroIntro: string;
  causes: string[];
  causesHeading: string;
  process: string[];
  processHeading: string;
  whyHeading: string;
  whySFlParagraphs: string[];
  faq: ServiceDetailFaq[];
  heroPhoto: ServiceDetailPhoto;     // top-of-page hero image
  photos: ServiceDetailPhoto[];      // bottom 3-photo strip — must NOT include heroPhoto
};

export const FL_SERVICE_DETAILS: ServiceDetail[] = [
  // ── 1. WATER DAMAGE RESTORATION ─────────────────────────────────────────
  {
    slug: "water-damage-restoration",
    title: "Water Damage Restoration in South Florida",
    metaTitle: "Water Damage Restoration South Florida | 24/7 | MRS",
    metaDescription:
      "24/7 emergency water damage restoration across South Florida — Boca Raton to Miami. IICRC certified, sub-60-minute response. Call (754) 777-8956.",
    serviceType: "WaterDamageRestoration",
    schemaName: "Water Damage Restoration — South Florida",
    schemaDescription:
      "IICRC-certified water extraction, structural drying, and moisture monitoring across South Florida. 24/7 emergency response for burst pipes, hurricane flooding, and tidal water intrusion.",
    heroIntro:
      "A burst supply line at 2 a.m. in a Coral Gables condo. King-tide water creeping under a Miami Beach front door. Storm surge wrecking a Hollywood townhome before the wind even dies. Water damage in South Florida moves fast — and so do we. Our IICRC-certified crews extract standing water, set industrial drying equipment, and document every reading for your insurance carrier, with sub-60-minute response from Boca Raton to Homestead.",
    causesHeading: "Common Causes of South Florida Water Damage",
    causes: [
      "Burst or leaking supply lines (especially older copper plumbing in pre-1980s coastal high-rises)",
      "Hurricane storm surge and tidal flooding (storm season runs June through November)",
      "King tide and street flooding in Miami Beach, Hollywood, and along Las Olas",
      "Failed AC condensate drain lines — year-round Florida heat means year-round AC means year-round risk",
      "Water heater failures and supply-line ruptures",
      "Sewer line backups in older Broward County neighborhoods",
      "Roof leaks during heavy rain and tropical storms",
    ],
    processHeading: "Our Water Damage Process",
    process: [
      "Emergency response and water source control",
      "Standing-water extraction with truck-mounted units",
      "Moisture mapping using infrared cameras and pinless meters",
      "Industrial drying with air movers, LGRs, and refrigerant dehumidifiers",
      "Containment and antimicrobial treatment to prevent mold colonization",
      "Daily monitoring with documented dryness logs",
      "Final inspection, clearance documentation, and insurance reporting",
    ],
    whyHeading: "Why South Florida Water Damage Is Different",
    whySFlParagraphs: [
      "South Florida humidity changes the math on water damage. In drier climates a flooded room can air-dry over a few days; here, ambient humidity sits between 70% and 90% most of the year, evaporation slows to a crawl, and mold colonies start forming inside cavity walls and under flooring within 24 to 48 hours. Drying equipment has to be sized correctly for both the volume of moisture and the local dew point — the same setup that works in Atlanta won't pull water out of a Hollywood living room on schedule.",
      "Hurricane season multiplies the urgency. A single storm can saturate hundreds of properties at once, and restoration crews fill up fast. The carrier paperwork is also unique to Florida: Citizens Property Insurance, Heritage, Universal North America, and a handful of state-specific carriers each have their own documentation expectations. We photograph every affected room, log moisture readings room-by-room over multiple days, and submit the kind of evidence package your adjuster needs to approve the claim without bouncing it back.",
      "Coastal high-rises in Miami Beach, Aventura, Sunny Isles, and downtown Fort Lauderdale add a layer most other markets don't deal with. Shared plumbing risers mean a leak in one unit can soak three units below within minutes. Condo association rules dictate which contractors can work in the building, what hours equipment can run, and who's financially responsible for what — drywall versus pipe, common element versus unit owner. We've worked enough of these buildings to know how to coordinate with property management without the job stalling out.",
    ],
    faq: [
      {
        q: "How quickly does mold start in Florida humidity?",
        a: "Mold spores can begin to colonize damp materials within 24 to 48 hours in South Florida's typical 70–90% humidity range. The faster water is extracted and structural drying is started, the less likely you'll be paying for mold remediation on top of water mitigation. That's why our standard response time on emergencies is under 60 minutes.",
      },
      {
        q: "Will my Florida insurance cover hurricane water damage?",
        a: "It depends on the source. Wind-driven rain that enters through a damaged roof is usually covered under your standard homeowners or condo policy. Rising water from storm surge is typically excluded under HO-3 and HO-A policies and falls under separate flood insurance (NFIP or private). We document both wind-driven and flood causation thoroughly so your adjuster can apply the right coverage — and when those lines blur, our reports help support disputes.",
      },
      {
        q: "Do I need to leave my home during drying?",
        a: "Most water mitigation jobs let you stay in the home, but drying equipment is loud and rooms with active equipment shouldn't be slept in. Significant Category 3 (sewage) losses, large mold finds, or jobs requiring contents pack-out usually mean temporary relocation. Many homeowners' policies in Florida include 'loss of use' coverage that pays for hotel or short-term rental stays — we'll help you file for it.",
      },
      {
        q: "How long does South Florida water damage drying typically take?",
        a: "Most residential jobs run 3 to 5 days from extraction to dry. Hardwood floors and dense materials in coastal humidity can take longer — sometimes up to 7 days — and we monitor moisture readings daily so the equipment runs only as long as it needs to. If we pull early we risk hidden moisture and downstream mold; we keep documentation throughout so your carrier sees why each day was billed.",
      },
    ],
    heroPhoto: { src: "/photos/water-air-movers.jpeg", alt: "Industrial air movers and dehumidifier deployed after South Florida water damage" },
    photos: [
      { src: "/photos/wall-demo-drying.jpeg", alt: "Opened wall with air mover running during South Florida water damage drying", todoNote: "Fallback to existing photo. Original spec: Pexels 'water damage drying equipment'." },
      { src: "/photos/dehumidifier-kitchen.jpeg", alt: "Commercial dehumidifier and air mover operating in kitchen after South Florida water loss", todoNote: "Fallback to existing photo. Original spec: Unsplash 'flooded living room interior'." },
      { src: "/photos/hallway-drying.jpeg", alt: "Industrial air movers deployed in water-damaged South Florida hallway", todoNote: "Fallback to existing photo." },
    ],
  },

  // ── 2. FIRE & SMOKE DAMAGE ──────────────────────────────────────────────
  {
    slug: "fire-damage-restoration",
    title: "Fire & Smoke Damage Restoration South Florida",
    metaTitle: "Fire & Smoke Damage Restoration South Florida | 24/7",
    metaDescription:
      "Emergency fire and smoke damage cleanup across South Florida — board-up, soot removal, deodorization, full reconstruction. 24/7. Call (754) 777-8956.",
    serviceType: "FireDamageRestoration",
    schemaName: "Fire & Smoke Damage Restoration — South Florida",
    schemaDescription:
      "Emergency board-up, soot and smoke odor removal, content cleaning, and structural restoration across South Florida — kitchen fires, brush fires, electrical fires, and lightning strikes.",
    heroIntro:
      "After a fire, the structure is what you see — but smoke and soot are what destroy everything else. From a kitchen fire in a Coral Gables condo to brush-fire damage near Homestead and Redland, our crews handle the same job in two phases: emergency stabilization first, then complete smoke odor elimination, soot removal, contents cleaning, and structural rebuild. We're on-site fast and we coordinate the entire job so you talk to one team start to finish.",
    causesHeading: "Common Fire Causes in South Florida",
    causes: [
      "Kitchen fires — the most common residential cause in dense condo buildings and townhomes",
      "Electrical fires from overloaded panels, especially in mid-century homes that haven't been re-wired",
      "Lightning strikes during summer thunderstorm season and named storms",
      "Brush and wildland fires in the Redland, Homestead, and western Broward areas",
      "Grease fires and outdoor cooking accidents",
      "HVAC and dryer-vent fires (frequently overlooked in coastal homes with salt-air corrosion)",
    ],
    processHeading: "Our Fire & Smoke Process",
    process: [
      "Emergency board-up, roof tarping, and water removal from fire suppression",
      "Hazard assessment — structural integrity, lingering electrical risk, soot composition",
      "Soot and char removal using HEPA vacuuming and wet-wipe protocols",
      "Smoke odor elimination with thermal fogging, ozone, or hydroxyl generators (job-dependent)",
      "Contents pack-out, off-site cleaning, and inventoried storage when needed",
      "Air quality testing and sealing of contaminated cavity spaces",
      "Full structural rebuild — drywall, paint, flooring, cabinetry, and trim",
    ],
    whyHeading: "Why South Florida Fire Damage Is Different",
    whySFlParagraphs: [
      "Fire spread in South Florida buildings doesn't behave the way it does in older detached housing stock. A lot of our work is in concrete-and-steel mid-rise and high-rise buildings where smoke moves through HVAC chases, plenum spaces, and shared corridors rather than through walls. That changes the cleaning scope — soot can land on every surface in a hallway twenty doors down from the unit that actually burned, and HOAs expect documentation of where the contamination did and didn't reach.",
      "Brush-fire and dry-season risk is real even though most people associate Florida with rain. The Everglades agricultural reserve, the Redland, and the western edges of Broward County see structure fires every dry season when wind pushes a wildland event into the suburban interface. Lightning is its own category — Florida leads the country in lightning-strike property losses, and the resulting fires often involve both burn damage and the water and chemicals from suppression.",
      "Insurance coordination on a Florida fire claim is rarely simple. Carriers typically split mitigation, contents, and rebuild into separate scopes and adjusters, and the AOB landscape means some homeowners are reluctant to assign benefits even when it would speed up the work. We build documentation packages — photo logs, smoke deposit maps, inventoried contents, before/after readings — that hold up under reinspection and don't slow the rebuild down.",
    ],
    faq: [
      {
        q: "Can smoke damage be fully removed, or does the smell always come back?",
        a: "Properly executed, yes — odor can be eliminated, not just masked. The issue is that surface cleaning alone misses smoke residue trapped in cavity walls, HVAC ductwork, attic insulation, and porous materials like drywall paper. We diagnose where the smoke molecules actually landed (often using a sealed-room ozone test) and treat each surface category with the right method. Cutting corners is what leads to that 'smoke comes back when it gets humid' problem you've probably heard about.",
      },
      {
        q: "Do you clean my belongings, or just the structure?",
        a: "Both. We do a full contents pack-out for jobs where on-site cleaning isn't practical — soft goods like clothing and bedding go to specialized launderers, electronics get ultrasonic-cleaned, hard goods are wiped and inventoried photographically, and everything is stored in climate-controlled space until rebuild is done. For lighter smoke jobs, on-site cleaning room-by-room is faster and less disruptive.",
      },
      {
        q: "How long does fire restoration take in a typical South Florida home?",
        a: "Mitigation (stabilization, soot removal, deodorization) usually runs 7–14 days. Full rebuild after that depends on scope: a single-room kitchen fire might be 4–6 weeks; a whole-floor or whole-house rebuild is more like 3–6 months and depends heavily on permitting and material lead times. Hurricane season slows permitting in some Broward and Miami-Dade municipalities, which we'll factor into the timeline.",
      },
      {
        q: "What should I avoid touching after a fire before you arrive?",
        a: "Don't try to wipe soot off walls or furniture — modern soot is acidic and sets into surfaces within hours, especially in Florida humidity. Don't run the HVAC system if smoke entered the air handler, since that pushes contamination through the entire duct network. Don't throw out damaged items until they've been inventoried for the claim. Stay out of structurally compromised areas and call us.",
      },
    ],
    heroPhoto: { src: "/photos/services/fire-aftermath.jpg", alt: "Fire-damaged exterior of a South Florida home after a structural blaze" },
    photos: [
      { src: "/photos/services/fire-burning.jpg", alt: "House fully engulfed in flames during a South Florida structure fire", todoNote: "Fallback to existing photo. Original spec: Pexels 'house fire damage interior'." },
      { src: "/photos/services/fire-charred.jpg", alt: "Charred structural framing inside a South Florida home after fire damage", todoNote: "Fallback to existing photo. Original spec: Unsplash 'smoke restoration equipment'." },
      { src: "/photos/damage-ceiling.jpeg", alt: "Storm and fire damage to ceiling structure in a South Florida home", todoNote: "Fallback to existing photo." },
    ],
  },

  // ── 3. MOLD REMEDIATION ─────────────────────────────────────────────────
  {
    slug: "mold-remediation",
    title: "Mold Remediation & Testing — South Florida",
    metaTitle: "Mold Remediation South Florida | Testing & Removal | MRS",
    metaDescription:
      "Year-round mold testing and remediation across South Florida. EPA & IICRC protocols. Air quality, containment, source correction. Call (754) 777-8956.",
    serviceType: "MoldRemediation",
    schemaName: "Mold Remediation & Testing — South Florida",
    schemaDescription:
      "Mold inspection, air quality testing, containment, HEPA filtration, and antimicrobial remediation across South Florida — coastal high-rises, single-family homes, commercial properties.",
    heroIntro:
      "South Florida mold isn't just a post-flood problem — it's a year-round one. Year-round 70–90% humidity, AC condensation issues, hidden roof leaks, and slow plumbing drips add up to mold colonies you can smell before you can see. We test, identify, contain, remove, and address the source, following EPA and IICRC S520 protocols, with clearance testing on the back end so your file shows the job was done right.",
    causesHeading: "What Drives Florida Mold",
    causes: [
      "Year-round high humidity (not just post-flood)",
      "AC system condensation issues — dirty drain lines, oversized units short-cycling, leaking coils",
      "Hidden mold behind drywall after slow leaks in coastal homes (especially around windows and door thresholds)",
      "Roof leaks not visible from inside until staining shows on ceilings",
      "Crawlspaces and slab-on-grade moisture intrusion",
      "Bathroom ventilation failures in older condos and townhomes",
      "Unaddressed water damage from prior carriers or DIY drying attempts",
    ],
    processHeading: "Our Mold Remediation Process",
    process: [
      "Visual and instrument-based inspection (moisture mapping, infrared, sometimes borescope)",
      "Air quality testing — pre-remediation samples to establish baseline",
      "Engineering controls — containment with poly sheeting, negative air pressure, HEPA filtration",
      "Physical removal of mold-contaminated materials per IICRC S520 condition categories",
      "Antimicrobial treatment of cleaned surfaces and HVAC components if affected",
      "Moisture source correction — repair the leak, fix the AC, address the ventilation",
      "Post-remediation clearance testing by an independent industrial hygienist when required",
    ],
    whyHeading: "Why South Florida Mold Is Different",
    whySFlParagraphs: [
      "Florida humidity is the single biggest driver of indoor mold and it doesn't take a flood to start a problem. A bathroom exhaust fan that doesn't quite vent to the exterior, a slightly oversized AC unit short-cycling so it never dehumidifies, an attic that builds heat and condenses moisture against the underside of the roof deck — any one of those is enough to feed a colony year-round. We see this in newer construction as much as older homes; the failure mode just looks different.",
      "Coastal salt-air construction adds its own twist. Older Hollywood, Hallandale Beach, and Miami Beach homes were often built without modern vapor barriers, and slab-on-grade construction can wick ground moisture into bottom plates and lower drywall. In high-rises, we frequently find mold in the cavity behind shower walls, around penetrations for plumbing risers, and inside HVAC closets — areas no homeowner would think to inspect.",
      "The legal side matters too. Florida HOAs and condo associations have tight rules about mold remediation work — air balance, after-hours equipment, certificates of insurance for contractors. Insurance carriers like Citizens Property Insurance handle mold claims very differently than out-of-state carriers; some require remediation under a specific scope cap before they'll engage. We've worked enough of these to know how to position the documentation to get full coverage approved when the science supports it.",
    ],
    faq: [
      {
        q: "Do I need mold testing before remediation?",
        a: "Sometimes. Visible mold and a known moisture source — say, a leak under a sink — can usually skip pre-testing and go straight to remediation. Hidden mold, ambiguous odors, suspected HVAC contamination, or cases where the homeowner is buying or selling the property generally do need testing first to scope the work and document conditions. We'll tell you honestly which side your situation falls on.",
      },
      {
        q: "Is black mold always dangerous?",
        a: "'Black mold' is a popular shorthand, but a lot of dark-colored fungi look similar visually and behave very differently. Stachybotrys chartarum (the species most people mean when they say 'black mold') is a concern, but it's not the only species worth removing. The real question isn't color — it's spore concentration, the species, and whether there's an actively wet substrate feeding it. We test, we don't guess.",
      },
      {
        q: "Will my HOA cover mold remediation?",
        a: "Florida condo and HOA mold coverage is highly building-specific. Common-element mold (riser leaks, building envelope failures) is usually association responsibility; in-unit mold from in-unit causes (a leaking dishwasher, for example) is usually the unit owner's. The split is governed by your declaration documents and by the Florida Condo Act. We document the source so the claim lands with the right party from the start.",
      },
      {
        q: "Can I just spray bleach on mold and be done with it?",
        a: "On a hard, sealed surface like tile, bleach can kill surface mold. On any porous material — drywall, wood, fabric — bleach kills what's on top while leaving viable spores in the substrate, and bleach plus humidity actually feeds future regrowth. IICRC S520 doesn't recognize spraying bleach as remediation for a reason. The right answer is removing or properly treating the affected material and fixing the moisture source feeding it.",
      },
    ],
    heroPhoto: { src: "/photos/services/mold-ceiling.jpg", alt: "Mold staining spreading across drywall ceiling in a South Florida home" },
    photos: [
      { src: "/photos/mold-testing.jpeg", alt: "MRS technician swab-testing mold growth on wall in a South Florida home", todoNote: "Fallback to existing photo. Original spec: Pexels 'mold remediation equipment'." },
      { src: "/photos/services/mold-flood-ceiling.jpg", alt: "Ceiling collapse with mold damage from a South Florida flood event", todoNote: "Fallback to existing photo. Original spec: Unsplash 'HEPA air scrubber containment'." },
      { src: "/photos/thermal-imaging.jpeg", alt: "Thermal imaging camera detecting hidden moisture behind a wall in a South Florida home", todoNote: "Fallback to existing photo." },
    ],
  },

  // ── 4. STORM & HURRICANE DAMAGE ─────────────────────────────────────────
  {
    slug: "storm-damage-repair",
    title: "Storm & Hurricane Damage Repair South Florida",
    metaTitle: "Hurricane Damage Repair South Florida | 24/7 Tarping",
    metaDescription:
      "Emergency hurricane damage response across South Florida — tarping, water extraction, board-up, structural repair. 24/7 storm season ready. Call (754) 777-8956.",
    serviceType: "StormDamageRestoration",
    schemaName: "Storm & Hurricane Damage Repair — South Florida",
    schemaDescription:
      "Emergency hurricane and tropical storm response across South Florida — emergency tarping, board-up, water extraction, structural assessment, and full restoration.",
    heroIntro:
      "Hurricane season runs June 1 to November 30 and South Florida sits in the bullseye. We respond to wind, water, and storm-surge damage as soon as it's safe — emergency tarping to prevent the next rainband from finishing what the first one started, board-up to secure the property, water extraction before mold takes hold, and full structural rebuild after. We work all of South Florida and we keep our equipment and crews staged through storm season so we don't run out when you need us most.",
    causesHeading: "Common Storm Damage in South Florida",
    causes: [
      "Named-storm wind damage to roofs, soffits, fascia, and windows",
      "Storm surge flooding in coastal zones (Miami Beach, Hollywood, Hallandale Beach, Fort Lauderdale beachfront)",
      "Wind-driven rain entering through damaged roofs, soffit, or window seals",
      "Tornadoes and microbursts inside larger storm systems",
      "Hail damage to roofs, windows, and exterior cladding",
      "Tree falls and downed limbs causing structural breach",
      "Power surge damage to electrical systems and HVAC equipment",
    ],
    processHeading: "Our Storm Response Process",
    process: [
      "Initial safety assessment and structural triage on arrival",
      "Emergency tarping of breached roof areas to seal against the next rainband",
      "Board-up of broken windows and compromised entry points",
      "Water extraction and immediate drying setup",
      "Debris removal and exterior cleanup",
      "Insurance documentation — wind-vs-flood causation evidence is critical in Florida",
      "Permitted repairs and full structural rebuild, including roof, windows, and interior finishes",
    ],
    whyHeading: "Why South Florida Storm Damage Is Different",
    whySFlParagraphs: [
      "Hurricane season in South Florida isn't a single event — it's six months of standing ready. We pre-stage tarping material, generators, water-extraction trucks, and crews ahead of every named storm. Once a storm passes, the first 72 hours are everything. A roof breach that doesn't get tarped before the next rainband can turn a $20,000 wind claim into a $200,000 mold-and-rebuild claim. Our crews work in shifts immediately after a storm clears so we hit as many properties as fast as we can.",
      "Wind-vs-flood is the insurance distinction that dominates Florida storm claims. A standard homeowners or condo policy generally covers wind damage and wind-driven rain. Storm surge — water that rises and enters from outside — is typically a flood policy coverage (NFIP or private). When both happen in the same storm, which is normal in South Florida, the carrier wants very specific evidence of which damage came from which source. We photograph and document in a way that gives the adjuster the causation story they need.",
      "Permitting and code matter too. Post-Hurricane Andrew, post-Surfside, post-Irma — South Florida building codes have tightened considerably, and the rebuild scope after a storm often involves bringing parts of the structure up to current code rather than back to as-was. We know the Broward and Miami-Dade permitting offices, we know which inspectors are picky about which details, and we plan the timeline accordingly so your rebuild doesn't stall waiting on a paperwork issue we should have caught up front.",
    ],
    faq: [
      {
        q: "When should I tarp my roof after a hurricane?",
        a: "As fast as you can safely access it. Wind events in Florida are usually followed by additional rain, and an unbarriered roof breach lets the rain finish the damage the wind started. Don't climb on a roof yourself in wind — but get a professional crew engaged within the first 24–48 hours after the storm clears. We carry industrial-grade reinforced tarping that holds up through subsequent rain bands, not just the consumer blue-tarp version.",
      },
      {
        q: "Is wind damage covered separately from flood?",
        a: "Yes — and the distinction matters. Most South Florida homeowners and condo policies cover wind damage and wind-driven rain. Standard policies do NOT cover rising water from storm surge or flooding; that requires a separate flood policy (NFIP or private). When a storm causes both, your claim has to be carefully split between the two policies, and the documentation we provide makes or breaks how the carriers settle it.",
      },
      {
        q: "How fast can you respond during peak hurricane season?",
        a: "Faster than you'd expect, but slower than our normal response time. In a major impact event, restoration capacity across the region is overwhelmed — every crew is booked and every truck is out. We pre-position equipment and crews ahead of named storms, and our existing customers and contracted commercial accounts get triage priority. Even at peak, we typically reach new emergency calls within 24 hours of dispatch — far faster than the 'someone will call you in two weeks' scenario you might have heard about.",
      },
      {
        q: "Can you handle insurance coordination during a major storm event?",
        a: "Yes, and in storm events that's where most of the value lives. Adjusters are overwhelmed in the days after a major storm; documentation that lands on their desk well-organized and clearly causation-tagged moves to the front of the queue. We provide photo logs, moisture readings, debris inventories, and wind-vs-flood causation evidence in the format carriers like Citizens, Heritage, Universal, and Tower Hill expect. We can also work directly with public adjusters when the homeowner has retained one.",
      },
    ],
    heroPhoto: { src: "/photos/services/storm-flood.jpg", alt: "Hurricane storm-surge flooding in a South Florida residential neighborhood" },
    photos: [
      { src: "/photos/services/storm-lightning.jpg", alt: "Lightning storm over a South Florida neighborhood during severe weather", todoNote: "Fallback to existing photo. Original spec: Pexels 'hurricane roof tarp'." },
      { src: "/photos/services/storm-trees.jpg", alt: "Hurricane-downed trees blocking a South Florida home after a named storm", todoNote: "Fallback to existing photo. Original spec: Unsplash 'storm damage debris'." },
      { src: "/photos/damage-ceiling.jpeg", alt: "Storm damage to ceiling structure in a South Florida property", todoNote: "Fallback to existing photo." },
    ],
  },

  // ── 5. SEWAGE & BIOHAZARD ───────────────────────────────────────────────
  {
    slug: "biohazard-cleanup",
    title: "Sewage & Biohazard Cleanup South Florida",
    metaTitle: "Biohazard & Sewage Cleanup South Florida | 24/7 | MRS",
    metaDescription:
      "Discreet, certified biohazard, sewage, and trauma cleanup across South Florida. PPE crews, regulatory compliance, insurance support. Call (754) 777-8956.",
    serviceType: "BiohazardCleanup",
    schemaName: "Sewage & Biohazard Cleanup — South Florida",
    schemaDescription:
      "Certified biohazard, sewage, trauma, and Cat-3 water cleanup across South Florida — full PPE protocols, regulated waste disposal, OSHA-compliant procedures.",
    heroIntro:
      "Biohazard cleanup is rarely the call anyone wants to make. We handle these jobs with the discretion they deserve — sewage backups in older Broward neighborhoods, trauma scene response, hoarding cleanup, Category 3 water losses — using full PPE, regulated waste handling, and OSHA-compliant protocols. We coordinate with law enforcement, county health departments, and your insurance carrier when needed.",
    causesHeading: "When You Need Biohazard Cleanup",
    causes: [
      "Sewage backups and lateral line failures (common in older Pompano Beach, Hollywood, and Fort Lauderdale neighborhoods)",
      "Toilet and drain overflows from clogs, root intrusion, or municipal main backups",
      "Category 3 'black water' floodwater containing sewage or contaminants",
      "Trauma and unattended-death scene response",
      "Hoarding cleanup and disability-related cleanup situations",
      "Animal-related contamination and infestation cleanup",
      "Crime scene cleanup, working alongside law enforcement clearance",
    ],
    processHeading: "Our Biohazard Process",
    process: [
      "Hazard assessment and PPE deployment per OSHA bloodborne-pathogen standards",
      "Containment, vapor barriers, and negative-air pressure when required",
      "Safe removal of contaminated materials with proper bagging and chain-of-custody",
      "EPA-registered antimicrobial application and bio-disinfection",
      "Odor elimination using ozone, hydroxyl, or thermal fogging as appropriate",
      "Regulated waste disposal at licensed Florida facilities (we provide manifests)",
      "Air quality testing and final clearance documentation when required",
    ],
    whyHeading: "Why South Florida Biohazard Work Is Different",
    whySFlParagraphs: [
      "Sewage backups in South Florida are more common than people expect, and the pattern is driven by infrastructure age. Older Broward and Miami-Dade neighborhoods — large parts of Pompano Beach, Wilton Manors, Hollywood, Little Havana — have lateral lines and city mains that predate modern materials. Root intrusion from the area's mature tree canopy plus heavy rain events overload municipal capacity, and a sewer backup can turn a finished lower level or first floor into a Category 3 environment within minutes.",
      "Trauma and crime-scene work requires specific certifications and a calm, low-profile presence. We coordinate with the local agency that has the scene — Broward County Sheriff, Miami-Dade Police, municipal departments — and only enter after release. Families dealing with these situations don't need a contractor showing up in branded vehicles and uniforms; we run unmarked when requested and we handle the documentation insurance and estate work needs without making the family relive details.",
      "Hoarding and severely-soiled-property cleanup is the third major category we see. South Florida's older population includes an aging-in-place demographic where these situations build up over years. We're patient, we triage what's salvageable, we coordinate with adult protective services or the county when family is involved, and we can stage the work so it isn't overwhelming. The job isn't just bagging trash — it's understanding that real life happened in this space and treating the cleanup with that respect.",
    ],
    faq: [
      {
        q: "Do you handle crime scenes?",
        a: "Yes. We respond to crime scenes after law enforcement releases the property, and we coordinate directly with the agency holding the scene — Broward Sheriff, Miami-Dade Police, or municipal departments — so families don't have to manage that handoff themselves. Our work follows OSHA bloodborne-pathogen standards and Florida regulated medical waste disposal requirements.",
      },
      {
        q: "Is biohazard cleanup covered by insurance?",
        a: "Often, yes — homeowners and commercial property policies usually cover biohazard cleanup that follows a covered event (sewage backup with the right rider, trauma after an insured incident, vandalism). Coverage gets specific around what triggered the loss, so we document the event, the contamination level, and the scope of work in a format carriers like Citizens and Tower Hill expect. We can also work with crime victim compensation programs in Florida when applicable.",
      },
      {
        q: "How quickly can you respond?",
        a: "Bio jobs get the same emergency response priority as our water and fire work — under 60 minutes when reasonably possible. In trauma situations we often stage near the scene and wait on law enforcement release, and in sewage backups we want crews on-site within the first hour to start containment before the contamination spreads further.",
      },
      {
        q: "Will my neighbors know what's going on?",
        a: "Not unless you want them to. We run unmarked vehicles and unmarked uniforms on request for sensitive jobs, we don't post yard signs, and we keep the on-site crew small and quiet. The only thing visible should be a regulated waste disposal step at the very end, and even that we time and stage to keep the scene low-profile.",
      },
    ],
    heroPhoto: { src: "/photos/services/bio-spray.jpg", alt: "Technician in full PPE applying biohazard disinfection in a South Florida residence" },
    photos: [
      { src: "/photos/services/bio-kitchen.jpg", alt: "Hazmat-suited worker decontaminating a South Florida kitchen during biohazard cleanup", todoNote: "Fallback to existing photo. Original spec: Pexels 'biohazard cleanup PPE'." },
      { src: "/photos/services/bio-suit.jpg", alt: "Technician suiting up in protective gear before South Florida biohazard cleanup", todoNote: "Fallback to existing photo. Original spec: Pixabay 'hazmat disinfection'." },
      { src: "/photos/job-site-thumb.jpeg", alt: "South Florida commercial job site with full restoration equipment deployed", todoNote: "Fallback to existing photo." },
    ],
  },

  // ── 6. RECONSTRUCTION & REBUILD ─────────────────────────────────────────
  {
    slug: "reconstruction-rebuild",
    title: "Post-Damage Reconstruction & Rebuild South Florida",
    metaTitle: "Restoration Reconstruction & Rebuild South Florida | MRS",
    metaDescription:
      "Full reconstruction after water, fire, mold, or storm damage in South Florida. One contractor, full scope, insurance-coordinated. Call (754) 777-8956.",
    serviceType: "RestorationReconstruction",
    schemaName: "Post-Damage Reconstruction & Rebuild — South Florida",
    schemaDescription:
      "Full structural reconstruction across South Florida after water, fire, mold, or storm damage — drywall, flooring, cabinetry, paint, and code-compliant rebuild.",
    heroIntro:
      "Mitigation gets a property dry, clean, and stable. Rebuild puts it back. We handle the full reconstruction scope after any damage event — drywall, flooring, cabinetry, paint, trim, and the structural work in between — as one contractor, with one project manager, coordinating directly with your insurance adjuster. South Florida permitting, post-Surfside code requirements, and condo association approvals are all part of the job, and we plan for them up front so the rebuild doesn't stall.",
    causesHeading: "When You Need Reconstruction",
    causes: [
      "After a covered water mitigation, fire damage cleanup, or storm response",
      "Following mold remediation that required removing drywall, flooring, or framing",
      "Building envelope and structural repairs after hurricane wind or surge events",
      "Older home remediation where pre-1990s materials had to be removed",
      "Code-compliance updates required during post-loss permitting (post-Surfside common-area work, for example)",
      "Insurance scope-of-work rebuilds where mitigation and reconstruction were split across phases",
    ],
    processHeading: "Our Reconstruction Process",
    process: [
      "Scope of work development, including code-compliance items unique to South Florida",
      "Insurance coordination — line-item estimate alignment with adjuster scope",
      "Permitting through the relevant Broward or Miami-Dade municipality",
      "Framing, structural repairs, and rough-in trades (electrical, plumbing, HVAC)",
      "Drywall, paint, flooring, cabinetry, trim, and final finishes",
      "Code inspections and certificate-of-completion handoffs",
      "Walkthrough, punch list, and warranty documentation",
    ],
    whyHeading: "Why South Florida Reconstruction Is Different",
    whySFlParagraphs: [
      "South Florida reconstruction has more permitting overhead than most markets and that overhead has grown post-Surfside. Broward and Miami-Dade municipalities have tightened review on common-area work, structural work in mid-rise and high-rise buildings, and any envelope-affecting repairs. We know which inspectors and reviewers are picky about which details — wind-load calcs in coastal Hollywood, electrical service upgrades during interior work in older Coral Gables homes, HOA architectural-review requirements in condo associations — and we plan the schedule accordingly.",
      "Hurricane season compounds everything. Materials are tight in the months after a major storm event, sub-trades are booked, and permitting offices run slower as their queues fill. We pre-stage common materials, maintain relationships with sub-trades who give us priority on storm-impacted jobs, and we sequence work to hit the structural-then-finishes path that most carriers want documented for staged claim payments.",
      "The carrier coordination piece is where most rebuild jobs go sideways. In Florida, mitigation and reconstruction are usually scoped and approved separately, often by different adjusters, and the scope sheets don't always agree. We provide line-item estimates that match the format the carrier's software (typically Xactimate) reads, we negotiate scope adjustments with documentation rather than arguments, and we don't start work that isn't going to be reimbursed unless the homeowner has elected to upgrade out-of-scope. That keeps the project predictable and keeps the homeowner from getting a surprise bill.",
    ],
    faq: [
      {
        q: "Do you handle the full rebuild after mitigation, or just the cleanup phase?",
        a: "Full rebuild. One of the reasons we exist is so homeowners aren't passed between a mitigation contractor, a general contractor, and three different sub-trades. We carry the rebuild scope through to certificate-of-completion — drywall, paint, flooring, cabinetry, trim, and the structural and trade work behind them — with one project manager from start to walkthrough.",
      },
      {
        q: "Will you work with my insurance adjuster?",
        a: "Yes — directly. We provide line-item scope estimates in the format the carrier's software (typically Xactimate) reads, we participate in joint scope walks with the adjuster on-site when needed, and we negotiate scope adjustments with documentation rather than sales pressure. For complex claims involving public adjusters or attorneys, we coordinate with all parties and keep the documentation clean.",
      },
      {
        q: "Do I need permits for rebuild work, even if it's just putting back what was there?",
        a: "Usually yes, in Florida. Most South Florida municipalities require permits for structural rework, drywall replacement above a certain square footage, electrical and plumbing modifications, and any work that affects the building envelope. Like-for-like cosmetic finishes (paint, basic flooring replacement) sometimes don't require permits, but we err on the side of pulling them — unpermitted work surfaces during sale, refinance, or insurance reinspection and creates problems years later.",
      },
      {
        q: "How long does a typical post-damage reconstruction take?",
        a: "Highly scope-dependent. A single-room rebuild might be 2–4 weeks. A whole-floor rebuild is 6–12 weeks. A full-house reconstruction after a major fire or storm event runs 3–6 months and can stretch longer if the project involves code-upgrade items or hurricane-season material delays. We give realistic milestones up front and update them in writing as the job progresses.",
      },
    ],
    heroPhoto: { src: "/photos/kitchen-after.jpeg", alt: "Fully rebuilt kitchen after South Florida water damage reconstruction" },
    photos: [
      { src: "/photos/services/recon-framing.jpg", alt: "Exposed wood framing during a South Florida home reconstruction", todoNote: "Fallback to existing photo. Original spec: Pexels 'drywall installation'." },
      { src: "/photos/services/recon-interior.jpg", alt: "Interior rebuild in progress with new drywall during a South Florida reconstruction", todoNote: "Fallback to existing photo. Original spec: Unsplash 'home renovation interior finish'." },
      { src: "/photos/hallway-drying.jpeg", alt: "South Florida hallway after restoration and drying complete", todoNote: "Fallback to existing photo." },
    ],
  },
];

export const FL_SERVICE_DETAILS_BY_SLUG: Record<string, ServiceDetail> = Object.fromEntries(
  FL_SERVICE_DETAILS.map(s => [s.slug, s])
);
