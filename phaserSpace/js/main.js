(function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, null, { preload: preload, create: create, update: update });
  // VARs GLOBAIS (CUIDADO COM ELAS)
  var platforms, player, keys, stars, txtScore, score = 0;


  // CARREGAR OS RECURSOS DURANTE O JOGO
  function preload() {
    game.load.image('sky', 'img/sky.png');
    game.load.image('platform', 'img/platform.png');
    game.load.image('star', 'img/star.png');

    game.load.spritesheet('dude', 'img/dude.png', 32, 48);
  }
  // CRIAR NO CONTEXTO DO JOGO OS ELEMENTOS
  function create() {
    // FAZ A VERIFICAÇÃO SE O JOGADOR ESTA APERTANDO TECLAS DO TECLADO
    keys = game.input.keyboard.createCursorKeys();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    // GRUPO DE PLATAFORMAS PARA TODAS AS PLAT DO JOGO
    platforms = game.add.group();
    // HABILITAR CORPO SOLIDO PARA TODAS AS PLATAFORMAS
    platforms.enableBody = true;
    // VARIAVEL PARA CRIAÇÃO DA PLATAFORMA DO JOGO    
    var platform = platforms.create(0, game.world.height - 64, 'platform');
    platform.scale.setTo(2, 2);
    // DEIXAR A PLATAFORMA FIXA
    platform.body.immovable = true;

    platform = platforms.create(400, 400, 'platform');
    platform.body.immovable = true;
    platform = platforms.create(-150, 250, 'platform');
    platform.body.immovable = true;

    stars = game.add.group();
    stars.enableBody = true;

    // CRIAR ESTRELAS AUTOMATICAMENTE
    for (var i = 0; i < 12; i++) {
      var star = stars.create(i * 70, 0, 'star');
      star.body.gravity.y = 300;
      star.body.bounce.y = 0.7 + (Math.random() * 0.2);
    }

    player = game.add.sprite(50, game.world.hight - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 300;
    // FAZ O PERSONAGEM QUICAR AO CHAO
    player.body.bounce.y = 0.2;
    //COLIDE NAS FRONTEIRAS DO MUNDO DO JOGO
    player.body.collideWorldBounds = true;
    // ADICIONAR ANIMACOES DO PERSONAGEM
    // COLCHETE -> FRAMES DO SPRITE (DA DIREITA E DA ESQUERDA)
    player.animations.add('left', [0, 1, 2, 3], 10), true;
    player.animations.add('right', [5, 6, 7, 8], 10), true;

    // TEXTO DO PHASER
    // TEXTO PARA MARCAR A PONTUAÇÃO
    txtScore = game.add.text(16, 16, 'SCORE: 0', { fontSize: '32px', fill: '#FFF' });
  }
  // TODA LOGICA DO JOGO VERIFICADA AO LOOPING DO JOGO
  function update() {
    // METODO PARA VERIFICAR SE OS OBJETOS ESTAO COLIDINDO
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar);
    // MANTÉM A VELOCIDADE PADRÃO NO EIXO X
    player.body.velocity.x = 0;
    if (keys.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    }
    else
      if (keys.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
      } // PARAR A ANIMACAO DE CORRIDA E FIXAR NO FRAME 4
      else {
        player.animations.stop();
        player.frame = 4;
      }
    // PARA PULAR 
    if (keys.up.isDown && player.body.touching.down) {
      player.body.velocity.y = -290;
    }
  }

  function collectStar(player, star) {
    // ELIMINA UM SPRITE DO JOGO
    // PLAYER COLIDE COM A ESTRELA, ELA SOME
    star.kill();
    // MAIS 10 PONTOS PARA CADA ESTRELA
    score += 10;
    // MUDA O TEXTO DO SCORE (PONTUACAO)
    txtScore.text = 'SCORE: ' + score;
  }
}());