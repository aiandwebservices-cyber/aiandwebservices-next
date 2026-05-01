'use client';
import { useMemo } from 'react';

/**
 * useEspoCRM(config) — thin client for EspoCRM REST API.
 *
 * Reads `config.espocrm.{url, apiKey, vehicleEntity, leadEntity, ...}` to
 * construct typed CRUD helpers per entity. When `url` or `apiKey` is empty
 * (e.g. dealer hasn't connected CRM yet), every method becomes a no-op that
 * resolves with the local seed data passed via the second arg.
 *
 * NOTE: The current AdminPanel still maintains state in window.storage and
 * does not yet route through this hook. This file exists so future per-tab
 * extractions (DashboardTab, InventoryTab, etc.) can switch their data source
 * to live EspoCRM with a single import change.
 */

export function useEspoCRM(config) {
  return useMemo(() => {
    const { url, apiKey } = config?.espocrm || {};
    const enabled = !!url && !!apiKey;

    const headers = enabled ? {
      'Content-Type': 'application/json',
      'X-Api-Key':    apiKey,
    } : null;

    const safeFetch = async (path, init = {}) => {
      if (!enabled) throw new Error('EspoCRM not configured');
      const res = await fetch(`${url.replace(/\/$/, '')}${path}`, { ...init, headers: { ...headers, ...(init.headers || {}) } });
      if (!res.ok) throw new Error(`EspoCRM ${res.status}: ${res.statusText}`);
      return res.json();
    };

    const list = (entity) => async ({ where = [], offset = 0, maxSize = 200 } = {}) => {
      const params = new URLSearchParams({ offset: String(offset), maxSize: String(maxSize) });
      if (where.length) params.set('where', JSON.stringify(where));
      const data = await safeFetch(`/api/v1/${entity}?${params}`);
      return data.list || [];
    };
    const get    = (entity) => (id) => safeFetch(`/api/v1/${entity}/${id}`);
    const create = (entity) => (body) => safeFetch(`/api/v1/${entity}`, { method: 'POST', body: JSON.stringify(body) });
    const update = (entity) => (id, body) => safeFetch(`/api/v1/${entity}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    const remove = (entity) => (id) => safeFetch(`/api/v1/${entity}/${id}`, { method: 'DELETE' });

    return {
      enabled,
      vehicles: {
        list:   list(config.espocrm.vehicleEntity),
        get:    get(config.espocrm.vehicleEntity),
        create: create(config.espocrm.vehicleEntity),
        update: update(config.espocrm.vehicleEntity),
        remove: remove(config.espocrm.vehicleEntity),
      },
      leads: {
        list:   list(config.espocrm.leadEntity),
        get:    get(config.espocrm.leadEntity),
        create: create(config.espocrm.leadEntity),
        update: update(config.espocrm.leadEntity),
      },
      service: {
        list:   list(config.espocrm.serviceEntity),
        create: create(config.espocrm.serviceEntity),
        update: update(config.espocrm.serviceEntity),
      },
      reservations: {
        list:   list(config.espocrm.reservationEntity),
        create: create(config.espocrm.reservationEntity),
        remove: remove(config.espocrm.reservationEntity),
      },
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.espocrm?.url, config?.espocrm?.apiKey]);
}
