interface DraggableOptions {
  maxX?: number;
  maxY?: number;
  ease?: boolean;
  easeTime?: number;
  holdTime?: number;
  maxIterations?: number;
  handle?: string;
  grid?: number;
  frameRate?: number;
  dropEl?: string | HTMLElement | HTMLElement[];
  disabled?: boolean;
  initialCoords?: {
    x: number;
    y: number;
  };
  id?: string;
}

export default DraggableOptions;
