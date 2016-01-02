function Food()
{
  Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 1, this.size = Math.ceil(Math.sqrt(100 * this.mass)), this.squareSize = 100 * this.mass >> 0, this.shouldSendUpdate = !1, this.gameServer.config.foodMassGrow && this.gameServer.config.foodMassGrowPossiblity > Math.floor(101 * Math.random()) && this.grow()
}
var Cell = require("./Cell");
module.exports = Food, Food.prototype = new Cell, Food.prototype.getSize = function ()
{
  return this.size
}, Food.prototype.getSquareSize = function ()
{
  return this.squareSize
}, Food.prototype.calcMove = null, Food.prototype.grow = function ()
{
  setTimeout(function ()
  {
    this.mass++, this.size = Math.ceil(Math.sqrt(100 * this.mass)), this.squareSize = 100 * this.mass >> 0, this.shouldSendUpdate = !0, this.mass < this.gameServer.config.foodMassLimit && this.grow()
  }.bind(this), 1e3 * this.gameServer.config.foodMassTimeout)
}, Food.prototype.sendUpdate = function ()
{
  return 0 == this.moveEngineTicks ? !1 : this.shouldSendUpdate ? (this.shouldSendUpdate = !1, !0) : !0
}, Food.prototype.onRemove = function (o)
{
  o.currentFood--
}, Food.prototype.onConsume = function (o, t)
{
  o.addMass(this.mass)
};