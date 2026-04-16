import fields from './pipedrive-fields.json';

export interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  propertyType: string;
  damageTypes: string[];
  urgency: string;
  insuranceClaim?: string;
  insuranceCompany?: string;
  damageTime?: string;
  areaSize?: string;
  description: string;
  contactMethod: string;
  bestTime?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  sourceUrl?: string;
}

const BASE = `https://${process.env.PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/v1`;
const TOKEN = () => process.env.PIPEDRIVE_API_TOKEN ?? '';

const f = fields.fields;
const o = fields.options;

// --- Option mappers ---

function serviceTypeId(damageType: string): number | undefined {
  const map: Record<string, number | undefined> = {
    'Water Damage':        o.serviceType.waterDamage,
    'Fire & Smoke':        o.serviceType.fireDamage,
    'Mold':                o.serviceType.moldRemediation,
    'Storm & Wind':        o.serviceType.stormDamage,
    'Sewage & Biohazard':  o.serviceType.biohazard,
    'Other':               o.serviceType.other,
  };
  return map[damageType];
}

function propertyTypeId(val: string): number | undefined {
  const map: Record<string, number | undefined> = {
    'Residential':  o.propertyType.residential,
    'Condo / HOA':  o.propertyType.residential,
    'Commercial':   o.propertyType.commercial,
    'Multi-Unit':   o.propertyType.multifamily,
    'Other':        undefined,
  };
  return map[val];
}

function urgencyId(val: string): number | undefined {
  const map: Record<string, number | undefined> = {
    emergency: o.emergencyLevel.emergency24hr,
    urgent:    o.emergencyLevel.urgent48hr,
    scheduled: o.emergencyLevel.routine,
  };
  return map[val];
}

function insuranceId(val: string): number | undefined {
  const map: Record<string, number | undefined> = {
    'Yes':      o.insuranceClaim.yes,
    'No':       o.insuranceClaim.no,
    'Not sure': o.insuranceClaim.unsure,
  };
  return map[val];
}

function contactMethodId(val: string): number | undefined {
  const map: Record<string, number | undefined> = {
    'Phone Call':    o.preferredContactMethod.phone,
    'Text Message':  (o.preferredContactMethod as Record<string, number>)['textsms'],
    'Email':         o.preferredContactMethod.email,
  };
  return map[val];
}

function bestTimeId(val: string): number | undefined {
  const map: Record<string, number | undefined> = {
    'ASAP':      o.bestTimeToContact.anytime,
    'Morning':   o.bestTimeToContact.morning,
    'Afternoon': o.bestTimeToContact.afternoon,
    'Evening':   o.bestTimeToContact.evening,
  };
  return map[val];
}

// --- Helpers ---

function strip<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

async function apiPost(path: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const res = await fetch(`${BASE}${path}?api_token=${TOKEN()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { success: boolean; data: Record<string, unknown>; error?: string };
  if (!json.success) throw new Error(json.error ?? `API error on ${path}`);
  return json.data;
}

// --- Main export ---

export async function createLeadInPipedrive(
  input: LeadInput,
  photos: File[]
): Promise<{ personId: number; dealId: number; dealUrl: string; photoCount: number }> {
  const primaryDamage = input.damageTypes[0] ?? 'Other';
  const extraDamages  = input.damageTypes.slice(1);

  // Build enhanced description
  const descParts: string[] = [input.description];
  if (extraDamages.length > 0)   descParts.push(`Additional damage types: ${extraDamages.join(', ')}`);
  if (input.damageTime)          descParts.push(`Damage time: ${input.damageTime}`);
  if (input.areaSize)            descParts.push(`Affected area: ${input.areaSize}`);
  if (input.insuranceCompany)    descParts.push(`Insurance company: ${input.insuranceCompany}`);
  const noteContent = descParts.join('\n');

  // --- Step A: Create Person ---
  const personBody = strip({
    name: input.name,
    phone: [{ value: input.phone, primary: true, label: 'mobile' }],
    email: input.email ? [{ value: input.email, primary: true, label: 'work' }] : undefined,
    [f.person.preferredContactMethod]: contactMethodId(input.contactMethod),
    [f.person.bestTimeToContact]:      input.bestTime ? bestTimeId(input.bestTime) : undefined,
    [f.person.leadSourceDetail]:       input.sourceUrl ?? undefined,
  });

  const person = await apiPost('/persons', personBody as Record<string, unknown>);
  const personId = person.id as number;

  // --- Step B: Create Deal ---
  const title = `${primaryDamage} - ${input.address ?? input.name}`;

  const dealBody = strip({
    title,
    person_id:                       personId,
    stage_id:                        fields.stages.newLead,
    [f.deal.serviceType]:            serviceTypeId(primaryDamage),
    [f.deal.emergencyLevel]:         urgencyId(input.urgency),
    [f.deal.propertyType]:           propertyTypeId(input.propertyType),
    [f.deal.propertyAddress]:        input.address ?? undefined,
    [f.deal.insuranceClaim]:         input.insuranceClaim ? insuranceId(input.insuranceClaim) : undefined,
    [f.deal.insuranceCarrier]:       input.insuranceCompany ?? undefined,
    [f.deal.leadSource]:             o.leadSource.websiteForm,
    [f.deal.utmSource]:              input.utmSource ?? undefined,
    [f.deal.utmMedium]:              input.utmMedium ?? undefined,
    [f.deal.utmCampaign]:            input.utmCampaign ?? undefined,
  });

  const deal = await apiPost('/deals', dealBody as Record<string, unknown>);
  const dealId = deal.id as number;

  // --- Step C: Note (best-effort) ---
  try {
    await apiPost('/notes', { content: noteContent, deal_id: dealId });
  } catch (err) {
    console.error('[pipedrive] note failed:', err);
  }

  // --- Step D: Photos (best-effort) ---
  let photoCount = 0;
  for (const photo of photos) {
    try {
      const form = new FormData();
      form.append('file', photo);
      form.append('deal_id', String(dealId));
      const res = await fetch(`${BASE}/files?api_token=${TOKEN()}`, {
        method: 'POST',
        body: form,
      });
      const json = (await res.json()) as { success: boolean };
      if (json.success) photoCount++;
    } catch (err) {
      console.error('[pipedrive] photo upload failed:', err);
    }
  }

  return {
    personId,
    dealId,
    dealUrl: `https://${process.env.PIPEDRIVE_COMPANY_DOMAIN}.pipedrive.com/deal/${dealId}`,
    photoCount,
  };
}
