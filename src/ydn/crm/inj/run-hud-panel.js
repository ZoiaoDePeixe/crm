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
var hud = new ydn.crm.inj.Hud();
hud.render();

user.onReady().addCallbacks(function() {
  document.getElementById('gmail-account').textContent = user.getLoginEmail();
  hud.updateHeader();
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.LIST_SUGAR_DOMAIN).addCallback(function(sugars) {
    console.log(sugars);
        hud.updateSugarPanels(sugars);
      }, this);
}, function(e) {
  window.console.error(e);
});

