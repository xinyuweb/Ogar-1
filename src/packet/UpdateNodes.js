function UpdateNodes(e, t, s) {
 this.destroyQueue = e, this.nodes = t, this.nonVisibleNodes = s
}
module.exports = UpdateNodes, UpdateNodes.prototype.build = function() {
 for (var e = 0, t = 0; t < this.nodes.length; t++) {
  var s = this.nodes[t];
  "undefined" != typeof s && (e = e + 20 + 2 * s.getName().length)
 }
 var n = new ArrayBuffer(3 + 12 * this.destroyQueue.length + 4 * this.nonVisibleNodes.length + e + 8),
  i = new DataView(n);
 i.setUint8(0, 16, !0), i.setUint16(1, this.destroyQueue.length, !0);
 for (var o = 3, t = 0; t < this.destroyQueue.length; t++) {
  var s = this.destroyQueue[t];
  if (s) {
   var r = 0;
   s.getKiller() && (r = s.getKiller().nodeId), i.setUint32(o, r, !0), i.setUint32(o + 4, s.nodeId, !0), o += 8
  }
 }
 for (var t = 0; t < this.nodes.length; t++) {
  var s = this.nodes[t];
  if ("undefined" != typeof s) {
   i.setUint32(o, s.nodeId, !0), i.setInt32(o + 4, s.position.x, !0), i.setInt32(o + 8, s.position.y, !0), i.setUint16(o + 12, s.getSize(), !0), i.setUint8(o + 14, s.color.r, !0), i.setUint8(o + 15, s.color.g, !0), i.setUint8(o + 16, s.color.b, !0), i.setUint8(o + 17, s.spiked, !0), o += 18;
   var d = s.getName();
   if (d)
    for (var h = 0; h < d.length; h++) {
     var l = d.charCodeAt(h);
     l && i.setUint16(o, l, !0), o += 2
    }
   i.setUint16(o, 0, !0), o += 2
  }
 }
 var a = this.nonVisibleNodes.length + this.destroyQueue.length;
 i.setUint32(o, 0, !0), i.setUint32(o + 4, a, !0), o += 8;
 for (var t = 0; t < this.destroyQueue.length; t++) {
  var s = this.destroyQueue[t];
  s && (i.setUint32(o, s.nodeId, !0), o += 4)
 }
 for (var t = 0; t < this.nonVisibleNodes.length; t++) {
  var s = this.nonVisibleNodes[t];
  s && (i.setUint32(o, s.nodeId, !0), o += 4)
 }
 return n
};