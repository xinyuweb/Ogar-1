function BotLoader(e) {
 this.gameServer = e, this.loadNames()
}
var BotPlayer = require("./BotPlayer"),
 FakeSocket = require("./FakeSocket"),
 PacketHandler = require("../PacketHandler");
module.exports = BotLoader, BotLoader.prototype.getName = function() {
 var e = "";
 if (this.randomNames.length > 0) {
  var t = Math.floor(Math.random() * this.randomNames.length);
  e = this.randomNames[t], this.randomNames.splice(t, 1)
 } else e = "bot" + ++this.nameIndex;
 return e
}, BotLoader.prototype.loadNames = function() {
 this.randomNames = [];
 try {
  var e = require("fs");
  this.randomNames = e.readFileSync("./botnames.txt", "utf8").split(/[\r\n]+/).filter(function(e) {
   return "" != e
  })
 } catch (t) {}
 this.nameIndex = 0
}, BotLoader.prototype.addBot = function() {
 var e = new FakeSocket(this.gameServer);
 e.playerTracker = new BotPlayer(this.gameServer, e), e.packetHandler = new PacketHandler(this.gameServer, e), this.gameServer.clients.push(e), e.packetHandler.setNickname(this.getName())
};