import { useState, useCallback } from "react";
import { GameCanvas } from "./GameCanvas";
import { BuildingPalette } from "./BuildingPalette";
import { GameStats } from "./GameStats";
import { Card } from "./ui/card";

export type BuildingType = 'house' | 'office' | 'factory' | 'shop' | null;

export interface Building {
  id: string;
  type: BuildingType;
  x: number;
  y: number;
}

export interface GameState {
  population: number;
  money: number;
  happiness: number;
  power: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 32;

export const CityBuilder = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingType>('house');
  const [gameState, setGameState] = useState<GameState>({
    population: 0,
    money: 1000,
    happiness: 50,
    power: 100
  });

  const buildingCosts = {
    house: 100,
    office: 200,
    factory: 300,
    shop: 150
  };

  const handleCellClick = useCallback((x: number, y: number) => {
    if (!selectedBuilding) return;
    
    // Check if cell is already occupied
    const isOccupied = buildings.some(building => building.x === x && building.y === y);
    if (isOccupied) return;
    
    // Check if player has enough money
    const cost = buildingCosts[selectedBuilding];
    if (gameState.money < cost) return;
    
    // Place building
    const newBuilding: Building = {
      id: Date.now().toString(),
      type: selectedBuilding,
      x,
      y
    };
    
    setBuildings(prev => [...prev, newBuilding]);
    
    // Update game state
    setGameState(prev => {
      let newState = { ...prev, money: prev.money - cost };
      
      switch (selectedBuilding) {
        case 'house':
          newState.population += 4;
          break;
        case 'office':
          newState.money += 50; // Generate income
          break;
        case 'factory':
          newState.power += 20;
          newState.happiness -= 5; // Pollution
          break;
        case 'shop':
          newState.happiness += 10;
          newState.money += 25; // Generate income
          break;
      }
      
      return newState;
    });
  }, [selectedBuilding, buildings, gameState.money, buildingCosts]);

  const handleRemoveBuilding = useCallback((buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    setBuildings(prev => prev.filter(b => b.id !== buildingId));
    
    // Refund half the cost
    const refund = Math.floor(buildingCosts[building.type] / 2);
    setGameState(prev => ({
      ...prev,
      money: prev.money + refund
    }));
  }, [buildings, buildingCosts]);

  return (
    <div className="min-h-screen bg-game-grass p-4">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">City Builder</h1>
          <p className="text-muted-foreground">Build your dream city! Click to place buildings.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-4 bg-card/90 backdrop-blur">
              <GameCanvas
                gridSize={GRID_SIZE}
                cellSize={CELL_SIZE}
                buildings={buildings}
                onCellClick={handleCellClick}
                onBuildingClick={handleRemoveBuilding}
                selectedBuilding={selectedBuilding}
              />
            </Card>
          </div>
          
          <div className="space-y-4">
            <GameStats gameState={gameState} />
            <BuildingPalette
              selectedBuilding={selectedBuilding}
              onBuildingSelect={setSelectedBuilding}
              buildingCosts={buildingCosts}
              playerMoney={gameState.money}
            />
          </div>
        </div>
      </div>
    </div>
  );
};