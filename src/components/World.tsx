import { useEffect, useMemo, useRef, useState } from "react";
import { type Avatar, type Dir, drawAvatar } from "@/lib/avatar";
import { type Station } from "@/lib/content";
import { COLS, ROWS, W, H, WALL_H, buildMap, toScreen, SOLID, SIGNS, type Tile } from "@/lib/map";
import { StationModal } from "./StationModal";
import { BookModal } from "./BookModal";

type Ctx = CanvasRenderingContext2D;
type Box = { x0: number; y0: number; x1: number; y1: number; z: number; h: number };
type Col = [top: string, left: string, right: string];
const P = (x: number, y: number, z = 0) => { const s = toScreen(x, y); return { x: s.x, y: s.y - z }; };

function poly(c: Ctx, pts: { x: number; y: number }[], fill: string) {
  c.fillStyle = fill; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); c.fill();
}

/** Prisma isométrico: cara superior clara, izquierda media, derecha oscura. mx/my/w/d en casillas; z/h en píxeles. */
function box(c: Ctx, gx: number, gy: number, mx: number, my: number, w: number, d: number, z: number, h: number, [top, left, right]: Col): Box {
  const x0 = gx + mx, y0 = gy + my, x1 = x0 + w, y1 = y0 + d, zt = z + h;
  poly(c, [P(x0, y1, zt), P(x1, y1, zt), P(x1, y1, z), P(x0, y1, z)], left);
  poly(c, [P(x1, y0, zt), P(x1, y1, zt), P(x1, y1, z), P(x1, y0, z)], right);
  poly(c, [P(x0, y0, zt), P(x1, y0, zt), P(x1, y1, zt), P(x0, y1, zt)], top);
  return { x0, y0, x1, y1, z, h };
}

/** Rectángulo pintado sobre la cara frontal-izquierda (L) o frontal-derecha (R) de un prisma. u en 0..1, v en píxeles desde la base. */
function face(c: Ctx, b: Box, side: "L" | "R", u0: number, u1: number, v0: number, v1: number, col: string) {
  const pt = (u: number, v: number) => side === "L" ? P(b.x0 + u * (b.x1 - b.x0), b.y1, b.z + v) : P(b.x1, b.y0 + u * (b.y1 - b.y0), b.z + v);
  poly(c, [pt(u0, v1), pt(u1, v1), pt(u1, v0), pt(u0, v0)], col);
}

const WHITE: Col = ["#ffffff", "#e8edf3", "#c9d2de"];
const BLUE: Col = ["#2a62b8", "#1d4fa3", "#12356f"];
const WOOD: Col = ["#d8b383", "#b98f5c", "#9a763f"];
const DARK: Col = ["#3a4558", "#2b3443", "#1f2733"];
const BROWN: Col = ["#8a5a33", "#6b4426", "#52331a"];
const GRAY: Col = ["#9aa3b0", "#808998", "#68717f"];
const GREEN: Col = ["#3d9a48", "#2f7d3a", "#235f2c"];
const PRODUCTS = ["#e4483f", "#f2c14e", "#3cae63", "#ffffff", "#6fa8d8", "#e86fb0"];

function drawWall(c: Ctx, x: number, y: number) {
  const b = box(c, x, y, 0, 0, 1, 1, 0, WALL_H, ["#3b74cf", "#1d4fa3", "#12356f"]);
  face(c, b, "L", 0, 1, 26, 32, "#ffffff"); face(c, b, "R", 0, 1, 26, 32, "#ffffff");
  face(c, b, "L", 0, 1, 0, 8, "#0b2a5b"); face(c, b, "R", 0, 1, 0, 8, "#0b2a5b");
  const label = y === 0 ? SIGNS[x] : undefined;
  if (label) {
    const s = box(c, x, 0, -0.5, 0.4, 2, 0.15, WALL_H, 26, WHITE);
    face(c, s, "L", 0, 1, 0, 3, "#1d4fa3");
    const o = P(s.x0, s.y1, s.z + s.h);
    c.save(); c.translate(o.x, o.y); c.transform(1, 0.5, 0, 1, 0, 0);
    c.fillStyle = "#0b2a5b"; c.font = "bold 11px monospace"; c.textAlign = "center"; c.fillText(label, 32, 17); c.restore();
  }
}

function flag(c: Ctx, gx: number, gy: number, co: boolean) {
  box(c, gx, gy, 0.3, 0.3, 0.4, 0.4, 0, 4, DARK);
  box(c, gx, gy, 0.46, 0.46, 0.08, 0.08, 0, 74, GRAY);
  const f = box(c, gx, gy, 0.54, 0.46, 0.4, 0.06, 50, 22, WHITE);
  if (co) { face(c, f, "L", 0, 1, 11, 22, "#fcd116"); face(c, f, "L", 0, 1, 5.5, 11, "#003893"); face(c, f, "L", 0, 1, 0, 5.5, "#ce1126"); }
  else { face(c, f, "L", 0, 1, 0, 11, "#d52b1e"); face(c, f, "L", 0, 0.35, 11, 22, "#0039a6"); }
}

function drawObj(c: Ctx, t: Tile, gx: number, gy: number) {
  const b = (mx: number, my: number, w: number, d: number, z: number, h: number, col: Col) => box(c, gx, gy, mx, my, w, d, z, h, col);
  switch (t) {
    case "fridge": {
      const steel = gx % 2 === 0;
      const f = b(0.1, 0.1, 0.8, 0.8, 0, 72, steel ? ["#dfe4ea", "#b9c1cc", "#8f98a5"] : WHITE);
      face(c, f, "L", 0, 1, 40, 42, "#7d8794"); face(c, f, "L", 0.78, 0.86, 48, 68, "#4b5563"); face(c, f, "L", 0.78, 0.86, 10, 34, "#4b5563");
      break;
    }
    case "dishes": {
      const base = b(0.05, 0.05, 0.9, 0.9, 0, 34, WHITE); face(c, base, "L", 0, 1, 0, 4, "#1d4fa3");
      b(0.15, 0.4, 0.3, 0.3, 34, 10, WHITE); b(0.55, 0.45, 0.3, 0.3, 34, 14, ["#a9d3f5", "#8fc0ea", "#6fa8d8"]);
      const up = b(0.05, 0.05, 0.9, 0.35, 52, 30, WHITE); face(c, up, "L", 0.06, 0.94, 4, 26, "#bcd0ee");
      break;
    }
    case "sink": {
      const base = b(0.05, 0.05, 0.9, 0.9, 0, 34, WOOD); face(c, base, "L", 0.1, 0.9, 4, 28, "#b98f5c");
      b(0.2, 0.25, 0.6, 0.55, 34, 3, WHITE); b(0.3, 0.35, 0.4, 0.35, 36, 1, ["#bfe0f7", "#bfe0f7", "#bfe0f7"]);
      b(0.46, 0.1, 0.08, 0.08, 34, 18, GRAY); b(0.46, 0.1, 0.08, 0.25, 50, 3, GRAY);
      break;
    }
    case "toilet":
      b(0.28, 0.06, 0.44, 0.22, 0, 36, WHITE); b(0.3, 0.3, 0.4, 0.55, 0, 16, WHITE);
      b(0.28, 0.28, 0.44, 0.6, 16, 3, ["#dbe6f3", "#c0cfe3", "#a8b9d1"]);
      break;
    case "tiles":
      b(0.1, 0.1, 0.8, 0.8, 0, 6, BROWN); b(0.15, 0.15, 0.7, 0.7, 6, 10, ["#c7a27a", "#a8845d", "#8b6a45"]);
      b(0.15, 0.15, 0.7, 0.7, 16, 10, GRAY); b(0.15, 0.15, 0.7, 0.7, 26, 10, ["#e6dccb", "#cfc4b0", "#b3a890"]);
      break;
    case "paint": {
      const f = b(0.05, 0.05, 0.9, 0.9, 0, 58, DARK);
      for (const z of [8, 34]) for (let i = 0; i < 3; i++) {
        const col = ["#1d4fa3", "#e4483f", "#f2c14e"][(i + z) % 3]!;
        face(c, f, "L", 0.07 + i * 0.3, 0.27 + i * 0.3, z, z + 14, col); face(c, f, "L", 0.07 + i * 0.3, 0.27 + i * 0.3, z + 14, z + 17, "#d1d5db");
        face(c, f, "R", 0.07 + i * 0.3, 0.27 + i * 0.3, z, z + 14, ["#3cae63", "#1d4fa3", "#e4483f"][(i + z) % 3]!);
      }
      break;
    }
    case "toolrack": {
      b(0.05, 0.3, 0.9, 0.6, 0, 22, BLUE);
      const r = b(0.05, 0.05, 0.9, 0.2, 0, 72, WOOD);
      face(c, r, "L", 0.1, 0.2, 26, 62, "#33363d"); face(c, r, "L", 0.08, 0.32, 54, 60, "#9aa3b0"); face(c, r, "L", 0.42, 0.52, 30, 64, "#1d4fa3");
      face(c, r, "L", 0.62, 0.7, 26, 58, "#e4483f"); face(c, r, "L", 0.8, 0.88, 36, 66, "#33363d");
      break;
    }
    case "shelf": {
      const f = b(0.08, 0.08, 0.84, 0.84, 0, 62, BLUE);
      for (const z of [4, 34]) {
        face(c, f, "L", 0.04, 0.96, z - 2, z, "#f4f6f9"); face(c, f, "R", 0.04, 0.96, z - 2, z, "#f4f6f9");
        for (let i = 0; i < 4; i++) {
          face(c, f, "L", 0.08 + i * 0.22, 0.25 + i * 0.22, z, z + 18, PRODUCTS[(i + z + gx) % PRODUCTS.length]!);
          face(c, f, "R", 0.08 + i * 0.22, 0.25 + i * 0.22, z, z + 18, PRODUCTS[(i * 2 + z + gy) % PRODUCTS.length]!);
        }
      }
      b(0.2, 0.2, 0.25, 0.25, 62, 8, ["#f2c14e", "#d9a92f", "#b88f1f"]); b(0.55, 0.5, 0.25, 0.25, 62, 8, ["#e4483f", "#c0392b", "#992d22"]);
      break;
    }
    case "flagCO": flag(c, gx, gy, true); break;
    case "flagCL": flag(c, gx, gy, false); break;
    case "plant":
      b(0.3, 0.3, 0.4, 0.4, 0, 14, BROWN); b(0.2, 0.2, 0.6, 0.6, 14, 20, GREEN); b(0.3, 0.3, 0.4, 0.4, 34, 14, ["#4fb35a", "#3d9a48", "#2f7d3a"]);
      break;
  }
}

const HEIGHT: Record<Station["kind"], number> = { register: 44, globe: 60, books: 80, tools: 78, book: 40 };

function drawStation(c: Ctx, s: Station, near: boolean, time: number) {
  const b = (mx: number, my: number, w: number, d: number, z: number, h: number, col: Col) => box(c, s.x, s.y, mx, my, w, d, z, h, col);
  if (near) {
    c.strokeStyle = "#ffd84d"; c.lineWidth = 3; c.beginPath();
    [P(s.x, s.y), P(s.x + 1, s.y), P(s.x + 1, s.y + 1), P(s.x, s.y + 1)].forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y))); c.closePath(); c.stroke();
  }
  switch (s.kind) {
    case "register": {
      const f = b(0.05, 0.1, 0.9, 0.8, 0, 30, ["#8a5a33", "#6b4426", "#52331a"]); face(c, f, "L", 0, 1, 22, 26, "#ffffff");
      b(0.55, 0.35, 0.3, 0.3, 30, 4, DARK);
      const m = b(0.62, 0.45, 0.2, 0.08, 34, 14, DARK); face(c, m, "L", 0.1, 0.9, 3, 11, Math.floor(time / 500) % 2 ? "#7ee0a8" : "#5cc98f");
      b(0.15, 0.3, 0.25, 0.35, 30, 4, ["#f4f6f9", "#dfe4ea", "#b9c1cc"]);
      break;
    }
    case "globe": {
      b(0.25, 0.25, 0.5, 0.5, 0, 8, BROWN); b(0.46, 0.46, 0.08, 0.08, 8, 18, BROWN);
      const o = P(s.x + 0.5, s.y + 0.5, 40);
      const g = c.createRadialGradient(o.x - 5, o.y - 6, 2, o.x, o.y, 18); g.addColorStop(0, "#7ec0ff"); g.addColorStop(1, "#1f5fb0");
      c.fillStyle = g; c.beginPath(); c.arc(o.x, o.y, 18, 0, Math.PI * 2); c.fill();
      c.fillStyle = "#3cae63"; c.beginPath(); c.ellipse(o.x - 5, o.y - 4, 6, 4, -0.4, 0, Math.PI * 2); c.ellipse(o.x + 6, o.y + 4, 5, 6, 0.3, 0, Math.PI * 2); c.fill();
      break;
    }
    case "books": {
      const f = b(0.05, 0.05, 0.9, 0.9, 0, 80, ["#7a4d2b", "#5a3a22", "#3f2716"]);
      const cols = ["#0b2a5b", "#ffffff", "#1d4fa3", "#9aa3b0", "#e4483f"];
      for (const z of [6, 30, 54]) { face(c, f, "L", 0.03, 0.97, z - 3, z, "#3b2414"); for (let i = 0; i < 5; i++) { face(c, f, "L", 0.07 + i * 0.18, 0.2 + i * 0.18, z, z + 18, cols[(i + z) % 5]!); face(c, f, "R", 0.07 + i * 0.18, 0.2 + i * 0.18, z, z + 18, cols[(i * 2 + z) % 5]!); } }
      break;
    }
    case "tools": {
      const bench = b(0.05, 0.3, 0.9, 0.65, 0, 30, BLUE); face(c, bench, "L", 0.1, 0.9, 8, 24, "#dbe6f3");
      const r = b(0.05, 0.05, 0.9, 0.18, 0, 78, WOOD);
      face(c, r, "L", 0.1, 0.2, 40, 70, "#33363d"); face(c, r, "L", 0.4, 0.62, 56, 62, "#e4483f"); face(c, r, "L", 0.72, 0.8, 44, 72, "#1d4fa3");
      b(0.2, 0.4, 0.4, 0.3, 30, 10, ["#e4483f", "#c0392b", "#992d22"]);
      break;
    }
    case "book": {
      b(0.3, 0.3, 0.4, 0.4, 0, 22, BROWN);
      const pg = b(0.12, 0.18, 0.76, 0.64, 22, 6, WHITE); face(c, pg, "L", 0.49, 0.51, 0, 6, "#0b2a5b");
      b(0.2, 0.28, 0.25, 0.04, 28, 1, GRAY); b(0.58, 0.28, 0.25, 0.04, 28, 1, GRAY);
      break;
    }
  }
  const bob = Math.sin(time / 250) * 2;
  const m = P(s.x + 0.5, s.y + 0.5, HEIGHT[s.kind] + 14);
  c.fillStyle = "#0b2a5b"; c.fillRect(m.x - 5, m.y - 6 + bob, 10, 12);
  c.fillStyle = near ? "#ffd84d" : "#ffffff"; c.fillRect(m.x - 3, m.y - 4 + bob, 6, 8);
  c.fillStyle = "#0b2a5b"; c.fillRect(m.x - 1, m.y - 2 + bob, 2, 3); c.fillRect(m.x - 1, m.y + 2 + bob, 2, 1);
}

function drawFloor(c: Ctx, map: Tile[][]) {
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const t = map[y]![x]!;
    if (t === "wall" || t === "void") continue;
    poly(c, [P(x, y), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1)], (x + y) % 2 ? "#dbe5f1" : "#cddae9");
    c.strokeStyle = "rgba(120,140,170,.35)"; c.lineWidth = 1; c.stroke();
    if (y === ROWS - 2) poly(c, [P(x, y + 1), P(x + 1, y + 1), P(x + 1, y + 1, -10), P(x, y + 1, -10)], "#8fa0b5");
    if (x === COLS - 2) poly(c, [P(x + 1, y), P(x + 1, y + 1), P(x + 1, y + 1, -10), P(x + 1, y, -10)], "#6f819a");
  }
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const t = map[y]![x]!;
    if (t === "mat") { poly(c, [P(x + 0.1, y + 0.1), P(x + 0.9, y + 0.1), P(x + 0.9, y + 0.9), P(x + 0.1, y + 0.9)], "#173f85"); poly(c, [P(x + 0.2, y + 0.2), P(x + 0.8, y + 0.2), P(x + 0.8, y + 0.8), P(x + 0.2, y + 0.8)], "#1d4fa3"); }
    else if (t !== "floor" && t !== "wall" && t !== "void") poly(c, [P(x + 0.1, y + 0.1), P(x + 1.15, y + 0.1), P(x + 1.15, y + 1.15), P(x + 0.1, y + 1.15)], "rgba(15,35,80,.16)");
  }
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function World({ avatar, stations, onExit }: { avatar: Avatar; stations: Station[]; onExit: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const map = useMemo(buildMap, []);
  // Las estaciones guardadas con coordenadas del mapa anterior se acomodan dentro de la tienda.
  const placed = useMemo(() => stations.map((s) => ({ ...s, x: clamp(s.x, 1, COLS - 2), y: clamp(s.y, 1, ROWS - 2) })), [stations]);
  const [open, setOpen] = useState<Station | null>(null);
  const [near, setNear] = useState<Station | null>(null);
  const openRef = useRef(open); openRef.current = open;
  const nearRef = useRef(near); nearRef.current = near;
  const visited = useRef(new Set<string>());
  const [visitedCount, setVisitedCount] = useState(0);

  const openStation = (s: Station) => { setOpen(s); visited.current.add(s.id); setVisitedCount(visited.current.size); };

  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!;
    const keys = new Set<string>();
    const p = { x: 9.5, y: 7, dir: "down" as Dir, frame: 0, acc: 0 };
    const solidAt = (gx: number, gy: number) => {
      const tx = Math.floor(gx), ty = Math.floor(gy);
      const t = map[ty]?.[tx]; if (!t || SOLID.includes(t)) return true;
      return placed.some((s) => s.x === tx && s.y === ty);
    };
    const R = 0.22;
    const blocked = (x: number, y: number) => solidAt(x - R, y - R) || solidAt(x + R, y - R) || solidAt(x - R, y + R) || solidAt(x + R, y + R);
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
      if (openRef.current) return;
      if ((k === "x" || k === "e" || k === "enter") && nearRef.current) { openStation(nearRef.current); keys.clear(); return; }
      keys.add(k);
    };
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);
    let last = performance.now(), raf = 0;
    const loop = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      if (!openRef.current) {
        // Las teclas se leen en pantalla (↑ = arriba en pantalla) y se convierten a la cuadrícula isométrica.
        let sx = 0, sy = 0;
        if (keys.has("arrowleft") || keys.has("a")) sx -= 1;
        if (keys.has("arrowright") || keys.has("d")) sx += 1;
        if (keys.has("arrowup") || keys.has("w")) sy -= 1;
        if (keys.has("arrowdown") || keys.has("s")) sy += 1;
        if (sx || sy) {
          const gx = sx + sy, gy = sy - sx, len = Math.hypot(gx, gy), sp = 0.0032 * dt;
          const dx = (gx / len) * sp, dy = (gy / len) * sp;
          if (!blocked(p.x + dx, p.y)) p.x += dx;
          if (!blocked(p.x, p.y + dy)) p.y += dy;
          p.dir = Math.abs(sx) > Math.abs(sy) ? (sx < 0 ? "left" : "right") : sy < 0 ? "up" : "down";
          p.acc += dt; if (p.acc > 160) { p.acc = 0; p.frame = (p.frame % 2) + 1; }
        } else p.frame = 0;
      }
      let best = null as Station | null; let bd = 1.5;
      for (const s of placed) { const d = Math.hypot(s.x + 0.5 - p.x, s.y + 0.5 - p.y); if (d < bd) { bd = d; best = s; } }
      if (best?.id !== nearRef.current?.id) setNear(best);

      ctx.clearRect(0, 0, W, H);
      drawFloor(ctx, map);
      const walls: [number, number][] = [];
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (map[y]![x] === "wall") walls.push([x, y]);
      walls.sort((a, b) => a[0] + a[1] - (b[0] + b[1])).forEach(([x, y]) => drawWall(ctx, x, y));
      const items: { k: number; draw: () => void }[] = [];
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        const t = map[y]![x]!;
        if (t !== "floor" && t !== "wall" && t !== "void" && t !== "mat") items.push({ k: x + y + 1, draw: () => drawObj(ctx, t, x, y) });
      }
      for (const s of placed) items.push({ k: s.x + s.y + 1, draw: () => drawStation(ctx, s, s.id === best?.id, now) });
      items.push({ k: p.x + p.y, draw: () => { const o = P(p.x, p.y); drawAvatar(ctx, avatar, o.x - 28, o.y - 54, 56, p.dir, p.frame); } });
      items.sort((a, b) => a.k - b.k).forEach((i) => i.draw());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, [avatar, placed, map]);

  return (
    <div className="scene flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full max-w-[880px] items-center justify-between gap-4">
        <button className="btn-pixel btn-ghost" onClick={onExit}>← Editar avatar</button>
        <div className="pixel-panel bg-card px-4 py-2 font-pixel text-sm text-card-foreground">⭐ Puntos descubiertos: {visitedCount}/{stations.length}</div>
      </div>
      <div className="relative">
        <canvas ref={canvas} width={W} height={H} className="pixel-panel h-auto w-[min(880px,92vw,calc((100vh-170px)*768/500))] bg-[#e9f0f8]" />
        {near && !open && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2">
            <button className="btn-pixel animate-pulse-soft" onClick={() => openStation(near)}>Presiona <kbd className="key">X</kbd> para descubrir · {near.title}</button>
          </div>
        )}
      </div>
      <p className="font-pixel text-xs text-muted-foreground">Muévete con ← ↑ → ↓ o W A S D · Interactúa con X</p>
      {open && (open.kind === "book" ? <BookModal station={open} onClose={() => setOpen(null)} /> : <StationModal station={open} onClose={() => setOpen(null)} />)}
    </div>
  );
}
