/**
 * @fileoverview About this file
 */


ydn.crm.msg.Manager.addConsumer(new ydn.crm.msg.ConsoleStatusBar());
ydn.msg.initPipe('popup');
ydn.debug.log('ydn.crm', 'finer');
var panel, sugar;
var user = ydn.crm.ui.UserSetting.getInstance();

ydn.crm.shared.init();

var page = new ydn.crm.su.ui.SettingPage();


page.render(document.getElementById('root'));

page.onPageShow();
