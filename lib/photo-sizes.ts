/**
 * Responsive-image maths for object-fit: cover crops.
 *
 * next/image picks a source width from `sizes`, which describes the *frame*.
 * When a wide photo fills a narrower frame, the photo is rendered wider than
 * the frame and would be upscaled (blurry) if only the frame width were
 * requested. `coverSizes` scales each length in `sizes` by that overflow so
 * the browser requests enough pixels for the visible crop.
 */
export function parseRatio(ratio: string): number {
  const [w, h] = ratio.split('/').map((n) => Number(n.trim()));
  return w && h ? w / h : 1;
}

/** How much wider than the frame the photo renders under object-fit: cover. */
export function coverFactor(imageWidth: number, imageHeight: number, frameRatio: number, hoverScale = 1): number {
  const imageRatio = imageWidth / imageHeight;
  return Math.max(1, imageRatio / frameRatio) * hoverScale;
}

/** Multiplies the length at the end of each `sizes` entry (vw or px), leaving media conditions untouched. */
export function scaleSizes(sizes: string, factor: number): string {
  if (factor <= 1.001) return sizes;
  return sizes
    .split(',')
    .map((entry) =>
      entry.replace(/(\d+(?:\.\d+)?)(vw|px)\s*$/, (_, n: string, unit: string) => `${Math.ceil(Number(n) * factor)}${unit}`),
    )
    .join(',');
}

/**
 * Widest frame (in CSS px, at a given device pixel ratio) a photo can fill at
 * this aspect ratio without being enlarged beyond its native resolution.
 */
export function maxSharpFrameWidth(imageWidth: number, imageHeight: number, frameRatio: number, dpr = 1): number {
  const imageRatio = imageWidth / imageHeight;
  // Visible source width: the full width if the frame is wider than the photo, otherwise the cropped band.
  const visibleSourceWidth = frameRatio >= imageRatio ? imageWidth : imageHeight * frameRatio;
  return Math.floor(visibleSourceWidth / dpr);
}
