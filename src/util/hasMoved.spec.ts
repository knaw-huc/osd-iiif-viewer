import {describe, expect, it} from 'vitest';
import {hasMoved} from './hasMoved';

describe('hasMoved', () => {
  const origin = {x: 0, y: 0};

  it('returns false when the pointer has not moved', () => {
    expect(hasMoved(origin, origin, 1)).toBe(false);
  });

  it('returns false when pointer shifted within threshold', () => {
    expect(hasMoved(origin, {x: 1, y: 1}, 2)).toBe(false);
  });

  it('returns false when shift equals threshold', () => {
    expect(hasMoved(origin, {x: 3, y: 4}, 5)).toBe(false);
  });

  it('is true when pointer shifted over threshold', () => {
    expect(hasMoved(origin, {x: 3, y: 4}, 4)).toBe(true);
  });

  it('measures negative directions', () => {
    expect(hasMoved(origin, {x: -3, y: -4}, 4)).toBe(true);
  });
});
