import type { Cohort, FeedEvent, Lead, Deal, Bot, BillNyeReport } from './types'

// ─── DEMO LEADS (42) ─────────────────────────────────────────────────────────

const DEMO_LEADS: Lead[] = [
  // HOT (6)
  { id: 'lead-d01', cohort_id: 'demo', business_name: 'Coral Gables Family Dental', first_name: 'Anna', last_name: 'Patel', email: 'anna.patel@cgfamilydental.com', phone: '305-555-0101', website: 'cgfamilydental.com', niche: 'dental', city: 'Coral Gables', state: 'FL', temperature: 'HOT', deal_tier: 349, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-24T08:10:00Z', last_activity_at: '2026-04-24T08:10:00Z' },
  { id: 'lead-d02', cohort_id: 'demo', business_name: 'Biscayne Bay Orthodontics', first_name: 'Michael', last_name: 'Reyes', email: 'michael@bbortho.com', phone: '305-555-0102', website: 'bbortho.com', niche: 'orthodontics', city: 'Miami', state: 'FL', temperature: 'HOT', deal_tier: 249, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-23T14:30:00Z', last_activity_at: '2026-04-23T18:00:00Z' },
  { id: 'lead-d03', cohort_id: 'demo', business_name: 'South Beach Dental Studio', first_name: 'Carlos', last_name: 'Rivera', email: 'carlos@sbdental.com', phone: '305-555-0103', niche: 'dental', city: 'Miami Beach', state: 'FL', temperature: 'HOT', deal_tier: 249, utm_source: 'website-form', source: 'website', created_at: '2026-04-22T11:00:00Z', last_activity_at: '2026-04-23T09:00:00Z' },
  { id: 'lead-d04', cohort_id: 'demo', business_name: 'Pinecrest Oral Care', first_name: 'Robert', last_name: 'Martinez', email: 'robert@pinecrestoral.com', phone: '305-555-0104', niche: 'dental', city: 'Pinecrest', state: 'FL', temperature: 'HOT', deal_tier: 349, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-04-21T09:00:00Z', last_activity_at: '2026-04-22T16:00:00Z' },
  { id: 'lead-d05', cohort_id: 'demo', business_name: 'Aventura Cosmetic Dental', first_name: 'Patricia', last_name: 'Williams', email: 'patricia@aventuradental.com', phone: '305-555-0105', website: 'aventuradental.com', niche: 'dental', city: 'Aventura', state: 'FL', temperature: 'HOT', deal_tier: 249, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-20T13:00:00Z', last_activity_at: '2026-04-23T10:00:00Z' },
  { id: 'lead-d06', cohort_id: 'demo', business_name: 'North Miami Beach Orthodontics', first_name: 'David', last_name: 'Park', email: 'david@nmfortho.com', phone: '305-555-0106', niche: 'orthodontics', city: 'North Miami Beach', state: 'FL', temperature: 'HOT', deal_tier: 249, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-19T10:00:00Z', last_activity_at: '2026-04-22T14:00:00Z' },

  // WARM (14)
  { id: 'lead-d07', cohort_id: 'demo', business_name: 'Key Biscayne Pediatric Dental', first_name: 'Sarah', last_name: 'Johnson', email: 'sarah@kbpediatric.com', phone: '305-555-0107', niche: 'pediatric-dental', city: 'Key Biscayne', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'website-form', source: 'website', created_at: '2026-04-18T09:00:00Z', last_activity_at: '2026-04-21T11:00:00Z' },
  { id: 'lead-d08', cohort_id: 'demo', business_name: 'Coconut Grove Smiles', first_name: 'Jennifer', last_name: 'Kim', email: 'jennifer@cgsmiles.com', phone: '305-555-0108', niche: 'dental', city: 'Coconut Grove', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-04-17T14:00:00Z', last_activity_at: '2026-04-20T09:00:00Z' },
  { id: 'lead-d09', cohort_id: 'demo', business_name: 'Doral Dental Center', first_name: 'Lisa', last_name: 'Chen', email: 'lisa@doraldental.com', phone: '305-555-0109', niche: 'dental', city: 'Doral', state: 'FL', temperature: 'WARM', deal_tier: 249, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-16T10:00:00Z', last_activity_at: '2026-04-19T15:00:00Z' },
  { id: 'lead-d10', cohort_id: 'demo', business_name: 'Kendall Family Dentistry', first_name: 'James', last_name: 'Torres', email: 'james@kendalldental.com', phone: '305-555-0110', niche: 'dental', city: 'Kendall', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'website-form', source: 'website', created_at: '2026-04-15T08:00:00Z', last_activity_at: '2026-04-18T12:00:00Z' },
  { id: 'lead-d11', cohort_id: 'demo', business_name: 'Hialeah Dental Group', first_name: 'Antonio', last_name: 'Rodriguez', email: 'antonio@hialeahdental.com', phone: '305-555-0111', niche: 'dental', city: 'Hialeah', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-04-14T11:00:00Z', last_activity_at: '2026-04-17T10:00:00Z' },
  { id: 'lead-d12', cohort_id: 'demo', business_name: 'Homestead Dental Care', first_name: 'Maria', last_name: 'Santos', email: 'maria@homesteaddental.com', phone: '305-555-0112', niche: 'dental', city: 'Homestead', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-04-13T09:00:00Z', last_activity_at: '2026-04-16T14:00:00Z' },
  { id: 'lead-d13', cohort_id: 'demo', business_name: 'Sunny Isles Smiles', first_name: 'Rachel', last_name: 'Green', email: 'rachel@sunnyislessmiles.com', phone: '305-555-0113', niche: 'dental', city: 'Sunny Isles Beach', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-12T13:00:00Z', last_activity_at: '2026-04-15T10:00:00Z' },
  { id: 'lead-d14', cohort_id: 'demo', business_name: 'Bal Harbour Dental Spa', first_name: 'Mark', last_name: 'Thompson', email: 'mark@bhds.com', phone: '305-555-0114', website: 'bhds.com', niche: 'dental', city: 'Bal Harbour', state: 'FL', temperature: 'WARM', deal_tier: 249, utm_source: 'website-form', source: 'website', created_at: '2026-04-11T10:00:00Z', last_activity_at: '2026-04-14T16:00:00Z' },
  { id: 'lead-d15', cohort_id: 'demo', business_name: 'Opa-locka Dental Clinic', first_name: 'Sofia', last_name: 'Hernandez', email: 'sofia@opalockadental.com', phone: '305-555-0115', niche: 'dental', city: 'Opa-locka', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-04-10T08:00:00Z', last_activity_at: '2026-04-13T09:00:00Z' },
  { id: 'lead-d16', cohort_id: 'demo', business_name: 'Miami Springs Family Dental', first_name: 'Chris', last_name: 'Anderson', email: 'chris@miamispringsdental.com', phone: '305-555-0116', niche: 'dental', city: 'Miami Springs', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-09T11:00:00Z', last_activity_at: '2026-04-12T14:00:00Z' },
  { id: 'lead-d17', cohort_id: 'demo', business_name: 'Sweetwater Dental Studio', first_name: 'Angela', last_name: 'Torres', email: 'angela@sweetwaterdental.com', phone: '305-555-0117', niche: 'dental', city: 'Sweetwater', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-04-08T09:00:00Z', last_activity_at: '2026-04-11T10:00:00Z' },
  { id: 'lead-d18', cohort_id: 'demo', business_name: 'Westchester Dental Care', first_name: 'Brian', last_name: 'Lee', email: 'brian@westchesterdental.com', phone: '305-555-0118', niche: 'dental', city: 'Westchester', state: 'FL', temperature: 'WARM', deal_tier: 249, utm_source: 'website-form', source: 'website', created_at: '2026-04-07T14:00:00Z', last_activity_at: '2026-04-10T11:00:00Z' },
  { id: 'lead-d19', cohort_id: 'demo', business_name: 'Cutler Bay Orthodontics', first_name: 'Nicole', last_name: 'Brown', email: 'nicole@cutlerbayortho.com', phone: '305-555-0119', niche: 'orthodontics', city: 'Cutler Bay', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-04-06T10:00:00Z', last_activity_at: '2026-04-09T09:00:00Z' },
  { id: 'lead-d20', cohort_id: 'demo', business_name: 'Palmetto Bay Pediatric Dental', first_name: 'Jason', last_name: 'White', email: 'jason@pbpediatric.com', phone: '305-555-0120', niche: 'pediatric-dental', city: 'Palmetto Bay', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-04-05T08:00:00Z', last_activity_at: '2026-04-08T14:00:00Z' },

  // COOL (15)
  { id: 'lead-d21', cohort_id: 'demo', business_name: 'Perrine Dental Group', first_name: 'Michelle', last_name: 'Davis', email: 'michelle@perrinedental.com', niche: 'dental', city: 'Perrine', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-03T09:00:00Z' },
  { id: 'lead-d22', cohort_id: 'demo', business_name: 'Goulds Family Dentistry', first_name: 'Kevin', last_name: 'Wilson', email: 'kevin@gouldsdental.com', niche: 'dental', city: 'Goulds', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'website-form', source: 'website', created_at: '2026-04-02T11:00:00Z' },
  { id: 'lead-d23', cohort_id: 'demo', business_name: 'Naranja Dental Care', first_name: 'Laura', last_name: 'Garcia', email: 'laura@naranjadental.com', niche: 'dental', city: 'Naranja', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-04-01T10:00:00Z' },
  { id: 'lead-d24', cohort_id: 'demo', business_name: 'Florida City Dental', first_name: 'Steven', last_name: 'Moore', email: 'steven@floridacitydental.com', niche: 'dental', city: 'Florida City', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-03-30T09:00:00Z' },
  { id: 'lead-d25', cohort_id: 'demo', business_name: 'Medley Smiles', first_name: 'Christine', last_name: 'Taylor', email: 'christine@medleysmiles.com', niche: 'dental', city: 'Medley', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-03-28T13:00:00Z' },
  { id: 'lead-d26', cohort_id: 'demo', business_name: 'Ojus Dental Center', first_name: 'Ryan', last_name: 'Anderson', email: 'ryan@ojusdental.com', niche: 'dental', city: 'Ojus', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'website-form', source: 'website', created_at: '2026-03-26T10:00:00Z' },
  { id: 'lead-d27', cohort_id: 'demo', business_name: 'Golden Beach Dental', first_name: 'Amanda', last_name: 'Jackson', email: 'amanda@goldenbeachdental.com', niche: 'dental', city: 'Golden Beach', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-03-24T09:00:00Z' },
  { id: 'lead-d28', cohort_id: 'demo', business_name: 'Indian Creek Dental Spa', first_name: 'Daniel', last_name: 'Martin', email: 'daniel@icdentalsp.com', niche: 'dental', city: 'Indian Creek', state: 'FL', temperature: 'COOL', deal_tier: 249, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-03-22T11:00:00Z' },
  { id: 'lead-d29', cohort_id: 'demo', business_name: 'Surfside Family Dental', first_name: 'Melissa', last_name: 'Thompson', email: 'melissa@surfsidedental.com', niche: 'dental', city: 'Surfside', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-03-20T10:00:00Z' },
  { id: 'lead-d30', cohort_id: 'demo', business_name: 'Bay Harbor Orthodontics', first_name: 'Jonathan', last_name: 'Kim', email: 'jonathan@bhortho.com', niche: 'orthodontics', city: 'Bay Harbor Islands', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-03-18T09:00:00Z' },
  { id: 'lead-d31', cohort_id: 'demo', business_name: 'Brickell Dental Studio', first_name: 'Samantha', last_name: 'Cruz', email: 'samantha@brickellstudio.com', niche: 'dental', city: 'Brickell', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'website-form', source: 'website', created_at: '2026-03-16T14:00:00Z' },
  { id: 'lead-d32', cohort_id: 'demo', business_name: 'Edgewater Dental Care', first_name: 'Andrew', last_name: 'Lee', email: 'andrew@edgewaterdental.com', niche: 'dental', city: 'Edgewater', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-03-14T10:00:00Z' },
  { id: 'lead-d33', cohort_id: 'demo', business_name: 'Wynwood Smiles', first_name: 'Brittany', last_name: 'Johnson', email: 'brittany@wynwoodsmiles.com', niche: 'dental', city: 'Wynwood', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-03-12T09:00:00Z' },
  { id: 'lead-d34', cohort_id: 'demo', business_name: 'Little Havana Dental', first_name: 'Ricardo', last_name: 'Gutierrez', email: 'ricardo@lhavana dental.com', niche: 'dental', city: 'Little Havana', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-03-10T11:00:00Z' },
  { id: 'lead-d35', cohort_id: 'demo', business_name: 'Liberty City Dental', first_name: 'Vanessa', last_name: 'Brown', email: 'vanessa@libertycitydental.com', niche: 'dental', city: 'Liberty City', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'website-form', source: 'website', created_at: '2026-03-08T10:00:00Z' },

  // COLD (7)
  { id: 'lead-d36', cohort_id: 'demo', business_name: 'Overtown Family Dentistry', first_name: 'Marcus', last_name: 'Davis', email: 'marcus@overtowndental.com', niche: 'dental', city: 'Overtown', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-03-05T09:00:00Z' },
  { id: 'lead-d37', cohort_id: 'demo', business_name: 'Allapattah Dental Group', first_name: 'Crystal', last_name: 'Rivera', email: 'crystal@allapatdental.com', niche: 'dental', city: 'Allapattah', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-03-02T11:00:00Z' },
  { id: 'lead-d38', cohort_id: 'demo', business_name: 'Brownsville Dental Care', first_name: 'Terrance', last_name: 'Moore', email: 'terrance@brownsvilledental.com', niche: 'dental', city: 'Brownsville', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-02-27T10:00:00Z' },
  { id: 'lead-d39', cohort_id: 'demo', business_name: 'Model City Dental', first_name: 'Denise', last_name: 'Washington', email: 'denise@modelcitydental.com', niche: 'dental', city: 'Model City', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-02-22T09:00:00Z' },
  { id: 'lead-d40', cohort_id: 'demo', business_name: 'Gladeview Smiles', first_name: 'Raymond', last_name: 'Scott', email: 'raymond@gladeviewsmiles.com', niche: 'dental', city: 'Gladeview', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-02-17T11:00:00Z' },
  { id: 'lead-d41', cohort_id: 'demo', business_name: 'Ives Estates Dental', first_name: 'Pamela', last_name: 'White', email: 'pamela@ivesestates dental.com', niche: 'dental', city: 'Ives Estates', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-02-12T10:00:00Z' },
  { id: 'lead-d42', cohort_id: 'demo', business_name: 'Norland Dental Care', first_name: 'Gregory', last_name: 'Thomas', email: 'gregory@norlanddental.com', niche: 'dental', city: 'Norland', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-01-24T09:00:00Z' },
]

// ─── AIANDWEBSERVICES LEADS (6) ───────────────────────────────────────────────

const AIW_LEADS: Lead[] = [
  { id: 'lead-a01', cohort_id: 'aiandwebservices', business_name: 'Torres Insurance Group', first_name: 'Miguel', last_name: 'Torres', email: 'miguel@torresinsurance.com', phone: '305-555-0201', niche: 'insurance', city: 'Doral', state: 'FL', temperature: 'HOT', deal_tier: 249, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-23T10:00:00Z', last_activity_at: '2026-04-23T10:00:00Z' },
  { id: 'lead-a02', cohort_id: 'aiandwebservices', business_name: 'Green Horizons Landscaping', first_name: 'Carlos', last_name: 'Mendez', email: 'carlos@greenhorizons.com', phone: '305-555-0202', niche: 'landscaping', city: 'Hialeah', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'website-form', source: 'website', created_at: '2026-04-21T14:00:00Z', last_activity_at: '2026-04-22T10:00:00Z' },
  { id: 'lead-a03', cohort_id: 'aiandwebservices', business_name: 'Casa Bella Restaurant', first_name: 'Elena', last_name: 'Vargas', email: 'elena@casabella miami.com', phone: '305-555-0203', niche: 'restaurant', city: 'Brickell', state: 'FL', temperature: 'WARM', deal_tier: 149, utm_source: 'referral', source: 'master_pipeline', created_at: '2026-04-19T11:00:00Z', last_activity_at: '2026-04-21T09:00:00Z' },
  { id: 'lead-a04', cohort_id: 'aiandwebservices', business_name: 'Palmetto Insurance Solutions', first_name: 'Sandra', last_name: 'Cruz', email: 'sandra@palmettoins.com', niche: 'insurance', city: 'Kendall', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-04-15T10:00:00Z' },
  { id: 'lead-a05', cohort_id: 'aiandwebservices', business_name: 'Tropical Grounds Co.', first_name: 'Jose', last_name: 'Morales', email: 'jose@tropicalgrounds.com', niche: 'landscaping', city: 'Coral Gables', state: 'FL', temperature: 'COOL', deal_tier: 149, utm_source: 'linkedin', source: 'master_pipeline', created_at: '2026-04-12T09:00:00Z' },
  { id: 'lead-a06', cohort_id: 'aiandwebservices', business_name: 'Little Havana Bistro', first_name: 'Maria', last_name: 'Fernandez', email: 'maria@lhbistro.com', niche: 'restaurant', city: 'Little Havana', state: 'FL', temperature: 'COLD', deal_tier: 149, utm_source: 'outbound', source: 'master_pipeline', created_at: '2026-04-07T11:00:00Z' },
]

// ─── DEALS ────────────────────────────────────────────────────────────────────

const DEMO_DEALS: Deal[] = [
  { id: 'deal-d01', cohort_id: 'demo', lead_id: 'lead-d42', business_name: 'Norland Dental Care', amount: 149, stage: 'Lead', probability: 20, days_in_stage: 2, created_at: '2026-04-22T09:00:00Z', last_activity_at: '2026-04-22T09:00:00Z' },
  { id: 'deal-d02', cohort_id: 'demo', lead_id: 'lead-d07', business_name: 'Key Biscayne Pediatric Dental', amount: 149, stage: 'Audit Scheduled', probability: 40, days_in_stage: 4, created_at: '2026-04-20T10:00:00Z', last_activity_at: '2026-04-20T10:00:00Z' },
  { id: 'deal-d03', cohort_id: 'demo', lead_id: 'lead-d09', business_name: 'Doral Dental Center', amount: 249, stage: 'Audit Scheduled', probability: 45, days_in_stage: 6, created_at: '2026-04-18T11:00:00Z', last_activity_at: '2026-04-18T11:00:00Z' },
  { id: 'deal-d04', cohort_id: 'demo', lead_id: 'lead-d04', business_name: 'Pinecrest Oral Care', amount: 249, stage: 'Audit Complete', probability: 60, days_in_stage: 3, created_at: '2026-04-21T09:00:00Z', last_activity_at: '2026-04-21T09:00:00Z' },
  { id: 'deal-d05', cohort_id: 'demo', lead_id: 'lead-d05', business_name: 'Aventura Cosmetic Dental', amount: 349, stage: 'Proposal Sent', probability: 70, days_in_stage: 8, created_at: '2026-04-16T10:00:00Z', last_activity_at: '2026-04-16T10:00:00Z' },
  { id: 'deal-d06', cohort_id: 'demo', lead_id: 'lead-d00', business_name: 'Smith Family Dental', amount: 149, stage: 'Active', probability: 100, days_in_stage: 268, created_at: '2025-08-01T00:00:00Z', last_activity_at: '2026-04-01T00:00:00Z' },
]

const AIW_DEALS: Deal[] = [
  { id: 'deal-a01', cohort_id: 'aiandwebservices', lead_id: 'lead-a01', business_name: 'Torres Insurance Group', amount: 249, stage: 'Lead', probability: 20, days_in_stage: 1, created_at: '2026-04-23T10:00:00Z', last_activity_at: '2026-04-23T10:00:00Z' },
  { id: 'deal-a02', cohort_id: 'aiandwebservices', lead_id: 'lead-a02', business_name: 'Green Horizons Landscaping', amount: 149, stage: 'Audit Scheduled', probability: 40, days_in_stage: 3, created_at: '2026-04-21T14:00:00Z', last_activity_at: '2026-04-21T14:00:00Z' },
]

// ─── BILL NYE REPORTS ─────────────────────────────────────────────────────────

const DEMO_REPORTS: BillNyeReport[] = [
  {
    id: 'report-d01',
    cohort_id: 'demo',
    generated_at: '2026-03-27T08:00:00Z',
    title: 'Initial pattern analysis — Miami dental market',
    top_findings: [
      '42% of HOT leads came from LinkedIn in the first 30 days',
      'Tuesday outreach yields highest open rates in the Miami dental segment',
      'Pediatric dental practices show 1.8x faster pipeline velocity than general dental',
    ],
    html_content: '<p>Initial analysis of 28 leads captured in the first 30 days of operation. LinkedIn is the dominant acquisition channel with 42% of HOT leads. Tuesday outreach timing is performing 2x vs. other weekdays.</p>',
  },
  {
    id: 'report-d02',
    cohort_id: 'demo',
    generated_at: '2026-04-10T08:00:00Z',
    title: 'HOT rate climbing, Tuesday leads convert 2x',
    top_findings: [
      'HOT lead rate increased from 12% to 14.3% week-over-week',
      'Tuesday-sourced leads converting at 2.1x vs. baseline — sustained pattern',
      'Referral channel producing highest deal_tier average at $249',
    ],
    html_content: '<p>HOT rate continues to climb. Tuesday pattern is now statistically significant across 6 weeks of data. Referral channel outperforming all other sources on deal value.</p>',
  },
  {
    id: 'report-d03',
    cohort_id: 'demo',
    generated_at: '2026-04-19T08:00:00Z',
    title: 'LinkedIn saturation detected — rotate sources',
    top_findings: [
      'LinkedIn response rate dropped 31% over the past 2 weeks — saturation signal',
      'Recommend rotating to Google Maps scrape + referral push for next 14 days',
      'Pipeline aging: Aventura Cosmetic Dental at 8 days in Proposal Sent — needs follow-up',
    ],
    html_content: '<p>LinkedIn engagement has dropped sharply. Saturation detected in the Miami dental segment. Immediate source rotation recommended. One deal is aging in Proposal Sent and requires urgent follow-up.</p>',
  },
]

const AIW_REPORTS: BillNyeReport[] = [
  {
    id: 'report-a01',
    cohort_id: 'aiandwebservices',
    generated_at: '2026-04-22T08:00:00Z',
    title: 'First analysis — early pipeline patterns',
    top_findings: [
      'LinkedIn generating HOT leads faster than other channels in week 1',
      'Insurance and landscaping niches responding well to outbound sequencing',
      'Early pipeline velocity on track — audit scheduled rate at 33%',
    ],
    html_content: '<p>First Bill Nye analysis for the AIandWEBservices cohort. Early signals are positive. LinkedIn is performing as expected for B2B outreach. Insurance and landscaping verticals showing strong initial engagement.</p>',
  },
]

// ─── BOTS (shared structure, cohort_id set per use) ───────────────────────────

function makeBots(cohortId: Cohort): Bot[] {
  return [
    { id: `bot-${cohortId}-billnye`, cohort_id: cohortId, name: 'Bill Nye', role: 'Data Scientist', avatar_emoji: '🧪', last_run_at: '2026-04-24T06:00:00Z', last_output_summary: 'Analyzed 47 leads, surfaced 3 findings', decisions_this_week: 12 },
    { id: `bot-${cohortId}-coach`, cohort_id: cohortId, name: 'Coach', role: 'Meta Reviewer', avatar_emoji: '🎯', last_run_at: '2026-04-24T05:30:00Z', last_output_summary: 'Spotted source saturation in LinkedIn', decisions_this_week: 7 },
    { id: `bot-${cohortId}-factchecker`, cohort_id: cohortId, name: 'Fact Checker', role: 'Quality Gate', avatar_emoji: '✅', last_run_at: '2026-04-23T18:00:00Z', last_output_summary: 'Verified 22 business claims, rejected 3', decisions_this_week: 25 },
    { id: `bot-${cohortId}-researcher`, cohort_id: cohortId, name: 'Lead Researcher', role: 'Prospect Finder', avatar_emoji: '🔍', last_run_at: '2026-04-24T07:00:00Z', last_output_summary: 'Surfaced 14 new prospects', decisions_this_week: 14 },
    { id: `bot-${cohortId}-bob`, cohort_id: cohortId, name: 'Bob', role: 'Outreach Drafter', avatar_emoji: '✍️', last_run_at: '2026-04-24T07:30:00Z', last_output_summary: 'Drafted 18 personalized emails', decisions_this_week: 18 },
    { id: `bot-${cohortId}-scheduler`, cohort_id: cohortId, name: 'Scheduler', role: 'Pipeline Orchestrator', avatar_emoji: '⏱️', last_run_at: '2026-04-24T06:00:00Z', last_output_summary: 'Runs master_pipeline 3x daily at 8am/1pm/6pm', decisions_this_week: 21 },
    { id: `bot-${cohortId}-harvester`, cohort_id: cohortId, name: 'Harvester', role: 'Data Collector', avatar_emoji: '🌾', last_run_at: '2026-04-23T20:00:00Z', last_output_summary: 'Pulled 300 new business records', decisions_this_week: 3 },
    { id: `bot-${cohortId}-archivist`, cohort_id: cohortId, name: 'Archivist', role: 'Knowledge Base', avatar_emoji: '📚', last_run_at: '2026-04-24T04:00:00Z', last_output_summary: 'Indexed 47 leads to Qdrant', decisions_this_week: 9 },
  ]
}

// ─── FEED EVENTS ─────────────────────────────────────────────────────────────

const DEMO_FEED: FeedEvent[] = [
  { id: 'feed-d01', cohort_id: 'demo', timestamp: '2026-04-24T07:30:00Z', type: 'bot_run', title: 'Bill Nye generated weekly analysis', subtitle: 'LinkedIn saturation detected — rotate sources', icon: '🧪', drill_target: { type: 'report', id: 'report-d03' } },
  { id: 'feed-d02', cohort_id: 'demo', timestamp: '2026-04-24T07:00:00Z', type: 'lead_hot', title: 'HOT lead: Dr. Anna Patel', subtitle: 'Coral Gables Family Dental · LinkedIn', icon: '🔥', drill_target: { type: 'lead', id: 'lead-d01' } },
  { id: 'feed-d03', cohort_id: 'demo', timestamp: '2026-04-24T06:45:00Z', type: 'bot_run', title: 'Lead Researcher surfaced 14 new prospects', subtitle: 'Miami metro dental segment', icon: '🔍', drill_target: { type: 'bot', id: 'bot-demo-researcher' } },
  { id: 'feed-d04', cohort_id: 'demo', timestamp: '2026-04-24T06:00:00Z', type: 'bot_run', title: 'Bob drafted 18 personalized emails', subtitle: 'HOT + WARM segment · Sent to queue', icon: '✍️', drill_target: { type: 'bot', id: 'bot-demo-bob' } },
  { id: 'feed-d05', cohort_id: 'demo', timestamp: '2026-04-23T18:00:00Z', type: 'pipeline_move', title: 'Smith Family Dental moved to Proposal Sent', subtitle: 'Aventura Cosmetic Dental · $349 · 8 days in stage', icon: '📋', drill_target: { type: 'deal', id: 'deal-d05' } },
  { id: 'feed-d06', cohort_id: 'demo', timestamp: '2026-04-23T17:30:00Z', type: 'coach_alert', title: 'Coach flagged LinkedIn saturation', subtitle: 'Response rate down 31% — rotate to referral + Google Maps', icon: '🎯', drill_target: { type: 'bot', id: 'bot-demo-coach' } },
  { id: 'feed-d07', cohort_id: 'demo', timestamp: '2026-04-23T16:00:00Z', type: 'lead_new', title: 'New lead: Dr. Michael Reyes', subtitle: 'Biscayne Bay Orthodontics · LinkedIn', icon: '🆕', drill_target: { type: 'lead', id: 'lead-d02' } },
  { id: 'feed-d08', cohort_id: 'demo', timestamp: '2026-04-23T14:00:00Z', type: 'bot_run', title: 'Archivist indexed 47 leads to Qdrant', subtitle: 'Vector store updated · 47 records', icon: '📚', drill_target: { type: 'bot', id: 'bot-demo-archivist' } },
  { id: 'feed-d09', cohort_id: 'demo', timestamp: '2026-04-23T13:00:00Z', type: 'bot_run', title: 'Scheduler ran master_pipeline (1pm)', subtitle: '14 new leads discovered · 3 HOT scored', icon: '⏱️', drill_target: { type: 'bot', id: 'bot-demo-scheduler' } },
  { id: 'feed-d10', cohort_id: 'demo', timestamp: '2026-04-23T11:00:00Z', type: 'lead_hot', title: 'HOT lead: Dr. Carlos Rivera', subtitle: 'South Beach Dental Studio · website-form', icon: '🔥', drill_target: { type: 'lead', id: 'lead-d03' } },
  { id: 'feed-d11', cohort_id: 'demo', timestamp: '2026-04-23T09:30:00Z', type: 'pipeline_move', title: 'Pinecrest Oral Care → Audit Complete', subtitle: '$249 · 3 days in stage', icon: '✅', drill_target: { type: 'deal', id: 'deal-d04' } },
  { id: 'feed-d12', cohort_id: 'demo', timestamp: '2026-04-23T08:00:00Z', type: 'bot_run', title: 'Scheduler ran master_pipeline (8am)', subtitle: '9 new leads discovered · 1 HOT scored', icon: '⏱️', drill_target: { type: 'bot', id: 'bot-demo-scheduler' } },
  { id: 'feed-d13', cohort_id: 'demo', timestamp: '2026-04-22T18:00:00Z', type: 'bot_run', title: 'Fact Checker verified 22 records', subtitle: '3 rejected · 19 passed to pipeline', icon: '✅', drill_target: { type: 'bot', id: 'bot-demo-factchecker' } },
  { id: 'feed-d14', cohort_id: 'demo', timestamp: '2026-04-22T16:00:00Z', type: 'revenue', title: 'Smith Family Dental billing renewed', subtitle: '$149 MRR · Active since Aug 2025', icon: '💰', drill_target: { type: 'deal', id: 'deal-d06' } },
]

const AIW_FEED: FeedEvent[] = [
  { id: 'feed-a01', cohort_id: 'aiandwebservices', timestamp: '2026-04-23T10:00:00Z', type: 'lead_hot', title: 'HOT lead: Torres Insurance, Doral', subtitle: 'Miguel Torres · LinkedIn · $249 tier', icon: '🔥', drill_target: { type: 'lead', id: 'lead-a01' } },
  { id: 'feed-a02', cohort_id: 'aiandwebservices', timestamp: '2026-04-22T08:00:00Z', type: 'bill_nye_finding', title: 'Bill Nye ran first analysis', subtitle: 'LinkedIn performing well — insurance + landscaping responding', icon: '🧪', drill_target: { type: 'report', id: 'report-a01' } },
  { id: 'feed-a03', cohort_id: 'aiandwebservices', timestamp: '2026-04-21T14:00:00Z', type: 'lead_new', title: 'New lead: Green Horizons Landscaping', subtitle: 'Carlos Mendez · website-form', icon: '🆕', drill_target: { type: 'lead', id: 'lead-a02' } },
  { id: 'feed-a04', cohort_id: 'aiandwebservices', timestamp: '2026-04-21T10:00:00Z', type: 'bot_run', title: 'Scheduler ran first master_pipeline', subtitle: '6 leads discovered across insurance, landscaping, restaurant', icon: '⏱️', drill_target: { type: 'bot', id: 'bot-aiandwebservices-scheduler' } },
]

// ─── EXPORTS ──────────────────────────────────────────────────────────────────

export function getFeedForCohort(cohortId: Cohort): FeedEvent[] {
  return cohortId === 'demo' ? DEMO_FEED : AIW_FEED
}

export function getLeadsForCohort(cohortId: Cohort): Lead[] {
  return cohortId === 'demo' ? DEMO_LEADS : AIW_LEADS
}

export function getDealsForCohort(cohortId: Cohort): Deal[] {
  return cohortId === 'demo' ? DEMO_DEALS : AIW_DEALS
}

export function getBotsForCohort(cohortId: Cohort): Bot[] {
  return makeBots(cohortId)
}

export function getReportsForCohort(cohortId: Cohort): BillNyeReport[] {
  return cohortId === 'demo' ? DEMO_REPORTS : AIW_REPORTS
}
