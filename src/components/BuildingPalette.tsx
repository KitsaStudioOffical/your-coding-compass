import { BuildingType } from "./CityBuilder";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import houseSprite from "../assets/house-sprite.png";
import officeSprite from "../assets/office-sprite.png";
import factorySprite from "../assets/factory-sprite.png";
import shopSprite from "../assets/shop-sprite.png";

interface BuildingPaletteProps {
  selectedBuilding: BuildingType;
  onBuildingSelect: (building: BuildingType) => void;
  buildingCosts: Record<string, number>;
  playerMoney: number;
}

const buildingInfo = {
  house: {
    name: "House",
    description: "Provides population",
    effect: "+4 Population",
    sprite: houseSprite,
    color: "bg-game-residential"
  },
  office: {
    name: "Office",
    description: "Generates income",
    effect: "+$50 Income",
    sprite: officeSprite,
    color: "bg-game-commercial"
  },
  factory: {
    name: "Factory",
    description: "Generates power",
    effect: "+20 Power, -5 Happiness",
    sprite: factorySprite,
    color: "bg-game-industrial"
  },
  shop: {
    name: "Shop",
    description: "Boosts happiness",
    effect: "+10 Happiness, +$25 Income",
    sprite: shopSprite,
    color: "bg-game-building"
  }
};

export const BuildingPalette = ({
  selectedBuilding,
  onBuildingSelect,
  buildingCosts,
  playerMoney
}: BuildingPaletteProps) => {
  return (
    <Card className="p-4 bg-card/90 backdrop-blur">
      <h3 className="text-lg font-semibold text-foreground mb-4">Buildings</h3>
      
      <div className="space-y-3">
        {Object.entries(buildingInfo).map(([type, info]) => {
          const cost = buildingCosts[type];
          const canAfford = playerMoney >= cost;
          const isSelected = selectedBuilding === type;
          
          return (
            <Button
              key={type}
              onClick={() => onBuildingSelect(type as BuildingType)}
              variant={isSelected ? "default" : "outline"}
              disabled={!canAfford}
              className={`w-full p-4 h-auto flex items-start gap-3 ${
                isSelected ? 'ring-2 ring-accent' : ''
              } ${!canAfford ? 'opacity-50' : ''}`}
            >
              <img
                src={info.sprite}
                alt={info.name}
                className="w-8 h-8 object-cover rounded"
              />
              
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">{info.name}</div>
                <div className="text-sm text-muted-foreground">{info.description}</div>
                <div className="text-xs text-accent font-medium">{info.effect}</div>
                <div className="text-sm font-bold text-primary">
                  ${cost}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          onClick={() => onBuildingSelect(null)}
          variant={selectedBuilding === null ? "default" : "outline"}
          className="w-full"
        >
          Select Mode (Remove Buildings)
        </Button>
      </div>
    </Card>
  );
};