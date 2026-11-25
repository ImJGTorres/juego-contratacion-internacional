import { useEffect, useRef, useState } from "react";
import { type Avatar, type Dir, CLOTHES, HAIR_COLORS, SKINS, drawAvatar } from "@/lib/avatar";

function Preview({ a }: { a: Avatar }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [dir, setDir] = useState<Dir>("down");
  useEffect(() => {
    const c = ref.current!.getContext("2d")!; c.imageSmoothingEnabled = false;
    let f = 0; const id = setInterval(() => { f = (f % 2) + 1; c.clearRect(0, 0, 200, 220); drawAvatar(c, a, 20, 30, 160, dir, f); }, 250);
    c.clearRect(0, 0, 200, 220); drawAvatar(c, a, 20, 30, 160, dir, 0);
    return () => clearInterval(id);
  }, [a, dir]);
  return (
    <div className="flex flex-col items-center gap-3">
      <canvas ref={ref} width={200} height={220} className="pixel-canvas pixel-panel stage" />
      <div className="flex gap-2">{(["left", "down", "up", "right"] as Dir[]).map((d) => <button key={d} onClick={() => setDir(d)} className={`btn-pixel btn-sm ${dir === d ? "" : "btn-ghost"}`}>{{ left: "←", down: "↓", up: "↑", right: "→" }[d]}</button>)}</div>
    </div>
  );
}

function Opts<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (<div><p className="label-pixel">{label}</p><div className="flex flex-wrap gap-2">{options.map((o) => <button key={o} onClick={() => onChange(o)} className={`btn-pixel btn-sm capitalize ${value === o ? "" : "btn-ghost"}`}>{o}</button>)}</div></div>);
}
function Colors({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (<div><p className="label-pixel">{label}</p><div className="flex flex-wrap gap-2">{options.map((o) => <button key={o} aria-label={o} onClick={() => onChange(o)} className={`swatch ${value === o ? "swatch-on" : ""}`} style={{ background: o }} />)}</div></div>);
}

export function AvatarEditor({ avatar, onChange, onEnter }: { avatar: Avatar; onChange: (a: Avatar) => void; onEnter: () => void }) {
  const set = <K extends keyof Avatar>(k: K, v: Avatar[K]) => onChange({ ...avatar, [k]: v });
  return (
    <div className="scene flex min-h-screen items-center justify-center p-6">
      <div className="pixel-panel grid w-full max-w-5xl gap-8 bg-card p-8 text-card-foreground md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-6">
          <h2 className="font-pixel text-2xl text-primary">Tu personaje</h2>
          <Preview a={avatar} />
          <button className="btn-pixel btn-lg" onClick={onEnter}>▶ Entrar al mundo</button>
        </div>
        <div className="grid gap-5">
          <Opts label="Estilo de personaje" value={avatar.style} options={["humano", "elfo", "gato", "robot"]} onChange={(v) => set("style", v)} />
          <Colors label="Tono de piel" value={avatar.skin} options={SKINS} onChange={(v) => set("skin", v)} />
          <Opts label="Peinado" value={avatar.hair} options={["corto", "largo", "punk", "mono", "calvo"]} onChange={(v) => set("hair", v)} />
          <Colors label="Color de cabello" value={avatar.hairColor} options={HAIR_COLORS} onChange={(v) => set("hairColor", v)} />
          <Colors label="Camiseta" value={avatar.shirt} options={CLOTHES} onChange={(v) => set("shirt", v)} />
          <Colors label="Pantalón" value={avatar.pants} options={CLOTHES} onChange={(v) => set("pants", v)} />
          <Opts label="Accesorio" value={avatar.accessory} options={["ninguno", "gafas", "gorra", "corona", "bufanda"]} onChange={(v) => set("accessory", v)} />
        </div>
      </div>
    </div>
  );
}
