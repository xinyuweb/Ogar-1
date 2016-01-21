function TeamX() {
 Teams.apply(this, Array.prototype.slice.call(arguments)), this.ID = 14, this.name = "Experimental Team", this.teamCollision = !1, this.pushVirus = !1, this.colorFuzziness = 72, this.motherCellMass = 200, this.motherUpdateInterval = 5, this.motherSpawnInterval = 100, this.motherMinAmount = 5, this.colors = [{
  r: 255,
  g: 7,
  b: 7
 }, {
  r: 7,
  g: 255,
  b: 7
 }, {
  r: 7,
  g: 7,
  b: 255
 }], this.nodesMother = [], this.tickMother = 0, this.tickMotherS = 0;
}

function MotherCell() {
 Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 2, this.color = {
  r: 205,
  g: 85,
  b: 100
 }, this.spiked = 1;
}
var Teams = require("./Teams.js"),
 Cell = require("../entity/Cell.js"),
 Food = require("../entity/Food.js"),
 Virus = require("../entity/Virus.js"),
 VirusFeed = Virus.prototype.feed,
 GS_getRandomColor = null,
 GS_getRandomSpawn = null,
 GS_getCellsInRange = null;
module.exports = TeamX, TeamX.prototype = new Teams, TeamX.prototype.updateMotherCells = function(e) {
 for (var o in this.nodesMother) {
  var t = this.nodesMother[o];
  t.update(e), t.checkEat(e);
 }
}, TeamX.prototype.spawnMotherCell = function(e) {
 if (this.nodesMother.length < this.motherMinAmount) {
  for (var o = e.getRandomPosition(), t = 0; t < e.nodesPlayer.length; t++) {
   var n = e.nodesPlayer[t],
    i = n.getSize(),
    s = n.position.y - i,
    r = n.position.y + i,
    a = n.position.x - i,
    l = n.position.x + i;
   if (!(o.y > r || o.y < s || o.x > l || o.x < a)) return;
  }
  var h = new MotherCell(e.getNextNodeId(), null, o, this.motherCellMass);
  e.addNode(h);
 }
}, TeamX.prototype.countNotInRange = function(e) {
 for (var o = 0, t = 0; t < e.cells.length; t++) {
  var n = e.cells[t];
  n.inRange !== !0 && o++;
 }
 return o;
}, TeamX.prototype.fuzzColorComponent = function(e) {
 return 255 != e && (e = Math.random() * (this.colorFuzziness - 7) + 7), e;
}, TeamX.prototype.getTeamColor = function(e) {
 var o = this.colors[e];
 return {
  r: this.fuzzColorComponent(o.r),
  b: this.fuzzColorComponent(o.b),
  g: this.fuzzColorComponent(o.g)
 };
}, TeamX.prototype.onServerInit = function(e) {
 for (var o = 0; o < this.teamAmount; o++) this.nodes[o] = [];
 this.pushVirus && (Virus.prototype.feed = function(e, o) {
  o.removeNode(e), this.setAngle(e.getAngle()), this.moveEngineTicks = 5, this.moveEngineSpeed = 30;
  var t = o.movingNodes.indexOf(this); - 1 == t && o.movingNodes.push(this);
 }), this.teamCollision || (this.onCellMove = function(e, o, t) {}, null == GS_getCellsInRange && (GS_getCellsInRange = e.getCellsInRange), e.getCellsInRange = function(e) {
  for (var o = new Array, t = e.getSquareSize(), n = e.owner.visibleNodes.length, i = 0; n > i; i++) {
   var s = e.owner.visibleNodes[i];
   if ("undefined" != typeof s && !s.inRange && e.nodeId != s.nodeId && (e.owner != s.owner || !e.ignoreCollision) && s.collisionCheck2(t, e.position)) {
    var r = 1.25;
    switch (s.getType()) {
     case 1:
      o.push(s), s.inRange = !0;
      continue;
     case 2:
      r = 1.33;
      break;
     case 0:
      if (s.owner == e.owner) {
       if (e.recombineTicks > 0 || s.recombineTicks > 0) continue;
       r = 1;
      }
      if (this.gameMode.haveTeams) {
       if (!s.owner) continue;
       if (s.owner != e.owner && s.owner.getTeam() == e.owner.getTeam() && 1 == this.gameMode.countNotInRange(s.owner)) continue;
      }
    }
    if (!(s.mass * r > e.mass)) {
     var a = Math.pow(s.position.x - e.position.x, 2),
      l = Math.pow(s.position.y - e.position.y, 2),
      h = Math.sqrt(a + l),
      p = e.getSize() - s.getEatingRange();
     h > p || (o.push(s), s.inRange = !0);
    }
   }
  }
  return o;
 }), null == GS_getRandomColor && (GS_getRandomColor = e.getRandomColor), null == GS_getRandomSpawn && (GS_getRandomSpawn = e.getRandomSpawn), e.getRandomSpawn = e.getRandomPosition, e.getRandomColor = function() {
  var e = [255, 7, 256 * Math.random() >> 0];
  return e.sort(function() {
   return .5 - Math.random();
  }), {
   r: e[0],
   b: e[1],
   g: e[2]
  };
 };
 for (var o = 0; o < e.clients.length; o++) {
  var t = e.clients[o].playerTracker;
  this.onPlayerInit(t), t.color = this.getTeamColor(t.team);
  for (var n = 0; n < t.cells.length; n++) {
   var i = t.cells[n];
   i.setColor(t.color), this.nodes[t.team].push(i);
  }
 }
}, TeamX.prototype.onChange = function(e) {
 for (var o in this.nodesMother) e.removeNode(this.nodesMother[o]);
 this.pushVirus && (Virus.prototype.feed = VirusFeed), e.getRandomColor = GS_getRandomColor, e.getRandomSpawn = GS_getRandomSpawn, GS_getRandomColor = null, GS_getRandomSpawn = null, null != GS_getCellsInRange && (e.getCellsInRange = GS_getCellsInRange, GS_getCellsInRange = null);
}, TeamX.prototype.onTick = function(e) {
 this.tickMother >= this.motherUpdateInterval ? (this.updateMotherCells(e), this.tickMother = 0) : this.tickMother++, this.tickMotherS >= this.motherSpawnInterval ? (this.spawnMotherCell(e), this.tickMotherS = 0) : this.tickMotherS++;
}, MotherCell.prototype = new Cell, MotherCell.prototype.getEatingRange = function() {
 return .5 * this.getSize();
}, MotherCell.prototype.update = function(e) {
 this.mass += .25;
 for (var o = 10, t = 0; this.mass > e.gameMode.motherCellMass && o > t;) e.currentFood < e.config.foodMaxAmount && this.spawnFood(e), this.mass--, t++;
}, MotherCell.prototype.checkEat = function(e) {
 var o = .9 * this.mass,
  t = this.getSize();
 for (var n in e.nodesPlayer) {
  var i = e.nodesPlayer[n];
  if (!(i.mass > o)) {
   var s = t - i.getSize() / 2 >> 0;
   this.abs(this.position.x - i.position.x) < s && this.abs(this.position.y - i.position.y) < s && (e.removeNode(i), this.mass += i.mass);
  }
 }
 for (var n in e.movingNodes) {
  var i = e.movingNodes[n];
  if (!(1 == i.getType() || i.mass > o)) {
   var s = t >> 0;
   this.abs(this.position.x - i.position.x) < s && this.abs(this.position.y - i.position.y) < s && (e.removeNode(i), this.mass += i.mass);
  }
 }
}, MotherCell.prototype.abs = function(e) {
 return 0 > e ? -e : e;
}, MotherCell.prototype.spawnFood = function(e) {
 var o = 6.28 * Math.random(),
  t = this.getSize(),
  n = {
   x: this.position.x + t * Math.sin(o),
   y: this.position.y + t * Math.cos(o)
  },
  i = new Food(e.getNextNodeId(), null, n, e.config.foodMass);
 i.setColor(e.getRandomColor()), e.addNode(i), e.currentFood++, i.angle = o;
 var s = 10 * Math.random() + 22;
 i.setMoveEngineData(s, 15), e.setAsMovingNode(i);
}, MotherCell.prototype.onConsume = Virus.prototype.onConsume, MotherCell.prototype.onAdd = function(e) {
 e.gameMode.nodesMother.push(this);
}, MotherCell.prototype.onRemove = function(e) {
 var o = e.gameMode.nodesMother.indexOf(this); - 1 != o && e.gameMode.nodesMother.splice(o, 1);
};