function Debug() {
 FFA.apply(this, Array.prototype.slice.call(arguments)), this.ID = 21, this.name = "Debug Mode", this.specByLeaderboard = !1
}
var FFA = require("./FFA"),
 Packet = require("../packet");
module.exports = Debug, Debug.prototype = new FFA, Debug.prototype.testPath = function(o, t) {
 var e = t.cells[0],
  s = o.nodesVirus[0],
  i = Math.atan2(e.position.x - t.mouse.x, e.position.y - t.mouse.y),
  n = this.getAngle(e, s),
  a = this.getDist(e, s);
 console.log(i), console.log(n);
 var r = Math.atan(2 * e.getSize() / a);
 console.log(r), n + r >= i && i >= n - r && console.log("Collided!")
}, Debug.prototype.getAngle = function(o, t) {
 var e = o.position.y - t.position.y,
  s = o.position.x - t.position.x;
 return Math.atan2(s, e)
}, Debug.prototype.getDist = function(o, t) {
 var e = t.position.x - o.position.x;
 e = 0 > e ? -1 * e : e;
 var s = t.position.y - o.position.y;
 return s = 0 > s ? -1 * s : s, e + s
}, Debug.prototype.pressW = function(o, t) {
 console.log("Test:"), this.testPath(o, t), t.socket.sendPacket(new Packet.DrawLine(t.mouse.x, t.mouse.y))
};