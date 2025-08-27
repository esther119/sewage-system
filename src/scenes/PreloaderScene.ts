import Phaser from "phaser";

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloaderScene" });
  }

  preload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        color: "#ffffff",
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        color: "#ffffff",
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: "",
      style: {
        font: "16px monospace",
        color: "#ffffff",
      },
    });
    assetText.setOrigin(0.5, 0.5);

    this.load.on("progress", (value: number) => {
      percentText.setText(`${Math.round(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
    });

    this.load.on("fileprogress", (file: Phaser.Loader.File) => {
      assetText.setText(`Loading: ${file.key}`);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.loadAssets();
  }

  loadAssets(): void {
    // Load actual background image first
    this.load.image("background", "assets/images/background.png");
    
    // Create placeholders for other assets that don't exist yet
    this.load.on('filecomplete-image-background', () => {
      console.log('Background image loaded successfully');
    });
    
    // Check if other image files exist, otherwise create placeholders
    this.load.image("pipe_healthy", "assets/images/pipe_healthy.png");
    this.load.image("pipe_damaged", "assets/images/pipe_damaged.png");
    this.load.image("node_on", "assets/images/node_on.png");
    this.load.image("node_off", "assets/images/node_off.png");
    this.load.image("popup_background", "assets/images/popup_background.png");

    this.load.audio("correct", ["assets/audio/correct.mp3"]);
    this.load.audio("incorrect", ["assets/audio/incorrect.mp3"]);
    
    // Handle missing files by creating placeholders
    this.load.on('loaderror', (file: any) => {
      console.log('Failed to load:', file.key);
      this.createPlaceholderForMissing(file.key);
    });
  }

  createPlaceholderForMissing(key: string): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.setVisible(false);

    switch(key) {
      case 'pipe_healthy':
        graphics.fillStyle(0x4ade80, 1);
        graphics.fillRoundedRect(0, 0, 80, 30, 5);
        graphics.generateTexture("pipe_healthy", 80, 30);
        break;
      case 'pipe_damaged':
        graphics.fillStyle(0xef4444, 1);
        graphics.fillRoundedRect(0, 0, 80, 30, 5);
        graphics.generateTexture("pipe_damaged", 80, 30);
        break;
      case 'node_on':
        graphics.fillStyle(0x22d3ee, 1);
        graphics.fillCircle(25, 25, 25);
        graphics.generateTexture("node_on", 50, 50);
        break;
      case 'node_off':
        graphics.fillStyle(0x6b7280, 1);
        graphics.fillCircle(25, 25, 25);
        graphics.generateTexture("node_off", 50, 50);
        break;
      case 'popup_background':
        graphics.fillStyle(0xffffff, 0.95);
        graphics.fillRoundedRect(0, 0, 300, 100, 10);
        graphics.lineStyle(2, 0x000000, 1);
        graphics.strokeRoundedRect(0, 0, 300, 100, 10);
        graphics.generateTexture("popup_background", 300, 100);
        break;
    }
    
    graphics.destroy();
  }

  createPlaceholderAssets(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.setVisible(false);

    graphics.fillStyle(0x3b82f6, 1);
    graphics.fillRect(0, 0, 800, 600);
    graphics.generateTexture("background", 800, 600);
    graphics.clear();

    graphics.fillStyle(0x4ade80, 1);
    graphics.fillRoundedRect(0, 0, 80, 30, 5);
    graphics.generateTexture("pipe_healthy", 80, 30);
    graphics.clear();

    graphics.fillStyle(0xef4444, 1);
    graphics.fillRoundedRect(0, 0, 80, 30, 5);
    graphics.strokeRoundedRect(0, 0, 80, 30, 5);
    graphics.generateTexture("pipe_damaged", 80, 30);
    graphics.clear();

    graphics.fillStyle(0x22d3ee, 1);
    graphics.fillCircle(25, 25, 25);
    graphics.generateTexture("node_on", 50, 50);
    graphics.clear();

    graphics.fillStyle(0x6b7280, 1);
    graphics.fillCircle(25, 25, 25);
    graphics.generateTexture("node_off", 50, 50);
    graphics.clear();

    graphics.fillStyle(0xffffff, 0.95);
    graphics.fillRoundedRect(0, 0, 300, 100, 10);
    graphics.lineStyle(2, 0x000000, 1);
    graphics.strokeRoundedRect(0, 0, 300, 100, 10);
    graphics.generateTexture("popup_background", 300, 100);
    graphics.clear();

    graphics.destroy();

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const correctSound = audioContext.createBuffer(
      1,
      audioContext.sampleRate * 0.3,
      audioContext.sampleRate
    );
    const correctData = correctSound.getChannelData(0);
    for (let i = 0; i < correctData.length; i++) {
      correctData[i] =
        Math.sin((2 * Math.PI * 800 * i) / audioContext.sampleRate) *
        Math.exp(-i / (audioContext.sampleRate * 0.1));
    }

    const incorrectSound = audioContext.createBuffer(
      1,
      audioContext.sampleRate * 0.3,
      audioContext.sampleRate
    );
    const incorrectData = incorrectSound.getChannelData(0);
    for (let i = 0; i < incorrectData.length; i++) {
      incorrectData[i] =
        Math.sin((2 * Math.PI * 300 * i) / audioContext.sampleRate) *
        Math.exp(-i / (audioContext.sampleRate * 0.15));
    }

    this.cache.audio.add("correct", correctSound);
    this.cache.audio.add("incorrect", incorrectSound);
  }

  create(): void {
    this.scene.start("GameScene");
  }
}
