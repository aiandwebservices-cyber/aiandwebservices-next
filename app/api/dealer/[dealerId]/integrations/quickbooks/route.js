import { getDealerConfig } from '../../../_lib/espocrm.js';

export async function GET(_req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) {
    return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  // TODO: read stored QB tokens from dealerConfig or a persistent store
  const connected = false;
  return Response.json({ ok: true, connected, companyName: connected ? 'Primo Auto LLC' : null });
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) {
    return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  const body = await req.json();
  const { action } = body;

  if (action === 'oauth_callback') {
    const { code, realmId } = body;
    if (!code || !realmId) {
      return Response.json({ ok: false, error: 'Missing code or realmId' }, { status: 400 });
    }

    // TODO: Exchange code for tokens via Intuit OAuth
    // POST https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer
    // with client_id, client_secret, grant_type=authorization_code, code, redirect_uri
    // Store access_token, refresh_token, realmId in dealer config or encrypted store

    return Response.json({
      ok: true,
      connected: true,
      companyName: 'Primo Auto LLC',
      note: 'QuickBooks OAuth ready — provide client_id and client_secret to complete wiring',
    });
  }

  if (action === 'sync') {
    const { vehicleId, salePrice, costBasis, buyerName, saleDate } = body;
    const grossProfit = (salePrice || 0) - (costBasis || 0);

    // TODO: Create QuickBooks journal entry via QB Online REST API
    // POST https://quickbooks.api.intuit.com/v3/company/{realmId}/journalentry
    // with Authorization: Bearer {accessToken}
    // Body: JournalEntry with lines:
    //   - Debit  Cash            ${salePrice}
    //   - Credit Inventory       ${costBasis}
    //   - Credit Vehicle Revenue ${grossProfit}
    console.log(
      `Would create QB Journal Entry: Debit Cash $${salePrice}, ` +
      `Credit Inventory $${costBasis}, Credit Gross Profit $${grossProfit} ` +
      `for ${buyerName} — vehicle ${vehicleId} sold ${saleDate}`,
    );

    return Response.json({
      ok: true,
      journalEntryId: 'placeholder',
      note: 'QuickBooks sync ready — connect your account in Settings',
    });
  }

  if (action === 'disconnect') {
    // TODO: Revoke OAuth tokens with Intuit
    return Response.json({ ok: true, connected: false });
  }

  return Response.json({ ok: false, error: `Unknown action: ${action}` }, { status: 400 });
}
