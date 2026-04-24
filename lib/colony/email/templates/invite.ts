function escapeHTML(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function buildInviteEmailHTML(params: {
  inviterName: string
  orgName: string
  role: string
  acceptUrl: string
}): string {
  const roleLabel = params.role.charAt(0).toUpperCase() + params.role.slice(1)
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080d18;font-family:Inter,sans-serif;">
  <div style="max-width:560px;margin:40px auto;padding:40px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:28px;color:#fff;margin:0 0 12px;letter-spacing:-0.5px;">
        You're invited to Colony
      </div>
      <p style="color:rgba(255,255,255,.65);font-size:15px;margin:0;">
        ${escapeHTML(params.inviterName)} added you to <strong style="color:#fff;">${escapeHTML(params.orgName)}</strong> as <strong style="color:#2AA5A0;">${escapeHTML(roleLabel)}</strong>.
      </p>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="${params.acceptUrl}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#2AA5A0,#1B8F8A);color:#fff;font-weight:700;text-decoration:none;border-radius:50px;font-size:15px;box-shadow:0 12px 40px rgba(42,165,160,.3);">
        Accept invitation
      </a>
    </div>

    <div style="background:rgba(255,255,255,.04);border-radius:12px;padding:16px 20px;margin:24px 0;">
      <p style="color:rgba(255,255,255,.65);font-size:13px;margin:0 0 4px;">What is Colony?</p>
      <p style="color:rgba(255,255,255,.45);font-size:12px;margin:0;line-height:1.6;">Colony is your AI-powered operations dashboard — lead inbox, pipeline, analytics, and your AI workforce all in one place.</p>
    </div>

    <p style="color:rgba(255,255,255,.3);font-size:11px;text-align:center;margin-top:32px;">
      Colony by AIandWEBservices &nbsp;·&nbsp; If you didn't expect this, ignore this email.
    </p>
  </div>
</body>
</html>`
}

export function buildInviteEmailText(params: {
  inviterName: string
  orgName: string
  role: string
  acceptUrl: string
}): string {
  return `You've been invited to Colony by ${params.inviterName}.

Organization: ${params.orgName}
Your role: ${params.role}

Accept your invitation:
${params.acceptUrl}

Colony is your AI-powered operations dashboard.

If you didn't expect this, ignore this email.
`
}
