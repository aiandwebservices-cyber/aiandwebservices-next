"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { getUTMs } from "@/lib/utm";

const PHONE = "(754) 777-8956";
const PHONE_HREF = "tel:+17547778956";

const DAMAGE_TYPES = ["Water Damage", "Fire & Smoke", "Mold", "Storm & Wind", "Sewage & Biohazard", "Other"];

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  propertyType: string;
  damageTypes: string[];
  urgency: string;
  insuranceClaim: string;
  insuranceCompany: string;
  damageTime: string;
  areaSize: string;
  description: string;
  contactMethod: string;
  bestTime: string;
  photos: File[];
}

const empty: FormData = {
  name: "", phone: "", email: "", address: "",
  propertyType: "", damageTypes: [], urgency: "",
  insuranceClaim: "", insuranceCompany: "", damageTime: "",
  areaSize: "", description: "", contactMethod: "", bestTime: "", photos: [],
};

function formatPhone(val: string) {
  const digits = val.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

export default function EmergencyForm() {
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  }

  function toggleDamage(type: string) {
    setForm(f => ({
      ...f,
      damageTypes: f.damageTypes.includes(type)
        ? f.damageTypes.filter(d => d !== type)
        : [...f.damageTypes, type]
    }));
    setErrors(e => ({ ...e, damageTypes: "" }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g,"").length < 10) e.phone = "Valid phone number required";
    if (!form.propertyType) e.propertyType = "Select property type";
    if (form.damageTypes.length === 0) e.damageTypes = "Select at least one damage type";
    if (!form.urgency) e.urgency = "Select urgency level";
    if (!form.contactMethod) e.contactMethod = "Select a preferred contact method";
    if (!form.description.trim()) e.description = "Please describe your situation";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const utms = getUTMs();
      const jsonPayload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        propertyType: form.propertyType,
        damageTypes: form.damageTypes,
        urgency: form.urgency,
        insuranceClaim: form.insuranceClaim,
        insuranceCompany: form.insuranceCompany,
        damageTime: form.damageTime,
        areaSize: form.areaSize,
        description: form.description,
        contactMethod: form.contactMethod,
        bestTime: form.bestTime,
        utm_source: utms.utm_source,
        utm_medium: utms.utm_medium,
        utm_campaign: utms.utm_campaign,
        source_url: typeof window !== "undefined" ? window.location.href : "",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonPayload),
      });

      const result = await res.json().catch(() => ({})) as { deal_id?: number };

      if (!res.ok) {
        console.error("Submit failed:", result);
      }

      // Upload photos separately if present and we got a deal_id
      if (form.photos.length > 0 && result.deal_id) {
        try {
          const photoData = new FormData();
          photoData.append("deal_id", String(result.deal_id));
          form.photos.forEach(f => photoData.append("photos", f));
          await fetch("/api/upload-photos", { method: "POST", body: photoData });
        } catch (e) {
          console.error("Photo upload failed (lead still captured):", e);
        }
      }

      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please call us directly at " + PHONE);
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h3 style={{ color: "var(--navy)", fontSize: "1.5rem", marginBottom: "0.75rem" }}>Request Received!</h3>
        <p style={{ color: "var(--gray-mid)", marginBottom: "1rem" }}>
          We&apos;ve received your request and will contact you shortly.
        </p>
        <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>
          For immediate assistance, call us now:&nbsp;
          <a href={PHONE_HREF} className="phone-link" style={{ fontSize: "1.3rem" }}>{PHONE}</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Row 1: Name, Phone, Email */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0 1rem" }}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input id="name" type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="John Smith" />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input id="phone" type="tel" value={form.phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => set("phone", formatPhone(e.target.value))}
            placeholder="(305) 555-0100" />
          {errors.phone && <p className="error-msg">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email (optional)</label>
          <input id="email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="john@email.com" />
        </div>
      </div>

      {/* Row 2: Property Type + Address */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 1rem" }}>
        <div className="form-group">
          <label htmlFor="propertyType">Property Type *</label>
          <select id="propertyType" value={form.propertyType} onChange={e => set("propertyType", e.target.value)}>
            <option value="">Select...</option>
            <option>Residential</option>
            <option>Condo / HOA</option>
            <option>Commercial</option>
            <option>Multi-Unit</option>
            <option>Other</option>
          </select>
          {errors.propertyType && <p className="error-msg">{errors.propertyType}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="address">Property Address (optional)</label>
          <input id="address" type="text" value={form.address} onChange={e => set("address", e.target.value)} placeholder="123 Main St, Fort Lauderdale, FL 33301" />
        </div>
      </div>

      {/* When + Affected Area */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0 1rem" }}>
        <div className="form-group">
          <label htmlFor="damageTime">When did the damage occur?</label>
          <select id="damageTime" value={form.damageTime} onChange={e => set("damageTime", e.target.value)}>
            <option value="">Select...</option>
            <option>Within the last few hours</option>
            <option>Today</option>
            <option>Yesterday</option>
            <option>This week</option>
            <option>More than a week ago</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="areaSize">Affected Area Size</label>
          <select id="areaSize" value={form.areaSize} onChange={e => set("areaSize", e.target.value)}>
            <option value="">Select...</option>
            <option>Small (single room)</option>
            <option>Medium (multiple rooms)</option>
            <option>Large (entire floor/building)</option>
            <option>Not sure</option>
          </select>
        </div>
      </div>

      {/* Damage types */}
      <div className="form-group">
        <label>Type of Damage * (select all that apply)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.6rem" }}>
          {DAMAGE_TYPES.map(type => {
            const selected = form.damageTypes.includes(type);
            return (
              <label key={type} style={{
                display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, cursor: "pointer",
                background: selected ? "var(--navy)" : "#fff",
                color: selected ? "#fff" : "var(--navy)",
                border: `2px solid ${selected ? "var(--navy)" : "#3b82f6"}`,
                padding: "0.25rem 0.6rem", borderRadius: 20, fontSize: "0.8rem", transition: "all 0.2s",
              }}>
                <input type="checkbox" checked={selected} onChange={() => toggleDamage(type)} style={{ width: "auto", display: "none" }} />
                {type}
              </label>
            );
          })}
        </div>
        {errors.damageTypes && <p className="error-msg">{errors.damageTypes}</p>}
      </div>

      {/* Urgency */}
      <div className="form-group">
        <label>Urgency Level *</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginTop: "0.25rem" }}>
          {[
            ["emergency", "🚨", "Emergency", "Need help NOW"],
            ["urgent",    "⚠️", "Urgent",    "Within 24 hours"],
            ["scheduled", "📅", "Scheduled", "Planning ahead"],
          ].map(([val, icon, title, sub]) => {
            const selected = form.urgency === val;
            return (
              <label key={val} style={{
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
                cursor: "pointer", padding: "0.75rem 0.5rem", borderRadius: 8, transition: "all 0.2s",
                background: selected ? "var(--navy)" : "#fff",
                color: selected ? "#fff" : "var(--navy)",
                border: `2px solid ${selected ? "var(--navy)" : "#3b82f6"}`,
                fontWeight: 600,
              }}>
                <input type="radio" name="urgency" value={val} checked={selected} onChange={e => set("urgency", e.target.value)} style={{ display: "none" }} />
                <span style={{ fontSize: "1.4rem", marginBottom: "0.2rem" }}>{icon}</span>
                <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>{title}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.8, marginTop: "0.1rem" }}>{sub}</span>
              </label>
            );
          })}
        </div>
        {errors.urgency && <p className="error-msg">{errors.urgency}</p>}
      </div>

      {/* Insurance */}
      <div className="form-group">
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.75rem 1.5rem" }}>
          <label style={{ margin: 0, whiteSpace: "nowrap" }}>Is this an insurance claim?</label>
          {["Yes", "No", "Not sure"].map(v => (
            <label key={v} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 400, cursor: "pointer", margin: 0 }}>
              <input type="radio" name="insuranceClaim" value={v} checked={form.insuranceClaim === v} onChange={e => set("insuranceClaim", e.target.value)} style={{ width: "auto" }} />
              {v}
            </label>
          ))}
        </div>
      </div>
      {form.insuranceClaim === "Yes" && (
        <div className="form-group">
          <label htmlFor="insuranceCompany">Insurance Company</label>
          <input id="insuranceCompany" type="text" value={form.insuranceCompany} onChange={e => set("insuranceCompany", e.target.value)} placeholder="e.g. Citizens Insurance, State Farm..." />
        </div>
      )}

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Describe Your Situation *</label>
        <textarea id="description" rows={4} value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="Tell us what happened — what type of damage, how it started, what areas are affected, and anything else we should know to help you faster." />
        {errors.description && <p className="error-msg">{errors.description}</p>}
      </div>

      {/* Contact prefs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0 1rem" }}>
        <div className="form-group">
          <label>Preferred Contact Method *</label>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
            {["Phone Call", "Text Message", "Email"].map(v => (
              <label key={v} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 400, cursor: "pointer" }}>
                <input type="radio" name="contactMethod" value={v} checked={form.contactMethod === v} onChange={e => set("contactMethod", e.target.value)} style={{ width: "auto" }} />
                {v}
              </label>
            ))}
          </div>
          {errors.contactMethod && <p className="error-msg">{errors.contactMethod}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="bestTime">Best Time to Reach You</label>
          <select id="bestTime" value={form.bestTime} onChange={e => set("bestTime", e.target.value)}>
            <option value="">Select...</option>
            <option>ASAP</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </div>
      </div>

      {/* Photo upload */}
      <div className="form-group">
        <label htmlFor="photos">Upload Photos of the Damage (optional)</label>
        <input id="photos" type="file" accept=".jpg,.jpeg,.png,.heic" multiple
          onChange={e => setForm(f => ({ ...f, photos: Array.from(e.target.files || []) }))}
          style={{ padding: "0.4rem" }} />
        <p style={{ fontSize: "0.8rem", color: "var(--gray-mid)", marginTop: "0.25rem" }}>
          Accepted: JPG, PNG, HEIC — Helps our team assess severity before arrival
        </p>
      </div>

      <button type="submit" className="btn-red" disabled={loading}
        style={{ width: "100%", padding: "1rem", fontSize: "1.1rem", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}>
        {loading ? "Submitting..." : "Get Help Now →"}
      </button>

      <p style={{ textAlign: "center", marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--gray-mid)" }}>
        ⏱ Average response time: under 60 minutes &nbsp;|&nbsp;
        <a href={PHONE_HREF} className="phone-link">{PHONE}</a>
      </p>
    </form>
  );
}
