'use client';
import { useState, useEffect } from 'react';

/**
 * Dual-write hook: reads from EspoCRM when available, writes to both
 * EspoCRM and local storage so the admin works in demo mode too.
 *
 * Fetch functions always attempt the API and return null on failure.
 * Write functions are guarded by espoAvailable so no spurious API calls
 * fire when EspoCRM is unreachable.
 */
export function useEspoCRMSync(dealerSlug) {
  const [espoAvailable, setEspoAvailable] = useState(false);
  const apiBase = `/api/dealer/${dealerSlug}/admin`;

  // Probe EspoCRM availability on mount via the lightweight stats endpoint.
  useEffect(() => {
    fetch(`${apiBase}/stats`)
      .then(r => { if (r.ok) setEspoAvailable(true); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── read helpers ─────────────────────────────────────────────────────────
  // These always attempt the API (no espoAvailable guard) so the init effect
  // can run them immediately on mount. Return null on any failure so the
  // caller can fall back to storage / seed data.

  async function fetchVehicles() {
    try {
      const res = await fetch(`${apiBase}/vehicles`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.ok) setEspoAvailable(true);
      return data.vehicles ?? null;
    } catch { return null; }
  }

  async function fetchLeads() {
    try {
      const res = await fetch(`${apiBase}/leads`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.leads ?? null;
    } catch { return null; }
  }

  async function fetchAppointments() {
    try {
      const res = await fetch(`${apiBase}/appointments`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.appointments ?? null;
    } catch { return null; }
  }

  async function fetchReservations() {
    try {
      const res = await fetch(`${apiBase}/reservations`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.reservations ?? null;
    } catch { return null; }
  }

  async function fetchStats() {
    try {
      const res = await fetch(`${apiBase}/stats`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data.ok) setEspoAvailable(true);
      return data.stats ?? null;
    } catch { return null; }
  }

  // ── write helpers ─────────────────────────────────────────────────────────
  // All guarded by espoAvailable — fire-and-forget, caller doesn't await.
  // Map local field names to EspoCRM names (cost → costBasis).

  async function saveVehicle(vehicle) {
    if (!espoAvailable) return;
    try {
      const payload = { ...vehicle, costBasis: vehicle.cost ?? vehicle.costBasis };
      if (vehicle.espoId) {
        await fetch(`${apiBase}/vehicles/${vehicle.espoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        const res = await fetch(`${apiBase}/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        return data.vehicleId;
      }
    } catch (e) {
      console.warn('[EspoCRM] vehicle save failed:', e.message);
    }
  }

  async function saveLead(lead) {
    if (!espoAvailable) return;
    try {
      await fetch(`${apiBase}/leads`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.espoId || lead.id, ...lead }),
      });
    } catch (e) {
      console.warn('[EspoCRM] lead save failed:', e.message);
    }
  }

  async function saveAppointment(appt) {
    if (!espoAvailable) return;
    try {
      if (appt.espoId) {
        await fetch(`${apiBase}/appointments`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId: appt.espoId, ...appt }),
        });
      } else {
        await fetch(`${apiBase}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appt),
        });
      }
    } catch (e) {
      console.warn('[EspoCRM] appointment save failed:', e.message);
    }
  }

  async function saveReservation(reservationId, action) {
    if (!espoAvailable) return;
    try {
      await fetch(`${apiBase}/reservations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, action }),
      });
    } catch (e) {
      console.warn('[EspoCRM] reservation save failed:', e.message);
    }
  }

  async function deleteVehicle(espoId) {
    if (!espoAvailable || !espoId) return;
    try {
      await fetch(`${apiBase}/vehicles/${espoId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('[EspoCRM] vehicle delete failed:', e.message);
    }
  }

  async function bulkVehicleAction(action, ids, params = {}) {
    if (!espoAvailable) return;
    try {
      await fetch(`${apiBase}/vehicles/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids, ...params }),
      });
    } catch (e) {
      console.warn('[EspoCRM] bulk action failed:', e.message);
    }
  }

  return {
    espoAvailable,
    fetchVehicles, fetchLeads, fetchAppointments,
    fetchReservations, fetchStats,
    saveVehicle, saveLead, saveAppointment,
    saveReservation, deleteVehicle, bulkVehicleAction,
  };
}
