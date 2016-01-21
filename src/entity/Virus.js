function Virus() {
 Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 2, this.spiked = 1, this.fed = 0, this.isMotherCell = !1;
}
var Cell = require("./Cell");
module.exports = Virus, Virus.prototype = new Cell, Virus.prototype.calcMove = null, Virus.prototype.feed = function(e, s) {
 this.setAngle(e.getAngle()), this.mass += e.mass, this.fed++, s.removeNode(e), this.fed >= s.config.virusFeedAmount && (this.mass = s.config.virusStartMass, this.fed = 0, s.shootVirus(this));
}, Virus.prototype.getEatingRange = function() {
 return .4 * this.getSize();
}, Virus.prototype.onConsume = function(e, s) {
 var i = e.owner,
  t = Math.floor(e.mass / 16) - 1,
  o = s.config.playerMaxCells - i.cells.length;
 o = Math.min(o, t);
 var r = Math.min(e.mass / (o + 1), 36);
 if (e.addMass(this.mass), !(0 >= o)) {
  var n = 0,
   a = e.mass - o * r;
  a > 300 && o > 0 && (n++, o--), a > 1200 && o > 0 && (n++, o--), a > 3e3 && o > 0 && (n++, o--);
  for (var l = 0, u = 0; o > u; u++) l += 6 / o, s.newCellVirused(i, e, l, r, 150), e.mass -= r;
  for (var u = 0; n > u; u++) l = 6.28 * Math.random(), r = e.mass / 4, s.newCellVirused(i, e, l, r, 20), e.mass -= r;
  e.calcMergeTime(s.config.playerRecombineTime);
 }
}, Virus.prototype.onAdd = function(e) {
 e.nodesVirus.push(this);
}, Virus.prototype.onRemove = function(e) {
 var s = e.nodesVirus.indexOf(this); - 1 != s ? e.nodesVirus.splice(s, 1) : console.log("[Warning] Tried to remove a non existing virus!");
};