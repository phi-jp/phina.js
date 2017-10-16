
phina.namespace(function() {

  /**
   * @class phina.display.DisplayElement
   * @extends phina.app.Object2D
   */
  phina.define('phina.display.DisplayElement', {
    superClass: 'phina.app.Object2D',

    /** ブレンドモード */
    blendMode: "source-over",

    /** 子供を 自分のCanvasRenderer で描画するか */
    renderChildBySelf: false,

    init: function(options) {
      options = ({}).$safe(options, {
        alpha: 1.0,
        visible: true,
      });
            
      this.superInit(options);

      this.alpha = options.alpha;
      this.visible = options.visible;
      this._worldAlpha = 1.0;
    },

    /**
     * アルファ値をセット
     */
    setAlpha: function(alpha) {
      this.alpha = alpha;
      return this;
    },
    
    /**
     * 表示/非表示をセット
     */
    setVisible: function(flag) {
      this.visible = flag;
      return this;
    },

    /**
     * 表示
     */
    show: function() {
      this.visible = true;
      return this;
    },

    /**
     * 非表示
     */
    hide: function() {
      this.visible = false;
      return this;
    },

    /**
     * @private
     */
    _calcWorldAlpha: function() {
      if (this.alpha < 0) {
        this._worldAlpha = 0;
        return;
      }
      if (!this.parent) {
        this._worldAlpha = this.alpha;
        return ;
      }
      else {
        var worldAlpha = (this.parent._worldAlpha !== undefined) ? this.parent._worldAlpha : 1.0; 
        // alpha
        this._worldAlpha = worldAlpha * this.alpha;
      }
    },
  });

});

