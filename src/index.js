// Importing the Phaser library
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO, // WebGL
  width: 800,
  height: 600,
  physics: {
    default: "arcade", // Arcade physics plugin, manages physics simulation
  },
  scene: {
    preload: preload, // Called before the game starts
    create: create, // Called during game creation
    update: update, // Called every frame
  },
};

// Bird variables
let bird;
const initialBirdPosition = { x: config.width / 10, y: config.height / 2 };
const FLAP_VELOCITY = 400;

// Pipe variables
let pipes;
const PIPES_TO_RENDER = 4;
const pipeVerticalDistanceRange = [150, 250];
let pipeHorizontalPosition = null;
let pipeVerticalDistance = null;
let pipeVerticalPosition = null;
let upperPipe;
let lowerPipe;

// Used to load assets such as images, animations, music, etc.
function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
  this.load.image("pipe", "assets/pipe.png");
}

// Used to set the initial scene, such as adding the background or title screen
function create() {
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add
    .image(initialBirdPosition.x, initialBirdPosition.y, "bird")
    .setOrigin(0);
  bird.body.gravity.y = 800;
  pipes = this.physics.add.group();

  for (let i = 0; i <= PIPES_TO_RENDER; i++) {
    const upperPipe = pipes
      .create(pipeHorizontalPosition, pipeVerticalPosition, "pipe")
      .setOrigin(0, 1);

    const lowerPipe = pipes
      .create(
        pipeHorizontalPosition,
        upperPipe.y + pipeVerticalDistance,
        "pipe"
      )
      .setOrigin(0, 0);

    placePipe(upperPipe, lowerPipe);
  }

  this.input.on("pointerdown", flap);
  this.input.keyboard.on("keydown_SPACE", flap);
}

function update() {
  if (bird.y > config.height || bird.y < -bird.height) {
    resetGame();
  }
}

function placePipe(upperPipe, lowerPipe) {
  pipeHorizontalPosition += 300;

  pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);

  pipeVerticalPosition = Phaser.Math.Between(
    20,
    config.height - 20 - pipeVerticalDistance
  );

  upperPipe.x = pipeHorizontalPosition;
  upperPipe.y = pipeVerticalPosition;

  lowerPipe.x = pipeHorizontalPosition;
  lowerPipe.y = pipeVerticalPosition + pipeVerticalDistance;

  pipes.setVelocityX(-200);
}

function flap() {
  bird.body.velocity.y = -FLAP_VELOCITY;
}

function resetGame() {
  bird.x = initialBirdPosition.x;
  bird.y = initialBirdPosition.y;
  bird.body.velocity.y = 0;
}

new Phaser.Game(config);
