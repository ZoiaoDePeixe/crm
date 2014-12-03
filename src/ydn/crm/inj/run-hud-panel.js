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
  div.style.backgroundColor = 'lightblue';
  el.appendChild(div);
}, function(e) {
  window.console.error(e);
});

