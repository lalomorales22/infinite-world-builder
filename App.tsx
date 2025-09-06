import React, { useState, useCallback, useMemo, WheelEvent } from 'react';
import {
  SelectIcon,
  HighlightIcon,
  DrawIcon,
  EraseIcon,
  EyedropperIcon,
  ZoomIcon,
  RotateLeftIcon,
  RotateRightIcon,
  ChatIcon,
} from './components/Icons';
import { Tool, Selection, Point, GridData, CellData } from './types';
import { generateBaseTerrain, generateWorldTile } from './services/geminiService';

const GRID_SIZE = 32; // 32x32 grid
const CELL_SIZE_PX = 25; // Each cell is 25px

interface Feature {
  id: string;
  selection: Selection;
  imageUrl: string;
  prompt: string;
}

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.Select);
  const [globalPrompt, setGlobalPrompt] = useState<string>('A vibrant, lush fantasy world with glowing flora and ancient ruins.');
  const [localPrompt, setLocalPrompt] = useState<string>('');
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [baseTerrain, setBaseTerrain] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  
  const [isDragging, setIsDragging] = useState(false);

  // Re-create gridData from features for the geminiService
  const gridData: GridData = useMemo(() => {
    const map: GridData = new Map<string, CellData>();
    features.forEach(feature => {
      const { start, end } = feature.selection;
      const startX = Math.min(start.x, end.x);
      const endX = Math.max(start.x, end.x);
      const startY = Math.min(start.y, end.y);
      const endY = Math.max(start.y, end.y);

      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          const key = `${x},${y}`;
          map.set(key, {
            id: key,
            prompt: feature.prompt,
            imageUrl: feature.imageUrl,
          });
        }
      }
    });
    return map;
  }, [features]);

  const handleGenerateBaseTerrain = useCallback(async () => {
    if (!globalPrompt) {
      setApiError("Please enter a global theme prompt.");
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      const imageUrl = await generateBaseTerrain(globalPrompt);
      setBaseTerrain(imageUrl);
    } catch (error: any) {
      console.error(error);
      setApiError(error.message || "Failed to generate base terrain.");
    } finally {
      setIsLoading(false);
    }
  }, [globalPrompt]);
  
  const handleResetWorld = () => {
    if (window.confirm("Are you sure you want to reset the world? This will clear all generated terrain and features.")) {
        setBaseTerrain(null);
        setFeatures([]);
        setSelection(null);
        setApiError(null);
        setGlobalPrompt('A vibrant, lush fantasy world with glowing flora and ancient ruins.');
    }
  };

  const handleGenerateTile = useCallback(async () => {
    if (!localPrompt || !selection) {
      setApiError("Please enter a local prompt and make a selection.");
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      const imageUrl = await generateWorldTile(globalPrompt, localPrompt, selection, gridData);
      
      const newFeature: Feature = {
        id: new Date().toISOString(),
        selection,
        imageUrl,
        prompt: localPrompt,
      };
      
      setFeatures(prev => [...prev, newFeature]);
      setSelection(null);
      setLocalPrompt('');

    } catch (error: any) {
      console.error(error);
      setApiError(error.message || "Failed to generate tile.");
    } finally {
      setIsLoading(false);
    }
  }, [localPrompt, selection, globalPrompt, gridData]);

  const getCoordsFromElement = (element: HTMLElement): Point => {
    const id = element.dataset.id;
    if (!id) return { x: -1, y: -1 };
    const [x, y] = id.split(',').map(Number);
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== Tool.Select) return;
    setIsDragging(true);
    const target = e.target as HTMLElement;
    const gridCell = target.closest('.grid-cell');
    if (!gridCell) return;
    const coords = getCoordsFromElement(gridCell as HTMLElement);
    setSelection({ start: coords, end: coords });
  };
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || activeTool !== Tool.Select || !selection) return;
    const coords = getCoordsFromElement(e.currentTarget);
    setSelection({ ...selection, end: coords });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setZoom(prev => Math.min(prev * 1.1, 5));
    } else {
      // Zoom out
      setZoom(prev => Math.max(prev / 1.1, 0.2));
    }
  };

  const isCellSelected = (x: number, y: number): boolean => {
    if (!selection) return false;
    const startX = Math.min(selection.start.x, selection.end.x);
    const endX = Math.max(selection.start.x, selection.end.x);
    const startY = Math.min(selection.start.y, selection.end.y);
    const endY = Math.max(selection.start.y, selection.end.y);
    return x >= startX && x <= endX && y >= startY && y <= endY;
  };

  const ToolButton = ({ tool, icon, name }: { tool: Tool; icon: JSX.Element; name: string }) => (
    <button
      className={`tool-button ${activeTool === tool ? 'active' : ''}`}
      onClick={() => setActiveTool(tool)}
      title={name}
    >
      {icon}
    </button>
  );

  const renderGridCells = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const key = `${x},${y}`;
        cells.push(
          <div 
            key={key}
            data-id={key}
            className={`grid-cell ${isCellSelected(x, y) ? 'selected' : ''}`}
            onMouseEnter={handleMouseEnter}
          />
        );
      }
    }
    return cells;
  };
  
  const renderFeatures = () => {
    return features.map(feature => {
      const { start, end } = feature.selection;
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);
      const width = Math.abs(start.x - end.x) + 1;
      const height = Math.abs(start.y - end.y) + 1;
      
      const style: React.CSSProperties = {
        position: 'absolute',
        left: `${x * CELL_SIZE_PX}px`,
        top: `${y * CELL_SIZE_PX}px`,
        width: `${width * CELL_SIZE_PX}px`,
        height: `${height * CELL_SIZE_PX}px`,
        backgroundImage: `url(${feature.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pointerEvents: 'none', // Allow clicking through to the grid
      };
      
      return <div key={feature.id} style={style} />;
    });
  };
  
  const styles = `
    body { margin: 0; }
    .app { display: flex; flex-direction: column; height: 100vh; background-color: #282c34; color: white; font-family: sans-serif; }
    .toolbar-top { display: flex; align-items: center; padding: 8px; background-color: #20232a; border-bottom: 1px solid #444; flex-shrink: 0; }
    .tool-button, .toolbar-top button { background: none; border: 1px solid #666; color: white; padding: 8px; margin-right: 8px; cursor: pointer; border-radius: 4px; }
    .tool-button.active, .tool-button:hover, .toolbar-top button:hover { background-color: #444c56; }
    .main-content { display: flex; flex-grow: 1; overflow: hidden; }
    .grid-wrapper { flex-grow: 1; overflow: auto; padding: 20px; display: flex; justify-content: center; align-items: center; }
    .grid-container { position: relative; display: grid; grid-template-columns: repeat(${GRID_SIZE}, ${CELL_SIZE_PX}px); grid-template-rows: repeat(${GRID_SIZE}, ${CELL_SIZE_PX}px); border: 1px solid #444; background-size: cover; background-position: center; width: ${GRID_SIZE * CELL_SIZE_PX}px; height: ${GRID_SIZE * CELL_SIZE_PX}px; transform-origin: center center; }
    .grid-cell { border: 1px solid rgba(255,255,255,0.1); }
    .grid-cell:hover { background-color: rgba(255,255,255,0.1); }
    .grid-cell.selected { background-color: rgba(0, 150, 255, 0.4); border: 1px solid #0096ff; }
    .sidebar { width: 300px; padding: 16px; background-color: #20232a; display: flex; flex-direction: column; gap: 24px; flex-shrink: 0; }
    .sidebar h2 { margin-top: 0; }
    .prompt-group { display: flex; flex-direction: column; gap: 8px; }
    .prompt-group label { font-weight: bold; }
    .prompt-group textarea { background-color: #333; color: white; border: 1px solid #666; border-radius: 4px; padding: 8px; font-family: sans-serif; resize: vertical; }
    .prompt-group textarea:disabled { background-color: #2a2a2a; color: #888; }
    .prompt-group button { background-color: #4CAF50; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
    .prompt-group button.reset-button { background-color: #f44336; }
    .prompt-group button:hover { opacity: 0.9; }
    .prompt-group button:disabled { background-color: #555; cursor: not-allowed; }
    .loading-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; font-size: 2em; z-index: 1000; }
    .api-error-box { background-color: #5c2c2c; border: 1px solid #f44336; color: white; padding: 12px; border-radius: 4px; margin-top: 16px; }
    .api-error-box p { margin: 0; }
    .api-error-box button { background: none; border: none; color: white; float: right; font-size: 1.2em; cursor: pointer; opacity: 0.7; }
    .api-error-box button:hover { opacity: 1; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="toolbar-top">
          <ToolButton tool={Tool.Select} icon={<SelectIcon />} name="Select" />
          <ToolButton tool={Tool.Highlight} icon={<HighlightIcon />} name="Highlight"/>
          <ToolButton tool={Tool.Draw} icon={<DrawIcon />} name="Draw" />
          <ToolButton tool={Tool.Erase} icon={<EraseIcon />} name="Erase" />
          <ToolButton tool={Tool.Eyedropper} icon={<EyedropperIcon />} name="Eyedropper" />
          <button title="Rotate Left"><RotateLeftIcon /></button>
          <button title="Rotate Right"><RotateRightIcon /></button>
          <button title="Zoom In" onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))}>+</button>
          <button title="Zoom Out" onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.2))}>-</button>
          <button title="Chat"><ChatIcon /></button>
        </div>

        <main className="main-content" onMouseUp={handleMouseUp}>
          <div className="grid-wrapper" onWheel={handleWheel}>
            <div 
                className="grid-container" 
                style={{ 
                    backgroundImage: baseTerrain ? `url(${baseTerrain})` : 'none',
                    transform: `scale(${zoom})`,
                }}
                onMouseDown={handleMouseDown}
            >
                {renderGridCells()}
                {renderFeatures()}
            </div>
          </div>
          <div className="sidebar">
            <h2>Infinite World Builder</h2>
            
            <div className="prompt-group">
              <label htmlFor="global-prompt">Global Theme</label>
              <textarea
                id="global-prompt"
                value={globalPrompt}
                onChange={(e) => setGlobalPrompt(e.target.value)}
                rows={4}
                placeholder="e.g., A desolate sci-fi wasteland..."
                disabled={isLoading || !!baseTerrain}
              />
              <button onClick={handleGenerateBaseTerrain} disabled={isLoading || !!baseTerrain}>
                {isLoading ? 'Generating...' : 'Generate Base Terrain'}
              </button>
              {baseTerrain && (
                <button onClick={handleResetWorld} className="reset-button" disabled={isLoading}>
                    Reset World
                </button>
              )}
            </div>

            <div className="prompt-group">
              <label htmlFor="local-prompt">Local Feature</label>
              <textarea
                id="local-prompt"
                value={localPrompt}
                onChange={(e) => setLocalPrompt(e.target.value)}
                rows={3}
                placeholder="e.g., A winding river, a dense forest..."
                disabled={!selection || !baseTerrain}
              />
              <button onClick={handleGenerateTile} disabled={isLoading || !selection || !baseTerrain}>
                {isLoading ? 'Generating...' : 'Generate Feature'}
              </button>
              {!baseTerrain && <small>Generate a base terrain first.</small>}
              {baseTerrain && !selection && <small>Make a selection on the map to add a feature.</small>}
            </div>
            
            {apiError && (
              <div className="api-error-box">
                <button onClick={() => setApiError(null)}>&times;</button>
                <p><strong>Error</strong></p>
                <p>{apiError}</p>
              </div>
            )}

          </div>
        </main>
        
        {isLoading && <div className="loading-overlay">Generating...</div>}
      </div>
    </>
  );
};

export default App;