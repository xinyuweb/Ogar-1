function PlayerTracker(e, t)
{
  this.pID = -1, this.disconnect = -1, this.name = "", this.gameServer = e, this.socket = t, this.nodeAdditionQueue = [], this.nodeDestroyQueue = [], this.visibleNodes = [], this.cells = [], this.score = 0, this.mouse = {
    x: 0,
    y: 0
  }, this.mouseCells = [], this.tickLeaderboard = 0, this.tickViewBox = 0, this.team = 0, this.spectate = !1, this.spectatedPlayer = -1, this.sightRangeX = 0, this.sightRangeY = 0, this.centerPos = {
    x: 3e3,
    y: 3e3
  }, this.viewBox = {
    topY: 0,
    bottomY: 0,
    leftX: 0,
    rightX: 0,
    width: 0,
    height: 0
  }, e && (this.pID = e.getNewPlayerID(), e.gameMode.onPlayerInit(this))
}
var Packet = require("./packet"),
  GameServer = require("./GameServer");
module.exports = PlayerTracker, PlayerTracker.prototype.setName = function (e)
{
  this.name = e
}, PlayerTracker.prototype.getName = function ()
{
  return this.name
}, PlayerTracker.prototype.getScore = function (e)
{
  if (e)
    for (var t = 0, s = 0; s < this.cells.length; s++) t += this.cells[s].mass, this.score = t;
  return this.score >> 0
}, PlayerTracker.prototype.setColor = function (e)
{
  this.color.r = e.r, this.color.b = e.b, this.color.g = e.g
}, PlayerTracker.prototype.getTeam = function ()
{
  return this.team
}, PlayerTracker.prototype.update = function ()
{
  this.socket.packetHandler.pressSpace && (this.gameServer.gameMode.pressSpace(this.gameServer, this), this.socket.packetHandler.pressSpace = !1), this.socket.packetHandler.pressW && (this.gameServer.gameMode.pressW(this.gameServer, this), this.socket.packetHandler.pressW = !1), this.socket.packetHandler.pressQ && (this.gameServer.gameMode.pressQ(this.gameServer, this), this.socket.packetHandler.pressQ = !1);
  for (var e = [], t = 0; t < this.nodeDestroyQueue.length;)
  {
    var s = this.visibleNodes.indexOf(this.nodeDestroyQueue[t]);
    s > -1 ? (this.visibleNodes.splice(s, 1), t++) : this.nodeDestroyQueue.splice(t, 1)
  }
  var i = [];
  if (this.tickViewBox <= 0)
  {
    for (var r = this.calcViewBox(), h = 0; h < this.visibleNodes.length; h++)
    {
      var s = r.indexOf(this.visibleNodes[h]); - 1 == s && i.push(this.visibleNodes[h])
    }
    for (var h = 0; h < r.length; h++)
    {
      var s = this.visibleNodes.indexOf(r[h]); - 1 == s && e.push(r[h])
    }
    this.visibleNodes = r, this.tickViewBox = 2
  }
  else
  {
    this.tickViewBox--;
    for (var h = 0; h < this.nodeAdditionQueue.length; h++)
    {
      var a = this.nodeAdditionQueue[h];
      this.visibleNodes.push(a), e.push(a)
    }
  }
  for (var h = 0; h < this.visibleNodes.length; h++)
  {
    var a = this.visibleNodes[h];
    a.sendUpdate() && e.push(a)
  }
  if (this.socket.sendPacket(new Packet.UpdateNodes(this.nodeDestroyQueue, e, i)), this.nodeDestroyQueue = [], this.nodeAdditionQueue = [], this.tickLeaderboard <= 0 ? (this.socket.sendPacket(this.gameServer.lb_packet), this.tickLeaderboard = 10) : this.tickLeaderboard--, this.disconnect > -1 && (this.disconnect--, -1 == this.disconnect))
  {
    for (var o = this.cells.length, h = 0; o > h; h++)
    {
      var c = this.socket.playerTracker.cells[0];
      c && this.gameServer.removeNode(c)
    }
    var s = this.gameServer.clients.indexOf(this.socket); - 1 != s && this.gameServer.clients.splice(s, 1)
  }
}, PlayerTracker.prototype.updateSightRange = function ()
{
  for (var e = 1, t = this.cells.length, s = 0; t > s; s++) this.cells[s] && (e += this.cells[s].getSize());
  var i = Math.pow(Math.min(64 / e, 1), .4);
  this.sightRangeX = this.gameServer.config.serverViewBaseX / i, this.sightRangeY = this.gameServer.config.serverViewBaseY / i
}, PlayerTracker.prototype.updateCenter = function ()
{
  var e = this.cells.length;
  if (!(0 >= e))
  {
    for (var t = 0, s = 0, i = 0; e > i; i++) this.cells[i] && (t += this.cells[i].position.x, s += this.cells[i].position.y);
    this.centerPos.x = t / e, this.centerPos.y = s / e
  }
}, PlayerTracker.prototype.calcViewBox = function ()
{
  if (this.spectate) return this.getSpectateNodes();
  this.updateSightRange(), this.updateCenter(), this.viewBox.topY = this.centerPos.y - this.sightRangeY, this.viewBox.bottomY = this.centerPos.y + this.sightRangeY, this.viewBox.leftX = this.centerPos.x - this.sightRangeX, this.viewBox.rightX = this.centerPos.x + this.sightRangeX, this.viewBox.width = this.sightRangeX, this.viewBox.height = this.sightRangeY;
  for (var e = [], t = 0; t < this.gameServer.nodes.length; t++) node = this.gameServer.nodes[t], node && node.visibleCheck(this.viewBox, this.centerPos) && e.push(node);
  return e
}, PlayerTracker.prototype.getSpectateNodes = function ()
{
  var e;
  if (this.gameServer.getMode().specByLeaderboard ? (this.spectatedPlayer = Math.min(this.gameServer.leaderboard.length - 1, this.spectatedPlayer), e = -1 == this.spectatedPlayer ? null : this.gameServer.leaderboard[this.spectatedPlayer]) : (this.spectatedPlayer = Math.min(this.gameServer.clients.length - 1, this.spectatedPlayer), e = -1 == this.spectatedPlayer ? null : this.gameServer.clients[this.spectatedPlayer].playerTracker), e)
  {
    if (0 == e.cells.length) return this.gameServer.switchSpectator(this), [];
    var t = Math.sqrt(100 * e.score);
    return t = .6 * Math.pow(Math.min(40.5 / t, 1), .4), this.socket.sendPacket(new Packet.UpdatePosition(e.centerPos.x, e.centerPos.y, t)), e.visibleNodes.slice(0, e.visibleNodes.length)
  }
  return []
};