import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL = "Sam@mitigationrestorationservice.co.site";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const name = data.get("name") as string;
    const phone = data.get("phone") as string;
    const email = data.get("email") as string;
    const address = data.get("address") as string;
    const propertyType = data.get("propertyType") as string;
    const damageTypes = data.get("damageTypes") as string;
    const urgency = data.get("urgency") as string;
    const insuranceClaim = data.get("insuranceClaim") as string;
    const insuranceCompany = data.get("insuranceCompany") as string;
    const damageTime = data.get("damageTime") as string;
    const areaSize = data.get("areaSize") as string;
    const description = data.get("description") as string;
    const contactMethod = data.get("contactMethod") as string;
    const bestTime = data.get("bestTime") as string;

    const urgencyEmoji = urgency === "emergency" ? "🚨 EMERGENCY" : urgency === "urgent" ? "⚠️ Urgent" : "📅 Scheduled";

    const html = `
<h2 style="color:#0d1f42">New MRS Emergency Request</h2>
<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold;width:180px">Urgency</td><td style="padding:8px 12px">${urgencyEmoji}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Name</td><td style="padding:8px 12px">${name}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Phone</td><td style="padding:8px 12px">${phone}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Email</td><td style="padding:8px 12px">${email || "—"}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Address</td><td style="padding:8px 12px">${address || "—"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Property Type</td><td style="padding:8px 12px">${propertyType}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Damage Types</td><td style="padding:8px 12px">${damageTypes}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">When Occurred</td><td style="padding:8px 12px">${damageTime || "—"}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Area Size</td><td style="padding:8px 12px">${areaSize || "—"}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold">Insurance Claim</td><td style="padding:8px 12px">${insuranceClaim || "—"}${insuranceCompany ? ` — ${insuranceCompany}` : ""}</td></tr>
  <tr style="background:#f3f4f6"><td style="padding:8px 12px;font-weight:bold">Preferred Contact</td><td style="padding:8px 12px">${contactMethod}${bestTime ? ` — ${bestTime}` : ""}</td></tr>
  <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top">Description</td><td style="padding:8px 12px">${description.replace(/\n/g, "<br>")}</td></tr>
</table>
<p style="color:#666;font-size:12px;margin-top:16px">Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET</p>
`;

    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "MRS Website <onboarding@resend.dev>",
          to: [TO_EMAIL],
          subject: `${urgencyEmoji} — MRS Request from ${name} (${phone})`,
          html,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("Resend error:", err);
        throw new Error("Email delivery failed");
      }
    } else {
      // No API key — log submission so it still appears in Vercel function logs
      console.log("📋 MRS Form Submission (no RESEND_API_KEY set):", {
        urgency, name, phone, email, address, propertyType, damageTypes,
        damageTime, areaSize, insuranceClaim, insuranceCompany,
        contactMethod, bestTime, description,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
