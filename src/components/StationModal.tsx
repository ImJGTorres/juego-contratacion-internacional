import { useEffect } from "react";
import { type Block, type Station, KIND_LABEL, toEmbed } from "@/lib/content";

export function RouteMap() {
  return (
    <figure className="route-map">
      <svg viewBox="0 0 400 220" role="img" aria-label="Ruta de la alianza de Chile a Colombia">
        <rect width="400" height="220" className="rm-sea" />
        <path d="M150 20 L215 30 L235 70 L225 110 L200 125 L185 160 L175 215 L160 215 L165 150 L140 110 L130 60 Z" className="rm-land" />
        <path d="M168 210 Q120 120 190 45" className="rm-route" />
        <circle cx="190" cy="45" r="8" className="rm-dot" /><circle cx="168" cy="205" r="8" className="rm-dot" />
        <text x="205" y="40" className="rm-label">🇨🇴 Colombia · Sodimac Colombia (1993)</text>
        <text x="185" y="208" className="rm-label">🇨🇱 Chile · Falabella / Sodimac</text>
      </svg>
      <figcaption>Del origen de los socios al desarrollo de Homecenter en Colombia.</figcaption>
    </figure>
  );
}

export function RenderBlock({ b }: { b: Block }) {
  switch (b.type) {
    case "heading": return <h3>{b.text}</h3>;
    case "text": return <p className="whitespace-pre-line">{b.text}</p>;
    case "image": return <figure><img src={b.url} alt={b.caption ?? ""} />{b.caption && <figcaption>{b.caption}</figcaption>}</figure>;
    case "video": { const e = toEmbed(b.url); return e ? <iframe src={e} title="video" allowFullScreen className="aspect-video w-full" /> : <video src={b.url} controls className="w-full" />; }
    case "link": return <p><a href={b.url} target="_blank" rel="noreferrer" className="btn-pixel inline-block">🔗 {b.label || b.url}</a></p>;
    case "table": return <table><tbody>{b.rows.map((r, ri) => <tr key={ri}>{r.map((c, ci) => ri === 0 ? <th key={ci}>{c}</th> : <td key={ci}>{c}</td>)}</tr>)}</tbody></table>;
    case "list": { const L = b.ordered ? "ol" : "ul"; return <L className="checklist">{b.items.map((t, i) => <li key={i}>{t}</li>)}</L>; }
    case "quote": return <blockquote className="quote">«{b.text}»</blockquote>;
    case "route": return <RouteMap />;
    case "cards": return (
      <div className={`grid gap-4 ${b.cols === 3 ? "md:grid-cols-3" : b.cols === 1 ? "" : "md:grid-cols-2"}`}>
        {b.cards.map((c, i) => (
          <div key={i} className={`info-card tone-${c.tone ?? "plain"}`}>
            <h4>{c.icon && <span className="mr-2">{c.icon}</span>}{c.title}</h4>
            {c.text && <p>{c.text}</p>}
            {c.items && <ul className="checklist">{c.items.map((t, j) => <li key={j}>{t}</li>)}</ul>}
          </div>
        ))}
      </div>
    );
  }
}

export function StationModal({ station, onClose }: { station: Station; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay animate-in fade-in" onClick={onClose}>
      <div className="modal-panel flex h-[85vh] w-[94vw] flex-col animate-in zoom-in-95 md:w-[80vw]" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head flex items-start justify-between gap-4 px-6 py-4 md:px-8">
          <div>
            <p className="font-pixel text-xs uppercase text-primary">{KIND_LABEL[station.kind]} · {station.subtitle}</p>
            <h2 className="font-pixel text-2xl text-ink md:text-3xl">{station.title}</h2>
          </div>
          <button className="btn-pixel" onClick={onClose} aria-label="Cerrar">✕ Cerrar</button>
        </header>
        <div className="reading flex-1 overflow-y-auto px-6 py-6 md:px-8">
          {station.blocks.map((b, i) => <RenderBlock key={i} b={b} />)}
        </div>
      </div>
    </div>
  );
}
