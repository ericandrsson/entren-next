import maplibregl from "maplibre-gl";

export function animateIconSize(
  map: maplibregl.Map,
  layerId: string,
  initialSize: number,
  finalSize: number,
  duration: number,
): void {
  const startTime = performance.now();
  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentSize = initialSize + progress * (finalSize - initialSize);

    // Set the current icon size
    map.setLayoutProperty(layerId, "icon-size", currentSize);

    // If animation is not finished, request the next frame
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Optionally, scale back to the original size
      requestAnimationFrame(() =>
        animateIconSize(map, layerId, finalSize, initialSize, duration),
      );
    }
  };
  requestAnimationFrame(step);
}

export function toggleIconSelection(
  map: maplibregl.Map,
  layerId: string,
  initialSize: number,
  selectedSize: number,
  duration: number,
): void {
  const scaleUpStart = performance.now();

  const scaleUp = (now: number) => {
    const elapsed = now - scaleUpStart;
    const progress = Math.min(elapsed / duration, 1);
    const currentSize = initialSize + progress * (selectedSize - initialSize);
    map.setLayoutProperty(layerId, "icon-size", currentSize);

    if (progress < 1) {
      requestAnimationFrame(scaleUp);
    } else {
      // Scale back to initial size
      const scaleDownStart = performance.now();
      const scaleDown = (now: number) => {
        const elapsed = now - scaleDownStart;
        const progress = Math.min(elapsed / duration, 1);
        const currentSize =
          selectedSize - progress * (selectedSize - initialSize);
        map.setLayoutProperty(layerId, "icon-size", currentSize);

        if (progress < 1) {
          requestAnimationFrame(scaleDown);
        }
      };
      requestAnimationFrame(scaleDown);
    }
  };

  requestAnimationFrame(scaleUp);
}
