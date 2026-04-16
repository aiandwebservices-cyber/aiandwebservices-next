import { NextRequest, NextResponse } from "next/server";
import { uploadPhotosToDeal } from "@/lib/pipedrive";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const dealIdRaw = data.get("deal_id");
    const dealId = Number(dealIdRaw);

    if (!dealId || isNaN(dealId)) {
      return NextResponse.json(
        { ok: false, error: "deal_id required and must be numeric" },
        { status: 400 }
      );
    }

    const photos = data.getAll("photos").filter(f => f instanceof File) as File[];

    if (photos.length === 0) {
      return NextResponse.json({ ok: true, uploaded: 0, note: "no photos" });
    }

    const result = await uploadPhotosToDeal(dealId, photos);

    return NextResponse.json({
      ok: true,
      uploaded: result.uploaded,
      failed: result.failed,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[upload-photos] error:", err);
    return NextResponse.json({
      ok: false,
      error: errMsg,
      debug: true,
    }, { status: 500 });
  }
}
