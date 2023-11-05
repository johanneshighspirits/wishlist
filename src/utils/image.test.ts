import { describe, expect, it } from 'vitest';
import { cropImageSize } from './image';

describe('cropImageSize should calculate cropped image dimensions, given a', () => {
  it('landscape -> portrait', () => {
    const img = { width: 1600, height: 900 };
    const { x, y, width, height } = cropImageSize(img, {
      width: 100,
      height: 300,
    });
    expect(width).toBeCloseTo(533.333);
    expect(height).toBe(300);
    expect(x).toBeCloseTo(-216.666);
    expect(y).toBe(0);
  });
  it('landscape -> square', () => {
    const img = { width: 1600, height: 900 };
    const { x, y, width, height } = cropImageSize(img, {
      width: 320,
      height: 320,
    });
    expect(x).toBeCloseTo(-124.444);
    expect(y).toBe(0);
    expect(width).toBeCloseTo(568.888);
    expect(height).toBe(320);
  });
  it('landscape -> landscape', () => {
    const img = { width: 1600, height: 900 };
    const { x, y, width, height } = cropImageSize(img, {
      width: 160,
      height: 90,
    });
    expect(x).toBe(0);
    expect(y).toBe(0);
    expect(width).toBe(160);
    expect(height).toBe(90);
  });
});
