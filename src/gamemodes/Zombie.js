function Zombie() {
 Mode.apply(this, Array.prototype.slice.call(arguments)), this.ID = 12, this.name = "Zombie FFA", this.haveTeams = !0, this.zombieColor = {
  r: 223,
  g: 223,
  b: 223
 }, this.zombies = [], this.players = [];
}
var Mode = require("./Mode");
module.exports = Zombie, Zombie.prototype = new Mode, Zombie.prototype.leaderboardAddSort = function(e, o) {
 for (var i = o.length - 1, t = !0; i >= 0 && t;) e.getScore(!1) <= o[i].getScore(!1) && (o.splice(i + 1, 0, e), t = !1), i--;
 t && o.splice(0, 0, e);
}, Zombie.prototype.makeZombie = function(e) {
 e.team = 0, e.color = this.zombieColor;
 for (var o = 0; o < e.cells.length; o++) {
  var i = this.players.indexOf(e.cells[o]); - 1 != i && this.players.splice(i, 1), e.cells[o].color = this.zombieColor, this.zombies.push(e.cells[o]);
 }
}, Zombie.prototype.onPlayerSpawn = function(e, o) {
 0 == this.zombies.length ? (o.team = 0, o.color = this.zombieColor) : (o.team = o.pID, o.color = e.getRandomColor()), e.spawnPlayer(o);
}, Zombie.prototype.onCellAdd = function(e) {
 0 == e.owner.getTeam() ? this.zombies.push(e) : this.players.push(e);
}, Zombie.prototype.onCellRemove = function(e) {
 if (0 == e.owner.getTeam()) {
  var o = this.zombies.indexOf(e); - 1 != o && this.zombies.splice(o, 1);
 } else {
  var o = this.players.indexOf(e); - 1 != o && this.players.splice(o, 1);
 }
}, Zombie.prototype.onCellMove = function(e, o, i) {
 for (var t = i.owner.getTeam(), r = i.getSize(), s = 0; s < i.owner.visibleNodes.length; s++) {
  var n = i.owner.visibleNodes[s];
  if (0 == n.getType() && i.owner != n.owner && (n.owner.getTeam() == t || 0 == n.owner.getTeam() || 0 == t)) {
   var l = n.getSize() + r;
   if (!i.simpleCollide(e, o, n, l)) continue;
   if (dist = i.getDist(i.position.x, i.position.y, n.position.x, n.position.y), dist < l) {
    0 == n.owner.getTeam() && 0 != t ? this.makeZombie(i.owner) : 0 == t && 0 != n.owner.getTeam() && this.makeZombie(n.owner);
    var a = n.position.y - o,
     p = n.position.x - e,
     m = Math.atan2(p, a),
     h = l - dist;
    n.position.x = n.position.x + h * Math.sin(m) >> 0, n.position.y = n.position.y + h * Math.cos(m) >> 0;
   }
  }
 }
}, Zombie.prototype.updateLB = function(e) {
 for (var o = e.leaderboard, i = 0; i < e.clients.length; i++)
  if ("undefined" != typeof e.clients[i] && 0 != e.clients[i].playerTracker.team) {
   var t = e.clients[i].playerTracker,
    r = t.getScore(!0);
   t.cells.length <= 0 || (0 != o.length ? o.length < 10 ? this.leaderboardAddSort(t, o) : r > o[9].getScore(!1) && (o.pop(), this.leaderboardAddSort(t, o)) : o.push(t));
  }
 this.rankOne = o[0];
};