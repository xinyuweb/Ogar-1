function encode(e, t)
{
  var r = [],
    n = "";
  "string" == typeof t ? t = {
    section: t,
    whitespace: !1
  } : (t = t ||
  {}, t.whitespace = t.whitespace === !0);
  var a = " = ";
  return Object.keys(e).forEach(function (t, i, o)
  {
    var c = e[t];
    c && Array.isArray(c) ? c.forEach(function (e)
    {
      n += safe(t + "[]") + a + safe(e) + "\n"
    }) : c && "object" == typeof c ? r.push(t) : n += safe(t) + a + safe(c) + eol
  }), t.section && n.length && (n = "[" + safe(t.section) + "]" + eol + n), r.forEach(function (r, a, i)
  {
    var o = dotSplit(r).join("\\."),
      c = (t.section ? t.section + "." : "") + o,
      s = encode(e[r],
      {
        section: c,
        whitespace: t.whitespace
      });
    n.length && s.length && (n += eol), n += s
  }), n
}

function dotSplit(e)
{
  return e.replace(/\1/g, "LITERAL\\1LITERAL").replace(/\\\./g, "").split(/\./).map(function (e)
  {
    return e.replace(/\1/g, "\\.").replace(/\2LITERAL\\1LITERAL\2/g, "")
  })
}

function decode(e)
{
  var t = {},
    r = t,
    n = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i,
    a = e.split(/[\r\n]+/g),
    i = null;
  return a.forEach(function (e, a, o)
  {
    if (e && !e.match(/^\s*[;#]/))
    {
      var c = e.match(n);
      if (c)
      {
        if (void 0 !== c[1]) return i = unsafe(c[1]), void(r = t[i] = t[i] ||
        {});
        var s = unsafe(c[2]),
          f = c[3] ? unsafe(c[4] || "") : !0;
        s.length > 2 && "[]" === s.slice(-2) && (s = s.substring(0, s.length - 2), r[s] ? Array.isArray(r[s]) || (r[s] = [r[s]]) : r[s] = []), isInt(f) ? r[s] = parseInt(f) : r[s] = parseFloat(f)
      }
    }
  }), Object.keys(t).filter(function (e, r, n)
  {
    if (!t[e] || "object" != typeof t[e] || Array.isArray(t[e])) return !1;
    var a = dotSplit(e),
      i = t,
      o = a.pop(),
      c = o.replace(/\\\./g, ".");
    return a.forEach(function (e, t, r)
    {
      i[e] && "object" == typeof i[e] || (i[e] = {}), i = i[e]
    }), i === t && c === o ? !1 : (i[c] = t[e], !0)
  }).forEach(function (e, r, n)
  {
    delete t[e]
  }), t
}

function isQuoted(e)
{
  return '"' === e.charAt(0) && '"' === e.slice(-1) || "'" === e.charAt(0) && "'" === e.slice(-1)
}

function safe(e)
{
  return "string" != typeof e || e.match(/[=\r\n]/) || e.match(/^\[/) || e.length > 1 && isQuoted(e) || e !== e.trim() ? JSON.stringify(e) : e.replace(/;/g, "\\;").replace(/#/g, "\\#")
}

function unsafe(e, t)
{
  if (e = (e || "").trim(), !isQuoted(e))
  {
    for (var r = !1, n = "", a = 0, i = e.length; i > a; a++)
    {
      var o = e.charAt(a);
      if (r) n += -1 !== "\\;#".indexOf(o) ? o : "\\" + o, r = !1;
      else
      {
        if (-1 !== ";#".indexOf(o)) break;
        "\\" === o ? r = !0 : n += o
      }
    }
    return r && (n += "\\"), n
  }
  "'" === e.charAt(0) && (e = e.substr(1, e.length - 2));
  try
  {
    e = JSON.parse(e)
  }
  catch (c)
  {}
  return e
}
exports.parse = exports.decode = decode, exports.stringify = exports.encode = encode, exports.safe = safe, exports.unsafe = unsafe;
var eol = "win32" === process.platform ? "\r\n" : "\n",
  isInt = function (e)
  {
    return parseInt(e) === e
  };