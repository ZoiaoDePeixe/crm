/**
 * @fileoverview About this file
 */

// ydn.msg.Pipe.DEBUG = true;
ydn.crm.msg.Manager.addConsumer(new ydn.crm.msg.ConsoleStatusBar());
ydn.msg.initPipe('popup');
ydn.debug.log('ydn.crm', 'finer');
var panel, sugar;
var user = ydn.crm.ui.UserSetting.getInstance();

ydn.crm.shared.logger.info('activity panel test');

ydn.crm.shared.init();
ydn.ui.setTemplateDocument('/inj-template.html');

var hud = new ydn.crm.inj.Hud();
hud.render();

user.onReady().addCallbacks(function() {
  document.getElementById('gmail-account').textContent = user.getLoginEmail();

  var panel = new goog.ui.Component();
  hud.addPanel(panel);
  var el = panel.getElement();
  var div = document.createElement('div');
  div.textContent = 'Panel content';
  div.style.height = '100px';
  div.style.border = 'lightblue solid thin';
  el.appendChild(div);
}, function(e) {
  window.console.error(e);
});


var btn_open = document.getElementById('open');
btn_open.onclick = function(e) {
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(ydn.crm.ui.EventType.DRAWER_REQUEST, true, true, { open: true });
  btn_open.dispatchEvent(evt);
};


var btn_close = document.getElementById('close');
btn_close.onclick = function(e) {
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(ydn.crm.ui.EventType.DRAWER_REQUEST, true, true, { open: false });
  btn_close.dispatchEvent(evt);
};




