import { GameState } from "./CityBuilder";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface GameStatsProps {
  gameState: GameState;
}

export const GameStats = ({ gameState }: GameStatsProps) => {
  return (
    <Card className="p-4 bg-card/90 backdrop-blur">
      <h3 className="text-lg font-semibold text-foreground mb-4">City Stats</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">Money</span>
            <span className="text-sm font-bold text-primary">${gameState.money}</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">Population</span>
            <span className="text-sm font-bold text-foreground">{gameState.population}</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">Happiness</span>
            <span className="text-sm font-semibold text-foreground">{gameState.happiness}%</span>
          </div>
          <Progress 
            value={Math.max(0, Math.min(100, gameState.happiness))} 
            className="h-2"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">Power</span>
            <span className="text-sm font-semibold text-foreground">{gameState.power}</span>
          </div>
          <Progress 
            value={Math.max(0, Math.min(100, gameState.power))} 
            className="h-2"
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          💡 Click buildings to remove them for 50% refund
        </div>
      </div>
    </Card>
  );
};