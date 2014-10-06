/**
 * Properties exported to compiled file.
 */



goog.require('ydn.crm.OptionPageApp');
goog.require('ydn.crm.msg.SimpleStatusBar');
goog.require('ydn.crm.sugarcrm.Page');
goog.require('ydn.crm.sugarcrm.ui.SearchPanel');
goog.require('ydn.crm.sugarcrm.ui.SyncPanel');
goog.require('ydn.crm.tracking.Panel');
goog.require('ydn.crm.ui.SidebarPanel');
goog.require('ydn.crm.ui.UserSetting');

goog.exportSymbol('ydn.crm.version', ydn.crm.version);

goog.exportSymbol('ydn.crm.OptionPageApp', ydn.crm.OptionPageApp);
goog.exportProperty(ydn.crm.OptionPageApp, 'run',
    ydn.crm.OptionPageApp.prototype.run);

goog.exportSymbol('ydn.crm.sugarcrm.Page', ydn.crm.sugarcrm.Page);

goog.exportSymbol('runInjApp', ydn.crm.inj.App.runInjApp);
goog.exportSymbol('ydn.crm.msg.SimpleStatusBar', ydn.crm.msg.SimpleStatusBar);
goog.exportSymbol('ydn.crm.tracking.Panel', ydn.crm.tracking.Panel);

goog.exportProperty(goog.ui.Component, 'render',
    goog.ui.Component.prototype.render);
goog.exportProperty(ydn.crm.msg.SimpleStatusBar, 'render',
    ydn.crm.msg.SimpleStatusBar.prototype.render);
goog.exportSymbol('ydn.crm.sugarcrm.model.Sugar', ydn.crm.sugarcrm.model.Sugar);
goog.exportSymbol('ydn.crm.ui.SidebarPanel', ydn.crm.ui.SidebarPanel);
goog.exportSymbol('ydn.crm.sugarcrm.ui.SyncPanel', ydn.crm.sugarcrm.ui.SyncPanel);
goog.exportSymbol('ydn.crm.sugarcrm.ui.SearchPanel', ydn.crm.sugarcrm.ui.SearchPanel);
goog.exportProperty(ydn.crm.sugarcrm.ui.SearchPanel.prototype, 'setToolbarOptions',
    ydn.crm.sugarcrm.ui.SearchPanel.prototype.setToolbarOptions);
goog.exportSymbol('ydn.crm.ui.UserSetting', ydn.crm.ui.UserSetting);
goog.exportProperty(ydn.crm.ui.UserSetting, 'getInstance',
    ydn.crm.ui.UserSetting.getInstance);
goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'getModuleInfo',
    ydn.crm.ui.UserSetting.prototype.getModuleInfo);
goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'getUserInfo',
    ydn.crm.ui.UserSetting.prototype.getUserInfo);
goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'onReady',
    ydn.crm.ui.UserSetting.prototype.onReady);
goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'show',
    ydn.crm.ui.UserSetting.prototype.show);
goog.exportProperty(ydn.crm.ui.UserSetting.prototype, 'getLoginEmail',
    ydn.crm.ui.UserSetting.prototype.getLoginEmail);
goog.exportProperty(ydn.crm.sugarcrm.model.Sugar, 'list',
    ydn.crm.sugarcrm.model.Sugar.list);
goog.exportProperty(ydn.crm.gmail.ContextSidebar.prototype, 'update',
    ydn.crm.gmail.ContextSidebar.prototype.updateForNewContact);




