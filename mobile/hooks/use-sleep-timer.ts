import { useRef, useCallback, useEffect } from "react";

export interface SleepTimerHandle {
  start: () => void;
  stop: () => void;
}

export function useSleepTimer(onWake: () => void) {
  const wakeLockRef = useRef<any>(null);
  const screenTimeoutRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef(Date.now());

  const keepAwake = useCallback(async () => {
    try {
      if ((navigator as any)?.wakeLock) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      }
    } catch {}
  }, []);

  const releaseAwake = useCallback(() => {
    try { wakeLockRef.current?.release(); } catch {}
    wakeLockRef.current = null;
  }, []);

  const start = useCallback(() => {
    keepAwake();
    lastActivityRef.current = Date.now();
    screenTimeoutRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 120000 && wakeLockRef.current) {
        releaseAwake();
        onWake();
      }
    }, 30000);
  }, [keepAwake, releaseAwake, onWake]);

  const stop = useCallback(() => {
    releaseAwake();
    if (screenTimeoutRef.current) {
      clearInterval(screenTimeoutRef.current);
      screenTimeoutRef.current = null;
    }
  }, [releaseAwake]);

  useEffect(() => () => stop(), [stop]);

  return { start, stop };
}
