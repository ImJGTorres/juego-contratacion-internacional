// Tienda Homecenter compacta en vista isométrica. Cambia buildMap() para reorganizar la tienda.
// Solo existen paredes al norte (y=0) y al oeste (x=0); los bordes sur y este quedan abiertos.
export const COLS = 14, ROWS = 10;
export const TW = 64, TH = 32; // tamaño del rombo de cada casilla
export const OX = 320, OY = 120; // origen en pantalla de la casilla (0,0)
export const W = 768, H = 500; // tamaño del canvas
export const WALL_H = 90;

/** Casilla (puede ser fraccionaria) -> pixel del canvas. */
export const toScreen = (gx: number, gy: number) => ({ x: (gx - gy) * (TW / 2) + OX, y: (gx + gy) * (TH / 2) + OY });

export type Tile =
  | "floor" | "wall" | "void" | "mat" | "dishes" | "fridge" | "sink" | "toilet"
  | "tiles" | "paint" | "toolrack" | "shelf" | "flagCO" | "flagCL" | "plant";
export const SIGNS: Record<number, string> = { 2: "COCINA", 4: "ELECTRO", 8: "BAÑOS", 11: "PINTURAS" };

export function buildMap(): Tile[][] {
  const m: Tile[][] = [];
  for (let y = 0; y < ROWS; y++) {
    const row: Tile[] = [];
    for (let x = 0; x < COLS; x++) row.push(x === 0 || y === 0 ? "wall" : x === COLS - 1 || y === ROWS - 1 ? "void" : "floor");
    m.push(row);
  }
  const put = (t: Tile, ...xy: [number, number][]) => xy.forEach(([x, y]) => { m[y]![x] = t; });
  put("dishes", [1, 1], [2, 1]);
  put("fridge", [3, 1], [4, 1]);
  put("flagCO", [5, 1]);
  put("sink", [7, 1], [8, 1]); put("toilet", [9, 1]);
  put("flagCL", [10, 1]);
  put("paint", [11, 1], [12, 1]);
  put("shelf", [1, 3], [1, 4]);
  put("shelf", [5, 4], [6, 4]);
  put("tiles", [8, 3], [9, 3]);
  put("toolrack", [12, 5], [12, 6]);
  put("plant", [1, 8], [12, 8], [12, 3]);
  put("mat", [8, 8], [9, 8]);
  return m;
}
export const SOLID: Tile[] = ["wall", "void", "dishes", "fridge", "sink", "toilet", "tiles", "paint", "toolrack", "shelf", "flagCO", "flagCL", "plant"];
