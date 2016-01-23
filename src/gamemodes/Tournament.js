function Tournament() {
 Mode.apply(this, Array.prototype.slice.call(arguments)), this.ID = 10, this.name = "Tournament", this.packetLB = 48, this.prepTime = 5, this.endTime = 15, this.autoFill = !1, this.autoFillPlayers = 1, this.dcTime = 0, this.gamePhase = 0, this.contenders = [], this.maxContenders = 12, this.winner, this.timer, this.timeLimit = 3600
}
var Mode = require("./Mode");
module.exports = Tournament, Tournament.prototype = new Mode, Tournament.prototype.startGamePrep = function(t) {
 this.gamePhase = 1, this.timer = this.prepTime
}, Tournament.prototype.startGame = function(t) {
 t.run = !0, this.gamePhase = 2, this.getSpectate(), t.config.playerDisconnectTime = this.dcTime
}, Tournament.prototype.endGame = function(t) {
 this.winner = this.contenders[0], this.gamePhase = 3, this.timer = this.endTime
}, Tournament.prototype.endGameTimeout = function(t) {
 t.run = !1, this.gamePhase = 4, this.timer = this.endTime
}, Tournament.prototype.fillBots = function(t) {
 for (var e = this.maxContenders - this.contenders.length, i = 0; e > i; i++) t.bots.addBot()
}, Tournament.prototype.getSpectate = function() {
 var t = Math.floor(Math.random() * this.contenders.length);
 this.rankOne = this.contenders[t]
}, Tournament.prototype.prepare = function(t) {
 for (var e = t.nodes.length, i = 0; e > i; i++) {
  var n = t.nodes[0];
  n && t.removeNode(n)
 }
 t.bots.loadNames(), t.run = !1, this.gamePhase = 0, t.config.tourneyAutoFill > 0 && (this.timer = t.config.tourneyAutoFill, this.autoFill = !0, this.autoFillPlayers = t.config.tourneyAutoFillPlayers), this.dcTime = t.config.playerDisconnectTime, t.config.playerDisconnectTime = 0, t.config.playerMinMassDecay = t.config.playerStartMass, this.prepTime = t.config.tourneyPrepTime, this.endTime = t.config.tourneyEndTime, this.maxContenders = t.config.tourneyMaxPlayers, this.timeLimit = 60 * t.config.tourneyTimeLimit
}, Tournament.prototype.onPlayerDeath = function(t) {}, Tournament.prototype.formatTime = function(t) {
 if (0 > t) return "0:00";
 var e = Math.floor(this.timeLimit / 60),
  i = this.timeLimit % 60;
 return i = i > 9 ? i : "0" + i.toString(), e + ":" + i
}, Tournament.prototype.onServerInit = function(t) {
 this.prepare(t)
}, Tournament.prototype.onPlayerSpawn = function(t, e) {
 0 == this.gamePhase && this.contenders.length < this.maxContenders && (e.color = t.getRandomColor(), this.contenders.push(e), t.spawnPlayer(e), this.contenders.length == this.maxContenders && this.startGamePrep(t))
}, Tournament.prototype.onCellRemove = function(t) {
 var e = t.owner,
  i = !1;
 if (e.cells.length <= 0) {
  var n = this.contenders.indexOf(e); - 1 != n && ("_socket" in this.contenders[n].socket && (i = !0), this.contenders.splice(n, 1));
  for (var r = 0, o = 0; o < this.contenders.length; o++) "_socket" in this.contenders[o].socket && r++;
  (1 == this.contenders.length || 0 == r || 1 == r && i) && 2 == this.gamePhase ? this.endGame(t.owner.gameServer) : this.onPlayerDeath(t.owner.gameServer)
 }
}, Tournament.prototype.updateLB = function(t) {
 var e = t.leaderboard;
 switch (this.gamePhase) {
  case 0:
   e[0] = "Waiting for", e[1] = "players: ", e[2] = this.contenders.length + "/" + this.maxContenders, this.autoFill && (this.timer <= 0 ? this.fillBots(t) : this.contenders.length >= this.autoFillPlayers && this.timer--);
   break;
  case 1:
   e[0] = "Game starting in", e[1] = this.timer.toString(), e[2] = "Good luck!", this.timer <= 0 ? this.startGame(t) : this.timer--;
   break;
  case 2:
   e[0] = "Players Remaining", e[1] = this.contenders.length + "/" + this.maxContenders, e[2] = "Time Limit:", e[3] = this.formatTime(this.timeLimit), this.timeLimit < 0 ? this.endGameTimeout(t) : this.timeLimit--;
   break;
  case 3:
   e[0] = "Congratulations", e[1] = this.winner.getName(), e[2] = "for winning!", this.timer <= 0 ? (this.onServerInit(t), t.startingFood()) : (e[3] = "Game restarting in", e[4] = this.timer.toString(), this.timer--);
   break;
  case 4:
   e[0] = "Time Limit", e[1] = "Reached!", this.timer <= 0 ? (this.onServerInit(t), t.startingFood()) : (e[2] = "Game restarting in", e[3] = this.timer.toString(), this.timer--)
 }
};