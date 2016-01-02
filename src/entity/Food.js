function Food()
{
  Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 1, this.size = Math.ceil(Math.sqrt(100 * this.mass)), this.squareSize = 100 * this.mass >> 0
}
var Cell = require("./Cell");
module.exports = Food, Food.prototype = new Cell, Food.prototype.getSize = function ()
{
  return this.size
}, Food.prototype.getSquareSize = function ()
{
  return this.squareSize
}, Food.prototype.calcMove = null, Food.prototype.sendUpdate = function ()
{
  return 0 == this.moveEngineTicks ? !1 : !0
}, Food.prototype.onRemove = function (o)
{
  o.currentFood--
}, Food.prototype.onConsume = function (o, e)
{
  o.addMass(this.mass)
};