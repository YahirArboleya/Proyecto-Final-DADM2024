import { Scene } from "phaser";

export class PlayScene extends Scene {
    constructor () {
      super({ key: 'PlayScene' })
    }
    preload ()
{
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('leftArrow', 'assets/leftarrow.png');
    this.load.image('rightArrow', 'assets/rightarrow.png');
    this.load.spritesheet('player', 
        'assets/player.png',
        { frameWidth: 32, frameHeight: 48 }
    );
  }
    create () {
        // Establece los valores del juego según el tamaño de la pantalla.
    this.screenWidth = this.scale.width;
    this.screenHeight = this.scale.height;
    this.screenCenterX = this.screenWidth / 2;
    this.controlsAreaHeight = this.screenHeight * 0.2;
    this.gameAreaHeight = this.screenHeight - this.controlsAreaHeight;

    // Agrega el jugador, la plataforma y los controles.
    this.platform = this.physics.add.staticImage(0, this.gameAreaHeight, 'platform').setOrigin(0, 0).refreshBody();
    this.player = this.physics.add.sprite(this.screenCenterX, this.gameAreaHeight - 24, 'player');
    this.leftArrow = this.add.image(this.screenWidth * 0.1, this.gameAreaHeight + 40, 'leftArrow').setOrigin(0, 0).setInteractive()
    this.rightArrow = this.add.image(this.screenWidth * 0.7, this.gameAreaHeight + 40, 'rightArrow').setOrigin(0, 0).setInteractive()
   
   
  if (!this.anims.exists('left')) {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  if (!this.anims.exists('turn')) {
    this.anims.create({
      key: "turn",
      frames: [{ key: 'player', frame: 4 }],
    });
  }

  if (!this.anims.exists('right')) {
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }
// Establece la física del jugador
this.player.body.setGravityY(300);
this.player.setCollideWorldBounds(true);

//agrega un colisionador entre el jugador y las plataforma
this.physics.add.collider(this.player, this.platform);

// controladores de eventos para entrada de flecha
this.moveLeft = false;
this.moveRight = false;

this.leftArrow.on('pointerdown', () => {
this.moveLeft = true;
});

this.leftArrow.on('pointerup', () => {
this.moveLeft = false;
});

this.rightArrow.on('pointerdown', () => { 
this.moveRight = true;
});

this.rightArrow.on('pointerup', () => {
this.moveRight = false;
});

// agregamos la generacion de estrellas.
this.stars = this.physics.add.group({
  gravityY: 300,
 });
 const createStar = () => {
  const x = Math.random() * this.screenWidth;
  const star = this.stars.create(x, 0, 'star');
 }
 const createStarLoop = this.time.addEvent({
  //Número aleatorio entre 1 y 1,2 segundos.
  delay: Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000,
  callback: createStar,
  callbackScope: this,
  loop: true,
 });
 // agregamos generacion de bombas.
  this.bombs = this.physics.add.group({
    gravityY: 900,
  });
  const createBomb = () => {
    const x = Math.random() * this.screenWidth;
    const bomb = this.bombs.create(x, 0, 'bomb');
    bomb.setScale(2).refreshBody();
  }
  const createBombLoop = this.time.addEvent({
    // Número aleatorio entre 4.5 y 5 segundos.
    delay: Math.floor(Math.random() * (5000 - 4500 + 1)) + 4500,
    callback: createBomb,
    callbackScope: this,
    loop: true,
  });

  // colisiones entre el jugador y las bombas.
  this.physics.add.collider(this.stars, this.platform, function(object1, object2) {
    const star = (object1.key === 'star') ? object1 : object2;
    star.destroy();
  });
  
  this.physics.add.collider(this.bombs, this.platform, function(object1, object2) {
    const bomb = (object1.key === 'bomb') ? object1 : object2;
    bomb.destroy();
  });

  //Añade superposición entre el jugador y las estrellas.
  this.score = 0;
this.scoreText = this.add.text(this.screenCenterX, this.gameAreaHeight + 16, 'Score: 0', { fontSize: '16px', fill: '#000' }).setOrigin(0.5, 0.5);

this.physics.add.overlap(this.player, this.stars, function(object1, object2) {
  const star = (object1.key === 'player') ? object1 : object2;
  star.destroy();
  this.score += 10;
  this.scoreText.setText('Score: ' + this.score);
}, null, this);

// Añade superposición entre el jugador y las bombas.

this.physics.add.overlap(this.player, this.bombs, function(object1, object2) {
  const bomb = (object1.key === 'player') ? object1 : object2;
  bomb.destroy();

  createStarLoop.destroy();
  createBombLoop.destroy();
  this.physics.pause();

  
  this.scene.stop('PlayScene')
  this.scene.start('ScoreScene',{score:this.score});

 
}, null, this);
}

update () {
  if (this.moveLeft && !this.moveRight) {
    this.player.setVelocityX(0 - 200);   
    this.player.anims.play('left', true);
  }

  else if (this.moveRight && !this.moveLeft) {
     this.player.setVelocityX(200);    
     this.player.anims.play('right', true);
  }

  else {
    this.player.setVelocityX(0);
    this.player.anims.play('turn');
  }
}
}
