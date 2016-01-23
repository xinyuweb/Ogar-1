function HungerGames() {
 Tournament.apply(this, Array.prototype.slice.call(arguments)), this.ID = 11, this.name = "Hunger Games", this.maxContenders = 12, this.baseSpawnPoints = [{
  x: 1600,
  y: 200
 }, {
  x: 3200,
  y: 200
 }, {
  x: 4800,
  y: 200
 }, {
  x: 200,
  y: 1600
 }, {
  x: 200,
  y: 3200
 }, {
  x: 200,
  y: 4800
 }, {
  x: 6200,
  y: 1600
 }, {
  x: 6200,
  y: 3200
 }, {
  x: 6200,
  y: 4800
 }, {
  x: 1600,
  y: 6200
 }, {
  x: 3200,
  y: 6200
 }, {
  x: 4800,
  y: 6200
 }], this.contenderSpawnPoints, this.borderDec = 100
}
var Tournament = require("./Tournament"),
 Entity = require("../entity");
module.exports = HungerGames, HungerGames.prototype = new Tournament, HungerGames.prototype.getPos = function() {
 var o = {
  x: 0,
  y: 0
 };
 if (this.contenderSpawnPoints.length > 0) {
  var n = Math.floor(Math.random() * this.contenderSpawnPoints.length);
  o = this.contenderSpawnPoints[n], this.contenderSpawnPoints.splice(n, 1)
 }
 return {
  x: o.x,
  y: o.y
 }
}, HungerGames.prototype.spawnFood = function(o, n, t) {
 var s = new Entity.Food(o.getNextNodeId(), null, t, n);
 s.setColor(o.getRandomColor()), o.addNode(s), o.currentFood++
}, HungerGames.prototype.spawnVirus = function(o, n) {
 var t = new Entity.Virus(o.getNextNodeId(), null, n, o.config.virusStartMass);
 o.addNode(t)
}, HungerGames.prototype.onPlayerDeath = function(o) {
 var n = o.config;
 n.borderLeft += this.borderDec, n.borderRight -= this.borderDec, n.borderTop += this.borderDec, n.borderBottom -= this.borderDec;
 for (var t = o.nodes.length, s = 0; t > s; s++) {
  var e = o.nodes[s];
  e && 0 != e.getType() && (e.position.x < n.borderLeft ? (o.removeNode(e), s--) : e.position.x > n.borderRight ? (o.removeNode(e), s--) : e.position.y < n.borderTop ? (o.removeNode(e), s--) : e.position.y > n.borderBottom && (o.removeNode(e), s--))
 }
}, HungerGames.prototype.onServerInit = function(o) {
 this.prepare(o), this.contenderSpawnPoints = this.baseSpawnPoints.slice(), o.config.serverBots > this.maxContenders && (o.config.serverBots = this.maxContenders), o.config.spawnInterval = 20, o.config.borderLeft = 0, o.config.borderRight = 6400, o.config.borderTop = 0, o.config.borderBottom = 6400, o.config.foodSpawnAmount = 5, o.config.foodStartAmount = 100, o.config.foodMaxAmount = 200, o.config.foodMass = 2, o.config.virusMinAmount = 10, o.config.virusMaxAmount = 100, o.config.ejectSpawnPlayer = 0, o.config.playerDisconnectTime = 10;
 var n = o.config.borderRight - o.config.borderLeft,
  t = o.config.borderBottom - o.config.borderTop;
 this.spawnFood(o, 200, {
  x: .5 * n,
  y: .5 * t
 }), this.spawnFood(o, 80, {
  x: .4 * n,
  y: .6 * t
 }), this.spawnFood(o, 80, {
  x: .6 * n,
  y: .6 * t
 }), this.spawnFood(o, 80, {
  x: .4 * n,
  y: .4 * t
 }), this.spawnFood(o, 80, {
  x: .6 * n,
  y: .4 * t
 }), this.spawnFood(o, 50, {
  x: .7 * n,
  y: .5 * t
 }), this.spawnFood(o, 50, {
  x: .3 * n,
  y: .5 * t
 }), this.spawnFood(o, 50, {
  x: .5 * n,
  y: .7 * t
 }), this.spawnFood(o, 50, {
  x: .5 * n,
  y: .3 * t
 }), this.spawnFood(o, 30, {
  x: .7 * n,
  y: .625 * t
 }), this.spawnFood(o, 30, {
  x: .625 * n,
  y: .7 * t
 }), this.spawnFood(o, 30, {
  x: .3 * n,
  y: .4 * t
 }), this.spawnFood(o, 30, {
  x: .4 * n,
  y: .3 * t
 }), this.spawnFood(o, 30, {
  x: .6 * n,
  y: .3 * t
 }), this.spawnFood(o, 30, {
  x: .7 * n,
  y: .4 * t
 }), this.spawnFood(o, 30, {
  x: .3 * n,
  y: .6 * t
 }), this.spawnFood(o, 30, {
  x: .4 * n,
  y: .7 * t
 }), this.spawnVirus(o, {
  x: .6 * n,
  y: .5 * t
 }), this.spawnVirus(o, {
  x: .4 * n,
  y: .5 * t
 }), this.spawnVirus(o, {
  x: .5 * n,
  y: .4 * t
 }), this.spawnVirus(o, {
  x: .5 * n,
  y: .6 * t
 }), this.spawnVirus(o, {
  x: .3 * n,
  y: .3 * t
 }), this.spawnVirus(o, {
  x: .3 * n,
  y: .7 * t
 }), this.spawnVirus(o, {
  x: .7 * n,
  y: .3 * t
 }), this.spawnVirus(o, {
  x: .7 * n,
  y: .7 * t
 }), this.spawnVirus(o, {
  x: .25 * n,
  y: .6 * t
 }), this.spawnVirus(o, {
  x: .25 * n,
  y: .4 * t
 }), this.spawnVirus(o, {
  x: .75 * n,
  y: .6 * t
 }), this.spawnVirus(o, {
  x: .75 * n,
  y: .4 * t
 }), this.spawnVirus(o, {
  x: .6 * n,
  y: .25 * t
 }), this.spawnVirus(o, {
  x: .4 * n,
  y: .25 * t
 }), this.spawnVirus(o, {
  x: .6 * n,
  y: .75 * t
 }), this.spawnVirus(o, {
  x: .4 * n,
  y: .75 * t
 })
}, HungerGames.prototype.onPlayerSpawn = function(o, n) {
 0 == this.gamePhase && this.contenders.length < this.maxContenders && (n.color = o.getRandomColor(), this.contenders.push(n), o.spawnPlayer(n, this.getPos()), this.contenders.length == this.maxContenders && this.startGamePrep(o))
};