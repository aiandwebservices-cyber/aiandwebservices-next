'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const POSTS = [
  { href: '/blog/how-ai-works-while-you-sleep',                 tag: 'AI Automation', title: 'How AI Works\nWhile You Sleep' },
  { href: '/blog/growing-businesses-use-ai-83-percent',         tag: 'Growth',         title: '83% of Growing\nSMBs Use AI' },
  { href: '/blog/ai-directly-boosts-revenue-91-percent-small-businesses', tag: 'AI ROI',     title: '91% of SMBs Say\nAI Boosts Revenue' },
  { href: '/blog/businesses-cut-costs-35-percent-first-year-ai',          tag: 'Cost Savings', title: 'Cut Costs 35%\nin Year One' },
  { href: '/blog/urgency-ai-adoption-8-in-10-companies',                  tag: 'AI Trends',    title: '8 in 10 Companies\nAdopting AI Now' },
];

export default function BlogP5() {
  const containerRef = useRef(null);
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let p5Instance = null;
    let destroyed = false;

    import('p5').then(({ default: P5 }) => {
      if (destroyed) return;

      const sketch = (p) => {
        const W = () => el.offsetWidth;
        const H = () => el.offsetHeight;

        const CARD_W = 240;
        const CARD_H = 160;
        const TEAL = [42, 165, 160];
        const BLUE = [59, 130, 246];
        const LOGO_SIZE = 36;

        let logoImg = null;
        let cards = [];
        let hoveredIdx = -1;

        class Card {
          constructor(post, cx, cy) {
            this.post = post;
            this.x = cx;
            this.y = cy;
            this.vx = p.random(-0.4, 0.4);
            this.vy = p.random(-0.3, 0.3);
          }

          update(mx, my, w, h) {
            const dx = mx - this.x;
            const dy = my - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repel = 110;

            if (dist < repel && dist > 1) {
              const force = (repel - dist) / repel * 0.55;
              this.vx -= (dx / dist) * force;
              this.vy -= (dy / dist) * force;
            }

            this.vx *= 0.94;
            this.vy *= 0.94;
            this.x += this.vx;
            this.y += this.vy;

            const pad = CARD_W / 2 + 6;
            const padY = CARD_H / 2 + 6;
            if (this.x < pad)       { this.x = pad;       this.vx = Math.abs(this.vx) * 0.6; }
            if (this.x > w - pad)   { this.x = w - pad;   this.vx = -Math.abs(this.vx) * 0.6; }
            if (this.y < padY)      { this.y = padY;       this.vy = Math.abs(this.vy) * 0.6; }
            if (this.y > h - padY)  { this.y = h - padY;  this.vy = -Math.abs(this.vy) * 0.6; }

            this.vx += (this.homeX - this.x) * 0.003;
            this.vy += (this.homeY - this.y) * 0.003;
          }

          isHovered(mx, my) {
            return (
              mx > this.x - CARD_W / 2 &&
              mx < this.x + CARD_W / 2 &&
              my > this.y - CARD_H / 2 &&
              my < this.y + CARD_H / 2
            );
          }

          draw(hov) {
            p.push();
            p.translate(this.x, this.y);

            // Glow
            if (hov) {
              p.noStroke();
              p.fill(59, 130, 246, 30);
              p.rect(-CARD_W / 2 - 8, -CARD_H / 2 - 8, CARD_W + 16, CARD_H + 16, 18);
            }

            // Card background
            p.stroke(hov ? 59 : 42, hov ? 130 : 165, hov ? 246 : 160, hov ? 200 : 90);
            p.strokeWeight(hov ? 2 : 1.2);
            p.fill(hov ? 219 : 240, hov ? 234 : 249, hov ? 254 : 255, hov ? 245 : 220);
            p.rect(-CARD_W / 2, -CARD_H / 2, CARD_W, CARD_H, 12);

            // Tag pill
            p.noStroke();
            p.fill(...(hov ? BLUE : TEAL), 30);
            p.rect(-CARD_W / 2 + 8, -CARD_H / 2 + 8, p.textWidth(this.post.tag) + 16, 18, 9);
            p.fill(...(hov ? BLUE : TEAL));
            p.textSize(9);
            p.textStyle(p.BOLD);
            p.textAlign(p.LEFT, p.CENTER);
            p.text(this.post.tag, -CARD_W / 2 + 16, -CARD_H / 2 + 17);

            // Logo icon (top-right)
            if (logoImg) {
              p.tint(255, hov ? 255 : 200);
              p.image(logoImg, CARD_W / 2 - LOGO_SIZE - 6, -CARD_H / 2 + 6, LOGO_SIZE, LOGO_SIZE);
              p.noTint();
            }

            // Title lines
            p.fill(hov ? 29 : 15, hov ? 78 : 58, hov ? 216 : 95);
            p.textSize(11.5);
            p.textStyle(p.BOLD);
            p.textAlign(p.LEFT, p.TOP);
            p.textLeading(16);
            const lines = this.post.title.split('\n');
            lines.forEach((ln, i) => p.text(ln, -CARD_W / 2 + 10, -CARD_H / 2 + 36 + i * 16));

            // "Read →" hint
            if (hov) {
              p.fill(...BLUE);
              p.textSize(9.5);
              p.textStyle(p.BOLD);
              p.textAlign(p.RIGHT, p.BOTTOM);
              p.text('Read →', CARD_W / 2 - 10, CARD_H / 2 - 8);
            }

            p.pop();
          }
        }

        const homePositions = (w, h) => {
          const pad = CARD_W / 2 + 12;
          const usable = w - pad * 2;
          const row1 = h * 0.28;
          const row2 = h * 0.72;
          return [
            [pad,                    row1],
            [pad + usable / 2,       row1],
            [pad + usable,           row1],
            [pad,                    row2],
            [pad + usable / 2,       row2],
            [pad + usable,           row2],
          ];
        };

        p.setup = () => {
          const cnv = p.createCanvas(W(), H());
          cnv.parent(el);
          p.textFont('Inter, system-ui, sans-serif');
          p.loadImage('/logo-icon-transparent.svg', img => { logoImg = img; }, () => {});

          const w = W(), h = H();
          const positions = homePositions(w, h);

          cards = POSTS.map((post, i) => {
            const c = new Card(post, positions[i][0], positions[i][1]);
            c.homeX = positions[i][0];
            c.homeY = positions[i][1];
            return c;
          });
        };

        p.draw = () => {
          const w = W(), h = H();
          p.clear();

          p.noStroke();
          p.fill(15, 30, 61, 55);
          p.textSize(9);
          p.textStyle(p.BOLD);
          p.textAlign(p.RIGHT, p.TOP);
          p.text('hover · click to read', w - 10, 8);

          const mx = p.mouseX, my = p.mouseY;
          hoveredIdx = -1;
          cards.forEach((c, i) => { if (c.isHovered(mx, my)) hoveredIdx = i; });

          cards.forEach((c) => c.update(mx, my, w, h));
          cards.forEach((c, i) => { if (i !== hoveredIdx) c.draw(false); });
          if (hoveredIdx >= 0) cards[hoveredIdx].draw(true);

          el.style.cursor = hoveredIdx >= 0 ? 'pointer' : 'default';
        };

        p.mousePressed = () => {
          if (hoveredIdx >= 0) {
            routerRef.current.push(cards[hoveredIdx].post.href);
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(W(), H());
          const positions = homePositions(W(), H());
          cards.forEach((c, i) => {
            c.homeX = positions[i][0];
            c.homeY = positions[i][1];
          });
        };
      };

      p5Instance = new P5(sketch);
    });

    return () => {
      destroyed = true;
      if (p5Instance) p5Instance.remove();
      if (el) el.style.cursor = 'default';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: 400, overflow: 'hidden' }}
      aria-label="Interactive blog posts — hover a card to preview, click to read"
    />
  );
}
