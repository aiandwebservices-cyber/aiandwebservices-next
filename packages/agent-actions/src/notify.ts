import { isPreviewEnv } from "./test-mode.ts";
import type { AgentMail, Ctx } from "./types.ts";

export class NotifyBlocked extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotifyBlocked";
  }
}

// Test-flagged requests never call send. Preview deployments hard-fail unless the path is the sink.
export async function notify(ctx: Ctx, mail: AgentMail, { test }: { test: boolean }): Promise<"sunk" | "sent"> {
  if (test) return "sunk";
  if (isPreviewEnv(ctx.env) || ctx.vercelEnv === "preview") {
    throw new NotifyBlocked("Preview notify is limited to the test sink.");
  }
  await ctx.send(mail);
  return "sent";
}
