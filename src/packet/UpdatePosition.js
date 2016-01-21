function UpdatePosition(t, i, e) {
 this.x = t, this.y = i, this.size = e;
}
module.exports = UpdatePosition, UpdatePosition.prototype.build = function() {
 var t = new ArrayBuffer(13),
  i = new DataView(t);
 return i.setUint8(0, 17, !0), i.setFloat32(1, this.x, !0), i.setFloat32(5, this.y, !0), i.setFloat32(9, this.size, !0), t;
};