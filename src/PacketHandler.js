function PacketHandler(e, t) {
 this.gameServer = e, this.socket = t, this.protocol = 0, this.pressQ = !1, this.pressW = !1, this.pressSpace = !1;
}
var Packet = require("./packet");
module.exports = PacketHandler, PacketHandler.prototype.handleMessage = function(e) {
 function t(e) {
  for (var t = e.length, r = new ArrayBuffer(t), a = new Uint8Array(r), s = 0; t > s; s++) a[s] = e[s];
  return a.buffer;
 }
 if (0 != e.length) {
  var r = t(e),
   a = new DataView(r),
   s = a.getUint8(0, !0);
  switch (s) {
   case 0:
    if ((a.byteLength + 1) % 2 == 1) break;
    for (var c = "", i = 2 * this.gameServer.config.playerMaxNickLength, o = 1; o < a.byteLength && i >= o; o += 2) {
     var n = a.getUint16(o, !0);
     if (0 == n) break;
     c += String.fromCharCode(n);
    }
    this.setNickname(c);
    break;
   case 1:
    this.socket.playerTracker.cells.length <= 0 && (this.gameServer.switchSpectator(this.socket.playerTracker), this.socket.playerTracker.spectate = !0);
    break;
   case 16:
    if (13 == a.byteLength) {
     var h = this.socket.playerTracker;
     h.mouse.x = a.getInt32(1, !0), h.mouse.y = a.getInt32(5, !0);
    }
    break;
   case 17:
    this.pressSpace = !0;
    break;
   case 18:
    this.pressQ = !0;
    break;
   case 19:
    break;
   case 21:
    this.pressW = !0;
    break;
   case 255:
    if (5 == a.byteLength) {
     this.protocol = a.getUint32(1, !0);
     var k = this.gameServer.config;
     this.socket.sendPacket(new Packet.SetBorder(k.borderLeft, k.borderRight, k.borderTop, k.borderBottom));
    }
  }
 }
}, PacketHandler.prototype.setNickname = function(e) {
 var t = this.socket.playerTracker;
 t.cells.length < 1 && (t.setName(e), this.gameServer.gameMode.onPlayerSpawn(this.gameServer, t), t.spectate = !1);
};