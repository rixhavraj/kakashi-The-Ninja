import { BaseLevelScene } from './BaseLevelScene.js'
import { KakashiPlayer } from './KakashiPlayer.js'

export class Level5Scene extends BaseLevelScene {
  constructor() {
    super({ key: "Level5Scene" })
  }

  create() {
    this.createBaseElements()
    this.backgroundMusic = this.sound.add("ninja_adventure_theme", { volume: 0.6, loop: true })
    this.backgroundMusic.play()
  }

  update() {
    this.baseUpdate()
  }

  setupMapSize() {
    this.mapWidth = 40 * 64
    this.mapHeight = 20 * 64
  }

  createPlayer() {
    this.player = new KakashiPlayer(this, 2 * 64, 17 * 64)
  }

  createEnemies() {
    this.addEnemy(7 * 64, 15 * 64)
    this.addEnemy(12 * 64, 13 * 64)
    this.addEnemy(17 * 64, 17 * 64)
    this.addEnemy(22 * 64, 16 * 64)
    this.addEnemy(26 * 64, 11 * 64)
    this.addEnemy(31 * 64, 15 * 64)
    this.addEnemy(36 * 64, 17 * 64)
  }

  getObstacleDefinitions() {
    return [
      { x: 6 * 64, y: 18.5 * 64, width: 96, height: 44 },
      { x: 13.5 * 64, y: 14.2 * 64, width: 96, height: 44 },
      { x: 21 * 64, y: 17.8 * 64, width: 128, height: 44 },
      { x: 28.5 * 64, y: 12.6 * 64, width: 96, height: 44 },
      { x: 34 * 64, y: 18.5 * 64, width: 128, height: 44 },
    ]
  }

  createBackground() {
    const backgroundKey = "forest_background"
    const bgImage = this.add.image(0, 0, backgroundKey).setOrigin(0, 0)
    const bgScale = this.mapHeight / bgImage.height
    bgImage.setScale(bgScale)
    const scaledBgWidth = bgImage.width * bgScale
    const numRepeats = Math.ceil(this.mapWidth / scaledBgWidth)

    for (let i = 0; i < numRepeats; i++) {
      this.add.image(i * scaledBgWidth, 0, backgroundKey)
        .setOrigin(0, 0)
        .setScale(bgScale)
        .setScrollFactor(0.2)
    }
  }

  createTileMap() {
    this.map = this.make.tilemap({ key: "level3_map" })
    this.forestGroundTileset = this.map.addTilesetImage("forest_ground", "forest_ground")
    this.groundLayer = this.map.createLayer("ground", this.forestGroundTileset, 0, 0)
    this.groundLayer.setCollisionByExclusion([-1])
  }

  createDecorations() {
    this.decorations.add(this.add.image(3 * 64, 17 * 64, "trees_variant_2").setOrigin(0.5, 1).setScale(0.6))
    this.decorations.add(this.add.image(10 * 64, 15 * 64, "wooden_post_variant_1").setOrigin(0.5, 1).setScale(0.25))
    this.decorations.add(this.add.image(18 * 64, 17 * 64, "rocks_variant_1").setOrigin(0.5, 1).setScale(0.5))
    this.decorations.add(this.add.image(24 * 64, 13 * 64, "bushes_variant_2").setOrigin(0.5, 1).setScale(0.4))
    this.decorations.add(this.add.image(32 * 64, 16 * 64, "trees_variant_3").setOrigin(0.5, 1).setScale(0.6))
    this.decorations.add(this.add.image(38 * 64, 17 * 64, "grass_variant_1").setOrigin(0.5, 1).setScale(0.3))
  }
}
