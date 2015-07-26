/**
 * @fileoverview About this file
 */

// ydn.msg.Pipe.DEBUG =  true;
ydn.crm.msg.Manager.addConsumer(new ydn.crm.msg.ConsoleStatusBar());
ydn.msg.initPipe('popup');
ydn.debug.log('ydn.crm', 'finer');
var sugar;
var user = ydn.crm.ui.UserSetting.getInstance();

ydn.crm.shared.logger.info('activity panel test');

var provider = new ydn.crm.su.ui.RecordListProvider();
var panel = new ydn.crm.su.ui.RecordList(provider);

ydn.crm.shared.init();
ydn.ui.setTemplateDocument('/inj-template.html');


ydn.crm.su.model.Sugar.get().addCallback(function(x) {
  sugar = /** @type {ydn.crm.su.model.Sugar} */(x);
  if (!sugar) {
    window.console.error('no instance');
    return;
  }
  provider.setSugar(sugar);
  panel.render(document.getElementById('root'));
});

