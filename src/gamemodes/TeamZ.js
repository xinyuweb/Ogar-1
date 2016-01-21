function TeamZ() {
 Mode.apply(this, Array.prototype.slice.call(arguments)), this.ID = 13, this.name = "Zombie Team", this.packetLB = 48, this.haveTeams = !0, this.minPlayer = 2, this.gameDuration = 18e3, this.warmUpDuration = 600, this.crazyDuration = 200, this.heroEffectDuration = 1e3, this.brainEffectDuration = 200, this.spawnBrainInterval = 1200, this.spawnHeroInterval = 600, this.defaultColor = {
  r: 155,
  g: 48,
  b: 255
 }, this.colorFactorStep = 5, this.colorLower = 50, this.colorUpper = 225, this.maxBrain = -1, this.maxHero = 4, this.state = GameState.WF_PLAYERS, this.winTeam = -1, this.gameTimer = 0, this.zombies = [], this.humans = [], this.heroes = [], this.brains = [], this.spawnHeroTimer = 0, this.spawnBrainTimer = 0;
}

function Hero() {
 Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = CellType.HERO, this.color = {
  r: 255,
  g: 255,
  b: 7
 }, this.mass = 60;
}

function Brain() {
 Cell.apply(this, Array.prototype.slice.call(arguments)), this.cellType = CellType.BRAIN, this.color = {
  r: 255,
  g: 7,
  b: 255
 }, this.mass = 60;
}
var Mode = require("./Mode.js"),
 Cell = require("../entity/Cell.js"),
 Entity = require("../entity"),
 Virus = require("../entity/Virus.js"),
 GameServer = null,
 GS_getRandomColor = null,
 GS_getNearestVirus = null,
 GS_getCellsInRange = null,
 GS_splitCells = null,
 GS_newCellVirused = null,
 Virus_onConsume = Virus.prototype.onConsume,
 GameState = {
  WF_PLAYERS: 0,
  WF_START: 1,
  IN_PROGRESS: 2
 },
 CellType = {
  PLAYER: 0,
  FOOD: 1,
  VIRUS: 2,
  EJECTED_MASS: 3,
  HERO: 130,
  BRAIN: 131
 },
 localLB = [];
module.exports = TeamZ, TeamZ.prototype = new Mode, TeamZ.prototype.createZColorFactor = function(e) {
 e.zColorFactor = Math.random() * (this.colorUpper - this.colorLower + 1) >> 0 + this.colorLower, e.zColorIncr = !0;
}, TeamZ.prototype.nextZColorFactor = function(e) {
 1 == e.zColorIncr ? e.zColorFactor + this.colorFactorStep >= this.colorUpper ? (e.zColorFactor = this.colorUpper, e.zColorIncr = !1) : e.zColorFactor += this.colorFactorStep : e.zColorFactor - this.colorFactorStep <= this.colorLower ? (e.zColorFactor = this.colorLower, e.zColorIncr = !0) : e.zColorFactor -= this.colorFactorStep;
}, TeamZ.prototype.updateZColor = function(e, t) {
 var o = {
  r: (4 & t) > 0 ? e.zColorFactor : 7,
  g: (2 & t) > 0 ? e.zColorFactor : 7,
  b: (1 & t) > 0 ? e.zColorFactor : 7
 };
 e.color = {
  r: o.r,
  g: o.g,
  b: o.b
 };
 for (var r = 0; r < e.cells.length; r++) {
  var i = e.cells[r];
  i.setColor(o);
 }
}, TeamZ.prototype.isCrazy = function(e) {
 return "undefined" != typeof e.crazyTimer && e.crazyTimer > 0 && e.team > 0;
}, TeamZ.prototype.hasEatenHero = function(e) {
 return "undefined" != typeof e.eatenHeroTimer && e.eatenHeroTimer > 0;
}, TeamZ.prototype.hasEatenBrain = function(e) {
 return "undefined" != typeof e.eatenBrainTimer && e.eatenBrainTimer > 0;
}, TeamZ.prototype.spawnDrug = function(e, t) {
 var o = 0,
  r = !1;
 if (t.getType() == CellType.HERO ? (o = this.maxHero < 0 ? this.zombies.length : this.maxHero, r = this.heroes.length < o) : t.getType() == CellType.BRAIN && (o = this.maxBrain < 0 ? this.humans.length : this.maxBrain, r = this.brains.length < o), r) {
  for (var i = e.getRandomPosition(), a = !1, s = 0; s < e.nodesPlayer.length; s++) {
   var n = e.nodesPlayer[s],
    l = n.getSize(),
    h = n.position.y - l,
    m = n.position.y + l,
    p = n.position.x - l,
    c = n.position.x + l;
   if (!(i.y > m || i.y < h || i.x > c || i.x < p)) {
    a = !0;
    break;
   }
  }
  return a ? !1 : (t.position = i, e.addNode(t), !0);
 }
 return !0;
}, TeamZ.prototype.turnToZombie = function(e) {
 e.team = 0, this.createZColorFactor(e), this.updateZColor(e, 7);
 var t = this.humans.indexOf(e);
 t >= 0 && this.humans.splice(t, 1), this.zombies.push(e);
}, TeamZ.prototype.boostSpeedCell = function(e) {
 ("undefined" == typeof e.originalSpeed || null == e.originalSpeed) && (e.originalSpeed = e.getSpeed, e.getSpeed = function() {
  return 2 * this.originalSpeed();
 });
}, TeamZ.prototype.boostSpeed = function(e) {
 for (var t = 0; t < e.cells.length; t++) {
  var o = e.cells[t];
  "undefined" != typeof o && this.boostSpeedCell(o);
 }
}, TeamZ.prototype.resetSpeedCell = function(e) {
 "undefined" != typeof e.originalSpeed && null != e.originalSpeed && (e.getSpeed = e.originalSpeed, e.originalSpeed = null);
}, TeamZ.prototype.resetSpeed = function(e) {
 for (var t = 0; t < e.cells.length; t++) {
  var o = e.cells[t];
  "undefined" != typeof o && this.resetSpeedCell(o);
 }
}, TeamZ.prototype.startGame = function(e) {
 for (var t = 0; t < this.humans.length; t++) {
  var o = this.humans[t];
  o.team = o.pID, o.crazyTimer = 0, o.eatenHeroTimer = 0, o.eatenBrainTimer = 0, o.color = e.getRandomColor();
  for (var r = 0; r < o.cells.length; r++) {
   var i = o.cells[r];
   i && (i.setColor(o.color), i.mass = e.config.playerStartMass, this.resetSpeedCell(i));
  }
 }
 var a = this.humans[Math.random() * this.humans.length >> 0];
 this.turnToZombie(a), this.winTeam = -1, this.state = GameState.IN_PROGRESS, this.gameTimer = this.gameDuration;
}, TeamZ.prototype.endGame = function(e) {
 for (var t = 0; t < this.zombies.length; t++) {
  var o = this.zombies[t],
   r = this.humans.indexOf(o);
  0 > r && this.humans.push(o);
 }
 this.zombies = [], this.spawnHeroTimer = 0, this.spawnBrainTimer = 0, localLB = [];
 for (var t = 0; t < this.humans.length; t++) {
  var o = this.humans[t];
  o.color = this.defaultColor, o.team = 1;
  for (var i = 0; i < o.cells.length; i++) {
   var a = o.cells[i];
   a.setColor(this.defaultColor);
  }
 }
 this.state = GameState.WF_PLAYERS, this.gameTimer = 0;
}, TeamZ.prototype.leaderboardAddSort = function(e, t) {
 for (var o = t.length - 1, r = !0; o >= 0 && r;) e.getScore(!1) <= t[o].getScore(!1) && (t.splice(o + 1, 0, e), r = !1), o--;
 r && t.splice(0, 0, e);
}, TeamZ.prototype.onServerInit = function(e) {
 e.run = !0, GameServer = require("../GameServer.js"), GS_getRandomColor = GameServer.prototype.getRandomColor, GS_getNearestVirus = GameServer.prototype.getNearestVirus, GS_getCellsInRange = GameServer.prototype.getCellsInRange, GS_splitCells = GameServer.prototype.splitCells, GS_newCellVirused = GameServer.prototype.newCellVirused, GameServer.prototype.getRandomColor = function() {
  var e = [255, 7, 256 * Math.random() >> 0];
  return e.sort(function() {
   return .5 - Math.random();
  }), {
   r: e[0],
   b: e[1],
   g: e[2]
  };
 }, GameServer.prototype.getNearestVirus = function(e) {
  for (var t = null, o = 100, r = e.position.y - o, i = e.position.y + o, a = e.position.x - o, s = e.position.x + o, n = 0; n < this.gameMode.heroes.length; n++) {
   var l = this.gameMode.heroes[n];
   if ("undefined" != typeof l && l.collisionCheck(i, r, s, a)) {
    t = l;
    break;
   }
  }
  if (null != t) return t;
  for (var n = 0; n < this.gameMode.brains.length; n++) {
   var l = this.gameMode.brains[n];
   if ("undefined" != typeof l && l.collisionCheck(i, r, s, a)) {
    t = l;
    break;
   }
  }
  if (null != t) return t;
  for (var h = this.nodesVirus.length, n = 0; h > n; n++) {
   var l = this.nodesVirus[n];
   if ("undefined" != typeof l && l.collisionCheck(i, r, s, a)) {
    t = l;
    break;
   }
  }
  return t;
 }, GameServer.prototype.getCellsInRange = function(e) {
  var t = new Array;
  if (this.gameMode.state != GameState.IN_PROGRESS) return t;
  for (var o = e.getSquareSize(), r = e.owner.visibleNodes.length, i = 0; r > i; i++) {
   var a = e.owner.visibleNodes[i];
   if ("undefined" != typeof a && !a.inRange) {
    if (0 == e.owner.getTeam()) {
     if (a.getType() == CellType.HERO) continue;
    } else if (a.getType() == CellType.BRAIN) continue;
    if (e.nodeId != a.nodeId && (e.owner != a.owner || !e.ignoreCollision) && a.collisionCheck2(o, e.position)) {
     var s = 1.25;
     switch (a.getType()) {
      case 1:
       t.push(a), a.inRange = !0;
       continue;
      case 2:
       s = 1.33;
       break;
      case 0:
       if (a.owner == e.owner) {
        if (e.recombineTicks > 0 || a.recombineTicks > 0) continue;
        s = 1;
       }
       if (this.gameMode.haveTeams) {
        if (!a.owner) continue;
        if (a.owner != e.owner && a.owner.getTeam() == e.owner.getTeam()) continue;
       }
     }
     if (!(a.mass * s > e.mass)) {
      var n = Math.pow(a.position.x - e.position.x, 2),
       l = Math.pow(a.position.y - e.position.y, 2),
       h = Math.sqrt(n + l),
       m = e.getSize() - a.getEatingRange();
      h > m || (t.push(a), a.inRange = !0);
     }
    }
   }
  }
  return t;
 }, GameServer.prototype.splitCells = function(e) {
  for (var t = e.cells.length, o = 0; t > o; o++)
   if (!(e.cells.length >= this.config.playerMaxCells)) {
    var r = e.cells[o];
    if (r && !(r.mass < this.config.playerMinMassSplit)) {
     var i = e.mouse.y - r.position.y,
      a = e.mouse.x - r.position.x,
      s = Math.atan2(a, i),
      n = r.getSize() / 2,
      l = {
       x: r.position.x + n * Math.sin(s),
       y: r.position.y + n * Math.cos(s)
      },
      h = 6 * r.getSpeed(),
      m = r.mass / 2;
     r.mass = m;
     var p = new Entity.PlayerCell(this.getNextNodeId(), e, l, m);
     p.setAngle(s), p.setMoveEngineData(h, 32, .85), p.calcMergeTime(this.config.playerRecombineTime), this.gameMode.hasEatenBrain(e) || this.gameMode.isCrazy(e) ? this.gameMode.boostSpeedCell(p) : this.gameMode.hasEatenHero(e) && (p.recombineTicks = 2), this.setAsMovingNode(p), this.addNode(p);
    }
   }
 }, GameServer.prototype.newCellVirused = function(e, t, o, r, i) {
  var a = {
   x: t.position.x,
   y: t.position.y
  };
  newCell = new Entity.PlayerCell(this.getNextNodeId(), e, a, r), newCell.setAngle(o), newCell.setMoveEngineData(i, 10), newCell.calcMergeTime(this.config.playerRecombineTime), newCell.ignoreCollision = !0, this.gameMode.hasEatenBrain(e) || this.gameMode.isCrazy(e) ? this.gameMode.boostSpeedCell(newCell) : this.gameMode.hasEatenHero(e) && (newCell.recombineTicks = 1), this.addNode(newCell), this.setAsMovingNode(newCell)
 }, Virus.prototype.onConsume = function(e, t) {
  var o = e.owner,
   r = Math.floor(e.mass / 16) - 1,
   i = t.config.playerMaxCells - o.cells.length;
  i = Math.min(i, r);
  var a = Math.min(e.mass / (i + 1), 36);
  if (e.addMass(this.mass), !(0 >= i)) {
   var s = 0,
    n = e.mass - i * a;
   n > 300 && i > 0 && (s++, i--), n > 1200 && i > 0 && (s++, i--), n > 3e3 && i > 0 && (s++, i--);
   for (var l = 0, h = 0; i > h; h++) l += 6 / i, t.newCellVirused(o, e, l, a, 150), e.mass -= a;
   for (var h = 0; s > h; h++) l = 6.28 * Math.random(), a = e.mass / 4, t.newCellVirused(o, e, l, a, 20), e.mass -= a;
   t.gameMode.hasEatenHero(o) ? e.recombineTicks = 0 : e.calcMergeTime(t.config.playerRecombineTime);
  }
 };
 for (var t = 0; t < e.clients.length; t++) {
  var o = e.clients[t].playerTracker;
  if (o && o.cells.length > 0) {
   o.eatenBrainTimer = 0, o.eatenHeroTimer = 0, o.crazyTimer = 0, o.color = this.defaultColor, o.team = 1;
   for (var r = 0; r < o.cells.length; r++) {
    var i = o.cells[r];
    i.setColor(this.defaultColor);
   }
   this.humans.push(o);
  }
 }
}, TeamZ.prototype.onChange = function(e) {
 for (var t = 0; this.brains.length; t++) {
  var o = this.brains[t];
  e.removeNode(o);
 }
 for (var t = 0; this.heroes.length; t++) {
  var o = this.heroes[t];
  e.removeNode(o);
 }
 for (var t = 0; t < this.humans.length; t++) {
  var r = this.humans[t];
  this.isCrazy(r) && this.resetSpeed(r);
 }
 for (var t = 0; t < this.zombies.length; t++) {
  var r = this.zombies[t];
  this.hasEatenBrain(r) && this.resetSpeed(r);
 }
 GameServer.prototype.getRandomColor = GS_getRandomColor, GameServer.prototype.getNearestVirus = GS_getNearestVirus, GameServer.prototype.getCellsInRange = GS_getCellsInRange, GameServer.prototype.splitCells = GS_splitCells, GameServer.prototype.newCellVirused = GS_newCellVirused, Virus.prototype.onConsume = Virus_onConsume;
}, TeamZ.prototype.onTick = function(e) {
 switch (this.state) {
  case GameState.WF_PLAYERS:
   this.humans.length >= this.minPlayer && (this.state = GameState.WF_START, this.gameTimer = this.warmUpDuration);
   break;
  case GameState.WF_START:
   this.gameTimer--, 0 == this.gameTimer && (this.humans.length >= this.minPlayer ? this.startGame(e) : this.state = GameState.WF_PLAYERS);
   break;
  case GameState.IN_PROGRESS:
   this.gameTimer--, 0 == this.gameTimer ? this.winTeam = 1 : 0 == this.humans.length ? this.winTeam = 0 : 0 == this.zombies.length && (this.winTeam = 1), this.winTeam >= 0 && this.endGame(e);
 }
 for (var t = 0; t < this.zombies.length; t++) {
  var o = this.zombies[t];
  if (this.nextZColorFactor(o), this.hasEatenBrain(o)) {
   if (o.eatenBrainTimer--, o.eatenBrainTimer > 0) {
    this.updateZColor(o, 5);
    continue;
   }
   this.resetSpeed(o);
  }
  this.updateZColor(o, 7);
 }
 for (var t = 0; t < this.humans.length; t++) {
  var o = this.humans[t];
  if (this.isCrazy(o)) {
   if (o.crazyTimer--, 0 == o.crazyTimer) {
    for (var r = 0; r < o.cells.length; r++) {
     var i = o.cells[r];
     this.resetSpeedCell(i), 1 == o.cured && i.setColor(o.color);
    }
    if (1 != o.cured) {
     this.turnToZombie(o);
     continue;
    }
    o.cured = !1;
   } else if (o.colorToggle++, o.colorToggle % 10 == 0) {
    var a = null;
    20 == o.colorToggle ? (a = o.color, o.colorToggle = 0) : a = 1 == o.cured ? {
     r: 255,
     g: 255,
     b: 7
    } : {
     r: 75,
     g: 75,
     b: 75
    };
    for (var r = 0; r < o.cells.length; r++) {
     var i = o.cells[r];
     i.setColor(a);
    }
   }
  } else if (this.hasEatenHero(o)) {
   o.eatenHeroTimer--;
   var s = null;
   o.eatenHeroTimer > 0 ? (o.heroColorFactor = (o.heroColorFactor + 5) % 401, s = o.heroColorFactor <= 200 ? {
    r: 255,
    g: 255,
    b: o.heroColorFactor
   } : {
    r: 255,
    g: 255,
    b: 400 - o.heroColorFactor
   }) : s = o.color;
   for (var r = 0; r < o.cells.length; r++) {
    var i = o.cells[r];
    i.setColor(s);
   }
  }
 }
 if (this.spawnHeroTimer++, this.spawnHeroTimer >= this.spawnHeroInterval) {
  this.spawnHeroTimer = 0;
  for (var i = new Hero(e.getNextNodeId(), null); !this.spawnDrug(e, i););
 }
 if (this.spawnBrainTimer++, this.spawnBrainTimer >= this.spawnBrainInterval) {
  this.spawnBrainTimer = 0;
  for (var i = new Brain(e.getNextNodeId(), null); !this.spawnDrug(e, i););
 }
}, TeamZ.prototype.onCellAdd = function(e) {
 var t = e.owner;
 1 == t.cells.length && (t.team = t.pID, t.color = {
  r: e.color.r,
  g: e.color.g,
  b: e.color.b
 }, t.eatenBrainTimer = 0, t.eatenHeroTimer = 0, t.crazyTimer = 0, this.humans.push(t), this.state == GameState.IN_PROGRESS ? this.turnToZombie(t) : (t.color = this.defaultColor, e.setColor(this.defaultColor), t.team = 1));
}, TeamZ.prototype.onCellRemove = function(e) {
 var t = e.owner;
 if (0 == t.cells.length)
  if (0 == t.getTeam()) {
   var o = this.zombies.indexOf(t);
   o >= 0 && this.zombies.splice(o, 1);
  } else {
   var o = this.humans.indexOf(t);
   o >= 0 && this.humans.splice(o, 1);
  }
}, TeamZ.prototype.onCellMove = function(e, t, o) {
 for (var r = o.owner.getTeam(), i = o.getSize(), a = 0; a < o.owner.visibleNodes.length; a++) {
  var s = o.owner.visibleNodes[a];
  if (0 == s.getType() && o.owner != s.owner && !(this.hasEatenHero(s.owner) || this.hasEatenHero(o.owner) || 0 != s.owner.getTeam() && 0 != r)) {
   var n = s.getSize() + i;
   if (!o.simpleCollide(e, t, s, n)) continue;
   if (dist = o.getDist(o.position.x, o.position.y, s.position.x, s.position.y), dist < n) {
    var l = null;
    0 == s.owner.getTeam() && 0 != r ? l = o.owner : 0 == r && 0 != s.owner.getTeam() && (l = s.owner), null == l || this.isCrazy(l) || (l.crazyTimer = this.crazyDuration, l.colorToggle = 0, this.boostSpeed(l));
    var h = s.position.y - t,
     m = s.position.x - e,
     p = Math.atan2(m, h),
     c = n - dist;
    s.position.x = s.position.x + c * Math.sin(p) >> 0, s.position.y = s.position.y + c * Math.cos(p) >> 0;
   }
  }
 }
}, TeamZ.prototype.updateLB = function(e) {
 var t = e.leaderboard;
 switch (0 == this.winTeam ? (t.push("ZOMBIE WINS"), t.push("_______________")) : this.winTeam > 0 && (t.push("HUMAN WINS"), t.push("_______________")), this.state) {
  case GameState.WF_PLAYERS:
   t.push("WAITING FOR"), t.push("PLAYERS..."), t.push(this.humans.length + "/" + this.minPlayer);
   break;
  case GameState.WF_START:
   t.push("GAME STARTS IN:");
   var o = this.gameTimer / 20 / 60 >> 0,
    r = (this.gameTimer / 20 >> 0) % 60;
   t.push((10 > o ? "0" : "") + o + ":" + (10 > r ? "0" : "") + r);
   break;
  case GameState.IN_PROGRESS:
   var o = this.gameTimer / 20 / 60 >> 0,
    r = (this.gameTimer / 20 >> 0) % 60;
   t.push((10 > o ? "0" : "") + o + ":" + (10 > r ? "0" : "") + r), t.push("HUMAN: " + this.humans.length), t.push("ZOMBIE: " + this.zombies.length), t.push("_______________"), localLB = [];
   for (var i = 0; i < e.clients.length; i++)
    if ("undefined" != typeof e.clients[i] && 0 != e.clients[i].playerTracker.team) {
     var a = e.clients[i].playerTracker;
     if (!(a.cells.length <= 0)) {
      var s = a.getScore(!0);
      0 != localLB.length ? localLB.length < 6 ? this.leaderboardAddSort(a, localLB) : s > localLB[5].getScore(!1) && (localLB.pop(), this.leaderboardAddSort(a, localLB)) : localLB.push(a);
     }
    }
   for (var i = 0; i < localLB.length && t.length < 10; i++) t.push(localLB[i].getName());
   break;
  default:
   t.push("ERROR STATE");
 }
}, Hero.prototype = new Cell, Hero.prototype.getName = function() {
 return "HERO";
}, Hero.prototype.calcMove = null, Hero.prototype.onAdd = function(e) {
 e.gameMode.heroes.push(this);
}, Hero.prototype.onRemove = function(e) {
 var t = e.gameMode.heroes.indexOf(this); - 1 != t ? e.gameMode.heroes.splice(t, 1) : console.log("[Warning] Tried to remove a non existing HERO node!");
}, Hero.prototype.feed = function(e, t) {
 t.removeNode(e), this.setAngle(e.getAngle()), this.moveEngineTicks = 5, this.moveEngineSpeed = 60;
 var o = t.movingNodes.indexOf(this); - 1 == o && t.movingNodes.push(this);
}, Hero.prototype.onConsume = function(e, t) {
 var o = e.owner;
 if (e.addMass(this.mass), t.gameMode.isCrazy(o)) o.cured = !0;
 else {
  o.eatenHeroTimer = t.gameMode.heroEffectDuration, o.heroColorFactor = 0;
  for (var r = 0; r < o.cells.length; r++) {
   var i = o.cells[r];
   i.recombineTicks = 0;
  }
 }
}, Brain.prototype = new Cell, Brain.prototype.getName = function() {
 return "BRAIN";
}, Brain.prototype.calcMove = null, Brain.prototype.onAdd = function(e) {
 e.gameMode.brains.push(this);
}, Brain.prototype.onRemove = function(e) {
 var t = e.gameMode.brains.indexOf(this); - 1 != t ? e.gameMode.brains.splice(t, 1) : console.log("[Warning] Tried to remove a non existing BRAIN node!");
}, Brain.prototype.feed = function(e, t) {
 t.removeNode(e), this.setAngle(e.getAngle()), this.moveEngineTicks = 5, this.moveEngineSpeed = 60;
 var o = t.movingNodes.indexOf(this); - 1 == o && t.movingNodes.push(this);
}, Brain.prototype.onConsume = function(e, t) {
 var o = e.owner;
 e.addMass(this.mass), o.eatenBrainTimer = t.gameMode.brainEffectDuration, t.gameMode.boostSpeed(o);
};