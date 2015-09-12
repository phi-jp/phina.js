
phina.namespace(function () {

  /**
   * @class
   */
  phina.define('phina.display.AfterimageLayer', {
    superClass: 'phina.display.Layer',

    // �c�����`�悳���
    afterimage: null,

    _dummyCanvas: null,
    _renderer: null,
    _dummyElement: null,

    /**
     * 1�t���[���łǂ̂��炢�������邩
     * 0.499 �ȏ�ɂ���Ɖi�v�� rate �ɉ������s�����x�Ŏc�葱����
     * 0.9 �ȉ��Ȃ炻���܂ŉi�v�Ɏc��c���͖ڗ����Ȃ�
     */
    rate: 0.8,

    // scene�ɕ`�悷�邩
    isDrawing: true,

    childrenVisible: false,

    init: function (width, height) {
      this.superInit({
        width: width,
        height: height
      });


      var after = this.afterimage = this.canvas;
      var dummy = this._dummyCanvas = phina.graphics.Canvas();

      this.width = dummy.width = after.width
      this.height = dummy.height = after.height;

      this._renderer = phina.display.CanvasRenderer(dummy);
      this._dummyElement = phina.display.CanvasElement();
      this._dummyElement.children = this.children;

    },

    draw: function (canvas) {
      var after = this.afterimage;
      var element = after.canvas;

      var w = after.width, h = after.height;
      var c = after.context;
      var dummy = this._dummyCanvas;

      var dummyContext = dummy.context;

      dummyContext.clearRect(0, 0, w, h);
      dummyContext.globalAlpha = this.rate;
      dummyContext.drawImage(element, 0, 0, w, h, 0, 0, w, h);

      dummyContext.save();
      this._renderer.renderObject(this._dummyElement);
      dummyContext.restore();


      c.clearRect(0, 0, w, h);
      c.drawImage(dummy.canvas, 0, 0, w, h, 0, 0, w, h);

      if (this.isDrawing) canvas.context.drawImage(element, 0, 0, w, h, 0, 0, w, h);
    },


    /**
     * �c�����N���A
     */
    clear: function () {
      this.afterimage.clear();
      return this;
    },

    setRate: function (rate) {
      this.rate = rate;
      return this;
    },

    /**
     * �����_�ł̎c�����R�s�[�����摜��Ԃ�
     */
    getImage: function () {
      var image = phina.graphics.Canvas();
      var w = image.width = this.width;
      var h = image.height = this.height;
      image.context.drawImage(this.afterimage.canvas, 0, 0, w, h, 0, 0, w, h);
      return image;
    }

  });
});
