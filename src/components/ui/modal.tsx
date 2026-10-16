"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Native <dialog>: focus trap, Esc to close, backdrop click to close. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className="m-auto w-[min(92vw,30rem)] rounded-[16px] border border-border bg-surface p-0 text-foreground shadow-card backdrop:bg-foreground/30"
    >
      {open && (
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="rounded-full p-1 hover:bg-soft"><X size={18} /></button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
