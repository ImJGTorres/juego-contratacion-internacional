import { useEffect, useState } from "react";
import { type BookPage, type Station } from "@/lib/content";
import { useIsMobile } from "@/hooks/use-mobile";

function Page({ p, n }: { p: BookPage | undefined; n: number }) {
  if (!p) return <div className="book-page" />;
  const cover = n === 1;
  return (
    <div className={`book-page ${cover ? "book-cover" : ""}`}>
      {p.clause && <p className="font-pixel text-xs uppercase text-primary">{p.clause}</p>}
      <h3 className="font-pixel text-2xl text-ink">{p.title}</h3>
      <div className="mt-4 space-y-3">{p.body.map((t, i) => <p key={i}>{t}</p>)}</div>
      <span className="book-num">{n}</span>
    </div>
  );
}

export function BookModal({ station, onClose }: { station: Station; onClose: () => void }) {
  const pages = station.pages ?? [];
  const mobile = useIsMobile();
  const step = mobile ? 1 : 2;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const go = (d: number) => setI((cur) => { const n = cur + d * step; if (n < 0 || n >= pages.length) return cur; setDir(d > 0 ? "next" : "prev"); return n; });
  useEffect(() => { setI((c) => c - (c % step)); }, [step]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const last = Math.min(i + step, pages.length);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay animate-in fade-in" onClick={onClose}>
      <div className="flex h-[88vh] w-[94vw] flex-col gap-3 md:w-[82vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-pixel text-xl text-foreground md:text-2xl">📖 {station.title}</h2>
          <button className="btn-pixel" onClick={onClose}>✕ Cerrar libro</button>
        </div>
        <div key={i} className={`book flex-1 ${dir === "next" ? "flip-next" : "flip-prev"}`}>
          <Page p={pages[i]} n={i + 1} />
          {step === 2 && <Page p={pages[i + 1]} n={i + 2} />}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="btn-pixel btn-ghost" disabled={i === 0} onClick={() => go(-1)}>◀ Anterior</button>
          <span className="font-pixel text-sm text-foreground">Página {i + 1}{last > i + 1 ? `–${last}` : ""} de {pages.length}</span>
          <button className="btn-pixel btn-ghost" disabled={last >= pages.length} onClick={() => go(1)}>Siguiente ▶</button>
        </div>
      </div>
    </div>
  );
}
