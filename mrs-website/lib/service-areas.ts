// Per-area copy for the FL and NY service-areas hub pages.
// Hand-supplied by David — do not edit without his approval.

export type ServiceArea = {
  name: string;        // H2
  description: string; // single paragraph (~120 words)
};

export const FL_SERVICE_AREAS: ServiceArea[] = [
  {
    name: "Boca Raton",
    description:
      "Boca Raton sits at the northern edge of our service area, with a mix of upscale single-family homes, condo high-rises along the coast, and country club communities inland. King tide flooding affects properties closest to the Intracoastal in fall and winter, and aging plumbing in older Boca communities like Boca Pointe and Polo Club creates frequent slab leak and pipe failure calls. We respond with same-day arrival typical for Boca Raton emergencies.",
  },
  {
    name: "Deerfield Beach",
    description:
      "Deerfield Beach mixes coastal condos with inland single-family neighborhoods. Hurricane wind exposure on the coast and inland flooding from heavy rain events drive most of our calls here. The older neighborhoods west of US-1 see frequent water intrusion from storm-related roof and window damage. We're typically on-site within 60 minutes of an emergency call from anywhere in Deerfield Beach.",
  },
  {
    name: "Pompano Beach",
    description:
      "Pompano Beach is a high-volume area for us, particularly the coastal condo buildings along A1A and the older single-family neighborhoods inland. Sewer backups during heavy rain events are common in Pompano, and condo buildings with original plumbing from the 1970s and 80s see riser pipe failures regularly. We work directly with HOAs and condo boards across Pompano Beach.",
  },
  {
    name: "Fort Lauderdale",
    description:
      "Fort Lauderdale is one of our largest service areas, covering everything from Las Olas high-rises to single-family homes in Victoria Park, Coral Ridge, and Rio Vista. Marine humidity and extensive canal-front property mean mold issues are year-round concerns. King tide flooding along the New River and Intracoastal hits properties multiple times per year. We have crews positioned for fast Fort Lauderdale response 24/7.",
  },
  {
    name: "Hollywood",
    description:
      "Hollywood spans coastal condos, single-family neighborhoods, and large multi-family complexes. Aging infrastructure in older Hollywood neighborhoods creates frequent water damage calls, and proximity to the Intracoastal means flooding exposure during major storm events. We respond across all of Hollywood including Hollywood Hills, Emerald Hills, and the beach district.",
  },
  {
    name: "Hallandale Beach",
    description:
      "Hallandale Beach is dense with high-rise condo buildings along the coast and Hollywood line. Most of our Hallandale calls involve condo unit water damage from neighbor-unit failures or building-wide riser issues. We coordinate directly with Hallandale condo boards, building management, and unit owners on insurance documentation and scope of work.",
  },
  {
    name: "Aventura",
    description:
      "Aventura is almost entirely high-rise condo and gated single-family communities. Condo unit water damage that cascades between floors is the dominant call type here. Our team works with all major Aventura condo associations and management companies and arrives prepared for the documentation requirements specific to this market.",
  },
  {
    name: "North Miami",
    description:
      "North Miami covers a wide mix of housing types from older single-family homes to mid-rise apartment buildings to industrial and commercial properties. Flooding from heavy rain events and aging infrastructure drive most calls. We respond across North Miami and North Miami Beach as one combined service area for fast dispatch.",
  },
  {
    name: "Miami Beach",
    description:
      "Miami Beach properties span everything from historic Art Deco condos in South Beach to modern high-rises in Mid-Beach to single-family homes in Sunset Islands and Venetian Islands. Salt air, humidity, and king tide flooding combine to create unique restoration challenges. We work with the historic preservation guidelines that apply to Miami Beach landmark buildings.",
  },
  {
    name: "Miami",
    description:
      "Miami is our highest-volume service area, covering Brickell, Downtown, Wynwood, Little Havana, Coconut Grove, and surrounding neighborhoods. Building types range from new construction high-rises to early-1900s homes in Coconut Grove. King tide flooding affects coastal areas, and aging plumbing in older Miami homes drives steady water damage call volume year-round.",
  },
  {
    name: "Coral Gables",
    description:
      "Coral Gables is known for its historic homes, mature tree canopy, and strict architectural review process. Restoration in Coral Gables often requires coordination with the city's historic preservation office and matches to original building materials. Hurricane wind exposure is significant in Coral Gables due to the tree canopy. We respond across all of Coral Gables and the surrounding Coconut Grove area.",
  },
  {
    name: "Homestead",
    description:
      "Homestead is the southernmost area we serve, covering single-family homes, agricultural-area properties, and the eastern edges of the Everglades buffer. Hurricane exposure is the highest of any area we serve — Homestead saw the worst of Hurricane Andrew in 1992 and remains a high-risk area for future major storms. We respond to Homestead and Florida City for water, fire, mold, and storm damage.",
  },
];

export const NY_SERVICE_AREAS: ServiceArea[] = [
  {
    name: "Manhattan",
    description:
      "Manhattan is our most active borough, covering everything from pre-war elevator buildings on the Upper East Side and Upper West Side, to walk-ups in the East Village and Lower East Side, to luxury high-rises in Midtown and Tribeca, to historic brownstones in Greenwich Village and Harlem. Riser pipe failures and frozen pipe bursts in pre-war buildings drive most winter calls. Co-op board coordination is required for the majority of Manhattan jobs and we have established workflows with major Manhattan management companies.",
  },
  {
    name: "Brooklyn",
    description:
      "Brooklyn covers the widest range of housing types of any borough. Brownstones in Park Slope, Brooklyn Heights, and Bed-Stuy. Walk-ups in Williamsburg and Greenpoint. Single-family homes in Bay Ridge, Marine Park, and Flatbush. Coastal condos in Brighton Beach and Coney Island. Sandy zone exposure remains real in coastal Brooklyn and we respond to flood damage there during every major storm. Landmark district restrictions apply in Brooklyn Heights, Park Slope, Cobble Hill, and Carroll Gardens.",
  },
  {
    name: "Queens",
    description:
      "Queens has the largest single-family home stock of any borough plus dense apartment buildings in Astoria, Long Island City, and Jackson Heights. Basement flooding is a major issue in Queens — both from rising groundwater in flood-prone neighborhoods and from sewer backups during heavy rain events. Hurricane Ida in 2021 devastated basement apartments across Queens and we responded across the borough to that event. Frozen pipe damage in detached single-family homes drives steady winter call volume.",
  },
  {
    name: "The Bronx",
    description:
      "The Bronx covers a mix of pre-war apartment buildings concentrated in the south Bronx and Riverdale, plus single-family neighborhoods in Throgs Neck, Country Club, and the City Island area. Older building stock means original plumbing and frequent winter pipe burst calls. We respond across all Bronx neighborhoods and coordinate with both private owners and large management companies that operate in the borough.",
  },
  {
    name: "Staten Island",
    description:
      "Staten Island has the most single-family homes of any NYC borough and the most acute Sandy memory — coastal neighborhoods including Midland Beach, New Dorp Beach, and Tottenville saw catastrophic flooding in 2012 and remain in active flood zones today. Many homes have been raised since Sandy but flooding exposure remains for non-elevated properties during major storm events. We respond to Staten Island for water, fire, mold, and full reconstruction work and coordinate with FEMA flood insurance carriers when applicable.",
  },
];
