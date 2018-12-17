(function(){


  $(document).ready(function(){
    const game$ = $('#game');
    let ship$ = $('#ship');
    let asteroids$ = $('.asteroid');
    const life$ = $('#lives');
    const message$ = $('#message');
    const score$ = $('#score');
    let tempo = 5;
    let ship = {life: 3, score: 0};
    let bullets$ = $('.bullet');

    initShip();
    animBg();
    initLives()
    displayScore();
    generateAsteroid();

    $(document).on('keyup', function(e) {

      if (e.key == 'ArrowRight'){
        ship$.css({'left':'+=20'})
      }

      if (e.key == 'ArrowLeft'){
        ship$.css({'left':'-=20'})
      }

      //si on appuie sur espace une ball est generée
      if (e.key == ' '){
        generateBullet();
      }

    })

    function animBg(){
      setInterval(() => {

        //déplace l'arrière-plan vers le bas
        game$.css('background-position-y', '+=10');

        //déplacement des asteroides
        asteroids$.css('top', '+=' + tempo);

        //déplacement des balles
        bullets$.css('top', '-=10')

        asteroids$.each(function(){
          let aste = $(this);
          let asteTop = aste.offset().top
          let asteLeft = aste.offset().left

          if (asteTop > 390){
            //zone à risque, collision possible avec le vaisseau
            //récuperation de la position x du vaisseau
            let shipLeft = ship$.offset().left

            if ((asteLeft + 40 >= shipLeft) && (asteLeft <= shipLeft + 50)){
              //si les conditions sont vraies, il y a contact entre l'astéroide et le vaisseau
              //asteroide retiré du jeu au moment de l'impact
              aste.remove()
              loseLife()
            }
          }

          if(asteTop > 470) {
            //l'asteroide n'est presque plus visible dans la zone de jeu mais il existe encore dans le DOM
            //par souçis d'éfficacité on le retire du DOM
            aste.remove();
          }

          //boucle sur les bullets
          bullets$.each(function() {
            let bul = $(this);
            let bulTop = bul.offset().top;
            let bulLeft = bul.offset().left;

            let contactx = ((asteLeft + 40) >= bulLeft) && (asteLeft <= (bulLeft + 8));
            let contacty = ((asteTop + 40) >= bulTop) && (asteTop <= (bulTop - 8));

            if(contactx && contacty){
              //collision entre l'asteroide et la balle, on retire les deux du DOM
              aste.remove()
              bul.remove()
              ship.score+=1;
              displayScore();

            }
            if(bulTop<0) {bul.remove();}
          })

        })

      }, 1000 / 24)
    }

    function generateAsteroid(){
      setInterval(() => {
        let style = 'left:' + getRandomValue() + 'px';
        game$.append('<div class="asteroid" style="' + style + '"></div>');
        asteroids$ = $('.asteroid');
      }, 3 * 1000)
    }

    function initLives(){
      life$.html('');
      for (let i = 0; i < ship.life; i++) {
        life$.append('<div class="life"></div>')
      }
    }

    function loseLife(){
      ship.life -= 1;
      initLives()
      if (ship.life <= 0) {
        ship$.remove();
        message$.append('<h2>GAME OVER</h2>')
        message$.append('<button id="btnRejouer" type="button" name="button" value="Rejouer">Rejouer</button>')
        let btnRejouer$ = $('#btnRejouer');
        btnRejouer$.on('click', reset)
      }
    }

    function initShip(){
      game$.append('<div id="ship"></div>')
      ship$ = $('#ship');
    }

    function reset(){
      message$.html('');
      ship.life=3;
      ship.score=0;
      initLives();
      displayScore();
      initShip()
    }

    function displayScore(){
      score$.text(ship.score);
      //Tous les 10 points le vaisseau regagne une vie perdue
      if(ship.score%10 == 0 && ship.life<3){
        ship.life +=1;
        initLives();
      }
      displayMessage()
    }

    function displayMessage(){
      switch(ship.score){
        case 20:
          message$.html('<h2>Bien joué!</h2>')
          setTimeout(function(){message$.html('')}, 3 * 1000)
          tempo +=3;
          break;
        case 30:
          message$.html('<h2>Tu es très fort!</h2>')
          setTimeout(function(){message$.html('')}, 3 * 1000)
          tempo +=3;
          break;
        case 40:
          message$.html('<h2>Niveau Abdel!</h2>')
          setTimeout(function(){message$.html('')}, 3 * 1000)
          tempo +=3;
          break;
      }
    }

    function getRandomValue(){
      return Math.floor(Math.random() * 400)
    }

    function generateBullet(){
      let shipLeft = ship$.offset().left;
      let shipTop = ship$.offset().top;
      let style = `top:${shipTop}px;left:${shipLeft + 21}px`

      game$.append('<div class="bullet" style="' + style + '"></div>')
      bullets$ = $('.bullet');
    }

  })


})()//fin fonction englobante
