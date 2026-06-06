/** Simple seeded PRNG for deterministic tests (mulberry32). */
export class SeededRandom {
  private state: number;

  constructor(seed: number = Date.now()) {
    this.state = seed >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  bool(probability = 0.5): boolean {
    return this.next() < probability;
  }
}

export function createRandom(seed?: number): SeededRandom {
  return new SeededRandom(seed ?? Date.now());
}
