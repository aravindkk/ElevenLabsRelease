"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConversationProvider,
  useConversation,
} from "@elevenlabs/react";

type Turn = {
  id: number;
  role: "user" | "agent";
  text: string;
  timestamp: Date;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

class AuthExpiredError extends Error {}

async function fetchSignedUrl(): Promise<string> {
  const res = await fetch("/api/elevenlabs/token");
  if (res.status === 401) throw new AuthExpiredError();
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to fetch conversation token");
  }
  const data: { signedUrl: string } = await res.json();
  return data.signedUrl;
}

function deriveTitle(text: string) {
  return text.length > 60 ? `${text.slice(0, 60)}…` : text;
}

// The SDK's startSession() throws a DOMException (getUserMedia rejection) when
// the user denies mic access, or surfaces it via the onError string callback —
// detect either shape and give guidance instead of a generic failure message.
function describeStartError(err: unknown): string {
  if (
    (err instanceof DOMException &&
      (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) ||
    (err instanceof Error && /permission|not allowed/i.test(err.message)) ||
    (typeof err === "string" && /permission|not allowed/i.test(err))
  ) {
    return "Microphone access is blocked. Click the lock icon in your browser's address bar, allow microphone access for this site, then try again.";
  }
  if (err instanceof Error) return err.message;
  if (typeof err === "string" && err) return err;
  return "Could not start the voice session. Please try again.";
}

async function createVoiceSession(
  onAuthExpired: () => void,
): Promise<string | null> {
  try {
    const res = await fetch("/api/voice-sessions", { method: "POST" });
    if (res.status === 401) {
      onAuthExpired();
      return null;
    }
    if (!res.ok) return null;
    const data: { id: string } = await res.json();
    return data.id;
  } catch {
    return null;
  }
}

function persistTurn(
  sessionId: string,
  sequence: number,
  role: "user" | "agent",
  text: string,
  title: string | undefined,
  onAuthExpired: () => void,
) {
  fetch(`/api/voice-sessions/${sessionId}/turns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, text, sequence, title }),
  })
    .then((res) => {
      if (res.status === 401) onAuthExpired();
    })
    .catch(() => {});
}

function finalizeSession(sessionId: string, title?: string) {
  const payload = JSON.stringify({ title });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      `/api/voice-sessions/${sessionId}/finalize`,
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }
  fetch(`/api/voice-sessions/${sessionId}/finalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {});
}

function ActiveVoiceQueryInner() {
  const router = useRouter();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [authExpired, setAuthExpired] = useState(false);
  const turnIdRef = useRef(0);
  const hasStartedRef = useRef(false);
  const intentionalStopRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dbSessionIdRef = useRef<string | null>(null);
  const dbSequenceRef = useRef(0);
  const dbFinalizedRef = useRef(true);
  const dbTitleSyncedRef = useRef(false);

  const finalizeIfNeeded = useCallback((title?: string) => {
    if (!dbSessionIdRef.current || dbFinalizedRef.current) return;
    dbFinalizedRef.current = true;
    finalizeSession(dbSessionIdRef.current, title);
  }, []);

  const handleAuthExpired = useCallback(() => {
    setAuthExpired(true);
  }, []);

  const { startSession, endSession, status, isSpeaking, isMuted, setMuted } =
    useConversation({
      onMessage: ({ message, role }) => {
        turnIdRef.current += 1;
        setTurns((prev) => [
          ...prev,
          { id: turnIdRef.current, role, text: message, timestamp: new Date() },
        ]);

        if (dbSessionIdRef.current) {
          dbSequenceRef.current += 1;
          const shouldSyncTitle = role === "user" && !dbTitleSyncedRef.current;
          if (shouldSyncTitle) dbTitleSyncedRef.current = true;
          persistTurn(
            dbSessionIdRef.current,
            dbSequenceRef.current,
            role,
            message,
            shouldSyncTitle ? deriveTitle(message) : undefined,
            handleAuthExpired,
          );
        }
      },
      onError: (message) => {
        setError(describeStartError(message));
        finalizeIfNeeded();
      },
      onDisconnect: (details) => {
        if (intentionalStopRef.current) return;
        if (details.reason === "agent") {
          // The agent ended the call gracefully (e.g. after wrapping up).
          finalizeIfNeeded();
          router.push("/dashboard");
          return;
        }
        if (details.reason === "error") {
          setError(details.message || "The voice connection dropped.");
        } else {
          setError("The voice connection was lost. Please try again.");
        }
        finalizeIfNeeded();
      },
    });

  const beginSession = useCallback(async () => {
    if (isStarting || status === "connected" || status === "connecting") return;
    intentionalStopRef.current = false;
    setIsStarting(true);
    setError(null);
    try {
      const [signedUrl, dbSessionId] = await Promise.all([
        fetchSignedUrl(),
        createVoiceSession(handleAuthExpired),
      ]);
      dbSessionIdRef.current = dbSessionId;
      dbSequenceRef.current = 0;
      dbFinalizedRef.current = dbSessionId === null;
      dbTitleSyncedRef.current = false;
      await startSession({ signedUrl });
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        setAuthExpired(true);
        return;
      }
      setError(describeStartError(err));
    } finally {
      setIsStarting(false);
    }
  }, [isStarting, status, startSession, handleAuthExpired]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    void beginSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  const firstUserTurn = turns.find((t) => t.role === "user");
  const title = firstUserTurn ? deriveTitle(firstUserTurn.text) : "New Voice Query";

  const handleStop = useCallback(() => {
    intentionalStopRef.current = true;
    finalizeIfNeeded(title);
    endSession();
    router.push("/dashboard");
  }, [endSession, router, finalizeIfNeeded, title]);

  const handleMicClick = useCallback(() => {
    if (status !== "connected") {
      if (isStarting || status === "connecting") return;
      void beginSession();
      return;
    }
    setMuted(!isMuted);
  }, [status, isStarting, beginSession, isMuted, setMuted]);

  useEffect(() => {
    const handleUnload = () => finalizeIfNeeded(title);
    window.addEventListener("pagehide", handleUnload);
    return () => {
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [finalizeIfNeeded, title]);

  const isConnected = status === "connected";
  const isActiveMic = isConnected && !isMuted;
  const waitingForAgent =
    isConnected && turns.length > 0 && turns[turns.length - 1].role === "user";

  return (
    <>
      <div className="flex w-full items-center justify-between border-b border-outline-variant/50 px-gutter py-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={
              isConnected
                ? "h-3 w-3 shrink-0 animate-pulse rounded-full bg-tertiary-container shadow-[0_0_8px_rgba(0,150,104,0.6)]"
                : "h-3 w-3 shrink-0 rounded-full bg-outline-variant"
            }
          />
          <h2 className="truncate text-headline-md text-text-primary">
            {title}
          </h2>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-sm text-text-secondary">
          <span
            className={
              isConnected
                ? "h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim"
                : "h-1.5 w-1.5 rounded-full bg-outline"
            }
          />
          {isConnected ? "Live Sync Active" : status === "connecting" ? "Connecting…" : "Disconnected"}
        </span>
      </div>

      {authExpired && (
        <div className="mx-auto mt-4 w-full max-w-3xl px-gutter">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-warning/30 bg-surface-container-low px-4 py-3 text-body-md text-text-primary">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-warning">warning</span>
              Your session has expired. Sign in again to keep saving this conversation.
            </span>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-label-sm font-semibold text-on-secondary transition-colors hover:opacity-90"
            >
              Sign in again
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mx-auto mt-4 w-full max-w-3xl px-gutter">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-error/30 bg-error-container px-4 py-3 text-body-md text-on-error-container">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void beginSession()}
              className="shrink-0 rounded-lg bg-error px-3 py-1.5 text-label-sm font-semibold text-on-error transition-colors hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-stack-lg overflow-y-auto px-gutter py-stack-lg pb-[180px]"
      >
        {turns.length === 0 && !error && (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-text-secondary">
            <p className="text-body-lg">
              {status === "connecting" || isStarting
                ? "Connecting to Nexus Hub…"
                : "Ask a question to get started."}
            </p>
          </div>
        )}

        {turns.map((turn) =>
          turn.role === "user" ? (
            <div key={turn.id} className="flex flex-col items-end gap-1">
              <div className="max-w-[85%] rounded-t-xl rounded-bl-xl rounded-br-sm bg-secondary p-4 text-on-secondary shadow-sm">
                <p className="text-body-lg">{turn.text}</p>
              </div>
              <div className="flex items-center gap-1 text-label-sm text-text-secondary">
                <span>{formatTime(turn.timestamp)}</span>
                <span className="material-symbols-outlined text-[14px]">
                  check_circle
                </span>
              </div>
            </div>
          ) : (
            <div key={turn.id} className="flex flex-col items-start gap-1">
              <div className="flex max-w-[85%] items-end gap-3">
                <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-primary shadow-sm">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div className="rounded-t-xl rounded-br-xl rounded-bl-sm border border-outline-variant/60 bg-surface p-5 text-text-primary shadow-sm">
                  <p className="text-body-lg leading-relaxed">{turn.text}</p>
                </div>
              </div>
              <div className="pl-11 text-label-sm text-text-secondary">
                <span>{formatTime(turn.timestamp)}</span>
              </div>
            </div>
          ),
        )}

        {waitingForAgent && (
          <div className="flex flex-col items-start gap-1">
            <div className="flex max-w-[85%] items-end gap-3">
              <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-primary shadow-sm">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div className="flex h-12 items-center gap-1.5 rounded-t-xl rounded-br-xl rounded-bl-sm border border-outline-variant/60 bg-surface p-4 shadow-sm">
                <div className="delay-1 h-2 w-2 animate-bounce rounded-full bg-text-secondary" />
                <div className="delay-2 h-2 w-2 animate-bounce rounded-full bg-text-secondary" />
                <div className="delay-3 h-2 w-2 animate-bounce rounded-full bg-text-secondary" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-background via-background to-transparent px-gutter pb-8 pt-20">
        <div className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-8 rounded-full border border-outline-variant bg-surface px-6 py-3 shadow-lg">
          <button
            type="button"
            onClick={handleStop}
            aria-label="End voice query"
            className="flex h-12 w-12 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-container-low hover:text-error"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stop_circle
            </span>
          </button>

          <div className="group relative flex h-20 w-20 cursor-pointer items-center justify-center">
            {isActiveMic && (
              <>
                <div className="pulse-ring absolute inset-0 rounded-full bg-tertiary-container/20" />
                <div className="pulse-ring-2 absolute inset-0 rounded-full bg-tertiary-container/30" />
                <div className="pulse-ring-3 absolute inset-0 rounded-full bg-tertiary-container/40" />
              </>
            )}
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isStarting}
              aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
              className={
                isActiveMic
                  ? "relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-on-tertiary-container text-on-primary shadow-[0_0_15px_rgba(0,150,104,0.5)] transition-transform group-hover:scale-105"
                  : "relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-text-secondary shadow-sm transition-transform group-hover:scale-105"
              }
            >
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isMuted ? "mic_off" : "mic"}
              </span>
            </button>
          </div>

          <div className="flex h-8 w-24 items-center justify-center gap-1 opacity-70">
            {[3, 5, 8, 4, 6, 2, 7].map((h, i) => (
              <div
                key={i}
                className={
                  isConnected && isSpeaking
                    ? `waveform-bar delay-${(i % 5) + 1} w-1.5 rounded-t-full bg-on-tertiary-container`
                    : "w-1.5 rounded-t-full bg-on-tertiary-container"
                }
                style={{ height: `${h * 4}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function ActiveVoiceQuery() {
  return (
    <ConversationProvider>
      <ActiveVoiceQueryInner />
    </ConversationProvider>
  );
}
