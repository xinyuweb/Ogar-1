module.exports = {
 Mode: require("./Mode"),
 FFA: require("./FFA"),
 Teams: require("./Teams"),
 Experimental: require("./Experimental"),
 Tournament: require("./Tournament"),
 HungerGames: require("./HungerGames"),
 Rainbow: require("./Rainbow"),
 Debug: require("./Debug"),
 Zombie: require("./Zombie"),
 TeamZ: require("./TeamZ.js"),
 TeamX: require("./TeamX.js")
};
var get = function(e) {
 var r;
 switch (e) {
  case 1:
   r = new module.exports.Teams;
   break;
  case 2:
   r = new module.exports.Experimental;
   break;
  case 10:
   r = new module.exports.Tournament;
   break;
  case 11:
   r = new module.exports.HungerGames;
   break;
  case 12:
   r = new module.exports.Zombie;
   break;
  case 13:
   r = new module.exports.TeamZ;
   break;
  case 14:
   r = new module.exports.TeamX;
   break;
  case 20:
   r = new module.exports.Rainbow;
   break;
  case 21:
   r = new module.exports.Debug;
   break;
  default:
   r = new module.exports.FFA
 }
 return r
};
module.exports.get = get;