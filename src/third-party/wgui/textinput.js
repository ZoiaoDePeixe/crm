goog.provide('wgui.TextInput');
goog.require('goog.ui.Control');
goog.require('wgui.TextInputRenderer');



/**
 * A single line text field with consistent look & feel on all browsers.
 *
 * @param {string} content The text to set as the input element's value.
 * @param {wgui.TextInputRenderer=} opt_renderer Renderer used to render or
 *     decorate the input. Defaults to {@link wgui.TextInputRenderer}.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
 *     document interaction.
 * @param {boolean=} opt_disable_clear disable clear button inside the box.
 * @constructor
 * @extends {goog.ui.Control}
 */
wgui.TextInput = function(content, opt_renderer, opt_domHelper, opt_disable_clear) {
  goog.base(this, content,
      opt_renderer || wgui.TextInputRenderer.getInstance(),
      opt_domHelper);
  this.enable_clear_button_ = !opt_disable_clear;
  this.setHandleMouseEvents(false);
  this.setAllowTextSelection(true);
  this.setAutoStates(goog.ui.Component.State.ALL, false);
  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  if (!content) {
    this.setContentInternal('');
  }
};
goog.inherits(wgui.TextInput, goog.ui.Control);

/**
 * Override enterDocument to dispatch action event even FOCUSED state is not supported.
 * @inheritDoc
 */
wgui.TextInput.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var keyTarget = this.getKeyEventTarget();
  if(keyTarget) {
    var keyHandler = this.getKeyHandler();
    keyHandler.attach(keyTarget);
    this.getHandler().listen(
        keyHandler, goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent);
  }
  this.enableClearButton(this.enable_clear_button_);
};

/**
 * Enable or disable clear button inside the input box.
 * @param {boolean} val
 */
wgui.TextInput.prototype.enableClearButton = function(val) {
  var clear_btn = this.getClearButton();
  this.enable_clear_button_ = !!val;
  if (clear_btn) {
    if (this.enable_clear_button_) {
      this.getHandler().listen(clear_btn, 'click', this.handleClear);
      goog.style.setElementShown(clear_btn, true);
    } else {
      this.getHandler().unlisten(clear_btn, 'click', this.handleClear);
      goog.style.setElementShown(clear_btn, false);
    }
  }
};

/**
 * Get button element to clear content.
 * @return {Element}
 */
wgui.TextInput.prototype.getClearButton = function() {
  var r = this.getRenderer();
  return goog.dom.getElementByClass(goog.getCssName(r.getCssClass(), 'clear'),
     this.getElement());
};

wgui.TextInput.prototype.handleClear = function(e) {
  e.preventDefault();
  this.setValue('');
  var actionEvent = new goog.events.Event(goog.ui.Component.EventType.ACTION,
      this);
  this.dispatchEvent(actionEvent);
};

/**
 * Alias of setContent
 * @param {?string} content A string to set as the value of the input element.
 * @private
 */
wgui.TextInput.prototype.setCaption = function(content) {
  this.setContent(content);
};

/**
 * Alias of setContent
 * @param {?string} content A string to set as the value of the input element.
 * @private
 */
wgui.TextInput.prototype.setValue = function(content) {
  this.setContent(content);
};

/**
 * Returns the value of the text input.
 * @return {?string} the value of the text input.
 */
wgui.TextInput.prototype.getContent = function() {
  var el = this.getElement();
  if(el) {
    return this.getRenderer().getContent(this.getElement());
  } else {
    return null;
  }
};

/**
 * Alias of getContent
 * @return {?string} the value of the input element.
 * @private
 */
wgui.TextInput.prototype.getValue = function() {
  return this.getContent();
};

/**
 * Alias of getContent
 * @override
 */
wgui.TextInput.prototype.getCaption = function() {
  return this.getContent() || '';
};
