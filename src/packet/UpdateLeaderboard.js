function UpdateLeaderboard(e, t)
{
  this.leaderboard = e, this.packetLB = t
}
module.exports = UpdateLeaderboard, UpdateLeaderboard.prototype.build = function ()
{
  var e = this.leaderboard,
    t = 5,
    r = 0;
  switch (this.packetLB)
  {
  case 48:
    for (var a = 0; a < e.length; a++)
      if ("undefined" != typeof e[a])
      {
        var n = e[a];
        t += 4, t += 2 * n.length, t += 2, r++
      }
    var i = new ArrayBuffer(t),
      f = new DataView(i);
    f.setUint8(0, 49, !0), f.setUint32(1, r, !0);
    for (var d = 5, a = 0; a < e.length; a++)
      if ("undefined" != typeof e[a])
      {
        var n = e[a];
        f.setUint32(d, 1, !0), d += 4;
        for (var o = 0; o < n.length; o++) f.setUint16(d, n.charCodeAt(o), !0), d += 2;
        f.setUint16(d, 0, !0), d += 2
      }
    return i;
  case 49:
    for (var a = 0; a < e.length; a++)
      if ("undefined" != typeof e[a])
      {
        var n = e[a];
        t += 4, t += n.getName() ? 2 * n.getName().length : 0, t += 2, r++
      }
    var i = new ArrayBuffer(t),
      f = new DataView(i);
    f.setUint8(0, this.packetLB, !0), f.setUint32(1, r, !0);
    for (var d = 5, a = 0; a < e.length; a++)
      if ("undefined" != typeof e[a])
      {
        var n = e[a],
          s = 0;
        n.cells[0] && (s = n.cells[0].nodeId), f.setUint32(d, s, !0), d += 4;
        var h = n.getName();
        if (h)
          for (var o = 0; o < h.length; o++) f.setUint16(d, h.charCodeAt(o), !0), d += 2;
        f.setUint16(d, 0, !0), d += 2
      }
    return i;
  case 50:
    r = e.length, t += 4 * r;
    var i = new ArrayBuffer(t),
      f = new DataView(i);
    f.setUint8(0, this.packetLB, !0), f.setUint32(1, r, !0);
    for (var d = 5, a = 0; r > a; a++) f.setFloat32(d, e[a], !0), d += 4;
    return i
  }
};