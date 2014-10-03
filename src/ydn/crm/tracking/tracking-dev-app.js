/**
 * @fileOverview Sync demo app for TrackRecord data.
 */



var TrackingDevApp = function() {
  var xm = new goog.net.XhrManager();
  var client = new ydn.client.SimpleClient(xm);
  ydn.client.setClient(client, ydn.http.Scopes.DEFAULT);
  this.client = new ydn.client.RichClient(xm,
      {'Content-Type': 'application/json'},
      'https://www.yathit.com', 0, true);
  ydn.client.setClient(this.client, ydn.http.Scopes.LOGIN);
  this.user = ydn.api.User.getInstance();
  var display = new ydn.shared.api.UserDisplayImpl();
  this.user.setDisplay(display);

  this.db = new ydn.db.Storage('tracking-app', TrackingDevApp.schema);
  this.model = new ydn.crm.tracking.DbModel(this.client, this.db);

  var panel = new ydn.crm.tracking.Panel(this.model);

  panel.render(document.getElementById('tracking-panel'));
};


TrackingDevApp.schema = {
  stores: [ydn.db.sync.Entity.schema,
    ydn.crm.tracking.Service.trackSchema,
    ydn.crm.tracking.Service.accessSchema]
};


TrackingDevApp.prototype.generateRecord = function() {
  var path = '/t/' + this.user.getUserId() + '/' + goog.now() + '.gif';
  var emails = [];
  for (var i = 0, n = 1 + 2 * Math.random(); i < n; i++) {
    emails.push(ydn.testing.randEmail());
  }
  return {
    path: path,
    recipients: emails,
    subject: ydn.testing.randSentence()
  };
};


TrackingDevApp.prototype.refreshNewRecord = function() {
  var data = this.generateRecord();
  document.getElementById('path').value = data.path;
  document.getElementById('subject').value = data.subject;
  document.getElementById('recipients').value = JSON.stringify(data.recipients);
};


TrackingDevApp.prototype.createRecord = function(e) {
  var data = {
    path: document.getElementById('path').value,
    recipients: JSON.parse(document.getElementById('recipients').value),
    subject: document.getElementById('subject').value
  };
  console.log(data);
  this.track_entity.add(data);
};


TrackingDevApp.prototype.fetchTrack = function(e) {
  this.track_entity.update().addBoth(function(x) {
    document.getElementById('status').textContent = x + ' new track fetched';
    console.log(x);
  });
};


TrackingDevApp.prototype.listTrack = function(e) {
  this.db.values(ydn.crm.tracking.Service.SN_BEACON).addCallback(function(json) {
    document.getElementById('list-panel').textContent = JSON.stringify(json);
  });
};


TrackingDevApp.prototype.listAccess = function(e) {
  this.db.values(ydn.crm.tracking.Service.SN_ACCESS).addCallback(function(json) {
    document.getElementById('list-panel').textContent = JSON.stringify(json);
  });
};


TrackingDevApp.prototype.fetchAccess = function(e) {
  this.access_entity.update().addBoth(function(x) {
    document.getElementById('status').textContent = x + ' new access fetched';
    console.log(x);
  });
};


TrackingDevApp.prototype.run = function() {
  this.user.refresh();
  goog.events.listen(this.user, ydn.api.user.EventType.LOGIN, function(x) {
    document.getElementById('content').style.display = '';
    this.refreshNewRecord();
    document.getElementById('create').onclick = this.createRecord.bind(this);
    document.getElementById('fetch-track').onclick = this.fetchTrack.bind(this);
    document.getElementById('fetch-access').onclick = this.fetchAccess.bind(this);
    document.getElementById('list-track').onclick = this.listTrack.bind(this);
    document.getElementById('list-access').onclick = this.listAccess.bind(this);
  }, false, this);
};
