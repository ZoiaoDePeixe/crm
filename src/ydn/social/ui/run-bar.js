/**
 * @fileoverview About this file
 */

// ydn.msg.Pipe.DEBUG = true;
ydn.crm.msg.Manager.addConsumer(new ydn.crm.msg.ConsoleStatusBar());
ydn.msg.initPipe(ydn.msg.ChannelName.DEV);
var bar;
ydn.ui.setTemplateDocument(
    chrome.extension.getURL(ydn.crm.base.INJ_TEMPLATE), function(x) {
      bar = new ydn.social.ui.Bar();
      bar.render(document.getElementById('bar'));
    });




