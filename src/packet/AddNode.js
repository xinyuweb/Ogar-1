function AddNode(e)
{
  this.item = e
}
module.exports = AddNode, AddNode.prototype.build = function ()
{
  var e = new ArrayBuffer(5),
    t = new DataView(e);
  return t.setUint8(0, 32, !0), t.setUint32(1, this.item.nodeId, !0), e
};