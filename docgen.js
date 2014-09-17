/**
 * Created by kyawtun on 17/9/14.
 */

var fs = require("fs");
var mox = require("mox");

var source1 = "./src/ydn/crm/msg/message-manager.js";
var source2 = "./src/ydn/crm/msg/consumer.js";
var fileWriteStream = fs.createWriteStream("./doc/message-manager.md")


mox.run([source1, source2], {template:"file"}).pipe(fileWriteStream);