"use client";

import { useEffect, useState } from "react";

export function BackendWaker() {
  const [status, setStatus] = useState<"waking" | "ready" | "error">("waking");

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    async function ping() {
      try {
        const res = await fetch("/api/ping");
        const data = await res.json();
        if (data.ok) {
          setStatus("ready");
          return;
        }
      } catch { /* retry */ }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(ping, 4000); // retry every 4s
      } else {
        setStatus("error");
      }
    }

    ping();
  }, []);

  if (status === "ready") return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-border/60 bg-background/90 backdrop-blur-sm shadow-lg text-xs font-medium text-muted-foreground">
      {status === "waking" ? (
        <>
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Warming up AI engine…
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-red-400" />
          Backend unavailable — retrying…
        </>
      )}
    </div>
  );
}
