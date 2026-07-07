import { useEffect, useRef } from 'react';

/**
 * Game hotkeys. Pass a map of key -> handler; entries may be undefined when the
 * action is currently unavailable (mirrors disabled buttons). Keys are lowercase
 * (' ' is 'space'). Ignored while typing in a field, while a modal/sheet is open,
 * or with modifier keys held. Enter/Space on a focused button defer to the native
 * click so actions can't double-fire.
 */
export function useHotkeys(map: Record<string, (() => void) | undefined>) {
  const ref = useRef(map);
  ref.current = map;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (document.querySelector('.sheet-backdrop')) return;
      const key = e.key === ' ' ? 'space' : e.key.toLowerCase();
      if (t?.tagName === 'BUTTON' && (key === 'enter' || key === 'space')) return;
      const fn = ref.current[key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
}

export function Hk({ k }: { k: string }) {
  return <kbd className="hk">{k}</kbd>;
}
