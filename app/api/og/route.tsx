import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') ?? 'AIandWEBservices';
  const description = url.searchParams.get('description') ?? 'AI Automation, Agents & Chatbots for Small Business';
  const type = url.searchParams.get('type') ?? 'default';

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111827',
            backgroundImage: 'linear-gradient(135deg, #111827 0%, #1a2a3a 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '60px',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: '#2AA5A0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#111827',
              }}
            >
              A
            </div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>
              AIandWEBservices
            </div>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: type === 'blog' ? '48px' : '56px',
              fontWeight: '800',
              color: '#fff',
              margin: '0 0 20px 0',
              textAlign: 'center',
              lineHeight: '1.2',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.75)',
              margin: '0',
              textAlign: 'center',
              maxWidth: '850px',
              lineHeight: '1.4',
            }}
          >
            {description}
          </p>

          {/* Accent bar */}
          <div
            style={{
              marginTop: '40px',
              height: '4px',
              width: '100px',
              backgroundColor: '#2AA5A0',
              borderRadius: '2px',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
