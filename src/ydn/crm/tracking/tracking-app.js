/**
 * @fileOverview Sync demo app for TrackRecord data.
 */



var TrackingApp = function() {
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

  var db = new ydn.db.core.Storage('tracking-app', TrackingApp.schema);
  /**
   * @type {ydn.db.core.DbOperator}
   */
  this.db = db.branch(ydn.db.tr.Thread.Policy.SINGLE, true);

  var service = new ydn.crm.tracking.Service(this.client, db);
  this.track_entity = db.entity(service, ydn.crm.tracking.Service.SN_BEACON);
  this.access_entity = db.entity(service, ydn.crm.tracking.Service.SN_ACCESS);
};


TrackingApp.schema = {
  stores: [ydn.db.sync.Entity.schema,
    ydn.crm.tracking.Service.trackSchema,
    ydn.crm.tracking.Service.accessSchema]
};



TrackingApp.prototype.generateRecord = function() {
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


TrackingApp.prototype.refreshNewRecord = function() {
  var data = this.generateRecord();
  document.getElementById('path').value = data.path;
  document.getElementById('subject').value = data.subject;
  document.getElementById('recipients').value = JSON.stringify(data.recipients);
};


TrackingApp.prototype.createRecord = function(e) {
  var data = {
    path: document.getElementById('path').value,
    recipients: JSON.parse(document.getElementById('recipients').value),
    subject: document.getElementById('subject').value
  };
  console.log(data);
  this.track_entity.add(data);
};


TrackingApp.prototype.fetchTrack = function(e) {
  this.track_entity.update().addBoth(function(x) {
    document.getElementById('status').textContent = x + ' new track fetched';
    console.log(x);
  });
};


TrackingApp.prototype.dumpTrack = function(e) {
  this.db.valuesByKeyRange(ydn.crm.tracking.Service.SN_BEACON).addCallback(function(json) {
    // document.getElementById('list-panel').textContent = JSON.stringify(json);
    window.console.log(json);
  });
};


TrackingApp.prototype.dumpAccess = function(e) {
  this.db.valuesByKeyRange(ydn.crm.tracking.Service.SN_ACCESS).addCallback(function(json) {
    // document.getElementById('list-panel').textContent = JSON.stringify(json);
    window.console.log(json);
  });
};


TrackingApp.prototype.fetchAccess = function(e) {
  this.access_entity.update().addBoth(function(x) {
    document.getElementById('status').textContent = x + ' new access fetched';
    console.log(x);
  });
};

TrackingApp.prototype.displayMockData = function() {
  var data = [{
    recipients: 'A@sere.com',
    subject: 'OK',
    sentDate: new Date(1384963200000),
    opens: 3,
    clicks: 5,
    cities: 2,
    lastOpen: new Date(1351689200000)
  }, {
    recipients: 'B@sere.com',
    subject: 'Re: new',
    sentDate: new Date(1351699200000),
    opens: 6,
    clicks: 32,
    cities: 2,
    lastOpen: new Date(1351599200000)
  }, {
    recipients: 'C@sere.com',
    subject: 'Comain',
    sentDate: new Date(1351699200000),
    opens: 6,
    clicks: 32,
    cities: 2,
    lastOpen: new Date(1351599200000)
  }];
  panel.setData(data);
};

TrackingApp.prototype.loadData = function() {
  TrackingApp.setStatus('Loading data...');

};


TrackingApp.setStatus = function(msg) {
  document.getElementById('status').textContent = msg;
};

TrackingApp.prototype.run = function() {
  this.user.refresh();
  goog.events.listen(this.user, ydn.api.user.EventType.LOGIN, function(x) {
    document.getElementById('app-content').style.display = '';
    this.refreshNewRecord();
    document.getElementById('create').onclick = this.createRecord.bind(this);
    document.getElementById('fetch-track').onclick = this.fetchTrack.bind(this);
    document.getElementById('fetch-access').onclick = this.fetchAccess.bind(this);
    document.getElementById('list-track').onclick = this.dumpTrack.bind(this);
    document.getElementById('list-access').onclick = this.dumpAccess.bind(this);

    TrackingApp.setStatus('Ready');
    var me = this;
    setTimeout(function() {
      me.displayMockData();
    }, 10);
  }, false, this);
};

