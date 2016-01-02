function PlayerCell()
{
  Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 0, this.recombineTicks = 0, this.ignoreCollision = !1
}
var Cell = require("./Cell");
module.exports = PlayerCell, PlayerCell.prototype = new Cell, PlayerCell.prototype.visibleCheck = function (t, e)
{
  if (this.mass < 100) return this.collisionCheck(t.bottomY, t.topY, t.rightX, t.leftX);
  var i = this.getSize(),
    o = i + t.width >> 0,
    s = i + t.height >> 0;
  return this.abs(this.position.x - e.x) < o && this.abs(this.position.y - e.y) < s
}, PlayerCell.prototype.simpleCollide = function (t, e)
{
  var i = 2 * e >> 0;
  return this.abs(this.position.x - t.x) < i && this.abs(this.position.y - t.y) < i
}, PlayerCell.prototype.calcMergeTime = function (t)
{
  this.recombineTicks = t + (.02 * this.mass >> 0)
}, PlayerCell.prototype.calcMove = function (t, e, i)
{
  var o = i.config,
    s = this.getSize(),
    l = e - this.position.y,
    r = t - this.position.x,
    n = Math.atan2(r, l);
  if (!isNaN(n))
  {
    for (var h = this.getDist(this.position.x, this.position.y, t, e), a = Math.min(this.getSpeed(), h), p = this.position.x + a * Math.sin(n), y = this.position.y + a * Math.cos(n), c = 0; c < this.owner.cells.length; c++)
    {
      var d = this.owner.cells[c];
      if (this.nodeId != d.nodeId && !this.ignoreCollision && (d.recombineTicks > 0 || this.recombineTicks > 0))
      {
        var C = d.getSize() + s;
        if (h = this.getDist(p, y, d.position.x, d.position.y), C > h)
        {
          var g = y - d.position.y,
            f = p - d.position.x,
            u = Math.atan2(f, g),
            m = C - h;
          p = p + m * Math.sin(u) >> 0, y = y + m * Math.cos(u) >> 0
        }
      }
    }
    i.gameMode.onCellMove(p, y, this), p < o.borderLeft + s / 2 && (p = o.borderLeft + s / 2), p > o.borderRight - s / 2 && (p = o.borderRight - s / 2), y < o.borderTop + s / 2 && (y = o.borderTop + s / 2), y > o.borderBottom - s / 2 && (y = o.borderBottom - s / 2), this.position.x = p >> 0, this.position.y = y >> 0
  }
}, PlayerCell.prototype.getEatingRange = function ()
{
  return .4 * this.getSize()
}, PlayerCell.prototype.onConsume = function (t, e)
{
  t.addMass(this.mass)
}, PlayerCell.prototype.onAdd = function (t)
{
  t.nodesPlayer.push(this), t.gameMode.onCellAdd(this)
}, PlayerCell.prototype.onRemove = function (t)
{
  var e;
  e = this.owner.cells.indexOf(this), -1 != e && this.owner.cells.splice(e, 1), e = t.nodesPlayer.indexOf(this), -1 != e && t.nodesPlayer.splice(e, 1), t.gameMode.onCellRemove(this)
}, PlayerCell.prototype.moveDone = function (t)
{
  this.ignoreCollision = !1
}, PlayerCell.prototype.abs = function (t)
{
  return 0 > t ? -t : t
}, PlayerCell.prototype.getDist = function (t, e, i, o)
{
  var s = i - t;
  s *= s;
  var l = o - e;
  return l *= l, Math.sqrt(s + l)
};
