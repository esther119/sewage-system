import Phaser from 'phaser';
import { HealthBar } from '../components/HealthBar';
import { SimulationManager } from './SimulationManager';
import { IFeedback, IGameConfig } from '../types/interfaces';
import gameConfig from '../config/game.config.json';

export class UIManager {
    private scene: Phaser.Scene;
    private healthBar!: HealthBar;
    private config: IGameConfig;
    private currentPopup: Phaser.GameObjects.Container | null = null;
    private simulationManager?: SimulationManager;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.config = gameConfig as IGameConfig;
    }

    initialize(): void {
        this.healthBar = new HealthBar(this.scene);
        this.healthBar.draw(this.config.simulation.initialHealth);
        
        if (this.scene.scene.get('GameScene')) {
            const gameScene = this.scene.scene.get('GameScene') as any;
            this.simulationManager = gameScene.simulationManager;
        }

        console.log('UIManager initialized');
    }

    update(): void {
        if (this.simulationManager) {
            const gameState = this.simulationManager.getGameState();
            this.healthBar.draw(gameState.systemHealth);
            
            const prevThreshold = this.getHealthThreshold(gameState.systemHealth + 5);
            const currentThreshold = this.getHealthThreshold(gameState.systemHealth);
            
            if (prevThreshold !== currentThreshold && currentThreshold !== 'healthy') {
                const message = currentThreshold === 'critical' ? 
                    this.config.messages.healthCritical : 
                    this.config.messages.healthWarning;
                    
                this.displayPopup(message);
            }
        }
    }

    private getHealthThreshold(health: number): 'healthy' | 'warning' | 'critical' {
        if (health <= this.config.simulation.healthThresholds.critical) {
            return 'critical';
        } else if (health <= this.config.simulation.healthThresholds.warning) {
            return 'warning';
        }
        return 'healthy';
    }

    processFeedback(feedback: IFeedback): void {
        this.displayPopup(feedback.message);
        this.playSound(feedback.soundEffect);
    }

    displayPopup(message: string): void {
        if (this.currentPopup) {
            this.currentPopup.destroy();
        }

        const container = this.scene.add.container(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100
        );

        const background = this.scene.add.sprite(0, 0, 'popup_background');
        background.setAlpha(0);

        const text = this.scene.add.text(0, 0, message, {
            fontSize: '18px',
            color: '#333333',
            align: 'center',
            wordWrap: { width: 280 }
        });
        text.setOrigin(0.5);
        text.setAlpha(0);

        container.add([background, text]);
        this.currentPopup = container;

        this.scene.tweens.add({
            targets: [background, text],
            alpha: 1,
            duration: this.config.ui.popup.fadeTime,
            ease: 'Power2'
        });

        this.scene.time.delayedCall(this.config.ui.popup.duration, () => {
            if (this.currentPopup === container) {
                this.scene.tweens.add({
                    targets: [background, text],
                    alpha: 0,
                    duration: this.config.ui.popup.fadeTime,
                    ease: 'Power2',
                    onComplete: () => {
                        if (this.currentPopup === container) {
                            container.destroy();
                            this.currentPopup = null;
                        }
                    }
                });
            }
        });
    }

    playSound(effect: 'correct' | 'incorrect'): void {
        try {
            this.scene.sound.play(effect, { volume: 0.5 });
        } catch (error) {
            console.log(`Sound ${effect} not found, using placeholder`);
        }
    }

    showSuccessMessage(): void {
        if (this.currentPopup) {
            this.currentPopup.destroy();
        }

        const overlay = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x000000,
            0.7
        );

        const successContainer = this.scene.add.container(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY
        );

        const background = this.scene.add.graphics();
        background.fillStyle(0xffffff, 1);
        background.fillRoundedRect(-200, -100, 400, 200, 20);
        background.lineStyle(4, 0x4ade80, 1);
        background.strokeRoundedRect(-200, -100, 400, 200, 20);

        const text = this.scene.add.text(0, -30, this.config.messages.win, {
            fontSize: '24px',
            color: '#333333',
            align: 'center',
            wordWrap: { width: 360 }
        });
        text.setOrigin(0.5);

        const healthText = this.scene.add.text(0, 30, `Final Health: ${Math.round(this.simulationManager?.getGameState().systemHealth || 100)}%`, {
            fontSize: '20px',
            color: '#4ade80',
            fontStyle: 'bold'
        });
        healthText.setOrigin(0.5);

        successContainer.add([background, text, healthText]);
        
        successContainer.setScale(0);
        this.scene.tweens.add({
            targets: successContainer,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.playSound('correct');
    }

    updateHealthBar(health: number): void {
        this.healthBar.draw(health);
    }
}