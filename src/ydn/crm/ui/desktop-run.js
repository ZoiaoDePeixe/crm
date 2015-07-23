/**
 * @fileoverview About this file
 */


var desktop = new ydn.crm.ui.Desktop();
var home = new ydn.crm.ui.DesktopHome();
desktop.addChild(home, true);

desktop.render(document.getElementById('root'));
