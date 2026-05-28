import { useCallback, useEffect, useState } from "react";

function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export function useFavorites() {
  const [favs, setFavs] = useLocalState<string[]>("wo:favs", []);
  const toggle = useCallback(
    (code: string) =>
      setFavs((prev) =>
        prev.includes(code) ? prev.filter((c) => c !== code) : [code, ...prev],
      ),
    [setFavs],
  );
  const has = useCallback((code: string) => favs.includes(code), [favs]);
  return { favs, toggle, has };
}

export function useHistory() {
  const [hist, setHist] = useLocalState<string[]>("wo:hist", []);
  const push = useCallback(
    (code: string) =>
      setHist((prev) => [code, ...prev.filter((c) => c !== code)].slice(0, 12)),
    [setHist],
  );
  const clear = useCallback(() => setHist([]), [setHist]);
  return { hist, push, clear };
}
