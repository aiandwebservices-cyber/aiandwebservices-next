'use client';
import { useState } from 'react';
import { Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { Btn, relTime } from './_internals';
import { useAdminConfig } from './AdminConfigContext';

export default function DataExport() {
  const cfg = useAdminConfig();
  const dealerSlug = cfg.dealerSlug || 'lotcrm';

  const [loadingJson, setLoadingJson] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);
  const [lastExport, setLastExport] = useState(null);
  const [error, setError] = useState(null);

  async function handleExport(format) {
    const setter = format === 'csv' ? setLoadingCsv : setLoadingJson;
    setter(true);
    setError(null);
    try {
      const url = `/api/dealer/${dealerSlug}/admin/export-all${format === 'csv' ? '?format=csv' : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Export failed (${res.status})`);
      }
      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : `lotpilot-export.${format === 'csv' ? 'zip' : 'json'}`;
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
      setLastExport(new Date().toISOString());
    } catch (err) {
      setError(err.message || 'Export failed. Please try again.');
    } finally {
      setter(false);
    }
  }

  const anyLoading = loadingJson || loadingCsv;

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Your data, your way. Export everything anytime — vehicles, leads, appointments, and settings.
      </p>

      <div className="flex flex-wrap gap-3">
        <Btn
          variant="outline"
          icon={anyLoading && loadingJson ? RefreshCw : Download}
          onClick={() => handleExport('json')}
          disabled={anyLoading}
          className={loadingJson ? 'animate-spin-icon' : ''}
        >
          {loadingJson ? 'Generating…' : 'Download All Data (JSON)'}
        </Btn>
        <Btn
          variant="outline"
          icon={anyLoading && loadingCsv ? RefreshCw : FileSpreadsheet}
          onClick={() => handleExport('csv')}
          disabled={anyLoading}
        >
          {loadingCsv ? 'Generating…' : 'Download as CSV (ZIP)'}
        </Btn>
      </div>

      {error && (
        <p className="text-sm font-medium" style={{ color: 'var(--red-accent, #ef4444)' }}>
          {error}
        </p>
      )}

      {lastExport && !error && (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Last exported {relTime(lastExport)}
        </p>
      )}
    </div>
  );
}
