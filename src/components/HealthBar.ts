import Phaser from 'phaser';
import { IGameConfig } from '../types/interfaces';
import gameConfig from '../config/game.config.json';

export class HealthBar {
    private scene: Phaser.Scene;
    private barGraphics: Phaser.GameObjects.Graphics;
    private config: IGameConfig;
    private barWidth: number;
    private barHeight: number;
    private x: number;
    private y: number;
    private label: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.config = gameConfig as IGameConfig;
        
        this.barWidth = this.config.ui.healthBar.width;
        this.barHeight = this.config.ui.healthBar.height;
        this.x = this.config.ui.healthBar.x;
        this.y = this.config.ui.healthBar.y;

        this.barGraphics = this.scene.add.graphics();
        
        this.label = this.scene.add.text(this.x + this.barWidth / 2, this.y - 20, 'System Health', {
            fontSize: '16px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        this.label.setOrigin(0.5, 0.5);
    }

    draw(health: number): void {
        this.barGraphics.clear();
        
        this.barGraphics.fillStyle(0x000000, 0.5);
        this.barGraphics.fillRoundedRect(this.x - 2, this.y - 2, this.barWidth + 4, this.barHeight + 4, 5);
        
        this.barGraphics.fillStyle(0x333333, 1);
        this.barGraphics.fillRoundedRect(this.x, this.y, this.barWidth, this.barHeight, 3);

        const fillWidth = (health / 100) * this.barWidth;
        const color = this.getColorForHealth(health);
        
        if (fillWidth > 0) {
            this.barGraphics.fillStyle(color, 1);
            this.barGraphics.fillRoundedRect(this.x, this.y, fillWidth, this.barHeight, 3);
            
            const gradient = this.scene.add.graphics();
            gradient.fillStyle(0xffffff, 0.3);
            gradient.fillRect(this.x, this.y, fillWidth, this.barHeight / 2);
            gradient.setBlendMode(Phaser.BlendModes.ADD);
            
            this.scene.time.delayedCall(100, () => gradient.destroy());
        }

        const healthText = this.scene.add.text(
            this.x + this.barWidth / 2, 
            this.y + this.barHeight / 2, 
            `${Math.round(health)}%`, 
            {
                fontSize: '14px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        healthText.setOrigin(0.5, 0.5);
        
        if (health <= this.config.simulation.healthThresholds.critical) {
            this.scene.tweens.add({
                targets: healthText,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
    }

    private getColorForHealth(health: number): number {
        if (health <= this.config.simulation.healthThresholds.critical) {
            return this.config.simulation.healthColors.critical;
        } else if (health <= this.config.simulation.healthThresholds.warning) {
            return this.config.simulation.healthColors.warning;
        }
        return this.config.simulation.healthColors.healthy;
    }
}