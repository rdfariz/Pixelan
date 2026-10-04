/** 5×7 bitmap glyphs used by the pixel wordmarks (footer + preloader). */
export const GLYPHS: Record<string, string[]> = {
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
}

/** Lay a word out on a grid (1 empty column between letters). */
export function bitmap(text: string, pad = 0) {
  const letters = [...text.toUpperCase()].filter((l) => GLYPHS[l])
  const cols = letters.length * 6 - 1 + pad * 2
  const rows = 7 + pad * 2
  const cells: boolean[] = Array(cols * rows).fill(false)
  letters.forEach((letter, li) => {
    GLYPHS[letter].forEach((row, y) => {
      ;[...row].forEach((c, x) => {
        if (c === '#') cells[(y + pad) * cols + pad + li * 6 + x] = true
      })
    })
  })
  return { cells, cols, rows }
}

/** Deterministic 0–1 pseudo-random value — identical on server and client (no hydration drift). */
export const hash01 = (i: number, seed = 1) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}
