"use client";
import { createContext, useContext, useRef, useState } from "react";
import { Modal } from "./modal";

interface Request { title: string; description: string; action?: string }
const Context = createContext<(request: Request) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(Context);
export function ConfirmationProvider({ children }: { children: React.ReactNode }) {
  const [request, setRequest] = useState<Request | null>(null);
  const resolve = useRef<((answer: boolean) => void) | null>(null);
  const finish = (answer: boolean) => { resolve.current?.(answer); resolve.current = null; setRequest(null); };
  return <Context.Provider value={(r) => { resolve.current?.(false); setRequest(r); return new Promise<boolean>((done) => { resolve.current = done; }); }}>
    {children}<Modal open={!!request} title={request?.title ?? "Confirm change"} onClose={() => finish(false)}>
      <p className="text-sm leading-relaxed text-muted">{request?.description}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2"><button data-autofocus type="button" onClick={() => finish(false)} className="rounded-full border border-border px-5 py-2.5 text-sm">Cancel</button><button type="button" onClick={() => finish(true)} className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">{request?.action ?? "Confirm"}</button></div>
    </Modal>
  </Context.Provider>;
}
