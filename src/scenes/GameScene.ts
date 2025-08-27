import Phaser from 'phaser';
import { SimulationManager } from '../managers/SimulationManager';
import { InputManager } from '../managers/InputManager';
import { UIManager } from '../managers/UIManager';
import gameConfig from '../config/game.config.json';

export class GameScene extends Phaser.Scene {
    private simulationManager!: SimulationManager;
    private inputManager!: InputManager;
    private uiManager!: UIManager;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {
        this.add.image(400, 300, 'background');

        this.simulationManager = new SimulationManager(this);
        this.uiManager = new UIManager(this);
        this.inputManager = new InputManager(this, this.simulationManager, this.uiManager);

        this.simulationManager.initialize();
        this.uiManager.initialize();
        this.inputManager.initialize();

        console.log('GameScene initialized successfully');
    }

    update(time: number, delta: number): void {
        this.simulationManager.update(delta);
        this.uiManager.update();
    }
}