function prompt() {
 in_.question(">", function(e) {
  return parseCommands(e), prompt();
 });
}

function parseCommands(e) {
 if (gameServer.log.onCommand(e), "" !== e) {
  var o = e.split(" "),
   n = o[0].toLowerCase(),
   r = gameServer.commands[n];
  "undefined" != typeof r ? r(gameServer, o) : console.log("[Console] Invalid Command!");
 }
}
var Commands = require("./modules/CommandList"),
 GameServer = require("./GameServer"),
 showConsole = !0;
console.log("[Game] Ogar - An open source Agar.io server implementation"), process.argv.forEach(function(e) {
 "--noconsole" == e ? showConsole = !1 : "--help" == e && (console.log("Proper Usage: node index.js"), console.log("    --noconsole         Disables the console"), console.log("    --help              Help menu."), console.log(""));
});
var gameServer = new GameServer;
if (gameServer.start(), gameServer.commands = Commands.list, showConsole) {
 var readline = require("readline"),
  in_ = readline.createInterface({
   input: process.stdin,
   output: process.stdout
  });
 setTimeout(prompt, 100);
}