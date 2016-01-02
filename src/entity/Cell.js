function Cell(e, t, o, i, n)
{
  this.nodeId = e, this.owner = t, this.color = {
    r: 0,
    g: 255,
    b: 0
  }, this.position = o, this.mass = i, this.cellType = -1, this.spiked = 0, this.killedBy, this.gameServer = n, this.moveEngineTicks = 0, this.moveEngineSpeed = 0, this.moveDecay = .75, this.angle = 0
}
module.exports = Cell, Cell.prototype.getName = function ()
{
  return this.owner ? this.owner.name : ""
}, Cell.prototype.setColor = function (e)
{
  this.color.r = e.r, this.color.b = e.b, this.color.g = e.g
}, Cell.prototype.getColor = function ()
{
  return this.color
}, Cell.prototype.getType = function ()
{
  return this.cellType
}, Cell.prototype.getSize = function ()
{
  return Math.ceil(Math.sqrt(100 * this.mass))
}, Cell.prototype.getSquareSize = function ()
{
  return 100 * this.mass >> 0
}, Cell.prototype.addMass = function (e)
{
  this.mass + e > this.owner.gameServer.config.playerMaxMass && this.owner.cells.length < this.owner.gameServer.config.playerMaxCells ? (this.mass = (this.mass + e) / 2, this.owner.gameServer.newCellVirused(this.owner, this, 0, this.mass, 150)) : this.mass = Math.min(this.mass + e, this.owner.gameServer.config.playerMaxMass)
}, Cell.prototype.getSpeed = function ()
{
  return this.owner.gameServer.config.playerSpeed * Math.pow(this.mass, -1 / 4.5) * 50 / 40
}, Cell.prototype.setAngle = function (e)
{
  this.angle = e
}, Cell.prototype.getAngle = function ()
{
  return this.angle
}, Cell.prototype.setMoveEngineData = function (e, t, o)
{
  this.moveEngineSpeed = e, this.moveEngineTicks = t, this.moveDecay = isNaN(o) ? .75 : o
}, Cell.prototype.getEatingRange = function ()
{
  return 0
}, Cell.prototype.getKiller = function ()
{
  return this.killedBy
}, Cell.prototype.setKiller = function (e)
{
  this.killedBy = e
}, Cell.prototype.collisionCheck = function (e, t, o, i)
{
  return this.position.y > e ? !1 : this.position.y < t ? !1 : this.position.x > o ? !1 : this.position.x < i ? !1 : !0
}, Cell.prototype.collisionCheck2 = function (e, t)
{
  var o = this.position.x - t.x,
    i = this.position.y - t.y;
  return o * o + i * i + this.getSquareSize() <= e
}, Cell.prototype.visibleCheck = function (e, t)
{
  return this.collisionCheck(e.bottomY, e.topY, e.rightX, e.leftX)
}, Cell.prototype.calcMovePhys = function (e)
{
  var t = this.position.x + this.moveEngineSpeed * Math.sin(this.angle),
    o = this.position.y + this.moveEngineSpeed * Math.cos(this.angle);
  this.moveEngineSpeed *= this.moveDecay, this.moveEngineTicks--;
  var i = 40;
  this.position.x - i < e.borderLeft && (this.angle = 6.28 - this.angle, t = e.borderLeft + i), this.position.x + i > e.borderRight && (this.angle = 6.28 - this.angle, t = e.borderRight - i), this.position.y - i < e.borderTop && (this.angle = this.angle <= 3.14 ? 3.14 - this.angle : 9.42 - this.angle, o = e.borderTop + i), this.position.y + i > e.borderBottom && (this.angle = this.angle <= 3.14 ? 3.14 - this.angle : 9.42 - this.angle, o = e.borderBottom - i), this.position.x = t >> 0, this.position.y = o >> 0
}, Cell.prototype.sendUpdate = function ()
{
  return !0
}, Cell.prototype.onConsume = function (e, t) {}, Cell.prototype.onAdd = function (e) {}, Cell.prototype.onRemove = function (e) {}, Cell.prototype.onAutoMove = function (e) {}, Cell.prototype.moveDone = function (e) {};