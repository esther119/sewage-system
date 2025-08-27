import Phaser from "phaser";

export enum ComponentStatus {
  HEALTHY = "healthy",
  DAMAGED = "damaged",
}

export interface IGameComponent {
  id: number;
  type: "pipe" | "node";
  status: ComponentStatus;
  sprite: Phaser.GameObjects.Sprite;
}

export interface IPipe extends IGameComponent {
  type: "pipe";
}

export interface INode extends IGameComponent {
  type: "node";
  flowActive: boolean;
}

export interface IGameState {
  systemHealth: number;
  components: IGameComponent[];
  allPipesRepaired: boolean;
}

export interface IAnalyticsEvent {
  timestamp: number;
  eventType:
    | "pipe_repaired"
    | "mismanagement_error"
    | "game_won"
    | "flow_adjusted"
    | "health_warning";
  componentId?: number;
  details: string;
}

export interface IFeedback {
  message: string;
  soundEffect: "correct" | "incorrect";
}

export interface INetworkComponent {
  id: number;
  type: "pipe" | "node";
  x: number;
  y: number;
  status?: string;
  flowActive?: boolean;
}

export interface IGameConfig {
  game: {
    width: number;
    height: number;
    backgroundColor: string;
  };
  simulation: {
    initialHealth: number;
    repairHealthBonus: number;
    mismanagementPenalty: number;
    healthDeteriorationRate: number;
    healthColors: {
      healthy: number;
      warning: number;
      critical: number;
    };
    healthThresholds: {
      warning: number;
      critical: number;
    };
  };
  network: {
    components: INetworkComponent[];
  };
  ui: {
    popup: {
      duration: number;
      fadeTime: number;
    };
    healthBar: {
      width: number;
      height: number;
      x: number;
      y: number;
    };
  };
  messages: {
    repair: {
      success: string;
      alreadyHealthy: string;
    };
    flow: {
      activated: string;
      deactivated: string;
      warning: string;
    };
    win: string;
    healthWarning: string;
    healthCritical: string;
  };
}
