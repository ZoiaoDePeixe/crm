/**
 * @fileoverview About this file
 */

ydn.crm.msg.Manager.MAX_BUFFER = 3;

var sb = new ydn.crm.msg.StatusBar();
sb.render(document.getElementById('statusbar'));
ydn.crm.msg.Manager.addConsumer(sb);
ydn.crm.msg.Manager.addStatus('Ready!');
var msg_id = 0;

document.getElementById('add').onclick = function(e) {
  var title = document.getElementById('title').value;
  var update = document.getElementById('update').value;
  var id = ydn.crm.msg.Manager.addStatus(title, update);
  var link = document.getElementById('link').value;
  var link_title = document.getElementById('link-title').value;
  document.getElementById('msg-id').value = id;
  if (link) {
    var href = 'http://example.com/' + link;
    ydn.crm.msg.Manager.setLink(id, href, link, link_title);
  }
};


document.getElementById('set').onclick = function(e) {
  var msg_id = parseInt(document.getElementById('msg-id').value, 10);
  var title = document.getElementById('title').value;
  var update = document.getElementById('update').value;
  ydn.crm.msg.Manager.setStatus(msg_id, title, update);
  var link = document.getElementById('link').value;
  var link_title = document.getElementById('link-title').value;
  if (link) {
    var href = 'http://example.com/' + link;
    ydn.crm.msg.Manager.setLink(msg_id, href, link, link_title);
  }
};

