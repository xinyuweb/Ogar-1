function SetBorder(t,e,o,r){this.left=t,this.right=e,this.top=o,this.bottom=r}module.exports=SetBorder,SetBorder.prototype.build=function(){var t=new ArrayBuffer(33),e=new DataView(t);return e.setUint8(0,64,!0),e.setFloat64(1,this.left,!0),e.setFloat64(9,this.top,!0),e.setFloat64(17,this.right,!0),e.setFloat64(25,this.bottom,!0),t};