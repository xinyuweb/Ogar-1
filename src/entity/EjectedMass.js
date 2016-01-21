function EjectedMass() {
 Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 3, this.size = Math.ceil(Math.sqrt(100 * this.mass)), this.squareSize = 100 * this.mass >> 0;
}
var Cell = require("./Cell");
module.exports = EjectedMass, EjectedMass.prototype = new Cell, EjectedMass.prototype.getSize = function() {
 return this.size;
}, EjectedMass.prototype.getSquareSize = function() {
 return this.squareSize;
}, EjectedMass.prototype.calcMove = null, EjectedMass.prototype.sendUpdate = function() {
 return 0 == this.moveEngineTicks ? !1 : !0;
}, EjectedMass.prototype.onRemove = function(e) {
 var t = e.nodesEjected.indexOf(this); - 1 != t && e.nodesEjected.splice(t, 1);
}, EjectedMass.prototype.onConsume = function(e, t) {
 e.addMass(this.mass);
}, EjectedMass.prototype.onAutoMove = function(e) {
 if (e.nodesVirus.length < e.config.virusMaxAmount) {
  var t = e.getNearestVirus(this);
  if (t) return t.feed(this, e), !0;
 }
}, EjectedMass.prototype.moveDone = function(e) {
 this.onAutoMove(e) || e.nodesEjected.push(this);
};