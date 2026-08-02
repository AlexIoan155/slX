"use client";

import { useEffect } from "react";

// Must render its own <html>/<body> since it replaces the root layout when
// an error occurs above the segment-level error.tsx boundary.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[global error boundary]", error);
  }, [error]);

  return (
    <html lang="ro">
      <body style={{ background: "#0A0C10", color: "#F5F6F8", fontFamily: "sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "24px",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: 600 }}>A apărut o eroare critică</h1>
          <p style={{ marginTop: "8px", color: "#9098A6", maxWidth: "360px" }}>
            Aplicația nu a putut porni corect. Reîncearcă sau revino mai târziu.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "24px",
              padding: "10px 20px",
              borderRadius: "999px",
              background: "linear-gradient(90deg, #FF5A36, #FFB020)",
              color: "#000",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Încearcă din nou
          </button>
        </div>
      </body>
    </html>
  );
}
