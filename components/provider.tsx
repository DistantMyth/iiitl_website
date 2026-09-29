"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { DemoState, initialState } from "@/lib/demo";
const Context = createContext<{
  data: DemoState;
  update: (fn: (d: DemoState) => DemoState, action?: string) => void;
  toast: (s: string) => void;
  reset: () => void;
}>({ data: initialState, update: () => {}, toast: () => {}, reset: () => {} });
export const useDemo = () => useContext(Context);
export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const s = localStorage.getItem("iiitl-demo-v1");
      if (s) setData({ ...initialState, ...JSON.parse(s) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("iiitl-demo-v1", JSON.stringify(data));
      } catch {
        setMessage(
          "Browser storage is full. This change is available until you refresh.",
        );
      }
  }, [data, ready]);
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 4500);
      return () => clearTimeout(t);
    }
  }, [message]);
  const update = useCallback(
    (fn: (d: DemoState) => DemoState, action?: string) =>
      setData((d) => {
        const next = fn(d);
        return action
          ? {
              ...next,
              audit: [
                `${new Date().toLocaleString()} · ${action}`,
                ...next.audit,
              ].slice(0, 100),
            }
          : next;
      }),
    [],
  );
  return (
    <Context.Provider
      value={{
        data,
        update,
        toast: setMessage,
        reset: () => {
          setData(structuredClone(initialState));
          setMessage("Demo reset to its starting state.");
        },
      }}
    >
      {children}
      <div className={`toast ${message ? "visible" : ""}`} role="status">
        {message}
      </div>
    </Context.Provider>
  );
}
