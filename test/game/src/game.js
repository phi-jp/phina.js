
th.describe('game.SplashScene', function() {

  th.it('default', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      this.app.pushScene(phina.game.SplashScene());
    };
  });
});


th.describe('game.TitleScene', function() {

  th.it('default', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      this.app.pushScene(phina.game.TitleScene());
    };
  });

  th.it('option', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      this.app.pushScene(phina.game.TitleScene({
        title: 'タイトルだよー♪',
        fontColor: 'black',
        backgroundColor: 'red',
      }));
    };
  });

});

th.describe('game.ResultScene', function() {

  th.it('default', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      this.app.pushScene(phina.game.ResultScene());
    };
  });

  th.it('option', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      this.app.pushScene(phina.game.ResultScene({
        title: 'タイトルだよー♪',
        fontColor: 'black',
        backgroundColor: 'white',
      }));
    };
  });

});


/*
 * LoadingScene
 */

th.describe('game.LoadingScene', function() {

  th.it('default', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      var scene = phina.game.LoadingScene({
        assets: {
          image: {
            a1: 'http://dummyimage.com/600x400/000/fff&text=1',
            a2: 'http://dummyimage.com/600x400/000/fff&text=2',
            a3: 'http://dummyimage.com/600x400/000/fff&text=3',
            a4: 'http://dummyimage.com/600x400/000/fff&text=4',
            a5: 'http://dummyimage.com/600x400/000/fff&text=5',
            a6: 'http://dummyimage.com/600x400/000/fff&text=6',
          },
        },
      });
      this.app.pushScene(scene);

    };
    
    this.onresume = function() {
      (6).times(function(i) {
        var sprite = phina.display.Sprite('a' + (i + 1)).addChildTo(this);
        sprite.setPosition(i * 100, i * 150);
        sprite.alpha = 0.5;
      }, this);
    };
  });
  
  
    th.it('local_spritesheet', function() {
      phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

      this.onenter = function() {
        var scene = phina.game.LoadingScene({
          assets: {
            image: {
              text: 'http://dummyimage.com/1200x1900/000/fff&text=text?id=' + Math.random(),
            },
            
            spritesheet: {
              ss: {
                frame: {
                  width: 600,
                  height: 280,
                  cols: 2,
                  rows: 5,
                },
                
                animations: {
                  animation: {
                    frames: Array.range(0, 10),
                    next: 'animation',
                    frequency: 5,
                  },
                },
              },
            },
          },
        });
        this.app.pushScene(scene);

      };
      
      this.onresume = function() {
        var sprite = phina.display.Sprite('text').addChildTo(this);
        sprite.setPosition(320, 480);
        var anim = phina.accessory.FrameAnimation('ss');
        anim.attachTo(sprite);
        anim.gotoAndPlay('animation');
      };
    });

});


/*
 * CountScene
 */

th.describe('game.CountScene', function() {

  th.it('default', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      this.app.pushScene(phina.game.CountScene());
    };
  });

  th.it('option', function() {
    phina.display.Label('Hello').addChildTo(this).setPosition(320, 480);

    this.onenter = function() {
      this.app.pushScene(phina.game.CountScene({
        count: ['Ready'],
        backgroundColor: 'red',
        fontColor: 'green',
      }));
    };
  });

});



