export type Json = Record<string, unknown>;
export type ActionKind = "read" | "handoff" | "submit";
export type PiiClass = "ssn" | "ny_license_no" | "dl" | "dob" | "vin" | "policy_no" | "loan_no" | "payment" | "health";

export type Out = { status: number; body: Json };

export type IdempotencyStore = {
  get(key: string): Promise<Out | null>;
  set(key: string, value: Out, ttlMs: number): Promise<void>;
};

export type AgentMail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: { filename: string; content: string; content_type: string }[];
  lead?: Json;
};

export type Ctx = {
  req: Request;
  env: Record<string, string | undefined>;
  ip: string;
  agent: string;
  rateHit: (key: string, limit: { windowMs: number; max: number }) => Promise<boolean>;
  send: (m: AgentMail) => Promise<void>;
  to: string;
  log: (line: string) => void;
  confirmSecret?: string;
  testKey?: string;
  idempotency?: IdempotencyStore;
  vercelEnv?: string;
};

export type Limits = { ipHour: number; agentHour: number; siteDay: number; dupDay: boolean };

export type ActionDef<I = Json, O = Json> = {
  id: string;
  site: string;
  kind: ActionKind;
  title: string;
  description: string;
  confirm: "none" | "preview_token";
  limits: Limits;
  pii: { forbid: PiiClass[]; allowFreeText: number };
  annotations: { readOnlyHint: boolean; destructiveHint: false; idempotentHint: boolean; openWorldHint: boolean };
  run(i: I, ctx: Ctx): Promise<O>;
};
