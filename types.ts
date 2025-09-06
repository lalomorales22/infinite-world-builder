
export enum Tool {
  Select = 'SELECT',
  Highlight = 'HIGHLIGHT',
  Draw = 'DRAW',
  Erase = 'ERASE',
  Eyedropper = 'EYEDROPPER',
  Zoom = 'ZOOM',
}

export interface Point {
  x: number;
  y: number;
}

export interface Selection {
  start: Point;
  end: Point;
}

export interface CellData {
  id: string; // "x,y"
  prompt: string;
  imageUrl: string;
}

export type GridData = Map<string, CellData>;
export type DrawLayerData = Map<string, string>;
export type HighlightLayerData = Map<string, boolean>;

export interface Viewport {
  pan: Point;
  zoom: number;
  rotation: number;
}
