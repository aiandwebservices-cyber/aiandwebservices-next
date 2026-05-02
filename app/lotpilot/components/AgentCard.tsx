import type { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  name: string;
  desc: string;
  cost: string;
};

export default function AgentCard({ icon, name, desc, cost }: Props) {
  return (
    <article className="lp-agent">
      <div className="lp-agent__icon">{icon}</div>
      <h3 className="lp-agent__name">{name}</h3>
      <p className="lp-agent__desc">{desc}</p>
      <span className="lp-agent__cost">{cost}</span>
    </article>
  );
}
