import { createHash } from "node:crypto";
import type { Ctx } from "./types.ts";

export const hashIp = (ip: string) => createHash("sha256").update(ip).digest("hex").slice(0, 16);

export function audit(ctx: Pick<Ctx, "log">, e: {
  route: string;
  result: string;
  agent: string;
  ip: string;
  test?: boolean;
  types?: string[];
  signed?: boolean;
}) {
  ctx.log(JSON.stringify({
    evt: "agent_audit",
    at: new Date().toISOString(),
    route: e.route,
    result: e.result,
    agent: e.agent,
    signed: e.signed ?? false,
    ip: hashIp(e.ip),
    types: e.types ?? [],
    ...(e.test ? { test: true } : {}),
  }));
}
