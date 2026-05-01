import EmbedChatClient from './EmbedChatClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Chat',
  robots: { index: false, follow: false },
};

export default async function EmbedChatPage({ params }) {
  const { dealerId } = await params;
  return <EmbedChatClient dealerId={dealerId} />;
}
