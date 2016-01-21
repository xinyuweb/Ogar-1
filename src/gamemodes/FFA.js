function FFA() {
 Mode.apply(this, Array.prototype.slice.call(arguments)), this.ID = 0, this.name = "Free For All", this.specByLeaderboard = !0;
}
var Mode = require("./Mode");
module.exports = FFA, FFA.prototype = new Mode, FFA.prototype.leaderboardAddSort = function(e, o) {
 for (var r = o.length - 1, t = !0; r >= 0 && t;) e.getScore(!1) <= o[r].getScore(!1) && (o.splice(r + 1, 0, e), t = !1), r--;
 t && o.splice(0, 0, e);
}, FFA.prototype.onPlayerSpawn = function(e, o) {
 o.color = e.getRandomColor();
 var r, t;
 if (e.nodesEjected.length > 0) {
  var a = Math.floor(100 * Math.random()) + 1;
  if (a <= e.config.ejectSpawnPlayer) {
   var a = Math.floor(Math.random() * e.nodesEjected.length),
    n = e.nodesEjected[a];
   e.removeNode(n), r = {
    x: n.position.x,
    y: n.position.y
   }, t = n.mass;
   var l = n.getColor();
   o.setColor({
    r: l.r,
    g: l.g,
    b: l.b
   });
  }
 }
 e.spawnPlayer(o, r, t);
}, FFA.prototype.updateLB = function(e) {
 for (var o = e.leaderboard, r = 0; r < e.clients.length; r++)
  if ("undefined" != typeof e.clients[r]) {
   var t = e.clients[r].playerTracker,
    a = t.getScore(!0);
   t.cells.length <= 0 || (0 != o.length ? o.length < 10 ? this.leaderboardAddSort(t, o) : a > o[9].getScore(!1) && (o.pop(), this.leaderboardAddSort(t, o)) : o.push(t));
  }
 this.rankOne = o[0];
};