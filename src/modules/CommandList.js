function Commands() {
 this.list = {}
}
var GameMode = require("../gamemodes"),
 Entity = require("../entity");
module.exports = Commands;
var fillChar = function(e, o, l, n) {
 var s = e.toString();
 if (n === !0)
  for (var a = s.length; l > a; a++) s = o.concat(s);
 else
  for (var a = s.length; l > a; a++) s = s.concat(o);
 return s
};
Commands.list = {
 help: function(e, o) {
  console.log("[Console] ======================== HELP ======================"), console.log("[Console] addbot [number]              : add bot to the server"), console.log("[Console] kickbot [number]             : kick an amount of bots"), console.log("[Console] board [string] [string] ...  : set scoreboard text"), console.log("[Console] boardreset                   : reset scoreboard text"), console.log("[Console] change [setting] [value]     : change specified settings"), console.log("[Console] clear                        : clear console output"), console.log("[Console] color [PlayerID] [R] [G] [B] : set cell(s) color by client ID"), console.log("[Console] exit                         : stop the server"), console.log("[Console] food [X] [Y] [mass]          : spawn food at specified Location"), console.log("[Console] gamemode [id]                : change server gamemode"), console.log("[Console] kick [PlayerID]              : kick player or bot by client ID"), console.log("[Console] kill [PlayerID]              : kill cell(s) by client ID"), console.log("[Console] killall                      : kill everyone"), console.log("[Console] mass [PlayerID] [mass]       : set cell(s) mass by client ID"), console.log("[Console] name [PlayerID] [name]       : change cell(s) name by client ID"), console.log("[Console] playerlist                   : get list of players and bots"), console.log("[Console] pause                        : pause game , freeze all cells"), console.log("[Console] reload                       : reload config"), console.log("[Console] status                       : get server status"), console.log("[Console] tp [PlayerID] [X] [Y]        : teleport player to specified location"), console.log("[Console] virus [X] [Y] [mass]         : spawn virus at a specified Location"), console.log("[Console] ====================================================")
 },
 addbot: function(e, o) {
  var l = parseInt(o[1]);
  isNaN(l) && (l = 1);
  for (var n = 0; l > n; n++) e.bots.addBot();
  console.log("[Console] Added " + l + " player bots")
 },
 kickbot: function(e, o) {
  var l = parseInt(o[1]);
  isNaN(l) && (l = -1);
  for (var n = 0, s = 0; s < e.clients.length && n != l;)
   if ("undefined" == typeof e.clients[s].remoteAddress) {
    for (var a = e.clients[s].playerTracker, r = a.cells.length, t = 0; r > t; t++) e.removeNode(a.cells[0]);
    a.socket.close(), n++
   } else s++; - 1 == l ? console.log("[Console] Kicked all bots (" + n + ")") : l == n ? console.log("[Console] Kicked " + l + " bots") : console.log("[Console] Only " + n + " bots could be kicked")
 },
 board: function(e, o) {
  for (var l = [], n = 1; n < o.length; n++) l[n - 1] = o[n];
  e.gameMode.packetLB = 48, e.gameMode.specByLeaderboard = !1, e.gameMode.updateLB = function(e) {
   e.leaderboard = l
  }, console.log("[Console] Successfully changed leaderboard values")
 },
 boardreset: function(e) {
  var o = GameMode.get(e.gameMode.ID);
  e.gameMode.packetLB = o.packetLB, e.gameMode.updateLB = o.updateLB, console.log("[Console] Successfully reset leaderboard")
 },
 change: function(e, o) {
  var l = o[1],
   n = o[2];
  n = -1 != n.indexOf(".") ? parseFloat(n) : parseInt(n), "undefined" != typeof e.config[l] ? (e.config[l] = n, console.log("[Console] Set " + l + " to " + n)) : console.log("[Console] Invalid config value")
 },
 clear: function() {
  process.stdout.write("[2J[0;0H")
 },
 color: function(e, o) {
  var l = parseInt(o[1]);
  if (isNaN(l)) return void console.log("[Console] Please specify a valid player ID!");
  var n = {
   r: 0,
   g: 0,
   b: 0
  };
  n.r = Math.max(Math.min(parseInt(o[2]), 255), 0), n.g = Math.max(Math.min(parseInt(o[3]), 255), 0), n.b = Math.max(Math.min(parseInt(o[4]), 255), 0);
  for (var s in e.clients)
   if (e.clients[s].playerTracker.pID == l) {
    var a = e.clients[s].playerTracker;
    a.setColor(n);
    for (var r in a.cells) a.cells[r].setColor(n);
    break
   }
 },
 exit: function(e, o) {
  console.log("[Console] Closing server..."), e.socketServer.close(), process.exit(1)
 },
 food: function(e, o) {
  var l = {
    x: parseInt(o[1]),
    y: parseInt(o[2])
   },
   n = parseInt(o[3]);
  if (isNaN(l.x) || isNaN(l.y)) return void console.log("[Console] Invalid coordinates");
  isNaN(n) && (n = e.config.foodStartMass);
  var s = new Entity.Food(e.getNextNodeId(), null, l, n);
  s.setColor(e.getRandomColor()), e.addNode(s), e.currentFood++, console.log("[Console] Spawned 1 food cell at (" + l.x + " , " + l.y + ")")
 },
 gamemode: function(e, o) {
  try {
   var l = parseInt(o[1]),
    n = GameMode.get(l);
   e.gameMode.onChange(e), e.gameMode = n, e.gameMode.onServerInit(e), console.log("[Game] Changed game mode to " + e.gameMode.name)
  } catch (s) {
   console.log("[Console] Invalid game mode selected")
  }
 },
 kick: function(e, o) {
  var l = parseInt(o[1]);
  if (isNaN(l)) return void console.log("[Console] Please specify a valid player ID!");
  for (var n in e.clients)
   if (e.clients[n].playerTracker.pID == l) {
    for (var s = e.clients[n].playerTracker, a = s.cells.length, r = 0; a > r; r++) e.removeNode(s.cells[0]);
    s.socket.close(), console.log("[Console] Kicked " + s.name);
    break
   }
 },
 kill: function(e, o) {
  var l = parseInt(o[1]);
  if (isNaN(l)) return void console.log("[Console] Please specify a valid player ID!");
  var n = 0;
  for (var s in e.clients)
   if (e.clients[s].playerTracker.pID == l) {
    for (var a = e.clients[s].playerTracker, r = a.cells.length, t = 0; r > t; t++) e.removeNode(a.cells[0]), n++;
    console.log("[Console] Removed " + n + " cells");
    break
   }
 },
 killall: function(e, o) {
  for (var l = 0, n = e.nodesPlayer.length, s = 0; n > s; s++) e.removeNode(e.nodesPlayer[0]), l++;
  console.log("[Console] Removed " + l + " cells")
 },
 mass: function(e, o) {
  var l = parseInt(o[1]);
  if (isNaN(l)) return void console.log("[Console] Please specify a valid player ID!");
  var n = Math.max(parseInt(o[2]), 9);
  if (isNaN(n)) return void console.log("[Console] Please specify a valid number");
  for (var s in e.clients)
   if (e.clients[s].playerTracker.pID == l) {
    var a = e.clients[s].playerTracker;
    for (var r in a.cells) a.cells[r].mass = n;
    console.log("[Console] Set mass of " + a.name + " to " + n);
    break
   }
 },
 name: function(e, o) {
  var l = parseInt(o[1]);
  if (isNaN(l)) return void console.log("[Console] Please specify a valid player ID!");
  var n = o.slice(2, o.length).join(" ");
  if ("undefined" == typeof n) return void console.log("[Console] Please type a valid name");
  for (var s = 0; s < e.clients.length; s++) {
   var a = e.clients[s].playerTracker;
   if (a.pID == l) return console.log("[Console] Changing " + a.name + " to " + n), void(a.name = n)
  }
  console.log("[Console] Player " + l + " was not found")
 },
 playerlist: function(e, o) {
  console.log("[Console] Showing " + e.clients.length + " players: "), console.log(" ID         | IP              | " + fillChar("NICK", " ", e.config.playerMaxNickLength) + " | CELLS | SCORE  | POSITION    "), console.log(fillChar("", "-", " ID         | IP              |  | CELLS | SCORE  | POSITION    ".length + e.config.playerMaxNickLength));
  for (var l = 0; l < e.clients.length; l++) {
   var n = e.clients[l].playerTracker,
    s = fillChar(n.pID, " ", 10, !0),
    a = "BOT";
   "undefined" != typeof e.clients[l].remoteAddress && (a = e.clients[l].remoteAddress), a = fillChar(a, " ", 15);
   var r = "",
    t = "",
    c = "",
    i = "",
    d = "";
   if (n.spectate) {
    try {
     r = e.getMode().specByLeaderboard ? e.leaderboard[n.spectatedPlayer].name : e.clients[n.spectatedPlayer].playerTracker.name
    } catch (g) {
     r = ""
    }
    r = "" == r ? "An unnamed cell" : r, d = fillChar("SPECTATING: " + r, "-", " | CELLS | SCORE  | POSITION    ".length + e.config.playerMaxNickLength, !0), console.log(" " + s + " | " + a + " | " + d)
   } else n.cells.length > 0 ? (r = fillChar("" == n.name ? "An unnamed cell" : n.name, " ", e.config.playerMaxNickLength), t = fillChar(n.cells.length, " ", 5, !0), c = fillChar(n.getScore(!0), " ", 6, !0), i = fillChar(n.centerPos.x >> 0, " ", 5, !0) + ", " + fillChar(n.centerPos.y >> 0, " ", 5, !0), console.log(" " + s + " | " + a + " | " + r + " | " + t + " | " + c + " | " + i)) : (d = fillChar("DEAD OR NOT PLAYING", "-", " | CELLS | SCORE  | POSITION    ".length + e.config.playerMaxNickLength, !0), console.log(" " + s + " | " + a + " | " + d))
  }
 },
 pause: function(e, o) {
  e.run = !e.run;
  var l = e.run ? "Unpaused" : "Paused";
  console.log("[Console] " + l + " the game.")
 },
 reload: function(e) {
  e.loadConfig(), console.log("[Console] Reloaded the config file successfully")
 },
 status: function(e, o) {
  for (var l = 0, n = 0, s = 0; s < e.clients.length; s++) "_socket" in e.clients[s] ? l++ : n++;
  console.log("[Console] Connected players: " + e.clients.length + "/" + e.config.serverMaxConnections), console.log("[Console] Players: " + l + " Bots: " + n), console.log("[Console] Server has been running for " + process.uptime() + " seconds."), console.log("[Console] Current memory usage: " + process.memoryUsage().heapUsed / 1e3 + "/" + process.memoryUsage().heapTotal / 1e3 + " kb"), console.log("[Console] Current game mode: " + e.gameMode.name)
 },
 tp: function(e, o) {
  var l = parseInt(o[1]);
  if (isNaN(l)) return void console.log("[Console] Please specify a valid player ID!");
  var n = {
   x: parseInt(o[2]),
   y: parseInt(o[3])
  };
  if (isNaN(n.x) || isNaN(n.y)) return void console.log("[Console] Invalid coordinates");
  for (var s in e.clients)
   if (e.clients[s].playerTracker.pID == l) {
    var a = e.clients[s].playerTracker;
    for (var r in a.cells) a.cells[r].position.x = n.x, a.cells[r].position.y = n.y;
    console.log("[Console] Teleported " + a.name + " to (" + n.x + " , " + n.y + ")");
    break
   }
 },
 virus: function(e, o) {
  var l = {
    x: parseInt(o[1]),
    y: parseInt(o[2])
   },
   n = parseInt(o[3]);
  if (isNaN(l.x) || isNaN(l.y)) return void console.log("[Console] Invalid coordinates");
  isNaN(n) && (n = e.config.virusStartMass);
  var s = new Entity.Virus(e.getNextNodeId(), null, l, n);
  e.addNode(s), console.log("[Console] Spawned 1 virus at (" + l.x + " , " + l.y + ")")
 }
};