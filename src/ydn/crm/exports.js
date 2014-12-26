/**
 * Properties exported to compiled file.
 */



goog.require('ydn.crm.tracking.Panel');
goog.require('ydn.crm.OptionPageApp');
goog.require('ydn.crm.msg.SimpleStatusBar');
goog.require('ydn.crm.sugarcrm.HomePage');
goog.require('ydn.crm.sugarcrm.ui.SearchPanel');
goog.require('ydn.crm.sugarcrm.ui.SyncPanel');
goog.require('ydn.crm.tracking.Panel');
goog.require('ydn.crm.ui.SidebarPanel');
goog.require('ydn.crm.ui.UserSetting');
goog.require('ydn.crm.AboutPage');

goog.exportSymbol('ydn.crm.version', ydn.crm.version);

goog.exportSymbol('ydn.crm.OptionPageApp', ydn.crm.OptionPageApp);
goog.exportSymbol('ydn.crm.AboutPage', ydn.crm.AboutPage);
goog.exportProperty(ydn.crm.OptionPageApp, 'run',
    ydn.crm.OptionPageApp.prototype.run);

goog.exportSymbol('ydn.crm.sugarcrm.HomePage', ydn.crm.sugarcrm.HomePage);
goog.exportSymbol('ydn.crm.tracking.Panel', ydn.crm.tracking.Panel);


goog.exportSymbol('runInjApp', ydn.crm.inj.App.runInjApp);
goog.exportSymbol('ydn.crm.msg.SimpleStatusBar', ydn.crm.msg.SimpleStatusBar);
goog.exportSymbol('ydn.crm.tracking.Panel', ydn.crm.tracking.Panel);

goog.exportProperty(goog.ui.Component, 'render',
    goog.ui.Component.prototype.render);
goog.exportProperty(ydn.crm.msg.SimpleStatusBar, 'render',
    ydn.crm.msg.SimpleStatusBar.prototype.render);
goog.exportSymbol('ydn.crm.sugarcrm.model.Sugar', ydn.crm.sugarcrm.model.Sugar);
goog.exportSymbol('ydn.crm.ui.SidebarPanel', ydn.crm.ui.SidebarPanel);

goog.exportSymbol('ydn.crm.ui.UserSetting', ydn.crm.ui.UserSetting);
goog.exportProperty(ydn.crm.ui.UserSetting, 'getInstance',
    ydn.crm.ui.UserSetting.getInstance);

goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'getUserInfo',
    ydn.crm.ui.UserSetting.prototype.getUserInfo);
goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'onReady',
    ydn.crm.ui.UserSetting.prototype.onReady);
goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'getLoginEmail',
    ydn.crm.ui.UserSetting.prototype.getLoginEmail);





