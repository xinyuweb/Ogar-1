function Virus()
{
  Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = 2, this.spiked = 1, this.fed = 0
}
var Cell = require("./Cell");
module.exports = Virus, Virus.prototype = new Cell, Virus.prototype.calcMove = null, Virus.prototype.feed = function (e, s)
{
  this.setAngle(e.getAngle()), this.mass += e.mass, this.fed++, s.removeNode(e), this.fed >= s.config.virusFeedAmount && (this.mass = s.config.virusStartMass, this.fed = 0, s.shootVirus(this))
}, Virus.prototype.getEatingRange = function ()
{
  return .4 * this.getSize()
}, Virus.prototype.onAutoMove = function (e)
{
  for (var s = 100, i = e.nodesEjected.length, o = 0; i > o; o++)
  {
    var t = e.nodesEjected[o],
      n = t.position.y - s,
      r = t.position.y + s,
      a = t.position.x - s,
      l = t.position.x + s;
    this.collisionCheck(r, n, l, a) && (t.angle = this.angle, this.feed(t, e), o--, i--)
  }
}, Virus.prototype.onConsume = function (e, s)
{
  var i = e.owner,
    o = Math.floor(e.mass / 16) - 1,
    t = s.config.playerMaxCells - i.cells.length;
  t = Math.min(t, o);
  var n = Math.min(e.mass / (t + 1), 36);
  if (e.addMass(this.mass), !(0 >= t))
  {
    var r = 0,
      a = e.mass - t * n;
    a > 300 && t > 0 && (r++, t--), a > 1200 && t > 0 && (r++, t--), a > 3e3 && t > 0 && (r++, t--);
    for (var l = 0, u = 0; t > u; u++) l += 6 / t, s.newCellVirused(i, e, l, n, 150), e.mass -= n;
    for (var u = 0; r > u; u++) l = 6.28 * Math.random(), n = e.mass / 4, s.newCellVirused(i, e, l, n, 20), e.mass -= n;
    e.calcMergeTime(s.config.playerRecombineTime)
  }
}, Virus.prototype.onAdd = function (e)
{
  e.nodesVirus.push(this)
}, Virus.prototype.onRemove = function (e)
{
  var s = e.nodesVirus.indexOf(this); - 1 != s ? e.nodesVirus.splice(s, 1) : console.log("[Warning] Tried to remove a non existing virus!")
};
