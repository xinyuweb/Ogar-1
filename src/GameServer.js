function GameServer() {
 this.run = !0, this.lastNodeId = 1, this.lastPlayerId = 1, this.clients = [], this.nodes = [], this.nodesVirus = [], this.nodesEjected = [], this.nodesPlayer = [], this.currentFood = 0, this.movingNodes = [], this.leaderboard = [], this.lb_packet = new ArrayBuffer(0), this.bots = new BotLoader(this), this.log = new Logger, this.commands, this.time = +new Date, this.startTime = this.time, this.tick = 0, this.tickMain = 0, this.tickSpawn = 0, this.config = {
  serverMaxConnections: 64,
  serverPort: 443,
  serverGamemode: 0,
  serverBots: 0,
  serverViewBaseX: 1024,
  serverViewBaseY: 592,
  serverStatsPort: 88,
  serverStatsUpdate: 60,
  serverLogLevel: 1,
  borderLeft: 0,
  borderRight: 6e3,
  borderTop: 0,
  borderBottom: 6e3,
  spawnInterval: 20,
  foodSpawnAmount: 10,
  foodStartAmount: 100,
  foodMaxAmount: 500,
  foodMass: 1,
  virusMinAmount: 10,
  virusMaxAmount: 50,
  virusStartMass: 100,
  virusFeedAmount: 7,
  ejectMass: 12,
  ejectMassLoss: 16,
  ejectSpeed: 160,
  ejectSpawnPlayer: 50,
  playerStartMass: 10,
  playerMaxMass: 22500,
  playerMinMassEject: 32,
  playerMinMassSplit: 36,
  playerMaxCells: 16,
  playerRecombineTime: 30,
  playerMassDecayRate: .002,
  playerMinMassDecay: 9,
  playerMaxNickLength: 15,
  playerSpeed: 30,
  playerDisconnectTime: 60,
  tourneyMaxPlayers: 12,
  tourneyPrepTime: 10,
  tourneyEndTime: 30,
  tourneyTimeLimit: 20,
  tourneyAutoFill: 0,
  tourneyAutoFillPlayers: 1
 }, this.loadConfig(), this.gameMode = Gamemode.get(this.config.serverGamemode);
}
var WebSocket = require("ws"),
 http = require("http"),
 fs = require("fs"),
 ini = require("./modules/ini.js"),
 Packet = require("./packet"),
 PlayerTracker = require("./PlayerTracker"),
 PacketHandler = require("./PacketHandler"),
 Entity = require("./entity"),
 Gamemode = require("./gamemodes"),
 BotLoader = require("./ai/BotLoader"),
 Logger = require("./modules/log");
module.exports = GameServer, GameServer.prototype.start = function() {
 function e(e) {
  function t(e) {
   this.server.log.onDisconnect(this.socket.remoteAddress);
   for (var t = this.socket.playerTracker, o = this.socket.playerTracker.cells.length, i = 0; o > i; i++) {
    var s = this.socket.playerTracker.cells[i];
    s && (s.calcMove = function() {});
   }
   t.disconnect = 20 * this.server.config.playerDisconnectTime, this.socket.sendPacket = function() {};
  }
  if (this.clients.length >= this.config.serverMaxConnections) return void e.close();
  var o = e.upgradeReq.headers.origin;
  if ("http://agar.io" != o && "https://agar.io" != o && "http://localhost" != o && "https://localhost" != o && "http://127.0.0.1" != o && "https://127.0.0.1" != o) return void e.close();
  e.remoteAddress = e._socket.remoteAddress, e.remotePort = e._socket.remotePort, this.log.onConnect(e.remoteAddress), e.playerTracker = new PlayerTracker(this, e), e.packetHandler = new PacketHandler(this, e), e.on("message", e.packetHandler.handleMessage.bind(e.packetHandler));
  var i = {
   server: this,
   socket: e
  };
  e.on("error", t.bind(i)), e.on("close", t.bind(i)), this.clients.push(e);
 }
 this.log.setup(this), this.gameMode.onServerInit(this), this.socketServer = new WebSocket.Server({
  port: this.config.serverPort,
  perMessageDeflate: !1
 }, function() {
  if (this.startingFood(), setInterval(this.mainLoop.bind(this), 1), console.log("[Game] Listening on port " + this.config.serverPort), console.log("[Game] Current game mode is " + this.gameMode.name), this.config.serverBots > 0) {
   for (var e = 0; e < this.config.serverBots; e++) this.bots.addBot();
   console.log("[Game] Loaded " + this.config.serverBots + " player bots");
  }
 }.bind(this)), this.socketServer.on("connection", e.bind(this)), this.socketServer.on("error", function(e) {
  switch (e.code) {
   case "EADDRINUSE":
    console.log("[Error] Server could not bind to port! Please close out of Skype or change 'serverPort' in gameserver.ini to a different number.");
    break;
   case "EACCES":
    console.log("[Error] Please make sure you are running Ogar with root privileges.");
    break;
   default:
    console.log("[Error] Unhandled error code: " + e.code);
  }
  process.exit(1);
 }), this.startStatsServer(this.config.serverStatsPort);
}, GameServer.prototype.getMode = function() {
 return this.gameMode;
}, GameServer.prototype.getNextNodeId = function() {
 return this.lastNodeId > 2147483647 && (this.lastNodeId = 1), this.lastNodeId++;
}, GameServer.prototype.getNewPlayerID = function() {
 return this.lastPlayerId > 2147483647 && (this.lastPlayerId = 1), this.lastPlayerId++;
}, GameServer.prototype.getRandomPosition = function() {
 return {
  x: Math.floor(Math.random() * (this.config.borderRight - this.config.borderLeft)) + this.config.borderLeft,
  y: Math.floor(Math.random() * (this.config.borderBottom - this.config.borderTop)) + this.config.borderTop
 };
}, GameServer.prototype.getRandomSpawn = function() {
 var e;
 if (this.currentFood > 0)
  for (var t, o = this.nodes.length - 1; o > -1; o--)
   if (t = this.nodes[o], t && !t.inRange && 1 == t.getType()) {
    e = {
     x: t.position.x,
     y: t.position.y
    }, this.removeNode(t);
    break;
   }
 return e || (e = this.getRandomPosition()), e;
}, GameServer.prototype.getRandomColor = function() {
 var e = Math.floor(3 * Math.random());
 return 0 == e ? {
  r: 255,
  b: 255 * Math.random(),
  g: 0
 } : 1 == e ? {
  r: 0,
  b: 255,
  g: 255 * Math.random()
 } : {
  r: 255 * Math.random(),
  b: 0,
  g: 255
 };
}, GameServer.prototype.addNode = function(e) {
 this.nodes.push(e), e.owner && (e.setColor(e.owner.color), e.owner.cells.push(e), e.owner.socket.sendPacket(new Packet.AddNode(e))), e.onAdd(this);
 for (var t = 0; t < this.clients.length; t++) client = this.clients[t].playerTracker, client && "_socket" in client.socket && e.visibleCheck(client.viewBox, client.centerPos) && client.nodeAdditionQueue.push(e)
}, GameServer.prototype.removeNode = function(e) {
 var t = this.nodes.indexOf(e); - 1 != t && this.nodes.splice(t, 1), t = this.movingNodes.indexOf(e), -1 != t && this.movingNodes.splice(t, 1), e.onRemove(this);
 for (var o = 0; o < this.clients.length; o++) client = this.clients[o].playerTracker, client && client.nodeDestroyQueue.push(e)
}, GameServer.prototype.cellTick = function() {
 this.updateMoveEngine();
}, GameServer.prototype.spawnTick = function() {
 this.tickSpawn++, this.tickSpawn >= this.config.spawnInterval && (this.updateFood(), this.virusCheck(), this.tickSpawn = 0);
}, GameServer.prototype.gamemodeTick = function() {
 this.gameMode.onTick(this);
}, GameServer.prototype.cellUpdateTick = function() {
 this.updateCells();
}, GameServer.prototype.mainLoop = function() {
 var e = new Date;
 this.tick += e - this.time, this.time = e, this.tick >= 50 && (this.run && (setTimeout(this.cellTick(), 0), setTimeout(this.spawnTick(), 0), setTimeout(this.gamemodeTick(), 0)), this.updateClients(), this.tickMain++, this.tickMain >= 20 && (setTimeout(this.cellUpdateTick(), 0), this.leaderboard = [], this.gameMode.updateLB(this), this.lb_packet = new Packet.UpdateLeaderboard(this.leaderboard, this.gameMode.packetLB), this.tickMain = 0), this.tick = 0);
}, GameServer.prototype.updateClients = function() {
 for (var e = 0; e < this.clients.length; e++) "undefined" != typeof this.clients[e] && this.clients[e].playerTracker.update();
}, GameServer.prototype.startingFood = function() {
 for (var e = 0; e < this.config.foodStartAmount; e++) this.spawnFood();
}, GameServer.prototype.updateFood = function() {
 for (var e = Math.min(this.config.foodSpawnAmount, this.config.foodMaxAmount - this.currentFood), t = 0; e > t; t++) this.spawnFood();
}, GameServer.prototype.spawnFood = function() {
 var e = new Entity.Food(this.getNextNodeId(), null, this.getRandomPosition(), this.config.foodMass);
 e.setColor(this.getRandomColor()), this.addNode(e), this.currentFood++;
}, GameServer.prototype.spawnPlayer = function(e, t, o) {
 null == t && (t = this.getRandomSpawn()), null == o && (o = this.config.playerStartMass);
 var i = new Entity.PlayerCell(this.getNextNodeId(), e, t, o);
 this.addNode(i), e.mouse = {
  x: t.x,
  y: t.y
 };
}, GameServer.prototype.virusCheck = function() {
 if (this.nodesVirus.length < this.config.virusMinAmount) {
  for (var e = this.getRandomPosition(), t = 100 * this.config.virusStartMass >> 0, o = 0; o < this.nodesPlayer.length; o++) {
   var i = this.nodesPlayer[o];
   if (!(i.mass < this.config.virusStartMass)) {
    var s = i.getSquareSize(),
     r = i.position.x - e.x,
     n = i.position.y - e.y;
    if (s >= r * r + n * n + t) return;
   }
  }
  var a = new Entity.Virus(this.getNextNodeId(), null, e, this.config.virusStartMass);
  this.addNode(a);
 }
}, GameServer.prototype.getDist = function(e, t, o, i) {
 var s = Math.abs(e - o),
  r = Math.abs(t - i);
 return Math.sqrt(s * s + r * r);
}, GameServer.prototype.updateMoveEngine = function() {
 for (var e = this.nodesPlayer.length, t = [], o = 0; e > o; o++) t[o] = o;
 for (var o = 0; e > o; o++)
  for (var i = o + 1; e > i; i++) {
   var s = this.nodesPlayer[t[o]].owner,
    r = this.nodesPlayer[t[i]].owner;
   if (this.getDist(this.nodesPlayer[t[o]].position.x, this.nodesPlayer[t[o]].position.y, s.mouse.x, s.mouse.y) > this.getDist(this.nodesPlayer[t[i]].position.x, this.nodesPlayer[t[i]].position.y, r.mouse.x, r.mouse.y)) {
    var n = t[o];
    t[o] = t[i], t[i] = n;
   }
  }
 for (var o = 0; e > o; o++) {
  var a = this.nodesPlayer[t[o]];
  if (a) {
   var l = a.owner;
   a.calcMove(l.mouse.x, l.mouse.y, this);
   for (var c = this.getCellsInRange(a), i = 0; i < c.length; i++) {
    var h = c[i];
    0 == h.cellType && (e--, h.nodeId < a.nodeId && o--), h.onConsume(a, this), h.setKiller(a), this.removeNode(h);
   }
  }
 }
 e = this.movingNodes.length;
 for (var o = 0; e > o; o++) {
  for (var h = this.movingNodes[o];
   "undefined" == typeof h && o < this.movingNodes.length;) this.movingNodes.splice(o, 1), h = this.movingNodes[o];
  if (!(o >= this.movingNodes.length))
   if (h.moveEngineTicks > 0) h.onAutoMove(this), h.calcMovePhys(this.config);
   else {
    h.moveDone(this);
    var d = this.movingNodes.indexOf(h); - 1 != d && this.movingNodes.splice(d, 1);
   }
 }
}, GameServer.prototype.setAsMovingNode = function(e) {
 this.movingNodes.push(e);
}, GameServer.prototype.splitCells = function(e) {
 for (var t = e.cells.length, o = 0; t > o; o++)
  if (!(e.cells.length >= this.config.playerMaxCells)) {
   var i = e.cells[o];
   if (i && !(i.mass < this.config.playerMinMassSplit)) {
    var s = e.mouse.y - i.position.y,
     r = e.mouse.x - i.position.x,
     n = Math.atan2(r, s),
     a = i.getSize() / 2,
     l = {
      x: i.position.x + a * Math.sin(n),
      y: i.position.y + a * Math.cos(n)
     },
     c = 6 * i.getSpeed(),
     h = i.mass / 2;
    i.mass = h;
    var d = new Entity.PlayerCell(this.getNextNodeId(), e, l, h);
    d.setAngle(n), d.setMoveEngineData(c, 32, .85), d.calcMergeTime(this.config.playerRecombineTime), this.setAsMovingNode(d), this.addNode(d);
   }
  }
}, GameServer.prototype.ejectMass = function(e) {
 for (var t = 0; t < e.cells.length; t++) {
  var o = e.cells[t];
  if (o && !(o.mass < this.config.playerMinMassEject)) {
   var i = e.mouse.y - o.position.y,
    s = e.mouse.x - o.position.x,
    r = Math.atan2(s, i),
    n = o.getSize() + 5,
    a = {
     x: o.position.x + (n + this.config.ejectMass) * Math.sin(r),
     y: o.position.y + (n + this.config.ejectMass) * Math.cos(r)
    };
   o.mass -= this.config.ejectMassLoss, r += .4 * Math.random() - .2;
   var l = new Entity.EjectedMass(this.getNextNodeId(), null, a, this.config.ejectMass);
   l.setAngle(r), l.setMoveEngineData(this.config.ejectSpeed, 20), l.setColor(o.getColor()), this.addNode(l), this.setAsMovingNode(l);
  }
 }
}, GameServer.prototype.newCellVirused = function(e, t, o, i, s) {
 var r = {
  x: t.position.x,
  y: t.position.y
 };
 newCell = new Entity.PlayerCell(this.getNextNodeId(), e, r, i), newCell.setAngle(o), newCell.setMoveEngineData(s, 15), newCell.calcMergeTime(this.config.playerRecombineTime), newCell.ignoreCollision = !0, this.addNode(newCell), this.setAsMovingNode(newCell)
}, GameServer.prototype.shootVirus = function(e) {
 var t = {
   x: e.position.x,
   y: e.position.y
  },
  o = new Entity.Virus(this.getNextNodeId(), null, t, this.config.virusStartMass);
 o.setAngle(e.getAngle()), o.setMoveEngineData(200, 20), this.addNode(o), this.setAsMovingNode(o);
}, GameServer.prototype.getCellsInRange = function(e) {
 for (var t = new Array, o = e.getSquareSize(), i = e.owner.visibleNodes.length, s = 0; i > s; s++) {
  var r = e.owner.visibleNodes[s];
  if ("undefined" != typeof r && !r.inRange && e.nodeId != r.nodeId && (e.owner != r.owner || !e.ignoreCollision) && r.collisionCheck2(o, e.position)) {
   var n = 1.25;
   switch (r.getType()) {
    case 1:
     t.push(r), r.inRange = !0;
     continue;
    case 2:
     n = 1.33;
     break;
    case 0:
     if (r.owner == e.owner) {
      if (!e.shouldRecombine || !r.shouldRecombine) continue;
      n = 1;
     }
     if (this.gameMode.haveTeams) {
      if (!r.owner) continue;
      if (r.owner != e.owner && r.owner.getTeam() == e.owner.getTeam()) continue;
     }
   }
   if (!(r.mass * n > e.mass)) {
    var a = Math.pow(r.position.x - e.position.x, 2),
     l = Math.pow(r.position.y - e.position.y, 2),
     c = Math.sqrt(a + l),
     h = e.getSize() - r.getEatingRange();
    c > h || (t.push(r), r.inRange = !0);
   }
  }
 }
 return t;
}, GameServer.prototype.getNearestVirus = function(e) {
 for (var t = null, o = 100, i = e.position.y - o, s = e.position.y + o, r = e.position.x - o, n = e.position.x + o, a = this.nodesVirus.length, l = 0; a > l; l++) {
  var c = this.nodesVirus[l];
  if ("undefined" != typeof c && c.collisionCheck(s, i, n, r)) {
   t = c;
   break;
  }
 }
 return t;
}, GameServer.prototype.updateCells = function() {
 if (this.run)
  for (var e = 1 - this.config.playerMassDecayRate * this.gameMode.decayMod, t = 0; t < this.nodesPlayer.length; t++) {
   var o = this.nodesPlayer[t];
   o && (o.owner.cells.length > 1 ? (o.recombineTicks += 1, o.calcMergeTime(this.config.playerRecombineTime)) : 1 == o.owner.cells.length && o.recombineTicks > 0 && (o.recombineTicks = 0, o.shouldRecombine = !1), o.mass >= this.config.playerMinMassDecay && (o.mass *= e));
  }
}, GameServer.prototype.loadConfig = function() {
 try {
  var e = ini.parse(fs.readFileSync("./gameserver.ini", "utf-8"));
  for (var t in e) this.config[t] = e[t];
 } catch (o) {
  console.log("[Game] Config not found... Generating new config"), fs.writeFileSync("./gameserver.ini", ini.stringify(this.config));
 }
}, GameServer.prototype.switchSpectator = function(e) {
 if (this.gameMode.specByLeaderboard) e.spectatedPlayer++, e.spectatedPlayer == this.leaderboard.length && (e.spectatedPlayer = 0);
 else {
  for (var t = e.spectatedPlayer + 1, o = 0; e.spectatedPlayer != t && o != this.clients.length;)
   if (t != this.clients.length) {
    if (!this.clients[t]) {
     e.spectatedPlayer = -1;
     break;
    }
    if (this.clients[t].playerTracker.cells.length > 0) break;
    t++, o++;
   } else t = 0;
  o == this.clients.length ? e.spectatedPlayer = -1 : e.spectatedPlayer = t;
 }
}, GameServer.prototype.startStatsServer = function(e) {
 1 > e || (this.stats = "Test", this.getStats(), this.httpServer = http.createServer(function(e, t) {
  t.setHeader("Access-Control-Allow-Origin", "*"), t.writeHead(200), t.end(this.stats);
 }.bind(this)), this.httpServer.listen(e, function() {
  console.log("[Game] Loaded stats server on port " + e), setInterval(this.getStats.bind(this), 1e3 * this.config.serverStatsUpdate);
 }.bind(this)));
}, GameServer.prototype.getStats = function() {
 var e = 0;
 this.clients.forEach(function(t) {
  t.playerTracker && t.playerTracker.cells.length > 0 && e++;
 });
 var t = {
  current_players: this.clients.length,
  alive: e,
  spectators: this.clients.length - e,
  max_players: this.config.serverMaxConnections,
  gamemode: this.gameMode.name,
  start_time: this.startTime
 };
 this.stats = JSON.stringify(t);
}, WebSocket.prototype.sendPacket = function(e) {
 function t(e) {
  for (var t = new Uint8Array(e.buffer || e), o = e.byteLength || e.length, i = e.byteOffset || 0, s = new Buffer(o), r = 0; o > r; r++) s[r] = t[i + r];
  return s;
 }
 if (this.readyState == WebSocket.OPEN && e.build) {
  var o = e.build();
  this.send(t(o), {
   binary: !0
  });
 } else e.build && (this.readyState = WebSocket.CLOSED, this.emit("close"), this.removeAllListeners());
};