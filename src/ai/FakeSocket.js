function FakeSocket(e)
{
  this.server = e
}
module.exports = FakeSocket, FakeSocket.prototype.sendPacket = function (e) {}, FakeSocket.prototype.close = function (e)
{
  for (var t = this.playerTracker.cells.length, r = 0; t > r; r++)
  {
    var s = this.playerTracker.cells[0];
    s && this.server.removeNode(s)
  }
  var o = this.server.clients.indexOf(this); - 1 != o && this.server.clients.splice(o, 1)
};