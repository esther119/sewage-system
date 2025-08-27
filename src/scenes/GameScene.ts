import Phaser from "phaser";
import { SimulationManager } from "../managers/SimulationManager";
import { InputManager } from "../managers/InputManager";
import { UIManager } from "../managers/UIManager";
import gameConfig from "../config/game.config.json";

export class GameScene extends Phaser.Scene {
  private simulationManager!: SimulationManager;
  private inputManager!: InputManager;
  private uiManager!: UIManager;

  constructor() {
    super({ key: "GameScene" });
  }

  create(): void {
    // Add background and scale it to fit the game canvas
    const bg = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "background"
    );

    // Scale the background to fit the game dimensions while showing more content
    const scaleX = this.cameras.main.width / bg.width;
    const scaleY = this.cameras.main.height / bg.height;
    const scale = Math.min(scaleX, scaleY); // Use smaller scale to show more of the image

    // Adjust the 0.8 multiplier to zoom out more (smaller values) or zoom in (larger values)
    bg.setScale(scale);

    this.simulationManager = new SimulationManager(this);
    this.uiManager = new UIManager(this);
    this.inputManager = new InputManager(
      this,
      this.simulationManager,
      this.uiManager
    );

    this.simulationManager.initialize();
    this.uiManager.initialize();
    this.inputManager.initialize();

    console.log("GameScene initialized successfully");
  }

  update(time: number, delta: number): void {
    this.simulationManager.update(delta);
    this.uiManager.update();
  }
}
