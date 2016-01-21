function Log() {}
var fs = require("fs"),
 util = require("util"),
 EOL = require("os").EOL;
module.exports = Log, Log.prototype.setup = function(o) {
 switch (fs.existsSync("./logs") || fs.mkdir("./logs"), o.config.serverLogLevel) {
  case 2:
   ip_log = fs.createWriteStream("./logs/ip.log", {
    flags: "w"
   }), this.onConnect = function(o) {
    ip_log.write("[" + this.formatTime() + "] Connect: " + o + EOL)
   }, this.onDisconnect = function(o) {
    ip_log.write("[" + this.formatTime() + "] Disconnect: " + o + EOL)
   };
  case 1:
   console_log = fs.createWriteStream("./logs/console.log", {
    flags: "w"
   }), console.log = function(o) {
    console_log.write(util.format(o) + EOL), process.stdout.write(util.format(o) + EOL)
   }, this.onCommand = function(o) {
    console_log.write(">" + o + EOL)
   };
  case 0:
   process.on("uncaughtException", function(o) {
    console.log(o.stack);
   });
 }
}, Log.prototype.onConnect = function(o) {}, Log.prototype.onDisconnect = function(o) {}, Log.prototype.onCommand = function(o) {}, Log.prototype.formatTime = function() {
 var o = new Date,
  t = o.getHours();
 t = (10 > t ? "0" : "") + t;
 var e = o.getMinutes();
 return e = (10 > e ? "0" : "") + e, t + ":" + e;
};