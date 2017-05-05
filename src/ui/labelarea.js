
phina.namespace(function() {

  var textWidthCache = {};

  var LabelArea = phina.define('phina.ui.LabelArea', {
    superClass: 'phina.display.Label',

    _lineUpdate: true,

    init: function(options) {
      options = {}.$safe(options, LabelArea.defaults);
      this.superInit(options);

      this.verticalAlign = options.verticalAlign;
      this.scroll = options.scroll || phina.geom.Vector2();
      this.scrollX = options.scrollX;
      this.scrollY = options.scrollY;
    },

    calcCanvasWidth: function() {
      return this.width + this.padding * 2;
    },

    calcCanvasHeight: function() {
      return this.height + this.padding * 2;
    },
    getOffsetY: function() {
      if (typeof this.verticalAlign === 'number') {
        return this.verticalAlign;
      }
      return LabelArea.verticalAlignToOffsetMap[this.verticalAlign] || 0;
    },

    getOffsetX: function() {
      return LabelArea.alignToOffsetMap[this.align] || 0;
    },

    getTextWidthCache: function() {
      var cache = textWidthCache[this.font];
      return cache || (textWidthCache[this.font] = {});
    },

    spliceLines: function(lines) {
      var rowWidth = this.width;
      var context = this.canvas.context;
      context.font = this.font;

      var cache = this.getTextWidthCache();

      // update cache
      lines.forEach(function(line) {
        line.forEach(function(elm) {
          elm.text.each(function(ch) {
            if (!cache[ch]) {
              cache[ch] = context.measureText(ch).width;
            }
          });
        });
      });

      var localLines = [];
      lines.forEach(function(line) {
        var totalWidth = 0;

        // 幅を超える文字列の前に改行を加える
        line.forEach(function(elm) {
          var str = '';
          elm.text.each(function(ch) {
            var w = cache[ch];

            if ((totalWidth+w) > rowWidth) {
              str += '\n';
              totalWidth = 0;
            }

            str += ch;
            totalWidth += w;
          });
          elm.text = str;
        });

        // 改めて改行ごとに要素を分割する
        var localLine = [];
        line.forEach(function(element) {
          var first = true;
          element.splitElement('\n').forEach(function(elm) {
            if (first) {
              first = false;
            } else {
              localLines.push(localLine);
              localLine = [];
            }
            localLine.push(elm);
          });
        });
        localLines.push(localLine);
      });

      return localLines;
    },

    getLines: function() {
      if (this._lineUpdate === false) {
        return this._lines;
      }
      this._lineUpdate = false;


      var textElements;
      if (this._text instanceof Array) {
        textElements = this._text.map(function(str){
          return TextElement(str);
        });
      } else {
        textElements = [TextElement(this._text)];
      }

      // 改行ごとに要素を分割する
      var lines = [];
      var line = [];
      textElements.forEach(function(element) {
        var first = true;
        element.splitElement('\n').forEach(function(elm) {
          if (first) {
            first = false;
          } else {
            lines.push(line);
            line = [];
          }
          line.push(elm);
        });
      });

      lines.push(line);

      if (this.width < 1) {
        this._lines = lines;
      }
      else {
        this._lines = this.spliceLines(lines);
      }

      return this._lines;
    },

    prerender: function(canvas) {
      var context = canvas.context;
      context.font = this.font;
      context.textAlign = 'left';
      context.textBaseline = this.baseline;

      var text = this.text + '';
      var lines = this.getLines();
      var length = lines.length;
      var width = this.width;
      var height = this.height;

      var fontSize = this.fontSize;
      var lineSize = fontSize * this.lineHeight;
      var offsetX = 0;
      var offsetY = this.getOffsetY();
      if (offsetY === 0) {
        offsetY = -Math.floor(length / 2) * lineSize;
        offsetY += ((length + 1) % 2) * (lineSize / 2);
      }
      else if (offsetY < 0) {
        offsetY *= height;
      }
      else {
        offsetY = offsetY * height - length * lineSize + lineSize;
      }

      offsetY -= this.scrollY;
      offsetX -= this.scrollX;
      var start = (offsetY + height / 2) / -lineSize | 0;
      if (start < 0) { start = 0; }

      var end = (height / 2 - offsetY + lineSize * 2) / lineSize | 0;
      lines = lines.filter(function(line, i) {
        return start <= i && end > i;
      });

      this.lines = lines;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.lineSize = lineSize;
      this.start = start;
    },

    renderFill: function(canvas) {
      var width = this.width;
      var offsetY = this.offsetY;
      var lineSize = this.lineSize;
      var start = this.start;
      // alignに対応するためすべてtextAlign='left'で表示開始位置を前後させる。
      this.lines.forEach(function(line, i) {
          var offsetX = this.offsetX;
          var w = 0;
          line.forEach(function(elm) {
            w += canvas.context.measureText(elm.text).width;
          });
          if (this.align == 'center') {
            offsetX = -1 * w / 2;
          } else if (this.align == 'left' || this.align == 'start') {
            offsetX = -1 * width / 2 + this.padding;
          } else {
            offsetX = width / 2 - w - this.padding;
          }

          // 1要素ごとに左にずらして表示
          line.forEach(function(elm) {
            offsetX += elm.doFill(canvas, offsetX, (start + i) * lineSize + offsetY);
          }, this);
        }, this);
    },

    renderStroke: function(canvas) {
      var width = this.width;
      var offsetY = this.offsetY;
      var lineSize = this.lineSize;
      var start = this.start;
      // alignに対応するためすべてtextAlign='left'で表示開始位置を前後させる。
      this._lines.forEach(function(line, i) {
        var offsetX = this.offsetX;
        var w = 0;
        line.forEach(function(elm) {
          w += canvas.context.measureText(elm.text).width;
        });
        if (this.align == 'center') {
          offsetX = -1 * w / 2;
        } else if (this.align == 'left' || this.align == 'start') {
          offsetX = -1 * width / 2 + this.padding;
        } else {
          offsetX = width / 2 - w - this.padding;
        }

        // 1要素ごとに左にずらして表示
        line.forEach(function(elm) {
          offsetX += elm.doStroke(canvas, offsetX, (start + i) * lineSize + offsetY);
        }, this);
      }, this);
    },

    _accessor: {
      text: {
        get: function() {
          return this._text;
        },
        set: function(v) {
          this._text = v;
        }
      },

      scrollX: {
        get: function() {
          return this.scroll.x;
        },
        set: function(v) {
          this.scroll.x = v;
        },
      },

      scrollY: {
        get: function() {
          return this.scroll.y;
        },
        set: function(v) {
          this.scroll.y = v;
        },
      },
    },
    _static: {
      defaults: {
        verticalAlign: 'top',
        align: 'left',
        baseline: 'top',
        width: 320,
        height: 320,
        scrollX: 0,
        scrollY: 0,
      },
      alignToOffsetMap: {
        start: -0.5,
        left: -0.5,
        center: 0,
        end: 0.5,
        right: 0.5,
      },

      verticalAlignToOffsetMap: {
        top: -0.5,
        center: 0,
        middle: 0,
        bottom: 0.5,
      },
    },

    _defined: function() {
      var func = function(newVal, oldVal) {
        if((this._lineUpdate === false) && (newVal !== oldVal)){
          this._lineUpdate = true;
        }
      };

      [
        'text',
        'width',
        'fontSize',
        'fontWeight',
        'fontFamily'
      ].forEach(function(key) {
        this.$watch(key, func);
      }, this.prototype);

      phina.display.Shape.watchRenderProperties.call(this ,[
        'verticalAlign',
        'text',
        'scroll',
        'scrollX',
        'scrollY'
      ]);
    },


    enableScroll: function() {
      //   this.setInteractive(true);
      //   var physical = phina.accessory.Physical();
      //   physical.attachTo(this);
      //   physical.friction = 0.8;
      //   var lastForce = 0;
      //   var lastMove = 0;
      //   this.on('pointstart', function(e){
      //     lastForce = physical.velocity.y;
      //     lastMove = 0;
      //     physical.force(0, 0);
      //   });
      //   this.on('pointmove', function(e){
      //     var p = e.pointer.deltaPosition;
      //     lastMove = p.y;
      //     this.scrollY += lastMove;
      //   });

      //   this.on('pointend', function(e){
      //     physical.force(0, lastForce + lastMove);
      //   });

      return this;
    },

  });

});