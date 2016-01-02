function PlayerCell()
{
  Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 0, this.recombineTicks = 0, this.ignoreCollision = !1
}
var Cell = require("./Cell");
module.exports = PlayerCell, PlayerCell.prototype = new Cell, PlayerCell.prototype.visibleCheck = function (e, t)
{
  if (this.mass < 100) return this.collisionCheck(e.bottomY, e.topY, e.rightX, e.leftX);
  var i = this.getSize(),
    o = i + e.width >> 0,
    s = i + e.height >> 0;
  return this.abs(this.position.x - t.x) < o && this.abs(this.position.y - t.y) < s
}, PlayerCell.prototype.calcMergeTime = function (e)
{
  this.recombineTicks = e + (.02 * this.mass >> 0)
}, PlayerCell.prototype.calcMove = function (e, t, i)
{
  var o = i.config,
    s = this.getSize(),
    l = t - this.position.y,
    r = e - this.position.x,
    n = Math.atan2(r, l);
  if (!isNaN(n))
  {
    for (var h = this.getDist(this.position.x, this.position.y, e, t), a = Math.min(this.getSpeed(), h), p = this.position.x + a * Math.sin(n), y = this.position.y + a * Math.cos(n), c = 0; c < this.owner.cells.length; c++)
    {
      var d = this.owner.cells[c];
      if (this.nodeId != d.nodeId && !this.ignoreCollision && (d.recombineTicks > 0 || this.recombineTicks > 0))
      {
        var C = d.getSize() + s;
        if (h = this.getDist(p, y, d.position.x, d.position.y), C > h)
        {
          var g = y - d.position.y,
            f = p - d.position.x,
            m = Math.atan2(f, g),
            u = C - h;
          p = p + u * Math.sin(m) >> 0, y = y + u * Math.cos(m) >> 0
        }
      }
    }
    i.gameMode.onCellMove(p, y, this), p < o.borderLeft + s / 2 && (p = o.borderLeft + s / 2), p > o.borderRight - s / 2 && (p = o.borderRight - s / 2), y < o.borderTop + s / 2 && (y = o.borderTop + s / 2), y > o.borderBottom - s / 2 && (y = o.borderBottom - s / 2), this.position.x = p >> 0, this.position.y = y >> 0
  }
}, PlayerCell.prototype.getEatingRange = function ()
{
  return .4 * this.getSize()
}, PlayerCell.prototype.onConsume = function (e, t)
{
  e.addMass(this.mass)
}, PlayerCell.prototype.onAdd = function (e)
{
  e.nodesPlayer.push(this), e.gameMode.onCellAdd(this)
}, PlayerCell.prototype.onRemove = function (e)
{
  var t;
  t = this.owner.cells.indexOf(this), -1 != t && this.owner.cells.splice(t, 1), t = e.nodesPlayer.indexOf(this), -1 != t && e.nodesPlayer.splice(t, 1), e.gameMode.onCellRemove(this)
}, PlayerCell.prototype.moveDone = function (e)
{
  this.ignoreCollision = !1
}, PlayerCell.prototype.abs = function (e)
{
  return 0 > e ? -e : e
}, PlayerCell.prototype.getDist = function (e, t, i, o)
{
  var s = i - e;
  s *= s;
  var l = o - t;
  return l *= l, Math.sqrt(s + l)
};