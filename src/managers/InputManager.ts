import Phaser from "phaser";
import { SimulationManager } from "./SimulationManager";
import { UIManager } from "./UIManager";
import { IGameComponent, IFeedback } from "../types/interfaces";

export class InputManager {
  private scene: Phaser.Scene;
  private simulationManager: SimulationManager;
  private uiManager: UIManager;
  private hoveredComponent: IGameComponent | null = null;

  constructor(
    scene: Phaser.Scene,
    simulationManager: SimulationManager,
    uiManager: UIManager
  ) {
    this.scene = scene;
    this.simulationManager = simulationManager;
    this.uiManager = uiManager;
  }

  initialize(): void {
    this.setupEventListeners();
    console.log("InputManager initialized");
  }

  private setupEventListeners(): void {
    this.scene.input.on("gameobjectover", this.onComponentHover, this);
    this.scene.input.on("gameobjectout", this.onComponentLeave, this);
    this.scene.input.on("gameobjectdown", this.onComponentClick, this);

    this.scene.input.on("pointerdown", this.onBackgroundClick, this);
  }

  private onComponentHover(
    pointer: Phaser.Input.Pointer,
    gameObject: Phaser.GameObjects.GameObject
  ): void {
    if (gameObject instanceof Phaser.GameObjects.Sprite) {
      const component = gameObject.getData("component") as IGameComponent;
      if (component) {
        this.hoveredComponent = component;
        gameObject.setTint(0xffff88);
        // Store the original scale and increase it slightly
        const originalScale = gameObject.getData('originalScale') || gameObject.scale;
        gameObject.setData('originalScale', originalScale);
        gameObject.setScale(originalScale * 1.1);
      }
    }
  }

  private onComponentLeave(
    pointer: Phaser.Input.Pointer,
    gameObject: Phaser.GameObjects.GameObject
  ): void {
    if (gameObject instanceof Phaser.GameObjects.Sprite) {
      this.hoveredComponent = null;
      gameObject.clearTint();
      // Restore the original scale
      const originalScale = gameObject.getData('originalScale');
      if (originalScale) {
        gameObject.setScale(originalScale);
      }
    }
  }

  private onComponentClick(
    pointer: Phaser.Input.Pointer,
    gameObject: Phaser.GameObjects.GameObject
  ): void {
    if (gameObject instanceof Phaser.GameObjects.Sprite) {
      const component = gameObject.getData("component") as IGameComponent;
      if (component) {
        this.handleComponentInteraction(component);
      }
    }
  }

  private onBackgroundClick(pointer: Phaser.Input.Pointer): void {
    const hitTest = this.scene.input.hitTestPointer(pointer);

    if (hitTest.length === 0) {
      const feedback: IFeedback = {
        message: "Click on a pipe to repair it or a valve to adjust flow!",
        soundEffect: "incorrect",
      };
      this.uiManager.processFeedback(feedback);
    }
  }

  private handleComponentInteraction(component: IGameComponent): void {
    let feedback: IFeedback;

    if (component.type === "pipe") {
      feedback = this.simulationManager.repairPipe(component.id);
    } else if (component.type === "node") {
      feedback = this.simulationManager.adjustWaterFlow(component.id);
    } else {
      feedback = {
        message: "Unknown component type!",
        soundEffect: "incorrect",
      };
    }

    this.uiManager.processFeedback(feedback);

    if (this.simulationManager.checkForWinCondition()) {
      this.uiManager.showSuccessMessage();
      this.disableInput();
    }
  }

  private disableInput(): void {
    this.scene.input.off("gameobjectover");
    this.scene.input.off("gameobjectout");
    this.scene.input.off("gameobjectdown");
    this.scene.input.off("pointerdown");
  }
}
