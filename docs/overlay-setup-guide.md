# Add LotPilot AI to Your Existing Website

Keep your current site. Add the AI sales agent and CRM in three steps.

## Step 1: Add the chat widget (30 seconds)

Paste this snippet just before `</body>` on every page of your website:

```html
<script
  src="https://lotpilot.ai/widget.js"
  data-dealer="your-dealer-id"
  data-color="#D4AF37">
</script>
```

That's it — a floating chat bubble appears in the bottom-right corner. Visitors can ask about inventory, financing, or trade-ins, and the AI answers using your real EspoCRM data.

### Optional attributes

| Attribute | Default | Description |
|---|---|---|
| `data-dealer` | (required) | Your dealer slug, e.g. `primo` |
| `data-color` | `#D4AF37` | Primary accent color (matches your brand) |
| `data-position` | `right` | `right` or `left` — where the bubble appears |
| `data-greeting` | (config) | Override the first AI message |
| `data-name` | (config) | Override the displayed dealership name |

If you don't pass `data-greeting` or `data-name`, the widget pulls those from your dealer config automatically.

## Step 2: Connect your contact forms (optional)

Point any existing form's `action` to LotPilot's lead-receiver endpoint:

```html
<form method="POST"
      action="https://lotpilot.ai/api/dealer/your-dealer-id/embed/lead-receiver">
  <input name="name"    placeholder="Your name"    required>
  <input name="email"   type="email" placeholder="Email">
  <input name="phone"   type="tel"   placeholder="Phone">
  <input name="vehicle" placeholder="Vehicle of interest">
  <textarea name="message" placeholder="How can we help?"></textarea>
  <button type="submit">Send</button>
</form>
```

The endpoint accepts both JSON (`Content-Type: application/json`) and standard form posts (`application/x-www-form-urlencoded` or `multipart/form-data`). It accepts flexible field names — any of these work:

- `name` — or `firstName` + `lastName`, or `fullName`
- `email` — or `emailAddress`
- `phone` — or `phoneNumber`, `tel`, `mobile`
- `vehicle` — or `vehicleOfInterest`, `interest`, `stockNumber`
- `message` — or `comments`, `notes`, `inquiry`

Either email or phone is required; everything else is optional. Submissions land in your LotPilot dashboard with AI lead scoring and automatic follow-up sequences.

### Programmatic submissions (for SPAs)

```js
fetch('https://lotpilot.ai/api/dealer/your-dealer-id/embed/lead-receiver', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    phone: '(305) 555-0142',
    vehicle: '2023 BMW X5',
    message: 'Interested in test driving this weekend',
    source: 'website_form',
  }),
});
```

The endpoint is fully CORS-enabled — call it from any domain.

## Step 3: Access your dashboard

Log in at:

```
https://admin.lotpilot.ai/your-dealer-id
```

You'll see every conversation the AI handled, every lead captured, and the AI's lead score and recommended next action for each. Your AI agent is now live on your site.

## Analytics integration

The widget fires Google Analytics events when the AI captures a lead:

```js
gtag('event', 'lotpilot_lead_captured', {
  dealer: 'your-dealer-id',
  email: '...',
  phone: '...',
});
```

It also pushes to `dataLayer` if Google Tag Manager is on the page. No setup required on your side — just check your existing analytics for the new event.

## Troubleshooting

**The bubble doesn't appear.**
- Check the browser console for `LotPilot: data-dealer attribute is required`. The `data-dealer` attribute is mandatory.
- Make sure the script tag is before `</body>`, not inside `<head>`.
- Confirm your CSP allows `script-src https://lotpilot.ai` and `frame-src https://lotpilot.ai`.

**Form submissions return 404.**
- Verify your dealer slug is correct in the form `action` URL. Slugs are lowercase, hyphenated.

**The AI says it can't find vehicles.**
- The agent reads from your EspoCRM `CVehicle` entity. Confirm vehicles in EspoCRM have `status` set to one of: `Available`, `Featured`, `OnSale`, `JustArrived`, `PriceDrop`.

**Need help?** Email support@lotpilot.ai with your dealer slug and the URL of the page where the widget is installed.
