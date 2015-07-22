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
var panel = new goog.ui.Component();
var panel_div = document.createElement('div');
panel_div.textContent = 'Panel content';
panel_div.style.overflowY = 'auto';
panel_div.style.border = 'lightblue solid thin';


user.onReady().addCallbacks(function() {
  document.getElementById('gmail-account').textContent = user.getLoginEmail();

  hud.addPanel(panel);
  panel.getElement().appendChild(panel_div);
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


var btn_load = document.getElementById('load');
btn_load.onclick = function(e) {
  for (var i = 0; i < 5; i++) {
    var p = document.createElement('p');
    p.textContent = i + ' some data added on ' + new Date().toLocaleString();
    panel_div.appendChild(p);
  }
};


