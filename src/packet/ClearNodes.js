function ClearNodes() {}
module.exports = ClearNodes, ClearNodes.prototype.build = function() {
 var e = new ArrayBuffer(1),
  r = new DataView(e);
 return r.setUint8(0, 20, !0), e
};