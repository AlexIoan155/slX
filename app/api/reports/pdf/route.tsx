import { NextResponse, type NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile.service";
import { getLatestResult, rowToAssessmentResult } from "@/services/assessment.service";
import { ReportDocument } from "@/lib/pdf/ReportDocument";

// @react-pdf/renderer needs Node APIs (streams, buffers) — must not run on
// the Edge runtime.
export const runtime = "nodejs";

/**
 * Streams a branded PDF of the user's latest HomeRisk report. Gated to
 * Premium (matches the feature list on /preturi and /premium) — a free
 * user hitting this directly still gets a clean 403, not a silent 500.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  const profile = await getProfile(supabase, user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profilul nu a fost găsit." }, { status: 404 });
  }
  if (profile.subscription !== "premium") {
    return NextResponse.json(
      { error: "Exportul PDF este disponibil doar pentru utilizatorii Premium." },
      { status: 403 }
    );
  }

  const resultRow = await getLatestResult(supabase, user.id);
  if (!resultRow) {
    return NextResponse.json({ error: "Nu ai încă nicio evaluare finalizată." }, { status: 404 });
  }

  const result = rowToAssessmentResult(resultRow);
  const buffer = await renderToBuffer(
  <ReportDocument
    result={result}
    userName={profile.name}
  />
);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="homerisk-raport-${new Date(resultRow.created_at).toISOString().slice(0, 10)}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
