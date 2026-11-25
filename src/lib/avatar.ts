export type Dir = "down" | "up" | "left" | "right";
export interface Avatar {
  style: "humano" | "elfo" | "gato" | "robot";
  skin: string;
  hair: "corto" | "largo" | "punk" | "mono" | "calvo";
  hairColor: string;
  shirt: string;
  pants: string;
  accessory: "ninguno" | "gafas" | "gorra" | "corona" | "bufanda";
}

export const SKINS = ["#f6d7b0", "#e8b98a", "#c68642", "#8d5524", "#5c3a21", "#bcd7ee"];
export const HAIR_COLORS = ["#2b1b12", "#6b3e1f", "#e8c15a", "#d9472b", "#3fa3d6", "#e86fb0", "#ececec"];
export const CLOTHES = ["#e4483f", "#f2a93b", "#3cae63", "#3a7bd5", "#7a4fd1", "#2f2f3a", "#f3efe6"];
export const DEFAULT_AVATAR: Avatar = {
  style: "humano", skin: SKINS[0]!, hair: "corto", hairColor: HAIR_COLORS[1]!,
  shirt: CLOTHES[3]!, pants: CLOTHES[5]!, accessory: "ninguno",
};

const KEY = "mundo-avatar-v1";
export function loadAvatar(): Avatar {
  try { const r = localStorage.getItem(KEY); return r ? { ...DEFAULT_AVATAR, ...JSON.parse(r) } : DEFAULT_AVATAR; }
  catch { return DEFAULT_AVATAR; }
}
export function saveAvatar(a: Avatar) { localStorage.setItem(KEY, JSON.stringify(a)); }

/** Dibuja el avatar en una cuadrícula de 16x16 "píxeles" dentro de size x size. */
export function drawAvatar(ctx: CanvasRenderingContext2D, a: Avatar, x: number, y: number, size: number, dir: Dir, frame: number) {
  const u = size / 16;
  const r = (cx: number, cy: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x + cx * u), Math.round(y + cy * u), Math.ceil(w * u), Math.ceil(h * u)); };
  const skin = a.style === "robot" ? "#a9b4c2" : a.skin;
  const outline = "#1d1a26";
  // sombra
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(x + 8 * u, y + 15.5 * u, 5 * u, 1.2 * u, 0, 0, Math.PI * 2); ctx.fill();
  // piernas (animación)
  const step = frame % 2 === 1 ? 1 : 0;
  r(5, 12, 2.5, 3 - step, a.pants); r(8.5, 12, 2.5, 3 - (1 - step) * (frame ? 1 : 0), a.pants);
  r(5, 15 - step, 2.5, 1, outline); r(8.5, 15 - (frame ? 1 - step : 0), 2.5, 1, outline);
  // cuerpo
  r(4, 8, 8, 4.5, a.shirt);
  r(3, 8.5, 1, 3, skin); r(12, 8.5, 1, 3, skin);
  if (a.style === "robot") r(6.5, 9, 3, 2, "#f2c14e");
  if (a.accessory === "bufanda") { r(4, 7.5, 8, 1.5, "#e4483f"); r(9, 9, 1.5, 2, "#e4483f"); }
  // cabeza
  r(4, 1.5, 8, 6.5, skin);
  if (a.style === "elfo") { if (dir !== "right") r(2.5, 3.5, 1.5, 1.5, skin); if (dir !== "left") r(12, 3.5, 1.5, 1.5, skin); }
  if (a.style === "gato") { r(4, 0, 2, 2, a.hairColor); r(10, 0, 2, 2, a.hairColor); r(4.5, 0.6, 1, 1, "#f2a0b4"); r(10.5, 0.6, 1, 1, "#f2a0b4"); }
  if (a.style === "robot") { r(7.5, -0.5, 1, 2, "#7a8696"); r(7, -1, 2, 1, "#e4483f"); }
  // cabello
  const hc = a.hairColor;
  if (a.style !== "robot" && a.hair !== "calvo") {
    r(4, 1, 8, 1.8, hc);
    if (dir === "up") r(4, 1, 8, 6, hc);
    if (a.hair === "largo") { r(3.5, 2, 1.2, 7, hc); r(11.3, 2, 1.2, 7, hc); }
    if (a.hair === "punk") { r(6, -0.5, 1.2, 1.6, hc); r(7.5, -1, 1.2, 2, hc); r(9, -0.5, 1.2, 1.6, hc); }
    if (a.hair === "mono") r(6.5, -1, 3, 2.2, hc);
    if (a.hair === "corto" && dir !== "up") { r(4, 2.5, 1, 1.5, hc); r(11, 2.5, 1, 1.5, hc); }
  }
  // cara
  if (dir !== "up") {
    const eye = a.style === "robot" ? "#3fd0e0" : outline;
    if (dir === "down") { r(5.5, 4.5, 1.2, 1.4, eye); r(9.3, 4.5, 1.2, 1.4, eye); r(7.3, 6.3, 1.4, 0.6, "#b0503c"); }
    if (dir === "left") r(5, 4.5, 1.2, 1.4, eye);
    if (dir === "right") r(9.8, 4.5, 1.2, 1.4, eye);
    if (a.accessory === "gafas") {
      if (dir === "down") { r(5, 4.2, 2.2, 2, "rgba(30,30,40,.85)"); r(8.8, 4.2, 2.2, 2, "rgba(30,30,40,.85)"); r(7.2, 4.8, 1.6, 0.5, outline); }
      else r(dir === "left" ? 4.5 : 9.3, 4.2, 2.2, 2, "rgba(30,30,40,.85)");
    }
  }
  if (a.accessory === "gorra") { r(3.5, 0.5, 9, 2, "#e4483f"); if (dir === "down") r(4, 2.3, 8, 0.8, "#b8302a"); if (dir === "left") r(1.5, 2, 3, 0.8, "#b8302a"); if (dir === "right") r(11.5, 2, 3, 0.8, "#b8302a"); }
  if (a.accessory === "corona") { r(4.5, -0.5, 7, 1.5, "#f2c14e"); r(4.5, -1.5, 1, 1, "#f2c14e"); r(7.5, -1.8, 1, 1.3, "#f2c14e"); r(10.5, -1.5, 1, 1, "#f2c14e"); }
}
