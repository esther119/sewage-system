import Phaser from "phaser";
import {
  IGameState,
  IGameComponent,
  IPipe,
  INode,
  ComponentStatus,
  IFeedback,
  IGameConfig,
} from "../types/interfaces";
import { AnalyticsLogger } from "../services/AnalyticsLogger";
import gameConfig from "../config/game.config.json";

export class SimulationManager {
  private scene: Phaser.Scene;
  private gameState: IGameState;
  private components: Map<number, IGameComponent>;
  private config: IGameConfig;
  private deteriorationTimer: number = 0;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.config = gameConfig as IGameConfig;
    this.gameState = {
      systemHealth: this.config.simulation.initialHealth,
      components: [],
      allPipesRepaired: false,
    };
    this.components = new Map();
  }

  initialize(): void {
    this.config.network.components.forEach((componentData) => {
      const sprite = this.createComponentSprite(componentData);

      const component: IGameComponent =
        componentData.type === "pipe"
          ? ({
              id: componentData.id,
              type: "pipe",
              status:
                componentData.status === "damaged"
                  ? ComponentStatus.DAMAGED
                  : ComponentStatus.HEALTHY,
              sprite,
            } as IPipe)
          : ({
              id: componentData.id,
              type: "node",
              status: ComponentStatus.HEALTHY,
              sprite,
              flowActive: componentData.flowActive || false,
            } as INode);

      this.components.set(component.id, component);
      this.gameState.components.push(component);

      sprite.setData("component", component);
    });

    this.updateAllSprites();
    console.log(
      `SimulationManager initialized with ${this.components.size} components`
    );
  }

  private createComponentSprite(componentData: any): Phaser.GameObjects.Sprite {
    const textureKey = this.getTextureForComponent(componentData);
    const sprite = this.scene.add.sprite(
      componentData.x,
      componentData.y,
      textureKey
    );
    sprite.setInteractive({ useHandCursor: true });
    return sprite;
  }

  private getTextureForComponent(componentData: any): string {
    if (componentData.type === "pipe") {
      return componentData.status === "damaged"
        ? "pipe_damaged"
        : "pipe_healthy";
    } else {
      return componentData.flowActive ? "node_on" : "node_off";
    }
  }

  repairPipe(pipeId: number): IFeedback {
    const component = this.components.get(pipeId);

    if (!component || component.type !== "pipe") {
      return {
        message: "That's not a pipe!",
        soundEffect: "incorrect",
      };
    }

    const pipe = component as IPipe;

    if (pipe.status === ComponentStatus.HEALTHY) {
      return {
        message: this.config.messages.repair.alreadyHealthy,
        soundEffect: "incorrect",
      };
    }

    pipe.status = ComponentStatus.HEALTHY;
    pipe.sprite.setTexture("pipe_healthy");

    this.gameState.systemHealth = Math.min(
      100,
      this.gameState.systemHealth + this.config.simulation.repairHealthBonus
    );

    this.checkForWinCondition();

    AnalyticsLogger.logEvent({
      timestamp: Date.now(),
      eventType: "pipe_repaired",
      componentId: pipeId,
      details: `Pipe ${pipeId} repaired. Health: ${this.gameState.systemHealth}`,
    });

    return {
      message: this.config.messages.repair.success,
      soundEffect: "correct",
    };
  }

  adjustWaterFlow(nodeId: number): IFeedback {
    const component = this.components.get(nodeId);

    if (!component || component.type !== "node") {
      return {
        message: "That's not a valve!",
        soundEffect: "incorrect",
      };
    }

    const node = component as INode;
    node.flowActive = !node.flowActive;
    node.sprite.setTexture(node.flowActive ? "node_on" : "node_off");

    AnalyticsLogger.logEvent({
      timestamp: Date.now(),
      eventType: "flow_adjusted",
      componentId: nodeId,
      details: `Node ${nodeId} flow ${
        node.flowActive ? "activated" : "deactivated"
      }`,
    });

    return {
      message: node.flowActive
        ? this.config.messages.flow.activated
        : this.config.messages.flow.deactivated,
      soundEffect: "correct",
    };
  }

  update(delta: number): void {
    this.deteriorationTimer += delta;

    if (this.deteriorationTimer >= 3000) {
      this.deteriorationTimer = 0;
      this.updateHealthOnMismanagement();
    }
  }

  updateHealthOnMismanagement(): void {
    const damagedPipes = this.gameState.components.filter(
      (c) => c.type === "pipe" && c.status === ComponentStatus.DAMAGED
    );

    if (damagedPipes.length > 0) {
      const damage =
        this.config.simulation.healthDeteriorationRate * damagedPipes.length;
      this.gameState.systemHealth = Math.max(
        0,
        this.gameState.systemHealth - damage
      );

      if (
        this.gameState.systemHealth <=
        this.config.simulation.healthThresholds.critical
      ) {
        AnalyticsLogger.logEvent({
          timestamp: Date.now(),
          eventType: "health_warning",
          details: `Critical health: ${this.gameState.systemHealth}`,
        });
      }
    }
  }

  checkForWinCondition(): boolean {
    const allPipesHealthy = this.gameState.components
      .filter((c) => c.type === "pipe")
      .every((c) => c.status === ComponentStatus.HEALTHY);

    if (allPipesHealthy && !this.gameState.allPipesRepaired) {
      this.gameState.allPipesRepaired = true;

      AnalyticsLogger.logEvent({
        timestamp: Date.now(),
        eventType: "game_won",
        details: `All pipes repaired! Final health: ${this.gameState.systemHealth}`,
      });

      return true;
    }

    return false;
  }

  private updateAllSprites(): void {
    this.components.forEach((component) => {
      if (component.type === "pipe") {
        const texture =
          component.status === ComponentStatus.HEALTHY
            ? "pipe_healthy"
            : "pipe_damaged";
        component.sprite.setTexture(texture);
      } else if (component.type === "node") {
        const node = component as INode;
        const texture = node.flowActive ? "node_on" : "node_off";
        component.sprite.setTexture(texture);
      }
    });
  }

  getGameState(): IGameState {
    return this.gameState;
  }

  getComponentAt(x: number, y: number): IGameComponent | null {
    for (const component of this.components.values()) {
      if (component.sprite.getBounds().contains(x, y)) {
        return component;
      }
    }
    return null;
  }
}
