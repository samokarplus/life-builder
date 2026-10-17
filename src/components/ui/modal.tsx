"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Native dialog provides focus containment, Escape, and return-to-trigger focus. */
export function Modal({ open, onClose, title, children, drawer = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; drawer?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); d.querySelector<HTMLElement>("[data-autofocus]")?.focus(); }
    if (!open && d.open) d.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <dialog ref={ref} onCancel={onClose} onClose={onClose}
    onClick={(e) => { if (e.target === ref.current) { const r = ref.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}
    aria-labelledby={titleId}
    className={cn("border border-border bg-surface p-0 text-foreground shadow-card backdrop:bg-black/35", drawer ? "drawer ml-auto mr-0 h-dvh max-h-dvh w-[min(100vw,34rem)] max-w-full rounded-l-2xl" : "m-auto max-h-[90dvh] w-[min(92vw,30rem)] rounded-2xl")}>
    {open && <div className="p-5 sm:p-7"><div className="mb-6 flex items-start justify-between gap-4"><h2 id={titleId} className="font-serif text-2xl">{title}</h2><button type="button" onClick={onClose} aria-label="Close" className="shrink-0 rounded-full p-2 hover:bg-soft"><X size={18} /></button></div>{children}</div>}
  </dialog>;
}
