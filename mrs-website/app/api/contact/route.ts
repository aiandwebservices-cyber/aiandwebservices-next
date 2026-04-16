import { NextRequest, NextResponse } from "next/server";
import { createLeadInPipedrive, LeadInput } from "@/lib/pipedrive";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

const TO_EMAIL = "Sam@mitigationrestorationservice.co.site";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// ─── Email helper ─────────────────────────────────────────────────────────────

async function sendEmailNotification(
  fields: {
    name: string; phone: string; email: string; address: string;
    propertyType: string; damageTypes: string; urgency: string;
    insuranceClaim: string; insuranceCompany: string; damageTime: string;
    areaSize: string; description: string; contactMethod: string;
    bestTime: string; utmSource: string; utmMedium: string;
    utmCampaign: string; sourceUrl: string;
  },
  photoCount: number,
  dealUrl?: string
): Promise<void> {
  const urgencyEmoji =
    fields.urgency === "emergency" ? "🚨 EMERGENCY" :
    fields.urgency === "urgent"    ? "⚠️ Urgent"    : "📅 Scheduled";

  const pipedriveButton = dealUrl
    ? `<p style="margin-bottom:16px"><a href="${dealUrl}" style="background:#0d1f42;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-family:sans-serif;font-size:14px;font-weight:bold">🔗 View in Pipedrive</a></p>`
    : "";

  const html = `
${pipedriveButton}
<h2 style="color:#0d1f42">New MRS Emergency Request</h2>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold;width:180px">Urgency</td><td style="padding:8px 12px">${urgencyEmoji}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Name</td><td style="padding:8px 12px">${fields.name}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Phone</td><td style="padding:8px 12px">${fields.phone}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Email</td><td style="padding:8px 12px">${fields.email || "—"}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Address</td><td style="padding:8px 12px">${fields.address || "—"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Property Type</td><td style="padding:8px 12px">${fields.propertyType}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Damage Types</td><td style="padding:8px 12px">${fields.damageTypes}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">When Occurred</td><td style="padding:8px 12px">${fields.damageTime || "—"}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Area Size</td><td style="padding:8px 12px">${fields.areaSize || "—"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Insurance Claim</td><td style="padding:8px 12px">${fields.insuranceClaim || "—"}${fields.insuranceCompany ? ` — ${fields.insuranceCompany}` : ""}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Preferred Contact</td><td style="padding:8px 12px">${fields.contactMethod}${fields.bestTime ? ` — ${fields.bestTime}` : ""}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top">Description</td><td style="padding:8px 12px">${fields.description.replace(/\n/g, "<br>")}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Photos Attached</td><td style="padding:8px 12px">${photoCount}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">UTM Source</td><td style="padding:8px 12px">${fields.utmSource || "—"}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">UTM Medium</td><td style="padding:8px 12px">${fields.utmMedium || "—"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">UTM Campaign</td><td style="padding:8px 12px">${fields.utmCampaign || "—"}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Source URL</td><td style="padding:8px 12px">${fields.sourceUrl || "—"}</td></tr>
</table>
<p style="color:#666;font-size:12px;margin-top:16px">Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</p>
`;

  if (!RESEND_API_KEY) {
    console.log("📋 MRS Form Submission (no RESEND_API_KEY set):", fields);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "MRS Website <onboarding@resend.dev>",
      to: [TO_EMAIL],
      subject: `${urgencyEmoji} — MRS Request from ${fields.name} (${fields.phone})`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get("content-type") || "";
    console.log("[contact] content-type:", ct);

    let data: FormData;
    try {
      data = await req.formData();
    } catch (e) {
      console.error("[contact] formData parse failed:", e);
      return NextResponse.json({
        ok: false,
        error: `Request body parse failed: ${e instanceof Error ? e.message : String(e)}`,
        contentType: ct,
        debug: true,
      }, { status: 400 });
    }

    // Debug: log all form keys + first 30 chars of each value
    const debugKeys: Record<string, string> = {};
    for (const [k, v] of data.entries()) {
      if (typeof v === "string") {
        debugKeys[k] = v.length > 30 ? v.slice(0, 30) + "..." : v;
      } else {
        debugKeys[k] = `[File ${(v as File).name} ${(v as File).size}b]`;
      }
    }
    console.log("[contact] parsed keys:", JSON.stringify(debugKeys));

    const fields = {
      name:             (data.get("name")            as string) ?? "",
      phone:            (data.get("phone")           as string) ?? "",
      email:            (data.get("email")           as string) ?? "",
      address:          (data.get("address")         as string) ?? "",
      propertyType:     (data.get("propertyType")    as string) ?? "",
      damageTypes:      (data.get("damageTypes")     as string) ?? "",
      urgency:          (data.get("urgency")         as string) ?? "",
      insuranceClaim:   (data.get("insuranceClaim")  as string) ?? "",
      insuranceCompany: (data.get("insuranceCompany") as string) ?? "",
      damageTime:       (data.get("damageTime")      as string) ?? "",
      areaSize:         (data.get("areaSize")        as string) ?? "",
      description:      (data.get("description")     as string) ?? "",
      contactMethod:    (data.get("contactMethod")   as string) ?? "",
      bestTime:         (data.get("bestTime")        as string) ?? "",
      utmSource:        (data.get("utm_source")      as string) ?? "",
      utmMedium:        (data.get("utm_medium")      as string) ?? "",
      utmCampaign:      (data.get("utm_campaign")    as string) ?? "",
      sourceUrl:        (data.get("source_url")      as string) ?? "",
    };

    const photos = data.getAll("photos").filter(f => f instanceof File) as File[];

    const damageTypesArr = fields.damageTypes
      .split(",").map(s => s.trim()).filter(Boolean);

    const leadInput: LeadInput = {
      name:             fields.name,
      phone:            fields.phone,
      email:            fields.email || undefined,
      address:          fields.address || undefined,
      propertyType:     fields.propertyType,
      damageTypes:      damageTypesArr,
      urgency:          fields.urgency,
      insuranceClaim:   fields.insuranceClaim || undefined,
      insuranceCompany: fields.insuranceCompany || undefined,
      damageTime:       fields.damageTime || undefined,
      areaSize:         fields.areaSize || undefined,
      description:      fields.description,
      contactMethod:    fields.contactMethod,
      bestTime:         fields.bestTime || undefined,
      utmSource:        fields.utmSource || undefined,
      utmMedium:        fields.utmMedium || undefined,
      utmCampaign:      fields.utmCampaign || undefined,
      sourceUrl:        fields.sourceUrl || undefined,
    };

    // Run Pipedrive + email in parallel
    const [pdResult, emailResult] = await Promise.allSettled([
      createLeadInPipedrive(leadInput, photos),
      // Email runs after we know dealUrl — handled below via placeholder
      Promise.resolve(null),
    ]);

    let dealUrl: string | undefined;
    let photoCount = 0;

    if (pdResult.status === "fulfilled" && pdResult.value) {
      dealUrl = pdResult.value.dealUrl;
      photoCount = pdResult.value.photoCount;
      console.log(`[pipedrive] ✅ success — dealUrl: ${dealUrl}, personId: ${pdResult.value.personId}, dealId: ${pdResult.value.dealId}, photos: ${photoCount}`);
    } else if (pdResult.status === "rejected") {
      console.error("[pipedrive] ❌ failed:", pdResult.reason);
    }

    // Now send email with dealUrl if available
    const emailResultFinal = await sendEmailNotification(fields, photoCount, dealUrl)
      .then(() => {
        console.log("[email] ✅ sent");
        return true;
      })
      .catch((err) => {
        console.error("[email] ❌ failed:", err);
        return false;
      });

    const pipedriveOk = pdResult.status === "fulfilled";
    const emailOk = emailResultFinal;

    if (!pipedriveOk && !emailOk) {
      return NextResponse.json({ ok: false, error: "Both CRM and email failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, pipedrive: pipedriveOk, email: emailOk });

  } catch (err) {
    console.error("[contact] unexpected error:", err);
    const errMsg = err instanceof Error ? err.message : String(err);
    const errStack = err instanceof Error ? err.stack?.split('\n').slice(0,5).join('\n') : undefined;
    console.error("[contact] full stack:", errStack);
    return NextResponse.json({
      ok: false,
      error: errMsg,
      stack: errStack,
      debug: true,
    }, { status: 500 });
  }
}
