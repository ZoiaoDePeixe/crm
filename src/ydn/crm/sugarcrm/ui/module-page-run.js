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


var desktop = new ydn.crm.ui.Desktop();
desktop.render(document.getElementById('root'));


ydn.crm.su.model.Sugar.get().addCallback(function(x) {
  sugar = /** @type {ydn.crm.su.model.Sugar} */(x);
  if (!sugar) {
    window.console.error('no instance');
    return;
  }
  panel = new ydn.crm.su.ui.ModulePage(sugar, ydn.crm.su.ModuleName.CONTACTS);
  desktop.addChild(panel, true);
  desktop.showPage(panel.toString());
});

