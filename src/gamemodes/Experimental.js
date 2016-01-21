function Experimental() {
 FFA.apply(this, Array.prototype.slice.call(arguments)), this.ID = 2, this.name = "Experimental", this.specByLeaderboard = !0, this.nodesMother = [], this.tickMother = 0, this.tickMotherS = 0, this.motherCellMass = 200, this.motherUpdateInterval = 5, this.motherSpawnInterval = 100, this.motherMinAmount = 5;
}

function MotherCell() {
 Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 2, this.color = {
  r: 205,
  g: 85,
  b: 100
 }, this.spiked = 1, this.isMotherCell = !0;
}
var FFA = require("./FFA"),
 Cell = require("../entity/Cell"),
 Food = require("../entity/Food"),
 Virus = require("../entity/Virus"),
 VirusFeed = require("../entity/Virus").prototype.feed;
module.exports = Experimental, Experimental.prototype = new FFA, Experimental.prototype.updateMotherCells = function(t) {
 for (var e in this.nodesMother) {
  var o = this.nodesMother[e];
  o.update(t), o.checkEat(t);
 }
}, Experimental.prototype.spawnMotherCell = function(t) {
 if (this.nodesMother.length < this.motherMinAmount) {
  for (var e = t.getRandomPosition(), o = 0; o < t.nodesPlayer.length; o++) {
   var i = t.nodesPlayer[o],
    s = i.getSize(),
    r = i.position.y - s,
    n = i.position.y + s,
    h = i.position.x - s,
    a = i.position.x + s;
   if (!(e.y > n || e.y < r || e.x > a || e.x < h)) return;
  }
  var p = new MotherCell(t.getNextNodeId(), null, e, this.motherCellMass);
  t.addNode(p);
 }
}, Experimental.prototype.onServerInit = function(t) {
 t.run = !0, Virus.prototype.feed = function(t, e) {
  e.removeNode(t), this.setAngle(t.getAngle()), this.moveEngineTicks = 5, this.moveEngineSpeed = 30;
  var o = e.movingNodes.indexOf(this); - 1 == o && e.movingNodes.push(this);
 }, t.getRandomSpawn = t.getRandomPosition;
}, Experimental.prototype.onTick = function(t) {
 this.tickMother >= this.motherUpdateInterval ? (this.updateMotherCells(t), this.tickMother = 0) : this.tickMother++, this.tickMotherS >= this.motherSpawnInterval ? (this.spawnMotherCell(t), this.tickMotherS = 0) : this.tickMotherS++;
}, Experimental.prototype.onChange = function(t) {
 for (var e in this.nodesMother) t.removeNode(this.nodesMother[e]);
 Virus.prototype.feed = VirusFeed, t.getRandomSpawn = require("../GameServer").prototype.getRandomSpawn;
}, MotherCell.prototype = new Cell, MotherCell.prototype.getEatingRange = function() {
 return .5 * this.getSize();
}, MotherCell.prototype.update = function(t) {
 this.mass += .25;
 for (var e = 10, o = 0; this.mass > t.gameMode.motherCellMass && e > o;) t.currentFood < t.config.foodMaxAmount && this.spawnFood(t), this.mass--, o++;
}, MotherCell.prototype.checkEat = function(t) {
 var e = .9 * this.mass,
  o = this.getSize();
 for (var i in t.nodesPlayer) {
  var s = t.nodesPlayer[i];
  if (!(s.mass > e)) {
   var r = o - s.getSize() / 2 >> 0;
   if (this.abs(this.position.x - s.position.x) < r && this.abs(this.position.y - s.position.y) < r) {
    var n = Math.pow(s.position.x - this.position.x, 2),
     h = Math.pow(s.position.y - this.position.y, 2),
     a = Math.sqrt(n + h);
    o > a && (t.removeNode(s), this.mass += s.mass);
   }
  }
 }
 for (var i in t.movingNodes) {
  var s = t.movingNodes[i];
  if (!(1 == s.getType() || s.mass > e)) {
   var r = o >> 0;
   this.abs(this.position.x - s.position.x) < r && this.abs(this.position.y - s.position.y) < r && (t.removeNode(s), this.mass += s.mass);
  }
 }
}, MotherCell.prototype.abs = function(t) {
 return 0 > t ? -t : t;
}, MotherCell.prototype.spawnFood = function(t) {
 var e = 6.28 * Math.random(),
  o = this.getSize(),
  i = {
   x: this.position.x + o * Math.sin(e),
   y: this.position.y + o * Math.cos(e)
  },
  s = new Food(t.getNextNodeId(), null, i, t.config.foodMass);
 s.setColor(t.getRandomColor()), t.addNode(s), t.currentFood++, s.angle = e;
 var r = 10 * Math.random() + 22;
 s.setMoveEngineData(r, 15), t.setAsMovingNode(s);
}, MotherCell.prototype.onConsume = Virus.prototype.onConsume, MotherCell.prototype.onAdd = function(t) {
 t.gameMode.nodesMother.push(this);
}, MotherCell.prototype.onRemove = function(t) {
 var e = t.gameMode.nodesMother.indexOf(this); - 1 != e && t.gameMode.nodesMother.splice(e, 1);
}, MotherCell.prototype.visibleCheck = function(t, e) {
 var o = this.getSize(),
  i = o + t.width >> 0,
  s = o + t.height >> 0;
 return this.abs(this.position.x - e.x) < i && this.abs(this.position.y - e.y) < s;
};