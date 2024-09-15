declare module 'leaflet-boundary-canvas' {
  import * as L from 'leaflet';

  namespace BoundaryCanvas {
    interface BoundaryCanvasOptions extends L.TileLayerOptions {
      boundary?: any;
    }

    class BoundaryCanvas extends L.TileLayer {
      constructor(urlTemplate: string, options?: BoundaryCanvasOptions);
    }
  }

  export = BoundaryCanvas;
}