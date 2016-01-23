function Mode() {
 this.ID = -1, this.name = "Blank", this.decayMod = 1, this.packetLB = 49, this.haveTeams = !1, this.specByLeaderboard = !1
}
module.exports = Mode, Mode.prototype.onServerInit = function(o) {
 o.run = !0
}, Mode.prototype.onTick = function(o) {}, Mode.prototype.onChange = function(o) {}, Mode.prototype.onPlayerInit = function(o) {}, Mode.prototype.onPlayerSpawn = function(o, e) {
 e.color = o.getRandomColor(), o.spawnPlayer(e)
}, Mode.prototype.pressQ = function(o, e) {
 e.spectate && o.switchSpectator(e)
}, Mode.prototype.pressW = function(o, e) {
 o.ejectMass(e)
}, Mode.prototype.pressSpace = function(o, e) {
 o.splitCells(e)
}, Mode.prototype.onCellAdd = function(o) {}, Mode.prototype.onCellRemove = function(o) {}, Mode.prototype.onCellMove = function(o, e, t) {}, Mode.prototype.updateLB = function(o) {};