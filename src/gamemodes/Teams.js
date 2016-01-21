function Teams() {
 Mode.apply(this, Array.prototype.slice.call(arguments)), this.ID = 1, this.name = "Teams", this.decayMod = 1.5, this.packetLB = 50, this.haveTeams = !0, this.colorFuzziness = 32, this.teamAmount = 3, this.colors = [{
  r: 223,
  g: 0,
  b: 0
 }, {
  r: 0,
  g: 223,
  b: 0
 }, {
  r: 0,
  g: 0,
  b: 223
 }], this.nodes = [];
}
var Mode = require("./Mode");
module.exports = Teams, Teams.prototype = new Mode, Teams.prototype.fuzzColorComponent = function(o) {
 return o += Math.random() * this.colorFuzziness >> 0;
}, Teams.prototype.getTeamColor = function(o) {
 var e = this.colors[o];
 return {
  r: this.fuzzColorComponent(e.r),
  b: this.fuzzColorComponent(e.b),
  g: this.fuzzColorComponent(e.g)
 };
}, Teams.prototype.onPlayerSpawn = function(o, e) {
 e.color = this.getTeamColor(e.team), o.spawnPlayer(e);
}, Teams.prototype.onServerInit = function(o) {
 for (var e = 0; e < this.teamAmount; e++) this.nodes[e] = [];
 for (var e = 0; e < o.clients.length; e++) {
  var t = o.clients[e].playerTracker;
  this.onPlayerInit(t), t.color = this.getTeamColor(t.team);
  for (var s = 0; s < t.cells.length; s++) {
   var n = t.cells[s];
   n.setColor(t.color), this.nodes[t.team].push(n);
  }
 }
}, Teams.prototype.onPlayerInit = function(o) {
 o.team = Math.floor(Math.random() * this.teamAmount);
}, Teams.prototype.onCellAdd = function(o) {
 this.nodes[o.owner.getTeam()].push(o);
}, Teams.prototype.onCellRemove = function(o) {
 var e = this.nodes[o.owner.getTeam()].indexOf(o); - 1 != e && this.nodes[o.owner.getTeam()].splice(e, 1);
}, Teams.prototype.onCellMove = function(o, e, t) {
 for (var s = t.owner.getTeam(), n = t.getSize(), i = 0; i < t.owner.visibleNodes.length; i++) {
  var r = t.owner.visibleNodes[i];
  if (0 == r.getType() && t.owner != r.owner && r.owner.getTeam() == s) {
   var a = r.getSize() + n;
   if (!t.simpleCollide(o, e, r, a)) continue;
   if (dist = t.getDist(t.position.x, t.position.y, r.position.x, r.position.y), dist < a) {
    var l = r.position.y - e,
     m = r.position.x - o,
     p = Math.atan2(m, l),
     h = a - dist;
    r.position.x = r.position.x + h * Math.sin(p) >> 0, r.position.y = r.position.y + h * Math.cos(p) >> 0;
   }
  }
 }
}, Teams.prototype.updateLB = function(o) {
 for (var e = 0, t = [], s = 0; s < this.teamAmount; s++) {
  t[s] = 0;
  for (var n = 0; n < this.nodes[s].length; n++) {
   var i = this.nodes[s][n];
   i && (t[s] += i.mass, e += i.mass);
  }
 }
 for (var s = 0; s < this.teamAmount; s++) 0 >= e || (o.leaderboard[s] = t[s] / e);
};