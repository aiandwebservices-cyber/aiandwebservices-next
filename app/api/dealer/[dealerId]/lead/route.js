import {
  espoFetch,
  getDealerConfig,
  isValidEmail,
  normalizePhone,
  phoneNumberData,
} from '../../_lib/espocrm.js';
import { notifyDealer, nowDealerTimestamp } from '../../_lib/notify.js';
import { sanitizeInput } from '../../../../../lib/dealer-platform/middleware/sanitize.js';
import { withErrorHandling } from '../../../../../lib/dealer-platform/utils/error-handler.js';
import { rateLimit } from '../../../../../lib/dealer-platform/middleware/rate-limit.js';

const DEALER_NOTIFY = {
  lotcrm: {
    dealerName: 'LotCRM',
    dealerPhone: '(305) 555-0199',
    dealerEmail: 'demo@lotpilot.ai',
    notifyPhone: '+13055550199',
    notifyEmail: 'demo@lotpilot.ai',
  },
};

const VALID_SOURCES = new Set([
  'GetEPrice',
  'PreApproval',
  'TradeIn',
  'TestDrive',
  'Contact',
  'BuildYourDeal',
  'InventoryAlert',
  'Chat',
  'PhoneCall',
  'Service',
  'Reserve',
  'PriceMatch',
]);

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

export const POST = withErrorHandling(async (req, { params }) => {
  const limited = rateLimit(req, { limit: 30, window: 60 });
  if (limited) return limited;
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  let body;
  try {
    body = sanitizeInput(await req.json());
  } catch {
    return bad('Invalid JSON body');
  }

  const {
    source,
    firstName,
    lastName,
    email,
    phone,
    vehicleOfInterest,
    message,
    tradeYear,
    tradeMake,
    tradeModel,
    tradeMileage,
    tradeCondition,
    tradeEstimate,
    downPayment,
    financeTerm,
    creditTier,
    estimatedPayment,
    dealStatus,
  } = body || {};

  if (!source || !VALID_SOURCES.has(source)) {
    return bad('Invalid or missing source');
  }
  if (!firstName || typeof firstName !== 'string') {
    return bad('firstName is required');
  }
  if (!isValidEmail(email)) {
    return bad('Valid email is required');
  }
  if (phone && !normalizePhone(phone)) {
    return bad('Phone must contain at least 10 digits');
  }

  const payload = {
    firstName,
    lastName: lastName || '',
    emailAddress: email.trim(),
    cLeadSource: source,
    status: 'New',
  };

  const phoneData = phoneNumberData(phone);
  if (phoneData) payload.phoneNumberData = phoneData;

  if (vehicleOfInterest) payload.cVehicleOfInterest = vehicleOfInterest;
  if (message) payload.description = message;

  if (tradeYear) payload.cTradeYear = tradeYear;
  if (tradeMake) payload.cTradeMake = tradeMake;
  if (tradeModel) payload.cTradeModel = tradeModel;
  if (tradeMileage !== undefined && tradeMileage !== null && tradeMileage !== '') {
    payload.cTradeMileage = Number(tradeMileage);
  }
  if (tradeCondition) payload.cTradeCondition = tradeCondition;
  if (tradeEstimate !== undefined && tradeEstimate !== null && tradeEstimate !== '') {
    payload.cTradeEstimate = Number(tradeEstimate);
    payload.cTradeEstimateCurrency = 'USD';
  }

  if (downPayment !== undefined && downPayment !== null && downPayment !== '') {
    payload.cDownPayment = Number(downPayment);
    payload.cDownPaymentCurrency = 'USD';
  }
  if (financeTerm !== undefined && financeTerm !== null && financeTerm !== '') {
    payload.cFinanceTerm = Number(financeTerm);
  }
  if (creditTier) payload.cCreditTier = creditTier;
  if (estimatedPayment !== undefined && estimatedPayment !== null && estimatedPayment !== '') {
    payload.cEstimatedPayment = Number(estimatedPayment);
    payload.cEstimatedPaymentCurrency = 'USD';
  }

  if (source === 'BuildYourDeal' || dealStatus === 'NewDeal') {
    payload.cDealStatus = 'NewDeal';
  }

  const result = await espoFetch('POST', '/api/v1/Lead', payload, dealerConfig);
  if (!result.ok) {
    return Response.json({ ok: false, error: result.error }, { status: 502 });
  }

  const leadId = result.data?.id;

  const notify = DEALER_NOTIFY[dealerId];
  if (notify) {
    notifyDealer({
      type: source === 'BuildYourDeal' ? 'new_deal' : (source === 'PriceMatch' ? 'price_match' : 'new_lead'),
      dealerId,
      ...notify,
      customerName: `${firstName} ${lastName || ''}`.trim(),
      customerPhone: phone || '',
      customerEmail: email.trim(),
      source,
      vehicleOfInterest: vehicleOfInterest || '',
      message: message || '',
      leadId,
      timestamp: nowDealerTimestamp(),
    });
  }

  return Response.json({ ok: true, leadId });
});
