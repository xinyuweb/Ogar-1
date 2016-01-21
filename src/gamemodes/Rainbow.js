function Rainbow() {
 FFA.apply(this, Array.prototype.slice.call(arguments)), this.ID = 20, this.name = "Rainbow FFA", this.specByLeaderboard = !0, this.colors = [{
  r: 255,
  g: 0,
  b: 0
 }, {
  r: 255,
  g: 32,
  b: 0
 }, {
  r: 255,
  g: 64,
  b: 0
 }, {
  r: 255,
  g: 96,
  b: 0
 }, {
  r: 255,
  g: 128,
  b: 0
 }, {
  r: 255,
  g: 160,
  b: 0
 }, {
  r: 255,
  g: 192,
  b: 0
 }, {
  r: 255,
  g: 224,
  b: 0
 }, {
  r: 255,
  g: 255,
  b: 0
 }, {
  r: 192,
  g: 255,
  b: 0
 }, {
  r: 128,
  g: 255,
  b: 0
 }, {
  r: 64,
  g: 255,
  b: 0
 }, {
  r: 0,
  g: 255,
  b: 0
 }, {
  r: 0,
  g: 192,
  b: 64
 }, {
  r: 0,
  g: 128,
  b: 128
 }, {
  r: 0,
  g: 64,
  b: 192
 }, {
  r: 0,
  g: 0,
  b: 255
 }, {
  r: 18,
  g: 0,
  b: 192
 }, {
  r: 37,
  g: 0,
  b: 128
 }, {
  r: 56,
  g: 0,
  b: 64
 }, {
  r: 75,
  g: 0,
  b: 130
 }, {
  r: 92,
  g: 0,
  b: 161
 }, {
  r: 109,
  g: 0,
  b: 192
 }, {
  r: 126,
  g: 0,
  b: 223
 }, {
  r: 143,
  g: 0,
  b: 255
 }, {
  r: 171,
  g: 0,
  b: 192
 }, {
  r: 199,
  g: 0,
  b: 128
 }, {
  r: 227,
  g: 0,
  b: 64
 }], this.colorsLength = this.colors.length - 1, this.speed = 1;
}
var FFA = require("./FFA"),
 Food = require("../entity/Food"),
 FoodUp = require("../entity/Food").prototype.sendUpdate;
module.exports = Rainbow, Rainbow.prototype = new FFA, Rainbow.prototype.changeColor = function(o) {
 "undefined" == typeof o.rainbow && (o.rainbow = Math.floor(Math.random() * this.colors.length)), o.rainbow >= this.colorsLength && (o.rainbow = 0), o.color = this.colors[o.rainbow], o.rainbow += this.speed;
}, Rainbow.prototype.onServerInit = function() {
 Food.prototype.sendUpdate = function() {
  return !0;
 };
}, Rainbow.prototype.onChange = function() {
 Food.prototype.sendUpdate = FoodUp;
}, Rainbow.prototype.onTick = function(o) {
 var r;
 for (var t in o.nodes) r = o.nodes[t], r && this.changeColor(r);
};