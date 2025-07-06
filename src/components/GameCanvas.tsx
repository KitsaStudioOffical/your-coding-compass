import { useEffect, useRef, useState } from "react";
import { Building, BuildingType } from "./CityBuilder";
import houseSprite from "../assets/house-sprite.png";
import officeSprite from "../assets/office-sprite.png";
import factorySprite from "../assets/factory-sprite.png";
import shopSprite from "../assets/shop-sprite.png";

interface GameCanvasProps {
  gridSize: number;
  cellSize: number;
  buildings: Building[];
  onCellClick: (x: number, y: number) => void;
  onBuildingClick: (buildingId: string) => void;
  selectedBuilding: BuildingType;
}

const buildingSprites = {
  house: houseSprite,
  office: officeSprite,
  factory: factorySprite,
  shop: shopSprite
};

export const GameCanvas = ({
  gridSize,
  cellSize,
  buildings,
  onCellClick,
  onBuildingClick,
  selectedBuilding
}: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, HTMLImageElement>>({});
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Load building sprites
  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, HTMLImageElement> = {};
      
      for (const [type, src] of Object.entries(buildingSprites)) {
        const img = new Image();
        img.src = src;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        images[type] = img;
      }
      
      setLoadedImages(images);
    };
    
    loadImages();
  }, []);

  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= gridSize; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, gridSize * cellSize);
      ctx.stroke();
    }
    
    for (let y = 0; y <= gridSize; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(gridSize * cellSize, y * cellSize);
      ctx.stroke();
    }
    
    // Draw hovered cell highlight
    if (hoveredCell && selectedBuilding) {
      const isOccupied = buildings.some(b => b.x === hoveredCell.x && b.y === hoveredCell.y);
      ctx.fillStyle = isOccupied ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.3)';
      ctx.fillRect(hoveredCell.x * cellSize, hoveredCell.y * cellSize, cellSize, cellSize);
    }
    
    // Draw buildings
    buildings.forEach(building => {
      const img = loadedImages[building.type];
      if (img) {
        ctx.drawImage(
          img,
          building.x * cellSize,
          building.y * cellSize,
          cellSize,
          cellSize
        );
      } else {
        // Fallback colored rectangle
        const colors = {
          house: '#FF6B35',
          office: '#4A90E2',
          factory: '#8B0000',
          shop: '#FFD700'
        };
        ctx.fillStyle = colors[building.type] || '#888';
        ctx.fillRect(building.x * cellSize, building.y * cellSize, cellSize, cellSize);
      }
    });
  }, [buildings, loadedImages, gridSize, cellSize, hoveredCell, selectedBuilding]);

  const handleMouseClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      // Check if clicking on an existing building
      const clickedBuilding = buildings.find(b => b.x === x && b.y === y);
      if (clickedBuilding) {
        onBuildingClick(clickedBuilding.id);
      } else {
        onCellClick(x, y);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedBuilding) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      setHoveredCell({ x, y });
    } else {
      setHoveredCell(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        onClick={handleMouseClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="border border-border rounded-lg bg-game-grass cursor-crosshair"
        style={{ maxWidth: '100%', height: 'auto', aspectRatio: '1/1' }}
      />
    </div>
  );
};