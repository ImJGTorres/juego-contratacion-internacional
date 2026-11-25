import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { type Block, type Station, type StationKind, DEFAULT_STATIONS, KIND_LABEL, loadStations, resetStations, saveStations } from "@/lib/content";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración · Mundo Pixel" },
      { name: "description", content: "Edita las estaciones de información del Mundo Pixel." },
      { property: "og:title", content: "Panel de administración · Mundo Pixel" },
      { property: "og:description", content: "Edita las estaciones de información del Mundo Pixel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const NEW_BLOCK: Record<Block["type"], Block> = {
  heading: { type: "heading", text: "Subtítulo" },
  text: { type: "text", text: "Escribe aquí..." },
  image: { type: "image", url: "", caption: "" },
  video: { type: "video", url: "" },
  link: { type: "link", url: "https://", label: "Enlace" },
  table: { type: "table", rows: [["Columna 1", "Columna 2"], ["", ""]] },
  list: { type: "list", items: ["Elemento"] },
  cards: { type: "cards", cols: 2, cards: [{ title: "Tarjeta", text: "Texto" }] },
  quote: { type: "quote", text: "Frase destacada" },
  route: { type: "route" },
};

const fileToData = (f: File) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(f); });

function Admin() {
  const [list, setList] = useState<Station[]>(DEFAULT_STATIONS);
  const [sel, setSel] = useState(0);
  const [msg, setMsg] = useState("");
  useEffect(() => setList(loadStations()), []);
  const st = list[sel];
  const upd = (s: Partial<Station>) => setList(list.map((x, i) => (i === sel ? { ...x, ...s } : x)));
  const updBlock = (bi: number, b: Block) => st && upd({ blocks: st.blocks.map((x, i) => (i === bi ? b : x)) });
  const save = () => { try { saveStations(list); setMsg("✔ Guardado"); } catch { setMsg("⚠ Demasiado grande: usa imágenes más livianas o enlaces"); } setTimeout(() => setMsg(""), 3000); };
  const move = (bi: number, d: number) => { if (!st) return; const b = [...st.blocks]; const j = bi + d; if (j < 0 || j >= b.length) return; [b[bi], b[j]] = [b[j]!, b[bi]!]; upd({ blocks: b }); };
  const exportJson = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(list, null, 2)], { type: "application/json" })); a.download = "estaciones.json"; a.click(); };

  return (
    <div className="admin min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="mr-auto font-pixel text-2xl text-primary">Panel de administración</h1>
          {msg && <span className="font-pixel text-sm">{msg}</span>}
          <button className="btn-pixel" onClick={save}>💾 Guardar</button>
          <button className="btn-pixel btn-ghost" onClick={exportJson}>Exportar</button>
          <label className="btn-pixel btn-ghost cursor-pointer">Importar<input type="file" accept="application/json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) { setList(JSON.parse(await f.text())); setSel(0); } }} /></label>
          <button className="btn-pixel btn-ghost" onClick={() => { if (confirm("¿Restaurar el contenido de ejemplo?")) { resetStations(); setList(DEFAULT_STATIONS); setSel(0); } }}>Restaurar</button>
          <Link to="/" className="btn-pixel btn-ghost">← Al juego</Link>
        </header>
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <aside className="pixel-panel space-y-2 bg-card p-4">
            {list.map((s, i) => <button key={s.id} onClick={() => setSel(i)} className={`block w-full rounded px-3 py-2 text-left ${i === sel ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{s.title}<span className="block text-xs opacity-70">{KIND_LABEL[s.kind]} · ({s.x},{s.y})</span></button>)}
            <button className="btn-pixel btn-sm w-full" onClick={() => { setList([...list, { id: `s${Date.now()}`, title: "Nueva estación", subtitle: "", kind: "register", x: 6, y: 5, blocks: [] }]); setSel(list.length); }}>+ Agregar estación</button>
          </aside>
          {st && (
            <section className="pixel-panel space-y-4 bg-card p-6">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="field">Título<input value={st.title} onChange={(e) => upd({ title: e.target.value })} /></label>
                <label className="field">Subtítulo<input value={st.subtitle} onChange={(e) => upd({ subtitle: e.target.value })} /></label>
                <label className="field">Objeto<select value={st.kind} onChange={(e) => upd({ kind: e.target.value as StationKind })}>{Object.entries(KIND_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="field">Columna (1-12)<input type="number" min={1} max={12} value={st.x} onChange={(e) => upd({ x: +e.target.value })} /></label>
                  <label className="field">Fila (1-8)<input type="number" min={1} max={8} value={st.y} onChange={(e) => upd({ y: +e.target.value })} /></label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Consejo: coloca la estación sobre el césped junto a un camino (no sobre el camino ni el agua).</p>
              <h2 className="font-pixel text-lg">Contenido</h2>
              {st.blocks.map((b, bi) => (
                <div key={bi} className="space-y-2 rounded border-2 border-border p-3">
                  <div className="flex items-center gap-2"><strong className="mr-auto capitalize">{b.type}</strong>
                    <button className="btn-pixel btn-sm btn-ghost" onClick={() => move(bi, -1)}>↑</button>
                    <button className="btn-pixel btn-sm btn-ghost" onClick={() => move(bi, 1)}>↓</button>
                    <button className="btn-pixel btn-sm btn-ghost" onClick={() => upd({ blocks: st.blocks.filter((_, i) => i !== bi) })}>Eliminar</button></div>
                  {(b.type === "heading") && <input className="input" value={b.text} onChange={(e) => updBlock(bi, { ...b, text: e.target.value })} />}
                  {(b.type === "text") && <textarea className="input min-h-28" value={b.text} onChange={(e) => updBlock(bi, { ...b, text: e.target.value })} />}
                  {b.type === "image" && <>
                    <input className="input" placeholder="URL de la imagen" value={b.url.startsWith("data:") ? "(imagen subida)" : b.url} onChange={(e) => updBlock(bi, { ...b, url: e.target.value })} />
                    <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) updBlock(bi, { ...b, url: await fileToData(f) }); }} />
                    <input className="input" placeholder="Pie de imagen" value={b.caption ?? ""} onChange={(e) => updBlock(bi, { ...b, caption: e.target.value })} />
                    {b.url && <img src={b.url} alt="" className="max-h-32" />}
                  </>}
                  {b.type === "video" && <input className="input" placeholder="URL de YouTube o .mp4" value={b.url} onChange={(e) => updBlock(bi, { ...b, url: e.target.value })} />}
                  {b.type === "link" && <div className="grid gap-2 md:grid-cols-2"><input className="input" placeholder="Texto" value={b.label} onChange={(e) => updBlock(bi, { ...b, label: e.target.value })} /><input className="input" placeholder="URL" value={b.url} onChange={(e) => updBlock(bi, { ...b, url: e.target.value })} /></div>}
                  {b.type === "table" && <>
                    <textarea className="input min-h-28 font-mono" value={b.rows.map((r) => r.join(" | ")).join("\n")} onChange={(e) => updBlock(bi, { ...b, rows: e.target.value.split("\n").map((l) => l.split("|").map((c) => c.trim())) })} />
                    <p className="text-xs text-muted-foreground">Una fila por línea, columnas separadas con | . La primera fila es el encabezado.</p>
                  </>}
                </div>
              ))}
              <div className="flex flex-wrap gap-2">{(Object.keys(NEW_BLOCK) as Block["type"][]).map((t) => <button key={t} className="btn-pixel btn-sm btn-ghost" onClick={() => upd({ blocks: [...st.blocks, NEW_BLOCK[t]] })}>+ {{ heading: "Subtítulo", text: "Texto", image: "Imagen", video: "Video", link: "Enlace", table: "Tabla", list: "Lista", cards: "Tarjetas", quote: "Frase", route: "Mapa ruta" }[t]}</button>)}</div>
              <div className="flex justify-between border-t-2 border-border pt-4">
                <button className="btn-pixel btn-danger" onClick={() => { if (confirm("¿Eliminar esta estación?")) { setList(list.filter((_, i) => i !== sel)); setSel(0); } }}>Eliminar estación</button>
                <button className="btn-pixel" onClick={save}>💾 Guardar cambios</button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
