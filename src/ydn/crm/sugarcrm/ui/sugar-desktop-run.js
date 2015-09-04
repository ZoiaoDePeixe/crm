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


var sugar_home = new ydn.crm.su.ui.DesktopHome();
desktop.getHomePage().addChild(sugar_home, true);


ydn.msg.getChannel().send(ydn.crm.ch.Req.GET_SUGAR).addCallback(function(x) {
  var details = /** @type {SugarCrm.Details} */ (x);
  sugar_home.setSugarCrm(details);
});


