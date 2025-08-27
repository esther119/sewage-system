import Phaser from "phaser";
import { PreloaderScene } from "./scenes/PreloaderScene";
import { GameScene } from "./scenes/GameScene";
import gameConfig from "./config/game.config.json";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: gameConfig.game.width,
  height: gameConfig.game.height,
  backgroundColor: gameConfig.game.backgroundColor,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [PreloaderScene, GameScene],
};

export const game = new Phaser.Game(config);

console.log("SF Sewage System Learning Simulation - Starting...");
