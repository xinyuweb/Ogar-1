function DrawLine(t, e) {
 this.x = t, this.y = e;
}
module.exports = DrawLine, DrawLine.prototype.build = function() {
 var t = new ArrayBuffer(5),
  e = new DataView(t);
 return e.setUint8(0, 21, !0), e.setUint16(1, this.x, !0), e.setUint16(3, this.y, !0), t;
};