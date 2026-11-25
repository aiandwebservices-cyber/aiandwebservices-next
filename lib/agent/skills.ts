export const SKILLS = [
  {
    name: 'choose-a-service',
    title: 'Choose a service',
    description: 'Help a person compare the published plans without inventing a price.',
    text: 'Call list_services, then get_comparison and get_pricing. Quote only the fees those tools return. Consulting is a starting price, not a monthly plan. Add-ons have their own setup and monthly fees. If the person wants Colony, call get_product and say which fee is printed on that page.',
  },
  {
    name: 'answer-from-the-site',
    title: 'Answer from the site',
    description: 'Answer questions from the guarantee, FAQ, and contact tools.',
    text: 'Call search_faq, get_guarantee, and get_contact_channels. Do not describe sample sites or case studies. If the person wants to talk, call get_meeting_link and give that Cal.com URL.',
  },
  {
    name: 'send-an-inquiry',
    title: 'Send an inquiry',
    description: 'Preview an inquiry, show it to the person, then submit after they agree.',
    text: 'Collect first name, last name, email, phone, one contact-form interest, and a message. The person must agree to be contacted. Call preview_inquiry, show the summary verbatim, and only after they agree call submit_inquiry with the same details, confirm_token, and user_confirmed: true. Send Idempotency-Key on submit. A test identity is not delivered.',
  },
];
