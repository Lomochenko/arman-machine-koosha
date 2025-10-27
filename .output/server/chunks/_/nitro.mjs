import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, void 0, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "db0404e6-bd83-40db-82ec-40dd173e6403",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {}
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await import('./error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const plugins = [
  
];

const assets = {
  "/css/plugins.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"c4e7-6VkS089+Q87d7bhfpWmo4COziIQ\"",
    "mtime": "2025-10-16T06:40:01.205Z",
    "size": 50407,
    "path": "../public/css/plugins.css"
  },
  "/css/style.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4325e-JL5w/ZoCT4Sw0zIxutcSyr9feUU\"",
    "mtime": "2025-10-23T13:51:26.845Z",
    "size": 275038,
    "path": "../public/css/style.css"
  },
  "/js/barba.min copy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7222-/Kq/iGM1pOl4ju53AzOX3LjtC2M\"",
    "mtime": "2023-10-27T18:06:25.000Z",
    "size": 29218,
    "path": "../public/js/barba.min copy.js"
  },
  "/js/gsap.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c08ad-9dW+MxcV78VOsXRAyxzn26vLw3o\"",
    "mtime": "2023-10-27T18:06:26.000Z",
    "size": 788653,
    "path": "../public/js/gsap.js"
  },
  "/js/jquery.min copy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15ec2-jbvSbhi4KCI6Un2eGIWACtjfzn4\"",
    "mtime": "2025-10-16T06:43:02.675Z",
    "size": 89794,
    "path": "../public/js/jquery.min copy.js"
  },
  "/js/plugins copy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44ea6-87XozFRIgkPh4fUuSE43rEp3u/s\"",
    "mtime": "2023-10-27T18:06:26.000Z",
    "size": 282278,
    "path": "../public/js/plugins copy.js"
  },
  "/js/scripts.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b4a3-G5Af1w7a+wQRqeopDsCYTkef8ac\"",
    "mtime": "2025-10-26T09:14:00.029Z",
    "size": 373923,
    "path": "../public/js/scripts.js"
  },
  "/robots.txt/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"766-fZ/p7rsDuXg0DV3ku4j6IMFQtBM\"",
    "mtime": "2025-10-26T09:15:16.610Z",
    "size": 1894,
    "path": "../public/robots.txt/index.html"
  },
  "/sitemap.xml/index.html": {
    "type": "text/html;charset=utf-8",
    "etag": "\"766-b/EYga2iHhBI2JngOqvXxGG36a0\"",
    "mtime": "2025-10-26T09:15:16.610Z",
    "size": 1894,
    "path": "../public/sitemap.xml/index.html"
  },
  "/_nuxt/7RyvCozT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"130a-0JwEVU0XPW+fWUQCUB9cPqNVQ/U\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 4874,
    "path": "../public/_nuxt/7RyvCozT.js"
  },
  "/_nuxt/agency_1.OWl4_xgw.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d34ae-sVX62zR8RN0ImUcLdnyVuJsm/JU\"",
    "mtime": "2025-10-26T09:15:14.294Z",
    "size": 2962606,
    "path": "../public/_nuxt/agency_1.OWl4_xgw.jpg"
  },
  "/_nuxt/agency_2.DBy_b6-z.jpg": {
    "type": "image/jpeg",
    "etag": "\"2191bf-KJXIiLG9lQvQmrr0Jt7Jlx3Wadg\"",
    "mtime": "2025-10-26T09:15:14.292Z",
    "size": 2199999,
    "path": "../public/_nuxt/agency_2.DBy_b6-z.jpg"
  },
  "/_nuxt/agency_3.B8e2ujoB.jpg": {
    "type": "image/jpeg",
    "etag": "\"2770c4-sY8e+LsmJDe78stRqra9DAkYNkI\"",
    "mtime": "2025-10-26T09:15:14.293Z",
    "size": 2584772,
    "path": "../public/_nuxt/agency_3.B8e2ujoB.jpg"
  },
  "/_nuxt/agency_4.CI7O5WXd.jpg": {
    "type": "image/jpeg",
    "etag": "\"2df542-MmOATe87vpNNNtinUIVKx6+du94\"",
    "mtime": "2025-10-26T09:15:14.294Z",
    "size": 3011906,
    "path": "../public/_nuxt/agency_4.CI7O5WXd.jpg"
  },
  "/_nuxt/agency_5.CV5IJlTG.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a1c68-WWqig9Mwcl9WfKubnp0+V4igvAA\"",
    "mtime": "2025-10-26T09:15:14.294Z",
    "size": 2759784,
    "path": "../public/_nuxt/agency_5.CV5IJlTG.jpg"
  },
  "/_nuxt/agency_6.DIT4oPHC.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d3275-G8/hZaalDucGzfrcXOoZ4NFyRrQ\"",
    "mtime": "2025-10-26T09:15:14.294Z",
    "size": 2962037,
    "path": "../public/_nuxt/agency_6.DIT4oPHC.jpg"
  },
  "/_nuxt/agency_mag.Be7mGWBd.jpg": {
    "type": "image/jpeg",
    "etag": "\"cb9a8-aeTVtEVVpoyTnD0H7onbrVHf8gE\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 833960,
    "path": "../public/_nuxt/agency_mag.Be7mGWBd.jpg"
  },
  "/_nuxt/ag_exp_vert_2.BCJp8lwr.jpg": {
    "type": "image/jpeg",
    "etag": "\"8adce-yOxgixnW9M7dtjxmMabebIm4rKE\"",
    "mtime": "2025-10-26T09:15:14.283Z",
    "size": 568782,
    "path": "../public/_nuxt/ag_exp_vert_2.BCJp8lwr.jpg"
  },
  "/_nuxt/ag_exp_vert_3.Bro8O2nj.jpg": {
    "type": "image/jpeg",
    "etag": "\"12f7ed-yo2CTVp2SFQjzYOsvU4j5vMn6VM\"",
    "mtime": "2025-10-26T09:15:14.287Z",
    "size": 1243117,
    "path": "../public/_nuxt/ag_exp_vert_3.Bro8O2nj.jpg"
  },
  "/_nuxt/ag_exp_vert_5.D54O1Hhh.jpg": {
    "type": "image/jpeg",
    "etag": "\"8eb1a-ED6XLNPIWgh+QLoPWmoqIKXwBIA\"",
    "mtime": "2025-10-26T09:15:14.283Z",
    "size": 584474,
    "path": "../public/_nuxt/ag_exp_vert_5.D54O1Hhh.jpg"
  },
  "/_nuxt/architexture_1.BTZ_uu7v.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b1960-D2TWq3ciAnlDwSXubh79i9YZ+QY\"",
    "mtime": "2025-10-26T09:15:14.295Z",
    "size": 2824544,
    "path": "../public/_nuxt/architexture_1.BTZ_uu7v.jpg"
  },
  "/_nuxt/austeria_featured.ELuEf0WJ.jpg": {
    "type": "image/jpeg",
    "etag": "\"331dc0-T3RL3DisuB/kHJKKvvG6n8Vm/m0\"",
    "mtime": "2025-10-26T09:15:14.295Z",
    "size": 3349952,
    "path": "../public/_nuxt/austeria_featured.ELuEf0WJ.jpg"
  },
  "/_nuxt/BaFOgMyR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d3e-0LC8dbp7C+fgwEdDB4yo1tJ/HoY\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 3390,
    "path": "../public/_nuxt/BaFOgMyR.js"
  },
  "/_nuxt/beach-brown_8.CEdLJSfM.jpg": {
    "type": "image/jpeg",
    "etag": "\"c3c58-zCDGPD+tvp8mD0SGgO5kazS1N+A\"",
    "mtime": "2025-10-26T09:15:14.284Z",
    "size": 801880,
    "path": "../public/_nuxt/beach-brown_8.CEdLJSfM.jpg"
  },
  "/_nuxt/Bl2igZ3b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"497e-M6kJlZa67UKO5dfGeyfNUTqj8uo\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 18814,
    "path": "../public/_nuxt/Bl2igZ3b.js"
  },
  "/_nuxt/BSwJTqP5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b0-4te2LBw/LyoSELnoDoaqG/E8exE\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 176,
    "path": "../public/_nuxt/BSwJTqP5.js"
  },
  "/_nuxt/BwvCgwC9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"74c-hdpGu9oxhwKTPYooZO2m/mKL8PI\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 1868,
    "path": "../public/_nuxt/BwvCgwC9.js"
  },
  "/_nuxt/C4xAA6ng.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"332-fna5w4lCekFM08KeJ3qjXIKBn2w\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 818,
    "path": "../public/_nuxt/C4xAA6ng.js"
  },
  "/_nuxt/curology_featured.BPQnE4Rt.jpg": {
    "type": "image/jpeg",
    "etag": "\"c570c-7StRTXP4WdsSbIrxgEHcnCqoLeo\"",
    "mtime": "2025-10-26T09:15:14.284Z",
    "size": 808716,
    "path": "../public/_nuxt/curology_featured.BPQnE4Rt.jpg"
  },
  "/_nuxt/CWFr9gdd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1df-Eo87inJpP+5IZ6sI65ndsZyVpWU\"",
    "mtime": "2025-10-26T09:15:14.229Z",
    "size": 479,
    "path": "../public/_nuxt/CWFr9gdd.js"
  },
  "/_nuxt/D4uvX1PV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"77fcf-kgFBuw9k8zCo2VlEZQLHv4Tz6P8\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 491471,
    "path": "../public/_nuxt/D4uvX1PV.js"
  },
  "/_nuxt/default.XsDKNeHo.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18c-udQ8yJ3prlf/CdMQlt/ejA65X74\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 396,
    "path": "../public/_nuxt/default.XsDKNeHo.css"
  },
  "/_nuxt/DeWE24Vq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"e95-BTpU8D3gGPswq8+ySxioBdqTeQo\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 3733,
    "path": "../public/_nuxt/DeWE24Vq.js"
  },
  "/_nuxt/en-vogue_fetured.DumKBMgy.jpg": {
    "type": "image/jpeg",
    "etag": "\"104e42-yT+W5gjLcxoRAdffub4zwlc5fcM\"",
    "mtime": "2025-10-26T09:15:14.288Z",
    "size": 1068610,
    "path": "../public/_nuxt/en-vogue_fetured.DumKBMgy.jpg"
  },
  "/_nuxt/entry.B6BHf5GY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"33066-+LBBiM0UpPhrUkl/abCPKmtQda8\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 208998,
    "path": "../public/_nuxt/entry.B6BHf5GY.css"
  },
  "/_nuxt/error-404.MksMKVWr.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"de0-LSCwt9IHC/XN7jyt2ge89hKLY3g\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 3552,
    "path": "../public/_nuxt/error-404.MksMKVWr.css"
  },
  "/_nuxt/error-500.DOWD7OuR.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"75a-E+EckUQEwkK5PkutZwCZNTJkHsY\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 1882,
    "path": "../public/_nuxt/error-500.DOWD7OuR.css"
  },
  "/_nuxt/gtZPGZRG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"490e-k5xtvUxA9AF98RLRZG2xzRohEY4\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 18702,
    "path": "../public/_nuxt/gtZPGZRG.js"
  },
  "/_nuxt/immersive_realities_featured.BsOhKcs6.jpg": {
    "type": "image/jpeg",
    "etag": "\"12b67d-0Z/g3ZMmuk2quBQ/UpSTVu5qv9Y\"",
    "mtime": "2025-10-26T09:15:14.288Z",
    "size": 1226365,
    "path": "../public/_nuxt/immersive_realities_featured.BsOhKcs6.jpg"
  },
  "/_nuxt/ink-sense_featured.CDxfE6Eo.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e64a-2HW5z4y5X7+bN86OmJhGCzfj8wc\"",
    "mtime": "2025-10-26T09:15:14.278Z",
    "size": 386634,
    "path": "../public/_nuxt/ink-sense_featured.CDxfE6Eo.jpg"
  },
  "/_nuxt/lcdsxGQ7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d90c-kz/2v684573jQyHYKsEfoR6onhw\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 55564,
    "path": "../public/_nuxt/lcdsxGQ7.js"
  },
  "/_nuxt/lifes-stories_11.DeZnl8-X.jpg": {
    "type": "image/jpeg",
    "etag": "\"1292b5-eerVzWJWy5QTEIa57JmmgYceG4k\"",
    "mtime": "2025-10-26T09:15:14.288Z",
    "size": 1217205,
    "path": "../public/_nuxt/lifes-stories_11.DeZnl8-X.jpg"
  },
  "/_nuxt/los-coyotes_featured.DJV4jpDc.jpg": {
    "type": "image/jpeg",
    "etag": "\"2105c8-IqXGZ+cqxxWZTWGAXYB7DyQcauA\"",
    "mtime": "2025-10-26T09:15:14.293Z",
    "size": 2164168,
    "path": "../public/_nuxt/los-coyotes_featured.DJV4jpDc.jpg"
  },
  "/_nuxt/nuzEVaVz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"30c-MKtkQAU7aLNQp1npeHHJj36iXXA\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 780,
    "path": "../public/_nuxt/nuzEVaVz.js"
  },
  "/_nuxt/nyc_streetlife-7.CD9v3aEh.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dad9a-3cLlbw7b9PkLGedQwCBxtqFDpQg\"",
    "mtime": "2025-10-26T09:15:14.291Z",
    "size": 1944986,
    "path": "../public/_nuxt/nyc_streetlife-7.CD9v3aEh.jpg"
  },
  "/_nuxt/office_1.C6FJybv2.jpg": {
    "type": "image/jpeg",
    "etag": "\"d6a81-1HtpLpOF04+0y+1pecz+TmxCOPM\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 879233,
    "path": "../public/_nuxt/office_1.C6FJybv2.jpg"
  },
  "/_nuxt/office_3.DkZDWyaG.jpg": {
    "type": "image/jpeg",
    "etag": "\"b139d-TPGFjtb3kMNi8xfiqqdzkRlUdHc\"",
    "mtime": "2025-10-26T09:15:14.283Z",
    "size": 725917,
    "path": "../public/_nuxt/office_3.DkZDWyaG.jpg"
  },
  "/_nuxt/pastel-ladies_7.BoINNLVA.jpg": {
    "type": "image/jpeg",
    "etag": "\"1df52c-GEoC9Gdt8gUyTHnBaHaqLTTNgik\"",
    "mtime": "2025-10-26T09:15:14.292Z",
    "size": 1963308,
    "path": "../public/_nuxt/pastel-ladies_7.BoINNLVA.jpg"
  },
  "/_nuxt/percent_19.CzOyKk4T.jpg": {
    "type": "image/jpeg",
    "etag": "\"11a202-6mzWAvWB/9x9hDsapzrNi3afjXg\"",
    "mtime": "2025-10-26T09:15:14.288Z",
    "size": 1155586,
    "path": "../public/_nuxt/percent_19.CzOyKk4T.jpg"
  },
  "/_nuxt/photog_contact.BmEuSYOE.jpg": {
    "type": "image/jpeg",
    "etag": "\"125bc1-CRy63MkP0z/QpBKyRfZZIjV2vhc\"",
    "mtime": "2025-10-26T09:15:14.287Z",
    "size": 1203137,
    "path": "../public/_nuxt/photog_contact.BmEuSYOE.jpg"
  },
  "/_nuxt/primo_featured.129C5_eQ.jpg": {
    "type": "image/jpeg",
    "etag": "\"16293c-FudFeELQcXD7mJajfQ7EEHid52Q\"",
    "mtime": "2025-10-26T09:15:14.288Z",
    "size": 1452348,
    "path": "../public/_nuxt/primo_featured.129C5_eQ.jpg"
  },
  "/_nuxt/sauz-hothoney_10.3gddB1pQ.jpg": {
    "type": "image/jpeg",
    "etag": "\"23224c-8s1FcAVJvAUQ4IJbV+yQIw402fQ\"",
    "mtime": "2025-10-26T09:15:14.293Z",
    "size": 2302540,
    "path": "../public/_nuxt/sauz-hothoney_10.3gddB1pQ.jpg"
  },
  "/_nuxt/soul_of_structure_featured.DdlmILJ4.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fb85-jltjMFQlsQU1mIIeHuZvDsB8nlY\"",
    "mtime": "2025-10-26T09:15:14.295Z",
    "size": 2751365,
    "path": "../public/_nuxt/soul_of_structure_featured.DdlmILJ4.jpg"
  },
  "/_nuxt/spirits-of-illusion_featured.BaFZSFri.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f0fe5-y3mQFD5UDLqfrOgZqPzKjqIOK/0\"",
    "mtime": "2025-10-26T09:15:14.295Z",
    "size": 3084261,
    "path": "../public/_nuxt/spirits-of-illusion_featured.BaFZSFri.jpg"
  },
  "/_nuxt/taller_23.CVHFDagF.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f7ff0-y08Rz54r733a18YhIokro03E6rM\"",
    "mtime": "2025-10-26T09:15:14.292Z",
    "size": 2064368,
    "path": "../public/_nuxt/taller_23.CVHFDagF.jpg"
  },
  "/_nuxt/team_member_1.BaXunEMr.jpg": {
    "type": "image/jpeg",
    "etag": "\"9275b-bwvZXqGcBnpjGMRYR3jQJ6pd3fA\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 599899,
    "path": "../public/_nuxt/team_member_1.BaXunEMr.jpg"
  },
  "/_nuxt/team_member_2.CgtOvwGZ.jpg": {
    "type": "image/jpeg",
    "etag": "\"5bac9-duAuHnpafdYlA3nqkBWLrSmdjvs\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 375497,
    "path": "../public/_nuxt/team_member_2.CgtOvwGZ.jpg"
  },
  "/_nuxt/team_member_3.CD7bxNBg.jpg": {
    "type": "image/jpeg",
    "etag": "\"78390-i9T+U2/gc5i3pfB5x+nRNfddydU\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 492432,
    "path": "../public/_nuxt/team_member_3.CD7bxNBg.jpg"
  },
  "/_nuxt/team_member_4.CWD0M4Px.jpg": {
    "type": "image/jpeg",
    "etag": "\"572b8-l5kpKDopoxwFNNL08fgfSrPUahw\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 357048,
    "path": "../public/_nuxt/team_member_4.CWD0M4Px.jpg"
  },
  "/_nuxt/team_member_5.CPGUS7ou.jpg": {
    "type": "image/jpeg",
    "etag": "\"6e429-ilf6E8PQy0QNHLWuY5HZsJjnDHo\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 451625,
    "path": "../public/_nuxt/team_member_5.CPGUS7ou.jpg"
  },
  "/_nuxt/team_member_6.AMzoPvoY.jpg": {
    "type": "image/jpeg",
    "etag": "\"82b1b-SsfoRw13xGwmEguAvc/1Pgfvp1E\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 535323,
    "path": "../public/_nuxt/team_member_6.AMzoPvoY.jpg"
  },
  "/_nuxt/team_member_7.CltOBSbm.jpg": {
    "type": "image/jpeg",
    "etag": "\"8b472-3S5fIFtWbFDTibDNmkEwDYOccAg\"",
    "mtime": "2025-10-26T09:15:14.282Z",
    "size": 570482,
    "path": "../public/_nuxt/team_member_7.CltOBSbm.jpg"
  },
  "/_nuxt/team_member_8.D1a1FS-Z.jpg": {
    "type": "image/jpeg",
    "etag": "\"5c376-IF25hufmjJ+tIJ9LPnlI8xuGJL4\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 377718,
    "path": "../public/_nuxt/team_member_8.D1a1FS-Z.jpg"
  },
  "/_nuxt/test_avatar_1.nCEldxaC.jpg": {
    "type": "image/jpeg",
    "etag": "\"2aa2-899rJ81ZVqMBnOxL0m7HCx8yk7A\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 10914,
    "path": "../public/_nuxt/test_avatar_1.nCEldxaC.jpg"
  },
  "/_nuxt/test_avatar_2.B8e6uBrp.jpg": {
    "type": "image/jpeg",
    "etag": "\"27fd-U3kPu8E2cC3ZnrqD5RDhGJ7j6DI\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 10237,
    "path": "../public/_nuxt/test_avatar_2.B8e6uBrp.jpg"
  },
  "/_nuxt/test_avatar_3.ClVH0Wfd.jpg": {
    "type": "image/jpeg",
    "etag": "\"259f-Yu1eJJBDn6qvELeyhNNWnVl70rk\"",
    "mtime": "2025-10-26T09:15:14.276Z",
    "size": 9631,
    "path": "../public/_nuxt/test_avatar_3.ClVH0Wfd.jpg"
  },
  "/_nuxt/vibrant-horizons_featured.0IA1Xtky.jpg": {
    "type": "image/jpeg",
    "etag": "\"266dc5-Myx8JfUSmMcRDXUOYiXprl30Lhc\"",
    "mtime": "2025-10-26T09:15:14.293Z",
    "size": 2518469,
    "path": "../public/_nuxt/vibrant-horizons_featured.0IA1Xtky.jpg"
  },
  "/_nuxt/_...C28P-SaS.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e-Zek/yeJRbUsjkT6+tce6FFjXxIY\"",
    "mtime": "2025-10-26T09:15:14.281Z",
    "size": 142,
    "path": "../public/_nuxt/_...C28P-SaS.css"
  },
  "/js/js/barba.min.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7222-/Kq/iGM1pOl4ju53AzOX3LjtC2M\"",
    "mtime": "2023-10-27T18:06:25.000Z",
    "size": 29218,
    "path": "../public/js/js/barba.min.js"
  },
  "/js/js/gsap.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"c08ad-9dW+MxcV78VOsXRAyxzn26vLw3o\"",
    "mtime": "2023-10-27T18:06:26.000Z",
    "size": 788653,
    "path": "../public/js/js/gsap.js"
  },
  "/js/js/jquery.min.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"15ec2-jbvSbhi4KCI6Un2eGIWACtjfzn4\"",
    "mtime": "2025-10-16T06:43:02.675Z",
    "size": 89794,
    "path": "../public/js/js/jquery.min.js"
  },
  "/js/js/plugins.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"44ea6-87XozFRIgkPh4fUuSE43rEp3u/s\"",
    "mtime": "2023-10-27T18:06:26.000Z",
    "size": 282278,
    "path": "../public/js/js/plugins.js"
  },
  "/js/js/scripts.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5b517-dv3hVSDUnxKLjHCJyT54CMG1SN8\"",
    "mtime": "2025-10-16T12:11:18.349Z",
    "size": 374039,
    "path": "../public/js/js/scripts.js"
  },
  "/img/img/agency_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d34ae-sVX62zR8RN0ImUcLdnyVuJsm/JU\"",
    "mtime": "2023-10-27T18:00:19.000Z",
    "size": 2962606,
    "path": "../public/img/img/agency_1.jpg"
  },
  "/img/img/agency_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"2191bf-KJXIiLG9lQvQmrr0Jt7Jlx3Wadg\"",
    "mtime": "2023-10-27T18:00:30.000Z",
    "size": 2199999,
    "path": "../public/img/img/agency_2.jpg"
  },
  "/img/img/agency_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2770c4-sY8e+LsmJDe78stRqra9DAkYNkI\"",
    "mtime": "2023-10-27T18:00:35.000Z",
    "size": 2584772,
    "path": "../public/img/img/agency_3.jpg"
  },
  "/img/img/agency_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"2df542-MmOATe87vpNNNtinUIVKx6+du94\"",
    "mtime": "2023-10-27T18:00:11.000Z",
    "size": 3011906,
    "path": "../public/img/img/agency_4.jpg"
  },
  "/img/img/agency_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"2a1c68-WWqig9Mwcl9WfKubnp0+V4igvAA\"",
    "mtime": "2023-10-27T18:00:19.000Z",
    "size": 2759784,
    "path": "../public/img/img/agency_5.jpg"
  },
  "/img/img/agency_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"2d3275-G8/hZaalDucGzfrcXOoZ4NFyRrQ\"",
    "mtime": "2023-10-27T18:00:11.000Z",
    "size": 2962037,
    "path": "../public/img/img/agency_6.jpg"
  },
  "/img/img/agency_bw.jpg": {
    "type": "image/jpeg",
    "etag": "\"180cd6-yGV8k4rPHK7wlVcp2K9i5fu2zbY\"",
    "mtime": "2023-10-27T18:01:26.000Z",
    "size": 1576150,
    "path": "../public/img/img/agency_bw.jpg"
  },
  "/img/img/agency_cntct.jpg": {
    "type": "image/jpeg",
    "etag": "\"18f424-3EhpWYvGikQGISnrTc43+P+S8Dc\"",
    "mtime": "2023-10-27T18:01:03.000Z",
    "size": 1635364,
    "path": "../public/img/img/agency_cntct.jpg"
  },
  "/img/img/agency_mag.jpg": {
    "type": "image/jpeg",
    "etag": "\"cb9a8-aeTVtEVVpoyTnD0H7onbrVHf8gE\"",
    "mtime": "2023-10-27T18:01:27.000Z",
    "size": 833960,
    "path": "../public/img/img/agency_mag.jpg"
  },
  "/img/img/agency_vertical.jpg": {
    "type": "image/jpeg",
    "etag": "\"15b528-IXpqt9qD2KgcB2ehzPWygAHnEuo\"",
    "mtime": "2023-10-27T18:00:39.000Z",
    "size": 1422632,
    "path": "../public/img/img/agency_vertical.jpg"
  },
  "/img/img/agency_vertical_bw.jpg": {
    "type": "image/jpeg",
    "etag": "\"aef62-VyeqKL358J/GENa0Amn7lrQOHB8\"",
    "mtime": "2023-10-27T18:01:27.000Z",
    "size": 716642,
    "path": "../public/img/img/agency_vertical_bw.jpg"
  },
  "/img/img/agency_wide.jpg": {
    "type": "image/jpeg",
    "etag": "\"28de8c-3b35kBi6dwP7W2ubpoTnR7oXPrM\"",
    "mtime": "2023-10-27T18:01:25.000Z",
    "size": 2678412,
    "path": "../public/img/img/agency_wide.jpg"
  },
  "/img/img/ag_creative-dark_hd.jpg": {
    "type": "image/jpeg",
    "etag": "\"cdb4f-qnOUBB00/njDq/29/lq9TgYbIV8\"",
    "mtime": "2023-10-27T18:00:09.000Z",
    "size": 842575,
    "path": "../public/img/img/ag_creative-dark_hd.jpg"
  },
  "/img/img/ag_exp_hor_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"df9e6-aiVgOpQeitVkH1mqUA42RAcE/OM\"",
    "mtime": "2023-10-27T18:00:30.000Z",
    "size": 915942,
    "path": "../public/img/img/ag_exp_hor_3.jpg"
  },
  "/img/img/ag_exp_hor_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"9bcdd-FsDvmECYMU7s3zH5LP9CSFNhgtw\"",
    "mtime": "2023-10-27T18:00:16.000Z",
    "size": 638173,
    "path": "../public/img/img/ag_exp_hor_4.jpg"
  },
  "/img/img/ag_exp_hor_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"4db00-jIG5o5zAaqARlo2vT/XFzUlE1kI\"",
    "mtime": "2023-10-27T18:00:13.000Z",
    "size": 318208,
    "path": "../public/img/img/ag_exp_hor_5.jpg"
  },
  "/img/img/ag_exp_squ_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"101f1b-fjO1mqSyWKDVBMxluMf6M8tmtQY\"",
    "mtime": "2023-10-27T18:01:04.000Z",
    "size": 1056539,
    "path": "../public/img/img/ag_exp_squ_1.jpg"
  },
  "/img/img/ag_exp_squ_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"84666-hM2G4BSAWFek7y3UKFAnnBFa9Cc\"",
    "mtime": "2023-10-27T18:01:10.000Z",
    "size": 542310,
    "path": "../public/img/img/ag_exp_squ_2.jpg"
  },
  "/img/img/ag_exp_squ_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"10a86a-/iED4Wi/v7lpXTPI5J2cviDI7rk\"",
    "mtime": "2023-10-27T18:01:15.000Z",
    "size": 1091690,
    "path": "../public/img/img/ag_exp_squ_3.jpg"
  },
  "/img/img/ag_exp_squ_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1192ee-WU/baLGvQZzVIomTU68XpcAKI7M\"",
    "mtime": "2023-10-27T18:01:26.000Z",
    "size": 1151726,
    "path": "../public/img/img/ag_exp_squ_5.jpg"
  },
  "/img/img/ag_exp_squ_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"6fea5-G2ZHBOK0wx5ZrMb9dgY1KI42zr4\"",
    "mtime": "2023-10-27T18:01:21.000Z",
    "size": 458405,
    "path": "../public/img/img/ag_exp_squ_6.jpg"
  },
  "/img/img/ag_exp_vert.jpg": {
    "type": "image/jpeg",
    "etag": "\"7a9a3-+xZ+7xaC5CMWlczuN4Mqh1ksDck\"",
    "mtime": "2023-10-27T18:00:24.000Z",
    "size": 502179,
    "path": "../public/img/img/ag_exp_vert.jpg"
  },
  "/img/img/ag_exp_vert_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"8adce-yOxgixnW9M7dtjxmMabebIm4rKE\"",
    "mtime": "2023-10-27T18:01:16.000Z",
    "size": 568782,
    "path": "../public/img/img/ag_exp_vert_2.jpg"
  },
  "/img/img/ag_exp_vert_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"12f7ed-yo2CTVp2SFQjzYOsvU4j5vMn6VM\"",
    "mtime": "2023-10-27T18:01:20.000Z",
    "size": 1243117,
    "path": "../public/img/img/ag_exp_vert_3.jpg"
  },
  "/img/img/ag_exp_vert_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"8eb1a-ED6XLNPIWgh+QLoPWmoqIKXwBIA\"",
    "mtime": "2023-10-27T18:01:09.000Z",
    "size": 584474,
    "path": "../public/img/img/ag_exp_vert_5.jpg"
  },
  "/img/img/ag_exp_vert_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"2e6654-M6J7JblLiq5SItfzLgKKRtP9HEw\"",
    "mtime": "2023-10-27T18:01:11.000Z",
    "size": 3040852,
    "path": "../public/img/img/ag_exp_vert_7.jpg"
  },
  "/img/img/ag_exp_vert_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"655ad-6uby8NNxDwYLct/ScwCJV8zz/yo\"",
    "mtime": "2023-10-27T18:00:53.000Z",
    "size": 415149,
    "path": "../public/img/img/ag_exp_vert_8.jpg"
  },
  "/img/img/app_vid.mp4": {
    "type": "video/mp4",
    "etag": "\"598808-F+1AE8oKPAWGaUObm8LPCIZOvlc\"",
    "mtime": "2023-10-27T18:00:41.000Z",
    "size": 5867528,
    "path": "../public/img/img/app_vid.mp4"
  },
  "/img/img/app_vid_2.mp4": {
    "type": "video/mp4",
    "etag": "\"5447b2-g9Vt0XNFNmxRgZW3J9bW5ZYcAxw\"",
    "mtime": "2023-10-27T18:00:58.000Z",
    "size": 5523378,
    "path": "../public/img/img/app_vid_2.mp4"
  },
  "/img/img/arch_head.mp4": {
    "type": "video/mp4",
    "etag": "\"48e676-9FyI7vk6fD3f47+Sq4tcrLT8sAI\"",
    "mtime": "2023-10-27T18:00:56.000Z",
    "size": 4777590,
    "path": "../public/img/img/arch_head.mp4"
  },
  "/img/img/client_10_dark.png": {
    "type": "image/png",
    "etag": "\"543-7+a8tNav8dxiXYz1fh98FZBdGls\"",
    "mtime": "2023-10-27T18:00:27.000Z",
    "size": 1347,
    "path": "../public/img/img/client_10_dark.png"
  },
  "/img/img/client_11_dark.png": {
    "type": "image/png",
    "etag": "\"c91-79DPyM0sLdsAVRcyWqNUNlOBTqo\"",
    "mtime": "2023-10-27T18:00:27.000Z",
    "size": 3217,
    "path": "../public/img/img/client_11_dark.png"
  },
  "/img/img/client_11_light.png": {
    "type": "image/png",
    "etag": "\"be9-cbyAdcgPoXILirQIUYwNv92U11E\"",
    "mtime": "2023-10-27T18:01:33.000Z",
    "size": 3049,
    "path": "../public/img/img/client_11_light.png"
  },
  "/img/img/client_12_dark.png": {
    "type": "image/png",
    "etag": "\"6e0-ph3i3zkD2GAqUOI4tH4NNAxNat0\"",
    "mtime": "2023-10-27T18:01:16.000Z",
    "size": 1760,
    "path": "../public/img/img/client_12_dark.png"
  },
  "/img/img/client_13_dark.png": {
    "type": "image/png",
    "etag": "\"2a6-4czCPFydPHG+UweYJNf352HaX00\"",
    "mtime": "2023-10-27T18:01:16.000Z",
    "size": 678,
    "path": "../public/img/img/client_13_dark.png"
  },
  "/img/img/client_14_dark.png": {
    "type": "image/png",
    "etag": "\"874-on5jxTnRmwNsqj6kSWQyYZCNUDw\"",
    "mtime": "2023-10-27T18:01:42.000Z",
    "size": 2164,
    "path": "../public/img/img/client_14_dark.png"
  },
  "/img/img/client_15_dark.png": {
    "type": "image/png",
    "etag": "\"154-L4wPum980iXEPvBGZlwzi08x4Fs\"",
    "mtime": "2023-10-27T18:01:42.000Z",
    "size": 340,
    "path": "../public/img/img/client_15_dark.png"
  },
  "/img/img/client_16_dark.png": {
    "type": "image/png",
    "etag": "\"9ae-DVRNAjd064W5nxy4IFqEoFaMdEc\"",
    "mtime": "2023-10-27T18:00:41.000Z",
    "size": 2478,
    "path": "../public/img/img/client_16_dark.png"
  },
  "/img/img/client_1_dark.png": {
    "type": "image/png",
    "etag": "\"9e2-odFDGospjolfDKM6NyLbPFgNakQ\"",
    "mtime": "2023-10-27T18:01:08.000Z",
    "size": 2530,
    "path": "../public/img/img/client_1_dark.png"
  },
  "/img/img/client_1_light.png": {
    "type": "image/png",
    "etag": "\"996-2ajTIz0Q5hsREDHj3Te++yuJs6Q\"",
    "mtime": "2023-10-27T18:00:40.000Z",
    "size": 2454,
    "path": "../public/img/img/client_1_light.png"
  },
  "/img/img/client_2_dark.png": {
    "type": "image/png",
    "etag": "\"9bf-sFqrCX40/B0pZcQ0+8bBLbsMUYY\"",
    "mtime": "2023-10-27T18:00:34.000Z",
    "size": 2495,
    "path": "../public/img/img/client_2_dark.png"
  },
  "/img/img/client_2_light.png": {
    "type": "image/png",
    "etag": "\"9cd-wd4THLk4+QxV1htxtEdFfInpyZ4\"",
    "mtime": "2023-10-27T18:01:04.000Z",
    "size": 2509,
    "path": "../public/img/img/client_2_light.png"
  },
  "/img/img/client_3_dark.png": {
    "type": "image/png",
    "etag": "\"44f-iPtwUFyDBM5XaRf3PZg112Nj/ng\"",
    "mtime": "2023-10-27T18:00:33.000Z",
    "size": 1103,
    "path": "../public/img/img/client_3_dark.png"
  },
  "/img/img/client_3_light.png": {
    "type": "image/png",
    "etag": "\"44f-R3uBUk1urPL+0XCagsbYWj0tCpc\"",
    "mtime": "2023-10-27T18:01:27.000Z",
    "size": 1103,
    "path": "../public/img/img/client_3_light.png"
  },
  "/img/img/client_4_dark.png": {
    "type": "image/png",
    "etag": "\"65c-PLGgBvx6eGJYqorpRo42i0RvOBI\"",
    "mtime": "2023-10-27T18:00:49.000Z",
    "size": 1628,
    "path": "../public/img/img/client_4_dark.png"
  },
  "/img/img/client_4_light.png": {
    "type": "image/png",
    "etag": "\"61e-AXWxZE0IjXa0g/T7eUIQgcn48wo\"",
    "mtime": "2023-10-27T18:01:19.000Z",
    "size": 1566,
    "path": "../public/img/img/client_4_light.png"
  },
  "/img/img/client_5_dark.png": {
    "type": "image/png",
    "etag": "\"51f-h92qNvg3WeL39DsI5+sJSFoh/Ns\"",
    "mtime": "2023-10-27T18:00:49.000Z",
    "size": 1311,
    "path": "../public/img/img/client_5_dark.png"
  },
  "/img/img/client_5_light.png": {
    "type": "image/png",
    "etag": "\"51f-P0NKjEubo966UE9SA6AjoQw38/A\"",
    "mtime": "2023-10-27T18:01:38.000Z",
    "size": 1311,
    "path": "../public/img/img/client_5_light.png"
  },
  "/img/img/client_6_dark.png": {
    "type": "image/png",
    "etag": "\"bd6-P6UxCZWm029/r7bN45+fOC3F9LY\"",
    "mtime": "2023-10-27T18:01:37.000Z",
    "size": 3030,
    "path": "../public/img/img/client_6_dark.png"
  },
  "/img/img/client_6_light.png": {
    "type": "image/png",
    "etag": "\"b4f-nNCfzRRn+EtaPlnW4RPb0vFa3AA\"",
    "mtime": "2023-10-27T18:00:20.000Z",
    "size": 2895,
    "path": "../public/img/img/client_6_light.png"
  },
  "/img/img/client_7_dark.png": {
    "type": "image/png",
    "etag": "\"3ec-C/ij2xNFFFP7ybuQ+seBjsBVLrw\"",
    "mtime": "2023-10-27T18:01:36.000Z",
    "size": 1004,
    "path": "../public/img/img/client_7_dark.png"
  },
  "/img/img/client_8_dark.png": {
    "type": "image/png",
    "etag": "\"362-QYQrdT5mFanpNB7ovz85M/E66ro\"",
    "mtime": "2023-10-27T18:00:27.000Z",
    "size": 866,
    "path": "../public/img/img/client_8_dark.png"
  },
  "/img/img/client_8_light.png": {
    "type": "image/png",
    "etag": "\"362-LfJhv7r7k+UMju22bkaT8Hb4zLI\"",
    "mtime": "2023-10-27T18:01:42.000Z",
    "size": 866,
    "path": "../public/img/img/client_8_light.png"
  },
  "/img/img/client_9_dark.png": {
    "type": "image/png",
    "etag": "\"384-LTMbHuwlKRgyHgB2HYvey488jFo\"",
    "mtime": "2023-10-27T18:00:27.000Z",
    "size": 900,
    "path": "../public/img/img/client_9_dark.png"
  },
  "/img/img/coming-soon-bg.jpg": {
    "type": "image/jpeg",
    "etag": "\"10c955-O3Rj4Te7M2ncLtrGa6vCPGenCYY\"",
    "mtime": "2023-10-27T18:00:44.000Z",
    "size": 1100117,
    "path": "../public/img/img/coming-soon-bg.jpg"
  },
  "/img/img/digital_ag_2.mp4": {
    "type": "video/mp4",
    "etag": "\"535ddb-UNQm0Qi4H6vGkNXE00qBF6Bu9Kk\"",
    "mtime": "2023-10-27T18:00:36.000Z",
    "size": 5463515,
    "path": "../public/img/img/digital_ag_2.mp4"
  },
  "/img/img/fs_pers_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"39700c-kFinOwGBjWZ3HZwbZuFlduYGpr4\"",
    "mtime": "2023-10-27T18:01:14.000Z",
    "size": 3764236,
    "path": "../public/img/img/fs_pers_1.jpg"
  },
  "/img/img/home-shop-1.mp4": {
    "type": "video/mp4",
    "etag": "\"78e006-4F5Uaf/V3XmS/XJfvBy58v7EaA8\"",
    "mtime": "2023-10-27T18:00:48.000Z",
    "size": 7921670,
    "path": "../public/img/img/home-shop-1.mp4"
  },
  "/img/img/home-shop-2.mp4": {
    "type": "video/mp4",
    "etag": "\"2eb3c4-T9E1MBnUBzVO4wI3jahc7X9kjjc\"",
    "mtime": "2023-10-27T18:00:38.000Z",
    "size": 3060676,
    "path": "../public/img/img/home-shop-2.mp4"
  },
  "/img/img/home_corporate_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"191656-tRQ1dKBxMKgrXh+QL3KDoN7HxiY\"",
    "mtime": "2023-10-27T18:00:12.000Z",
    "size": 1644118,
    "path": "../public/img/img/home_corporate_1.jpg"
  },
  "/img/img/home_corporate_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"770e7-QDpgqWebRGJSKLr7siNxk0OcRgs\"",
    "mtime": "2023-10-27T18:00:06.000Z",
    "size": 487655,
    "path": "../public/img/img/home_corporate_2.jpg"
  },
  "/img/img/home_corporate_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"72cb0-zLlB5ne9vhGQNkSOKbQNPPo2qjk\"",
    "mtime": "2023-10-27T18:00:08.000Z",
    "size": 470192,
    "path": "../public/img/img/home_corporate_3.jpg"
  },
  "/img/img/home_corporate_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1c89ea-NAV4AAxD5YTJfKkQcOeSWAjfpPs\"",
    "mtime": "2023-10-27T18:00:22.000Z",
    "size": 1870314,
    "path": "../public/img/img/home_corporate_4.jpg"
  },
  "/img/img/kum.jpg": {
    "type": "image/jpeg",
    "etag": "\"11c2c-TKcz/kOQVN+IXnL3UlOv70528RA\"",
    "mtime": "2023-10-27T18:01:07.000Z",
    "size": 72748,
    "path": "../public/img/img/kum.jpg"
  },
  "/img/img/office_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"d6a81-1HtpLpOF04+0y+1pecz+TmxCOPM\"",
    "mtime": "2023-10-27T18:01:26.000Z",
    "size": 879233,
    "path": "../public/img/img/office_1.jpg"
  },
  "/img/img/office_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"110625-Py26V11gEP9q2QenWJfZxTvvMdk\"",
    "mtime": "2023-10-27T18:01:32.000Z",
    "size": 1115685,
    "path": "../public/img/img/office_2.jpg"
  },
  "/img/img/office_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"b139d-TPGFjtb3kMNi8xfiqqdzkRlUdHc\"",
    "mtime": "2023-10-27T18:01:34.000Z",
    "size": 725917,
    "path": "../public/img/img/office_3.jpg"
  },
  "/img/img/office_3_hor.jpg": {
    "type": "image/jpeg",
    "etag": "\"f9950-oC7C+qwK6oUEBWJ0sZFZUljUVLQ\"",
    "mtime": "2023-10-27T18:00:06.000Z",
    "size": 1022288,
    "path": "../public/img/img/office_3_hor.jpg"
  },
  "/img/img/page-loader-logo-dark.png": {
    "type": "image/png",
    "etag": "\"400-E5E8u4+7vjrnoUJDQMYaH+BPn6Q\"",
    "mtime": "2023-10-27T18:01:23.000Z",
    "size": 1024,
    "path": "../public/img/img/page-loader-logo-dark.png"
  },
  "/img/img/page-loader-logo-light.png": {
    "type": "image/png",
    "etag": "\"41a-/G1mqSXfWl0V36e1ghq/dQcNKZ0\"",
    "mtime": "2023-10-27T18:01:15.000Z",
    "size": 1050,
    "path": "../public/img/img/page-loader-logo-light.png"
  },
  "/img/img/pers_ab_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"36f9a-m2R7z+asZnn1r7d+4wGW04NIEEw\"",
    "mtime": "2023-10-27T18:01:08.000Z",
    "size": 225178,
    "path": "../public/img/img/pers_ab_1.jpg"
  },
  "/img/img/pers_ab_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"aa572-pBqAZWT86xv0CvSeCGibU2AEc3k\"",
    "mtime": "2023-10-27T18:01:12.000Z",
    "size": 697714,
    "path": "../public/img/img/pers_ab_3.jpg"
  },
  "/img/img/photog_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"15d50b-u0Ev78IwKrDVctFO65U6sLrRfus\"",
    "mtime": "2023-10-27T18:00:27.000Z",
    "size": 1430795,
    "path": "../public/img/img/photog_1.jpg"
  },
  "/img/img/photog_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b823e-9ayp32VEltcMVl4laZvVG8mLXdI\"",
    "mtime": "2023-10-27T18:00:33.000Z",
    "size": 754238,
    "path": "../public/img/img/photog_2.jpg"
  },
  "/img/img/photog_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"12e7cb-QcVkDpY9i9n40ZW07WXlPMtsa/I\"",
    "mtime": "2023-10-27T18:00:32.000Z",
    "size": 1238987,
    "path": "../public/img/img/photog_3.jpg"
  },
  "/img/img/photog_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"69f04-l+48qD4TQBAfHPWRwbE3e1VFzYc\"",
    "mtime": "2023-10-27T18:00:15.000Z",
    "size": 433924,
    "path": "../public/img/img/photog_4.jpg"
  },
  "/img/img/photog_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"a953d-w4lGj6orN0iVnJCpTifuPRkKS+w\"",
    "mtime": "2023-10-27T18:00:13.000Z",
    "size": 693565,
    "path": "../public/img/img/photog_5.jpg"
  },
  "/img/img/photog_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"1786ed-nT4EZf4exNQxIMkxId7Bk0UvPvU\"",
    "mtime": "2023-10-27T18:00:08.000Z",
    "size": 1541869,
    "path": "../public/img/img/photog_6.jpg"
  },
  "/img/img/photog_About.jpg": {
    "type": "image/jpeg",
    "etag": "\"1de029-8ci/gmLL+wNWnLBPcfD/D38jBEg\"",
    "mtime": "2023-10-27T18:01:33.000Z",
    "size": 1957929,
    "path": "../public/img/img/photog_About.jpg"
  },
  "/img/img/photog_contact.jpg": {
    "type": "image/jpeg",
    "etag": "\"125bc1-CRy63MkP0z/QpBKyRfZZIjV2vhc\"",
    "mtime": "2023-10-27T18:01:22.000Z",
    "size": 1203137,
    "path": "../public/img/img/photog_contact.jpg"
  },
  "/img/img/post_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"575d5-e3jn3ZlFNZ9OUl36o239wZDlK1I\"",
    "mtime": "2023-10-27T18:00:59.000Z",
    "size": 357845,
    "path": "../public/img/img/post_4.jpg"
  },
  "/img/img/post_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"5f415-WycZuGlsNgcIvz46xkJPQYXE2dQ\"",
    "mtime": "2023-10-27T18:00:56.000Z",
    "size": 390165,
    "path": "../public/img/img/post_5.jpg"
  },
  "/img/img/post_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"411c1-pscBWmFyPDmPVG5y8KJTKZy48Ys\"",
    "mtime": "2023-10-27T18:00:51.000Z",
    "size": 266689,
    "path": "../public/img/img/post_6.jpg"
  },
  "/img/img/post_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"52670-XUqKm325KUa0lzvdMjcWhFXNXVU\"",
    "mtime": "2023-10-27T18:00:51.000Z",
    "size": 337520,
    "path": "../public/img/img/post_7.jpg"
  },
  "/img/img/post_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"2621b-3QxVeM/2f/TrWxHmdL7PqGgL4PE\"",
    "mtime": "2023-10-27T18:01:09.000Z",
    "size": 156187,
    "path": "../public/img/img/post_8.jpg"
  },
  "/img/img/post_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"4274d-gYKqk6JuroOgdjulJVmj/n+zt3E\"",
    "mtime": "2023-10-27T18:01:07.000Z",
    "size": 272205,
    "path": "../public/img/img/post_9.jpg"
  },
  "/img/img/product_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"7019d-JY/jBPtujO5PJt8KMjroDlIDWLs\"",
    "mtime": "2023-10-27T18:00:37.000Z",
    "size": 459165,
    "path": "../public/img/img/product_1.jpg"
  },
  "/img/img/product_10.jpg": {
    "type": "image/jpeg",
    "etag": "\"79c82-T0Be0Jq8Ml4PGJ1aTY0csmgNzx8\"",
    "mtime": "2023-10-27T18:00:55.000Z",
    "size": 498818,
    "path": "../public/img/img/product_10.jpg"
  },
  "/img/img/product_10_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b75f3-gUq/pSVtkY1GfL2//F48k1fPJLU\"",
    "mtime": "2023-10-27T18:01:36.000Z",
    "size": 751091,
    "path": "../public/img/img/product_10_2.jpg"
  },
  "/img/img/product_11.jpg": {
    "type": "image/jpeg",
    "etag": "\"76dd0-Q4NSt7tkxt2343fmMUlukAIg3i8\"",
    "mtime": "2023-10-27T18:01:00.000Z",
    "size": 486864,
    "path": "../public/img/img/product_11.jpg"
  },
  "/img/img/product_11_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"b7101-KYcFfDibPUI2s24Hhxf65aJwDB0\"",
    "mtime": "2023-10-27T18:01:24.000Z",
    "size": 749825,
    "path": "../public/img/img/product_11_2.jpg"
  },
  "/img/img/product_12.jpg": {
    "type": "image/jpeg",
    "etag": "\"796db-FPWNW4viIWku2YEenXfYhOyBrms\"",
    "mtime": "2023-10-27T18:00:52.000Z",
    "size": 497371,
    "path": "../public/img/img/product_12.jpg"
  },
  "/img/img/product_12_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"187586-qMcDw3VWCIkb3n1z9N0F0dKaXb8\"",
    "mtime": "2023-10-27T18:01:41.000Z",
    "size": 1602950,
    "path": "../public/img/img/product_12_2.jpg"
  },
  "/img/img/product_13.jpg": {
    "type": "image/jpeg",
    "etag": "\"6b63e-aa22zQbp5HM5IkWv2nlbKm7yZ0k\"",
    "mtime": "2023-10-27T18:00:51.000Z",
    "size": 439870,
    "path": "../public/img/img/product_13.jpg"
  },
  "/img/img/product_13_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"f87ee-toMJcmhDdGdyXTmvcy7HIaEI/KU\"",
    "mtime": "2023-10-27T18:01:17.000Z",
    "size": 1017838,
    "path": "../public/img/img/product_13_2.jpg"
  },
  "/img/img/product_14.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e879-xcxevhZTQxpZj6WUF43zSmsokWg\"",
    "mtime": "2023-10-27T18:00:41.000Z",
    "size": 387193,
    "path": "../public/img/img/product_14.jpg"
  },
  "/img/img/product_1_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"cd281-PwL6WsDtOs3ukAho0T5IlUmk5pY\"",
    "mtime": "2023-10-27T18:00:24.000Z",
    "size": 840321,
    "path": "../public/img/img/product_1_1.jpg"
  },
  "/img/img/product_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"6d9b7-rzp+xf6CxqFaQGWc2S+8PRY6YSc\"",
    "mtime": "2023-10-27T18:00:44.000Z",
    "size": 448951,
    "path": "../public/img/img/product_2.jpg"
  },
  "/img/img/product_2_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"176d2d-0DWT6BONFCxfJu5hsmmzaUHOAKE\"",
    "mtime": "2023-10-27T18:00:54.000Z",
    "size": 1535277,
    "path": "../public/img/img/product_2_1.jpg"
  },
  "/img/img/product_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"7ad3b-Y/lF6djdxVJrI7NOZOeSelINPZM\"",
    "mtime": "2023-10-27T18:00:50.000Z",
    "size": 503099,
    "path": "../public/img/img/product_3.jpg"
  },
  "/img/img/product_3_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"15b5b2-ooWmVD2gRl8HiyBt85q9n1fP65g\"",
    "mtime": "2023-10-27T18:00:27.000Z",
    "size": 1422770,
    "path": "../public/img/img/product_3_2.jpg"
  },
  "/img/img/product_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"82b1c-77jDsQ7mOrMtd/mLPtdwSAft1jc\"",
    "mtime": "2023-10-27T18:00:54.000Z",
    "size": 535324,
    "path": "../public/img/img/product_4.jpg"
  },
  "/img/img/product_4_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"12dfda-FRrYmBg0TBNazasO2LsTQKAuH+s\"",
    "mtime": "2023-10-27T18:00:49.000Z",
    "size": 1236954,
    "path": "../public/img/img/product_4_2.jpg"
  },
  "/img/img/product_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"b5ec8-Pug0iNgvc+nb1PYhH/iix/OPH58\"",
    "mtime": "2023-10-27T18:01:00.000Z",
    "size": 745160,
    "path": "../public/img/img/product_5.jpg"
  },
  "/img/img/product_5_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cc50a-hsQdJPjCJZ5f3yxacC4iLQSKUV0\"",
    "mtime": "2023-10-27T18:00:09.000Z",
    "size": 1885450,
    "path": "../public/img/img/product_5_2.jpg"
  },
  "/img/img/product_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"7f236-RteL3JIu1nM+eRU7YNWtaJ0Zp/c\"",
    "mtime": "2023-10-27T18:00:52.000Z",
    "size": 520758,
    "path": "../public/img/img/product_6.jpg"
  },
  "/img/img/product_6_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1388a1-JQZ2P/ks61pvJEeJKjmWRRO5xC8\"",
    "mtime": "2023-10-27T18:00:38.000Z",
    "size": 1280161,
    "path": "../public/img/img/product_6_2.jpg"
  },
  "/img/img/product_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"54495-hLK2TZBrb3bcNmkhulbQISVCmek\"",
    "mtime": "2023-10-27T18:00:50.000Z",
    "size": 345237,
    "path": "../public/img/img/product_7.jpg"
  },
  "/img/img/product_7_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"10ce73-OkNIA+JR0tttUr3dxrt0eoScjDQ\"",
    "mtime": "2023-10-27T18:00:12.000Z",
    "size": 1101427,
    "path": "../public/img/img/product_7_2.jpg"
  },
  "/img/img/product_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"6ca0f-DlEr72v1UGlrJdmbO78Lf6bRAYg\"",
    "mtime": "2023-10-27T18:01:05.000Z",
    "size": 444943,
    "path": "../public/img/img/product_8.jpg"
  },
  "/img/img/product_8_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"13a9eb-XbDcK8yKK0pNsXXRX2yVsXln0j8\"",
    "mtime": "2023-10-27T18:01:18.000Z",
    "size": 1288683,
    "path": "../public/img/img/product_8_2.jpg"
  },
  "/img/img/product_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"773c2-fzcmM/WnPCnINab4/AjW6iFxB1s\"",
    "mtime": "2023-10-27T18:01:09.000Z",
    "size": 488386,
    "path": "../public/img/img/product_9.jpg"
  },
  "/img/img/product_9_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"13c935-mzVz+Vf+hMwRyarhWBpLC5xjpcg\"",
    "mtime": "2023-10-27T18:01:40.000Z",
    "size": 1296693,
    "path": "../public/img/img/product_9_2.jpg"
  },
  "/img/img/site-favicon.png": {
    "type": "image/png",
    "etag": "\"1fe-hVP0aARe4uJb70hVAYU/bfoRJYs\"",
    "mtime": "2023-10-27T18:00:59.000Z",
    "size": 510,
    "path": "../public/img/img/site-favicon.png"
  },
  "/img/img/site-logo-light.png": {
    "type": "image/png",
    "etag": "\"3d0-L7Foyg5rxEb6GNHDqkDFiXnQIks\"",
    "mtime": "2023-10-27T18:00:28.000Z",
    "size": 976,
    "path": "../public/img/img/site-logo-light.png"
  },
  "/img/img/site-logo-type-dark.png": {
    "type": "image/png",
    "etag": "\"460-3qiUh/HHam/8JJGOs693qJTqluQ\"",
    "mtime": "2023-10-27T18:01:24.000Z",
    "size": 1120,
    "path": "../public/img/img/site-logo-type-dark.png"
  },
  "/img/img/site-logo-type-light.png": {
    "type": "image/png",
    "etag": "\"475-3ft49KwFyHNC8rjfMXaQMQg1fbk\"",
    "mtime": "2023-10-27T18:01:15.000Z",
    "size": 1141,
    "path": "../public/img/img/site-logo-type-light.png"
  },
  "/img/img/site-logo.png": {
    "type": "image/png",
    "etag": "\"3d9-tTCxwQWy/wpl7weXliUt/6uO1EU\"",
    "mtime": "2023-10-27T18:00:46.000Z",
    "size": 985,
    "path": "../public/img/img/site-logo.png"
  },
  "/img/img/site_emblem_dark.png": {
    "type": "image/png",
    "etag": "\"138-1l0STZnbhWo395vqHrSjAyxX/xQ\"",
    "mtime": "2023-10-27T18:01:24.000Z",
    "size": 312,
    "path": "../public/img/img/site_emblem_dark.png"
  },
  "/img/img/site_emblem_light.png": {
    "type": "image/png",
    "etag": "\"154-GQE6DnTuS4rFdRRSKYd/cQjdpKU\"",
    "mtime": "2023-10-27T18:01:42.000Z",
    "size": 340,
    "path": "../public/img/img/site_emblem_light.png"
  },
  "/img/img/sticky_logo.png": {
    "type": "image/png",
    "etag": "\"1c9-VYPJf3i1faYtJofgBFzSuOUDefg\"",
    "mtime": "2023-10-27T18:01:23.000Z",
    "size": 457,
    "path": "../public/img/img/sticky_logo.png"
  },
  "/img/img/sticky_logo_light.png": {
    "type": "image/png",
    "etag": "\"1c9-LmSaFQ/w8YT2ygfb6ddnRtdlP1s\"",
    "mtime": "2023-10-27T18:01:18.000Z",
    "size": 457,
    "path": "../public/img/img/sticky_logo_light.png"
  },
  "/img/img/team_member_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"9275b-bwvZXqGcBnpjGMRYR3jQJ6pd3fA\"",
    "mtime": "2023-10-27T18:00:28.000Z",
    "size": 599899,
    "path": "../public/img/img/team_member_1.jpg"
  },
  "/img/img/team_member_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"5bac9-duAuHnpafdYlA3nqkBWLrSmdjvs\"",
    "mtime": "2023-10-27T18:00:36.000Z",
    "size": 375497,
    "path": "../public/img/img/team_member_2.jpg"
  },
  "/img/img/team_member_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"78390-i9T+U2/gc5i3pfB5x+nRNfddydU\"",
    "mtime": "2023-10-27T18:00:28.000Z",
    "size": 492432,
    "path": "../public/img/img/team_member_3.jpg"
  },
  "/img/img/team_member_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"572b8-l5kpKDopoxwFNNL08fgfSrPUahw\"",
    "mtime": "2023-10-27T18:00:16.000Z",
    "size": 357048,
    "path": "../public/img/img/team_member_4.jpg"
  },
  "/img/img/team_member_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"6e429-ilf6E8PQy0QNHLWuY5HZsJjnDHo\"",
    "mtime": "2023-10-27T18:00:11.000Z",
    "size": 451625,
    "path": "../public/img/img/team_member_5.jpg"
  },
  "/img/img/team_member_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"82b1b-SsfoRw13xGwmEguAvc/1Pgfvp1E\"",
    "mtime": "2023-10-27T18:00:05.000Z",
    "size": 535323,
    "path": "../public/img/img/team_member_6.jpg"
  },
  "/img/img/team_member_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"8b472-3S5fIFtWbFDTibDNmkEwDYOccAg\"",
    "mtime": "2023-10-27T18:00:09.000Z",
    "size": 570482,
    "path": "../public/img/img/team_member_7.jpg"
  },
  "/img/img/team_member_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"5c376-IF25hufmjJ+tIJ9LPnlI8xuGJL4\"",
    "mtime": "2023-10-27T18:01:39.000Z",
    "size": 377718,
    "path": "../public/img/img/team_member_8.jpg"
  },
  "/img/img/team_vid.mp4": {
    "type": "video/mp4",
    "etag": "\"5d1d7d-h4UL/BLsmLwgnBMxl6ldvm8+608\"",
    "mtime": "2023-10-27T18:01:14.000Z",
    "size": 6102397,
    "path": "../public/img/img/team_vid.mp4"
  },
  "/img/img/test_avatar_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2aa2-899rJ81ZVqMBnOxL0m7HCx8yk7A\"",
    "mtime": "2023-10-27T18:01:37.000Z",
    "size": 10914,
    "path": "../public/img/img/test_avatar_1.jpg"
  },
  "/img/img/test_avatar_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"27fd-U3kPu8E2cC3ZnrqD5RDhGJ7j6DI\"",
    "mtime": "2023-10-27T18:01:42.000Z",
    "size": 10237,
    "path": "../public/img/img/test_avatar_2.jpg"
  },
  "/img/img/test_avatar_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"259f-Yu1eJJBDn6qvELeyhNNWnVl70rk\"",
    "mtime": "2023-10-27T18:01:41.000Z",
    "size": 9631,
    "path": "../public/img/img/test_avatar_3.jpg"
  },
  "/img/img/zum.jpg": {
    "type": "image/jpeg",
    "etag": "\"13802-VqvfHEy5uenxpBFNKib/BQS+daE\"",
    "mtime": "2023-10-27T18:00:43.000Z",
    "size": 79874,
    "path": "../public/img/img/zum.jpg"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-+QOcuyUwlHAjGDA0+tJURLnfU7Q\"",
    "mtime": "2025-10-26T09:15:16.656Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/img/img/landing/agency.jpg": {
    "type": "image/jpeg",
    "etag": "\"1031a-bZHCLYy0kRQMEiBmKphCeq6tx54\"",
    "mtime": "2023-10-27T18:01:49.000Z",
    "size": 66330,
    "path": "../public/img/img/landing/agency.jpg"
  },
  "/img/img/landing/agency_minimal.jpg": {
    "type": "image/jpeg",
    "etag": "\"1082b-dPflZ9Mfcv1jvwVOAR89rEBE2wE\"",
    "mtime": "2023-10-27T18:01:47.000Z",
    "size": 67627,
    "path": "../public/img/img/landing/agency_minimal.jpg"
  },
  "/img/img/landing/architecture.jpg": {
    "type": "image/jpeg",
    "etag": "\"4221d-MndMyggO3GEgwMZ2pXqxnxcc27k\"",
    "mtime": "2023-10-27T18:01:56.000Z",
    "size": 270877,
    "path": "../public/img/img/landing/architecture.jpg"
  },
  "/img/img/landing/creative_agency_dark.jpg": {
    "type": "image/jpeg",
    "etag": "\"11ce7-wdOPYkW/ZhBSwNMAr0kNI9WSU+k\"",
    "mtime": "2023-10-27T18:01:53.000Z",
    "size": 72935,
    "path": "../public/img/img/landing/creative_agency_dark.jpg"
  },
  "/img/img/landing/digital_agency_gray.jpg": {
    "type": "image/jpeg",
    "etag": "\"15c36-fE1QEYGC3lo2X4Wez/4Tu6AZpyQ\"",
    "mtime": "2023-10-27T18:01:48.000Z",
    "size": 89142,
    "path": "../public/img/img/landing/digital_agency_gray.jpg"
  },
  "/img/img/landing/digital_gency.jpg": {
    "type": "image/jpeg",
    "etag": "\"14f41-xfE6t0/tY8CDMeq0cwmh603nHiA\"",
    "mtime": "2023-10-27T18:01:55.000Z",
    "size": 85825,
    "path": "../public/img/img/landing/digital_gency.jpg"
  },
  "/img/img/landing/fullscreen_carousel.jpg": {
    "type": "image/jpeg",
    "etag": "\"44484-AcouyLu1rkP8JqHpRN9IgcToVok\"",
    "mtime": "2023-10-27T18:01:43.000Z",
    "size": 279684,
    "path": "../public/img/img/landing/fullscreen_carousel.jpg"
  },
  "/img/img/landing/fullscreen_personal.jpg": {
    "type": "image/jpeg",
    "etag": "\"9464-CgwQENdOUfkejGmJJC5pXWrrCaU\"",
    "mtime": "2023-10-27T18:01:46.000Z",
    "size": 37988,
    "path": "../public/img/img/landing/fullscreen_personal.jpg"
  },
  "/img/img/landing/fullscreen_slideshow.jpg": {
    "type": "image/jpeg",
    "etag": "\"4c1f0-RlB+8P8j25YGAi+NgMY8EpuQ7Xc\"",
    "mtime": "2023-10-27T18:01:51.000Z",
    "size": 311792,
    "path": "../public/img/img/landing/fullscreen_slideshow.jpg"
  },
  "/img/img/landing/fullscreen_wall.jpg": {
    "type": "image/jpeg",
    "etag": "\"11eb8-Ms+SCZK8bwuZgXXoytgAqxC3SlU\"",
    "mtime": "2023-10-27T18:01:53.000Z",
    "size": 73400,
    "path": "../public/img/img/landing/fullscreen_wall.jpg"
  },
  "/img/img/landing/infinite_grid.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f44f-JpeOzny9A6vdlsCIci93t0f7lro\"",
    "mtime": "2023-10-27T18:01:51.000Z",
    "size": 128079,
    "path": "../public/img/img/landing/infinite_grid.jpg"
  },
  "/img/img/landing/interactive_grid.jpg": {
    "type": "image/jpeg",
    "etag": "\"1ac18-rSHnXDoQhGuLGOD1NzSaQZpf+us\"",
    "mtime": "2023-10-27T18:01:51.000Z",
    "size": 109592,
    "path": "../public/img/img/landing/interactive_grid.jpg"
  },
  "/img/img/landing/landing_3d-titles.jpg": {
    "type": "image/jpeg",
    "etag": "\"7b80-+/kWzLZibqEp7at35CsFGE1ysrQ\"",
    "mtime": "2023-10-27T18:01:45.000Z",
    "size": 31616,
    "path": "../public/img/img/landing/landing_3d-titles.jpg"
  },
  "/img/img/landing/landing_app_landing.jpg": {
    "type": "image/jpeg",
    "etag": "\"17df2-Ys2fFLXXHJiv6KFcDcbdEeRSJ6g\"",
    "mtime": "2023-10-27T18:01:56.000Z",
    "size": 97778,
    "path": "../public/img/img/landing/landing_app_landing.jpg"
  },
  "/img/img/landing/landing_blog.jpg": {
    "type": "image/jpeg",
    "etag": "\"2403e-oWLRRbjbPvdR6QoAu+VeQ0LdF8g\"",
    "mtime": "2023-10-27T18:01:50.000Z",
    "size": 147518,
    "path": "../public/img/img/landing/landing_blog.jpg"
  },
  "/img/img/landing/landing_coming_soon.jpg": {
    "type": "image/jpeg",
    "etag": "\"15fe7-WRWy+ioAJy/gUdkiIQsr3WTlLp0\"",
    "mtime": "2023-10-27T18:01:45.000Z",
    "size": 90087,
    "path": "../public/img/img/landing/landing_coming_soon.jpg"
  },
  "/img/img/landing/landing_corporate.jpg": {
    "type": "image/jpeg",
    "etag": "\"24151-WjbU3UW7E4fyV3LzVL1dgSRllxY\"",
    "mtime": "2023-10-27T18:01:52.000Z",
    "size": 147793,
    "path": "../public/img/img/landing/landing_corporate.jpg"
  },
  "/img/img/landing/landing_infinite_grid_vertical.jpg": {
    "type": "image/jpeg",
    "etag": "\"19eac-qcuC2M/rYPLwGNZgB8R1mry0FOw\"",
    "mtime": "2023-10-27T18:01:47.000Z",
    "size": 106156,
    "path": "../public/img/img/landing/landing_infinite_grid_vertical.jpg"
  },
  "/img/img/landing/landing_one_page.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e19c-EKXlT9932aqomYA5CpJrbrYw5gU\"",
    "mtime": "2023-10-27T18:01:55.000Z",
    "size": 123292,
    "path": "../public/img/img/landing/landing_one_page.jpg"
  },
  "/img/img/landing/landing_shop.jpg": {
    "type": "image/jpeg",
    "etag": "\"19d46-wgycFfjqg7pyHwTqCPNAQCMs9lI\"",
    "mtime": "2023-10-27T18:01:53.000Z",
    "size": 105798,
    "path": "../public/img/img/landing/landing_shop.jpg"
  },
  "/img/img/landing/landing_single_proj_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"a0691-1jnxxO5pQi3ETV7r0+aG0unt7/Y\"",
    "mtime": "2023-07-17T13:35:10.000Z",
    "size": 657041,
    "path": "../public/img/img/landing/landing_single_proj_1.jpg"
  },
  "/img/img/landing/landing_single_proj_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"e950d-egehTWE0Bb4orohx+6SI1ruJlM4\"",
    "mtime": "2023-07-17T13:35:10.000Z",
    "size": 955661,
    "path": "../public/img/img/landing/landing_single_proj_2.jpg"
  },
  "/img/img/landing/landing_single_proj_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"5ceca-ixlA8G+e6k7FYqWlAB2AECz2LGE\"",
    "mtime": "2023-07-17T13:35:09.000Z",
    "size": 380618,
    "path": "../public/img/img/landing/landing_single_proj_3.jpg"
  },
  "/img/img/landing/landing_single_proj_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"77a65-StC2BmTxmDrUUFhJockcY2/a0DA\"",
    "mtime": "2023-07-17T13:35:12.000Z",
    "size": 490085,
    "path": "../public/img/img/landing/landing_single_proj_4.jpg"
  },
  "/img/img/landing/landing_single_proj_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"d4d54-taVDuE2B5SeIXqSqRxHc/rE4uok\"",
    "mtime": "2023-07-17T13:35:11.000Z",
    "size": 871764,
    "path": "../public/img/img/landing/landing_single_proj_5.jpg"
  },
  "/img/img/landing/landing_single_proj_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"cb40a-TvJpAX6M4hrn4mETVaaeo9v6guE\"",
    "mtime": "2023-07-17T13:35:13.000Z",
    "size": 832522,
    "path": "../public/img/img/landing/landing_single_proj_6.jpg"
  },
  "/img/img/landing/landing_single_proj_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"27cb8-eWAjkhi+ng1MVv+i/2ONbHPb17M\"",
    "mtime": "2023-07-17T13:35:13.000Z",
    "size": 163000,
    "path": "../public/img/img/landing/landing_single_proj_7.jpg"
  },
  "/img/img/landing/landing_single_proj_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"60a5c-ikME9RLLI827yjK3mayy5MAbn4o\"",
    "mtime": "2023-07-17T13:35:02.000Z",
    "size": 395868,
    "path": "../public/img/img/landing/landing_single_proj_8.jpg"
  },
  "/img/img/landing/minimal_list.jpg": {
    "type": "image/jpeg",
    "etag": "\"fdc3-/Bimq7wkAtHkc5zKPuXAQet4xTQ\"",
    "mtime": "2023-10-27T18:01:53.000Z",
    "size": 64963,
    "path": "../public/img/img/landing/minimal_list.jpg"
  },
  "/img/img/landing/minimal_portfolio.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b078-BLbDTQdkHYLLrm3YCHJe5IdcK9U\"",
    "mtime": "2023-10-27T18:01:52.000Z",
    "size": 110712,
    "path": "../public/img/img/landing/minimal_portfolio.jpg"
  },
  "/img/img/landing/personal.jpg": {
    "type": "image/jpeg",
    "etag": "\"25e60-V/sfbC9vFP1LyAXz/3ZLDFF1xTo\"",
    "mtime": "2023-10-27T18:01:56.000Z",
    "size": 155232,
    "path": "../public/img/img/landing/personal.jpg"
  },
  "/img/img/landing/photography.jpg": {
    "type": "image/jpeg",
    "etag": "\"15266-ckvfEVPPnRM7O5HvkmkxIDGSRbw\"",
    "mtime": "2023-10-27T18:01:49.000Z",
    "size": 86630,
    "path": "../public/img/img/landing/photography.jpg"
  },
  "/img/img/landing/responsive_1.png": {
    "type": "image/png",
    "etag": "\"63a83-P/RJO+iUioQhIgPJT+vUSjpQWTY\"",
    "mtime": "2023-10-27T18:01:48.000Z",
    "size": 408195,
    "path": "../public/img/img/landing/responsive_1.png"
  },
  "/img/img/landing/responsive_2.png": {
    "type": "image/png",
    "etag": "\"779ed-qZD4Gj/Ul0wgBhQ7PLui6uiYDdY\"",
    "mtime": "2023-10-27T18:01:47.000Z",
    "size": 489965,
    "path": "../public/img/img/landing/responsive_2.png"
  },
  "/img/img/landing/responsive_3.png": {
    "type": "image/png",
    "etag": "\"25ebd-5eZwfmG4AazhaS7loEepPsBWPc0\"",
    "mtime": "2023-10-27T18:01:47.000Z",
    "size": 155325,
    "path": "../public/img/img/landing/responsive_3.png"
  },
  "/img/img/landing/responsive_4.png": {
    "type": "image/png",
    "etag": "\"2209b-9CkzQ7VN3wD75qBglWMOajaZd0g\"",
    "mtime": "2023-10-27T18:01:49.000Z",
    "size": 139419,
    "path": "../public/img/img/landing/responsive_4.png"
  },
  "/img/img/landing/responsive_5.png": {
    "type": "image/png",
    "etag": "\"47274-HjMTxhfJuOTe9PXak7i6/+MFXXA\"",
    "mtime": "2023-10-27T18:01:49.000Z",
    "size": 291444,
    "path": "../public/img/img/landing/responsive_5.png"
  },
  "/img/img/landing/responsive_6.png": {
    "type": "image/png",
    "etag": "\"88aa0-tJQp5GyButaQHI9ouqJquaXH5V8\"",
    "mtime": "2023-10-27T18:01:50.000Z",
    "size": 559776,
    "path": "../public/img/img/landing/responsive_6.png"
  },
  "/img/img/landing/responsive_7.png": {
    "type": "image/png",
    "etag": "\"5dab7-yXzwtYA8zN74LXNqXIdgPi1OIak\"",
    "mtime": "2023-10-27T18:01:51.000Z",
    "size": 383671,
    "path": "../public/img/img/landing/responsive_7.png"
  },
  "/img/img/landing/responsive_8.png": {
    "type": "image/png",
    "etag": "\"41ed0-C1UVSFD0lLIgYg8+IRHiSVwuccU\"",
    "mtime": "2023-10-27T18:01:52.000Z",
    "size": 270032,
    "path": "../public/img/img/landing/responsive_8.png"
  },
  "/img/img/landing/responsive_9.png": {
    "type": "image/png",
    "etag": "\"737d5-Bae57EuYxpwFgu12qHJjAUAFJgg\"",
    "mtime": "2023-10-27T18:01:51.000Z",
    "size": 473045,
    "path": "../public/img/img/landing/responsive_9.png"
  },
  "/img/img/landing/showcase_cards.jpg": {
    "type": "image/jpeg",
    "etag": "\"2e37e-2IZLLnG2ZD4W1AYwK6YOjqj62Nc\"",
    "mtime": "2023-10-27T18:01:55.000Z",
    "size": 189310,
    "path": "../public/img/img/landing/showcase_cards.jpg"
  },
  "/img/img/landing/showcase_carousel.jpg": {
    "type": "image/jpeg",
    "etag": "\"12295-WwvzAGxmo+4//sf8CRLD/EDoc3s\"",
    "mtime": "2023-10-27T18:01:43.000Z",
    "size": 74389,
    "path": "../public/img/img/landing/showcase_carousel.jpg"
  },
  "/img/img/landing/showcase_list.jpg": {
    "type": "image/jpeg",
    "etag": "\"372b1-4twmj83I/2PXnGWFV3L2kn8PP5E\"",
    "mtime": "2023-10-27T18:01:44.000Z",
    "size": 225969,
    "path": "../public/img/img/landing/showcase_list.jpg"
  },
  "/img/img/landing/showcase_wall.jpg": {
    "type": "image/jpeg",
    "etag": "\"aae0-ua/3JvSVT3BBHmSpxotstfO5A0A\"",
    "mtime": "2023-10-27T18:01:55.000Z",
    "size": 43744,
    "path": "../public/img/img/landing/showcase_wall.jpg"
  },
  "/img/img/landing/single_proj_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"e950d-egehTWE0Bb4orohx+6SI1ruJlM4\"",
    "mtime": "2023-10-27T18:01:46.000Z",
    "size": 955661,
    "path": "../public/img/img/landing/single_proj_2.jpg"
  },
  "/img/img/landing/single_proj_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"27cb8-eWAjkhi+ng1MVv+i/2ONbHPb17M\"",
    "mtime": "2023-10-27T18:01:43.000Z",
    "size": 163000,
    "path": "../public/img/img/landing/single_proj_7.jpg"
  },
  "/img/img/projects/architexture_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2b1960-D2TWq3ciAnlDwSXubh79i9YZ+QY\"",
    "mtime": "2023-10-27T18:05:02.000Z",
    "size": 2824544,
    "path": "../public/img/img/projects/architexture_1.jpg"
  },
  "/img/img/projects/architexture_10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3cc94d-DHfyZpICNSCMS3lWpcqPHo4VDw0\"",
    "mtime": "2023-10-27T18:05:07.000Z",
    "size": 3983693,
    "path": "../public/img/img/projects/architexture_10.jpg"
  },
  "/img/img/projects/architexture_11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1fd06f-6f1kAcdHRasWtJW10SfHf5yGTCE\"",
    "mtime": "2023-10-27T18:05:06.000Z",
    "size": 2084975,
    "path": "../public/img/img/projects/architexture_11.jpg"
  },
  "/img/img/projects/architexture_15.jpg": {
    "type": "image/jpeg",
    "etag": "\"a01678-KTrd74bvL/25M371Xw/iA3RPcQg\"",
    "mtime": "2023-10-27T18:04:16.000Z",
    "size": 10491512,
    "path": "../public/img/img/projects/architexture_15.jpg"
  },
  "/img/img/projects/architexture_16.jpg": {
    "type": "image/jpeg",
    "etag": "\"25a05a-UZ2KaCiCOCuFni9bQD25JNUs0jo\"",
    "mtime": "2023-10-27T18:04:37.000Z",
    "size": 2465882,
    "path": "../public/img/img/projects/architexture_16.jpg"
  },
  "/img/img/projects/architexture_17.jpg": {
    "type": "image/jpeg",
    "etag": "\"f8f43-UVkV7FqqHS3mzt1YI7bFcgUwdWk\"",
    "mtime": "2023-10-27T18:04:37.000Z",
    "size": 1019715,
    "path": "../public/img/img/projects/architexture_17.jpg"
  },
  "/img/img/projects/architexture_18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1c69c9-NsrxOv+5aYoFJ1+ATvp4VjvHHXE\"",
    "mtime": "2023-10-27T18:03:57.000Z",
    "size": 1862089,
    "path": "../public/img/img/projects/architexture_18.jpg"
  },
  "/img/img/projects/architexture_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e1386-Vb8Ymw0Od0DRjrODAOU5kuyKcPk\"",
    "mtime": "2023-10-27T18:04:47.000Z",
    "size": 1971078,
    "path": "../public/img/img/projects/architexture_2.jpg"
  },
  "/img/img/projects/architexture_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"2ab2fe-UrL10w7DjZaNdmLG+2PF5k7FzT0\"",
    "mtime": "2023-10-27T18:04:57.000Z",
    "size": 2798334,
    "path": "../public/img/img/projects/architexture_3.jpg"
  },
  "/img/img/projects/architexture_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"1fcb89-qSIF7IeZBKqsV+pF68Egj/NyJi0\"",
    "mtime": "2023-10-27T18:04:09.000Z",
    "size": 2083721,
    "path": "../public/img/img/projects/architexture_4.jpg"
  },
  "/img/img/projects/architexture_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cf0d7-dPx7fEc9+m6esWqd23BBHqjoTXs\"",
    "mtime": "2023-10-27T18:04:17.000Z",
    "size": 1896663,
    "path": "../public/img/img/projects/architexture_5.jpg"
  },
  "/img/img/projects/architexture_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"172abf-8TGx3ybwavLH5xcE/i9BbgS63hk\"",
    "mtime": "2023-10-27T18:04:40.000Z",
    "size": 1518271,
    "path": "../public/img/img/projects/architexture_6.jpg"
  },
  "/img/img/projects/architexture_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1c83d5-RE1QkCZl+nlhB5KJ47A0IK2r4kM\"",
    "mtime": "2023-10-27T18:04:32.000Z",
    "size": 1868757,
    "path": "../public/img/img/projects/architexture_7.jpg"
  },
  "/img/img/projects/architexture_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"4323f3-UTlXX2k4SqRswnKmNAKSs4jWCwY\"",
    "mtime": "2023-10-27T18:03:55.000Z",
    "size": 4400115,
    "path": "../public/img/img/projects/architexture_8.jpg"
  },
  "/img/img/projects/architexture_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"39be8a-gRFO2Q6GRkiVHF4gHhcuauPOQ9I\"",
    "mtime": "2023-10-27T18:04:01.000Z",
    "size": 3784330,
    "path": "../public/img/img/projects/architexture_9.jpg"
  },
  "/img/img/projects/austeria_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"331dc0-T3RL3DisuB/kHJKKvvG6n8Vm/m0\"",
    "mtime": "2023-10-27T18:02:47.000Z",
    "size": 3349952,
    "path": "../public/img/img/projects/austeria_featured.jpg"
  },
  "/img/img/projects/beach-brown_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"129143-gOJC9z6NRoEagGcKJXVXIWxrZao\"",
    "mtime": "2023-10-27T18:04:42.000Z",
    "size": 1216835,
    "path": "../public/img/img/projects/beach-brown_1.jpg"
  },
  "/img/img/projects/beach-brown_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"c3c58-zCDGPD+tvp8mD0SGgO5kazS1N+A\"",
    "mtime": "2023-10-27T18:03:34.000Z",
    "size": 801880,
    "path": "../public/img/img/projects/beach-brown_8.jpg"
  },
  "/img/img/projects/beach-brown_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"174b82-UeokLK0cdGlYaFTjeTct/VjM/44\"",
    "mtime": "2023-10-27T18:03:31.000Z",
    "size": 1526658,
    "path": "../public/img/img/projects/beach-brown_9.jpg"
  },
  "/img/img/projects/curology_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"c570c-7StRTXP4WdsSbIrxgEHcnCqoLeo\"",
    "mtime": "2023-10-27T18:05:24.000Z",
    "size": 808716,
    "path": "../public/img/img/projects/curology_featured.jpg"
  },
  "/img/img/projects/en-vogue_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"13c8ad-IZdh2VNLFlEkDNkm4aoj6qwy4qI\"",
    "mtime": "2023-10-27T18:03:32.000Z",
    "size": 1296557,
    "path": "../public/img/img/projects/en-vogue_1.jpg"
  },
  "/img/img/projects/en-vogue_fetured.jpg": {
    "type": "image/jpeg",
    "etag": "\"104e42-yT+W5gjLcxoRAdffub4zwlc5fcM\"",
    "mtime": "2023-10-27T18:02:10.000Z",
    "size": 1068610,
    "path": "../public/img/img/projects/en-vogue_fetured.jpg"
  },
  "/img/img/projects/immersive_realities_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"12b67d-0Z/g3ZMmuk2quBQ/UpSTVu5qv9Y\"",
    "mtime": "2023-10-27T18:04:52.000Z",
    "size": 1226365,
    "path": "../public/img/img/projects/immersive_realities_featured.jpg"
  },
  "/img/img/projects/ink-sense_24.jpg": {
    "type": "image/jpeg",
    "etag": "\"1cffd5-+nf7xA3ZMnaL4XQSnzsZcdyQ+Pg\"",
    "mtime": "2023-10-27T18:05:41.000Z",
    "size": 1900501,
    "path": "../public/img/img/projects/ink-sense_24.jpg"
  },
  "/img/img/projects/ink-sense_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"5e64a-2HW5z4y5X7+bN86OmJhGCzfj8wc\"",
    "mtime": "2023-10-27T18:03:21.000Z",
    "size": 386634,
    "path": "../public/img/img/projects/ink-sense_featured.jpg"
  },
  "/img/img/projects/lifes-stories_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"158c50-MTz2ctIz2TVrwPWULuRytSfzOAU\"",
    "mtime": "2023-10-27T18:02:20.000Z",
    "size": 1412176,
    "path": "../public/img/img/projects/lifes-stories_1.jpg"
  },
  "/img/img/projects/lifes-stories_11.jpg": {
    "type": "image/jpeg",
    "etag": "\"1292b5-eerVzWJWy5QTEIa57JmmgYceG4k\"",
    "mtime": "2023-10-27T18:03:39.000Z",
    "size": 1217205,
    "path": "../public/img/img/projects/lifes-stories_11.jpg"
  },
  "/img/img/projects/lifes-stories_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"111f97-borEUoNiaOjmtzplhi8IlLNQiVY\"",
    "mtime": "2023-10-27T18:03:07.000Z",
    "size": 1122199,
    "path": "../public/img/img/projects/lifes-stories_6.jpg"
  },
  "/img/img/projects/lifes-stories_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"149012-mgUdjeWLuzlsW4PRP2Cn4P/yrSc\"",
    "mtime": "2023-10-27T18:03:01.000Z",
    "size": 1347602,
    "path": "../public/img/img/projects/lifes-stories_7.jpg"
  },
  "/img/img/projects/lifes-stories_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"b3f23-uXK+/pbSqY1vx025OjunQpSnzfY\"",
    "mtime": "2023-10-27T18:05:32.000Z",
    "size": 737059,
    "path": "../public/img/img/projects/lifes-stories_9.jpg"
  },
  "/img/img/projects/los-coyotes_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"2105c8-IqXGZ+cqxxWZTWGAXYB7DyQcauA\"",
    "mtime": "2023-10-27T18:03:11.000Z",
    "size": 2164168,
    "path": "../public/img/img/projects/los-coyotes_featured.jpg"
  },
  "/img/img/projects/nyc_streetlife-5.jpg": {
    "type": "image/jpeg",
    "etag": "\"186faf-ZFway4JZAh4Kjq6aChv7Gt6xNBY\"",
    "mtime": "2023-10-27T18:02:49.000Z",
    "size": 1601455,
    "path": "../public/img/img/projects/nyc_streetlife-5.jpg"
  },
  "/img/img/projects/nyc_streetlife-7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dad9a-3cLlbw7b9PkLGedQwCBxtqFDpQg\"",
    "mtime": "2023-10-27T18:02:57.000Z",
    "size": 1944986,
    "path": "../public/img/img/projects/nyc_streetlife-7.jpg"
  },
  "/img/img/projects/pastel-ladies_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1a5cef-+YO+pIFQRLmWf1CPOs7pTghtMUk\"",
    "mtime": "2023-10-27T18:02:36.000Z",
    "size": 1727727,
    "path": "../public/img/img/projects/pastel-ladies_1.jpg"
  },
  "/img/img/projects/pastel-ladies_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"1df52c-GEoC9Gdt8gUyTHnBaHaqLTTNgik\"",
    "mtime": "2023-10-27T18:02:01.000Z",
    "size": 1963308,
    "path": "../public/img/img/projects/pastel-ladies_7.jpg"
  },
  "/img/img/projects/percent_10.jpg": {
    "type": "image/jpeg",
    "etag": "\"3fc27-kYNWVaAoaAYTcLsuUJKZwINK8FY\"",
    "mtime": "2023-10-27T18:04:04.000Z",
    "size": 261159,
    "path": "../public/img/img/projects/percent_10.jpg"
  },
  "/img/img/projects/percent_11.jpg": {
    "type": "image/jpeg",
    "etag": "\"6a34b-YGzW/l1Nr9xyzoevaMlfqlLIxg8\"",
    "mtime": "2023-10-27T18:03:50.000Z",
    "size": 435019,
    "path": "../public/img/img/projects/percent_11.jpg"
  },
  "/img/img/projects/percent_12.jpg": {
    "type": "image/jpeg",
    "etag": "\"e22bc-zIjpLbckG/iTSpa4a9CWTOhL+nA\"",
    "mtime": "2023-10-27T18:03:38.000Z",
    "size": 926396,
    "path": "../public/img/img/projects/percent_12.jpg"
  },
  "/img/img/projects/percent_13.jpg": {
    "type": "image/jpeg",
    "etag": "\"74dfe-2HPJgbczIFSebTluD2eqOcGPAQc\"",
    "mtime": "2023-10-27T18:03:49.000Z",
    "size": 478718,
    "path": "../public/img/img/projects/percent_13.jpg"
  },
  "/img/img/projects/percent_14.jpg": {
    "type": "image/jpeg",
    "etag": "\"9f150-3Q1DPISOCEBt4Z8Xrl/iL9pEeFo\"",
    "mtime": "2023-10-27T18:03:16.000Z",
    "size": 651600,
    "path": "../public/img/img/projects/percent_14.jpg"
  },
  "/img/img/projects/percent_15.jpg": {
    "type": "image/jpeg",
    "etag": "\"62b46-t3r8+7gP24YyoroF2x5qTYfBRt8\"",
    "mtime": "2023-10-27T18:03:29.000Z",
    "size": 404294,
    "path": "../public/img/img/projects/percent_15.jpg"
  },
  "/img/img/projects/percent_16.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b4aff-BzpIJWunJv/PK0dWvejf4LODEU4\"",
    "mtime": "2023-10-27T18:03:36.000Z",
    "size": 1788671,
    "path": "../public/img/img/projects/percent_16.jpg"
  },
  "/img/img/projects/percent_17.jpg": {
    "type": "image/jpeg",
    "etag": "\"3fe73-HWaXjuoPV+jVpMBQQIs7Cmw4NHQ\"",
    "mtime": "2023-10-27T18:03:29.000Z",
    "size": 261747,
    "path": "../public/img/img/projects/percent_17.jpg"
  },
  "/img/img/projects/percent_18.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d862-g4Pw+ntHsJoSw84liy+NLRtOhKc\"",
    "mtime": "2023-10-27T18:04:57.000Z",
    "size": 120930,
    "path": "../public/img/img/projects/percent_18.jpg"
  },
  "/img/img/projects/percent_19.jpg": {
    "type": "image/jpeg",
    "etag": "\"11a202-6mzWAvWB/9x9hDsapzrNi3afjXg\"",
    "mtime": "2023-10-27T18:05:10.000Z",
    "size": 1155586,
    "path": "../public/img/img/projects/percent_19.jpg"
  },
  "/img/img/projects/percent_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"42b3f-/ffByP2dINSB0ezOnpG2cRy1V4s\"",
    "mtime": "2023-10-27T18:02:38.000Z",
    "size": 273215,
    "path": "../public/img/img/projects/percent_2.jpg"
  },
  "/img/img/projects/percent_20.jpg": {
    "type": "image/jpeg",
    "etag": "\"8b587-0o+uObKrtmTlXibee6MEihVngA4\"",
    "mtime": "2023-10-27T18:04:25.000Z",
    "size": 570759,
    "path": "../public/img/img/projects/percent_20.jpg"
  },
  "/img/img/projects/percent_3.jpg": {
    "type": "image/jpeg",
    "etag": "\"12c5e-TK2nbel5pXBrU7ufdBqEaSMv++E\"",
    "mtime": "2023-10-27T18:02:42.000Z",
    "size": 76894,
    "path": "../public/img/img/projects/percent_3.jpg"
  },
  "/img/img/projects/percent_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"d923f-8qfGK6F/lfIBVecNE0eQsFRroGo\"",
    "mtime": "2023-10-27T18:02:02.000Z",
    "size": 889407,
    "path": "../public/img/img/projects/percent_4.jpg"
  },
  "/img/img/projects/percent_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"1d036-EbDfGMWZqjbHh/PJ56MhjdWz39E\"",
    "mtime": "2023-10-27T18:02:06.000Z",
    "size": 118838,
    "path": "../public/img/img/projects/percent_5.jpg"
  },
  "/img/img/projects/percent_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"9f343-oackxmnJ0C1emNx1Pg95Oy5LfeQ\"",
    "mtime": "2023-10-27T18:02:24.000Z",
    "size": 652099,
    "path": "../public/img/img/projects/percent_6.jpg"
  },
  "/img/img/projects/percent_7.jpg": {
    "type": "image/jpeg",
    "etag": "\"e3f0-tuxyOC4GlamD4jmi1M679YTzpRA\"",
    "mtime": "2023-10-27T18:02:19.000Z",
    "size": 58352,
    "path": "../public/img/img/projects/percent_7.jpg"
  },
  "/img/img/projects/percent_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"31533-Ltct2Egv/wzv6E6vJLdul7WEJn8\"",
    "mtime": "2023-10-27T18:06:07.000Z",
    "size": 202035,
    "path": "../public/img/img/projects/percent_8.jpg"
  },
  "/img/img/projects/percent_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"87545-Uk6nN5i71B7uZqSUX4ks5hJw41o\"",
    "mtime": "2023-10-27T18:06:21.000Z",
    "size": 554309,
    "path": "../public/img/img/projects/percent_9.jpg"
  },
  "/img/img/projects/primo_10.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b0f4b-ROmGL6cU6SvU0PRhNfsZB99Zfls\"",
    "mtime": "2023-10-27T18:04:24.000Z",
    "size": 1773387,
    "path": "../public/img/img/projects/primo_10.jpg"
  },
  "/img/img/projects/primo_12.jpg": {
    "type": "image/jpeg",
    "etag": "\"1b4dfa-JH8mJRb5sIg6zGI3AcN7GaasU5M\"",
    "mtime": "2023-10-27T18:04:26.000Z",
    "size": 1789434,
    "path": "../public/img/img/projects/primo_12.jpg"
  },
  "/img/img/projects/primo_13.jpg": {
    "type": "image/jpeg",
    "etag": "\"16c679-tP/APvGGgnYGGdWWeXEEHqhG1K8\"",
    "mtime": "2023-10-27T18:04:44.000Z",
    "size": 1492601,
    "path": "../public/img/img/projects/primo_13.jpg"
  },
  "/img/img/projects/primo_14.jpg": {
    "type": "image/jpeg",
    "etag": "\"1dbc03-NJ2RtRoQNq0fn6bLggtIETFcNj0\"",
    "mtime": "2023-10-27T18:04:58.000Z",
    "size": 1948675,
    "path": "../public/img/img/projects/primo_14.jpg"
  },
  "/img/img/projects/primo_15.jpg": {
    "type": "image/jpeg",
    "etag": "\"12f35d-CWGep1V/KlLZBzkEVSvvmupWqJ4\"",
    "mtime": "2023-10-27T18:05:10.000Z",
    "size": 1241949,
    "path": "../public/img/img/projects/primo_15.jpg"
  },
  "/img/img/projects/primo_16.jpg": {
    "type": "image/jpeg",
    "etag": "\"1bb1db-4sG+7wrAX5EldzAqihQtaPpWAck\"",
    "mtime": "2023-10-27T18:04:58.000Z",
    "size": 1815003,
    "path": "../public/img/img/projects/primo_16.jpg"
  },
  "/img/img/projects/primo_17.jpg": {
    "type": "image/jpeg",
    "etag": "\"187a5a-jSB0+GFuKnzpnnyLxIloLH9jgfc\"",
    "mtime": "2023-10-27T18:04:45.000Z",
    "size": 1604186,
    "path": "../public/img/img/projects/primo_17.jpg"
  },
  "/img/img/projects/primo_18.jpg": {
    "type": "image/jpeg",
    "etag": "\"75201-P1Bbyt9ODhOmOyNtIe0uU3TIErc\"",
    "mtime": "2023-10-27T18:03:16.000Z",
    "size": 479745,
    "path": "../public/img/img/projects/primo_18.jpg"
  },
  "/img/img/projects/primo_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"4b5e9-eoV5xw0yKIGYhNc1uqCWM1eAaF8\"",
    "mtime": "2023-10-27T18:03:21.000Z",
    "size": 308713,
    "path": "../public/img/img/projects/primo_2.jpg"
  },
  "/img/img/projects/primo_20.jpg": {
    "type": "image/jpeg",
    "etag": "\"168603-bqzKvEcxn7CipF9AF04JffgAdNg\"",
    "mtime": "2023-10-27T18:04:03.000Z",
    "size": 1476099,
    "path": "../public/img/img/projects/primo_20.jpg"
  },
  "/img/img/projects/primo_4.jpg": {
    "type": "image/jpeg",
    "etag": "\"e8cf0-qEJiNYayRhzE2laj9JPJUMTpTRA\"",
    "mtime": "2023-10-27T18:03:40.000Z",
    "size": 953584,
    "path": "../public/img/img/projects/primo_4.jpg"
  },
  "/img/img/projects/primo_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"51d14-Ii33dgYeKpVKvqKW7qIfzku4WgI\"",
    "mtime": "2023-10-27T18:03:47.000Z",
    "size": 335124,
    "path": "../public/img/img/projects/primo_5.jpg"
  },
  "/img/img/projects/primo_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"71abc-eUv0BfumUwtDTOltIxjwLXz0rhA\"",
    "mtime": "2023-10-27T18:03:58.000Z",
    "size": 465596,
    "path": "../public/img/img/projects/primo_6.jpg"
  },
  "/img/img/projects/primo_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"15902d-/MBrYwVEfois8oLMcQMdSOohbtg\"",
    "mtime": "2023-10-27T18:04:35.000Z",
    "size": 1413165,
    "path": "../public/img/img/projects/primo_8.jpg"
  },
  "/img/img/projects/primo_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"167ce3-hyRtjw+NqpOkZz+shsj7QdWRSrE\"",
    "mtime": "2023-10-27T18:04:39.000Z",
    "size": 1473763,
    "path": "../public/img/img/projects/primo_9.jpg"
  },
  "/img/img/projects/primo_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"16293c-FudFeELQcXD7mJajfQ7EEHid52Q\"",
    "mtime": "2023-10-27T18:02:35.000Z",
    "size": 1452348,
    "path": "../public/img/img/projects/primo_featured.jpg"
  },
  "/img/img/projects/sauz-hothoney_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"f2923-CB2yQOZue7GLx28JCh1f8egRFGc\"",
    "mtime": "2023-10-27T18:02:22.000Z",
    "size": 993571,
    "path": "../public/img/img/projects/sauz-hothoney_1.jpg"
  },
  "/img/img/projects/sauz-hothoney_10.jpg": {
    "type": "image/jpeg",
    "etag": "\"23224c-8s1FcAVJvAUQ4IJbV+yQIw402fQ\"",
    "mtime": "2023-10-27T18:05:07.000Z",
    "size": 2302540,
    "path": "../public/img/img/projects/sauz-hothoney_10.jpg"
  },
  "/img/img/projects/sauz-hothoney_11.jpg": {
    "type": "image/jpeg",
    "etag": "\"b04ca-7O9QlSsXtgpj1SfTDlzbO832I/0\"",
    "mtime": "2023-10-27T18:05:04.000Z",
    "size": 722122,
    "path": "../public/img/img/projects/sauz-hothoney_11.jpg"
  },
  "/img/img/projects/sauz-hothoney_9.jpg": {
    "type": "image/jpeg",
    "etag": "\"155689-TYkcK2h4F2aO2twbZgY2e55N9oM\"",
    "mtime": "2023-10-27T18:05:31.000Z",
    "size": 1398409,
    "path": "../public/img/img/projects/sauz-hothoney_9.jpg"
  },
  "/img/img/projects/snaps_app_1.png": {
    "type": "image/png",
    "etag": "\"86fdd-Op1bFTN17Mv7OaIQ4ILObG/Z93Y\"",
    "mtime": "2023-10-27T18:02:23.000Z",
    "size": 552925,
    "path": "../public/img/img/projects/snaps_app_1.png"
  },
  "/img/img/projects/snaps_app_10.png": {
    "type": "image/png",
    "etag": "\"1cda4-G6J1+C0F/+gSKg70CU4wIW3H3dE\"",
    "mtime": "2023-10-27T18:06:08.000Z",
    "size": 118180,
    "path": "../public/img/img/projects/snaps_app_10.png"
  },
  "/img/img/projects/snaps_app_11.png": {
    "type": "image/png",
    "etag": "\"49f36-tymLfbzprgp7vBXA8IB3a4+DUBo\"",
    "mtime": "2023-10-27T18:06:21.000Z",
    "size": 302902,
    "path": "../public/img/img/projects/snaps_app_11.png"
  },
  "/img/img/projects/snaps_app_12.png": {
    "type": "image/png",
    "etag": "\"102f3-APfq/yYE5v3GyqPtkg5eRy5+pm0\"",
    "mtime": "2023-10-27T18:05:50.000Z",
    "size": 66291,
    "path": "../public/img/img/projects/snaps_app_12.png"
  },
  "/img/img/projects/snaps_app_13.png": {
    "type": "image/png",
    "etag": "\"4fb4d-udRK8SeDKF5Gh7Zmm3V1sOgJl8g\"",
    "mtime": "2023-10-27T18:05:44.000Z",
    "size": 326477,
    "path": "../public/img/img/projects/snaps_app_13.png"
  },
  "/img/img/projects/snaps_app_14.png": {
    "type": "image/png",
    "etag": "\"4dd4e-V7nO/2Pz1KJ0tO+TAHWQNw0XCwk\"",
    "mtime": "2023-10-27T18:05:18.000Z",
    "size": 318798,
    "path": "../public/img/img/projects/snaps_app_14.png"
  },
  "/img/img/projects/snaps_app_2.png": {
    "type": "image/png",
    "etag": "\"4965b-AQB5a4qNElbqI3DrwLkH/WntP98\"",
    "mtime": "2023-10-27T18:02:05.000Z",
    "size": 300635,
    "path": "../public/img/img/projects/snaps_app_2.png"
  },
  "/img/img/projects/snaps_app_3.png": {
    "type": "image/png",
    "etag": "\"26d79-w9Ojv5O3IeMcmP9U+WuPX3GuC7Q\"",
    "mtime": "2023-10-27T18:02:03.000Z",
    "size": 159097,
    "path": "../public/img/img/projects/snaps_app_3.png"
  },
  "/img/img/projects/snaps_app_4.png": {
    "type": "image/png",
    "etag": "\"2e166-JaGhu6P5JxCJhUOrwdeXliIDTNc\"",
    "mtime": "2023-10-27T18:02:41.000Z",
    "size": 188774,
    "path": "../public/img/img/projects/snaps_app_4.png"
  },
  "/img/img/projects/snaps_app_5.png": {
    "type": "image/png",
    "etag": "\"29ffc-JIZKgED/kgRbqztnEoHn1h1+qIs\"",
    "mtime": "2023-10-27T18:02:40.000Z",
    "size": 172028,
    "path": "../public/img/img/projects/snaps_app_5.png"
  },
  "/img/img/projects/snaps_app_6.png": {
    "type": "image/png",
    "etag": "\"47555-v/18T3Cp4ilOJCSLgpzo26804YQ\"",
    "mtime": "2023-10-27T18:03:03.000Z",
    "size": 292181,
    "path": "../public/img/img/projects/snaps_app_6.png"
  },
  "/img/img/projects/snaps_app_7.png": {
    "type": "image/png",
    "etag": "\"21b8b-quRX+0M8WWR45VfiVcMPy0xlruk\"",
    "mtime": "2023-10-27T18:03:03.000Z",
    "size": 138123,
    "path": "../public/img/img/projects/snaps_app_7.png"
  },
  "/img/img/projects/snaps_app_8.png": {
    "type": "image/png",
    "etag": "\"32f12-2cQC1knhgjf97GwxvwZFFjnKyBU\"",
    "mtime": "2023-10-27T18:05:30.000Z",
    "size": 208658,
    "path": "../public/img/img/projects/snaps_app_8.png"
  },
  "/img/img/projects/snaps_app_9.png": {
    "type": "image/png",
    "etag": "\"61894-+B/JMDQFlxXI2HLxTtPpP017xDI\"",
    "mtime": "2023-10-27T18:05:29.000Z",
    "size": 399508,
    "path": "../public/img/img/projects/snaps_app_9.png"
  },
  "/img/img/projects/soul_of_structure_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"130f13-zRxh418ew+TAatm028C27i84oTI\"",
    "mtime": "2023-10-27T18:03:37.000Z",
    "size": 1249043,
    "path": "../public/img/img/projects/soul_of_structure_1.jpg"
  },
  "/img/img/projects/soul_of_structure_6.jpg": {
    "type": "image/jpeg",
    "etag": "\"198e76-en/CIbxf8MoSRdwdoffgfwK706E\"",
    "mtime": "2023-10-27T18:03:51.000Z",
    "size": 1674870,
    "path": "../public/img/img/projects/soul_of_structure_6.jpg"
  },
  "/img/img/projects/soul_of_structure_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"20a385-VeGgu77zaGQEbaXTTC4/znB2r/w\"",
    "mtime": "2023-10-27T18:04:45.000Z",
    "size": 2139013,
    "path": "../public/img/img/projects/soul_of_structure_8.jpg"
  },
  "/img/img/projects/soul_of_structure_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"29fb85-jltjMFQlsQU1mIIeHuZvDsB8nlY\"",
    "mtime": "2023-10-27T18:02:52.000Z",
    "size": 2751365,
    "path": "../public/img/img/projects/soul_of_structure_featured.jpg"
  },
  "/img/img/projects/spirits-of-illusion_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"2f0fe5-y3mQFD5UDLqfrOgZqPzKjqIOK/0\"",
    "mtime": "2023-10-27T18:05:36.000Z",
    "size": 3084261,
    "path": "../public/img/img/projects/spirits-of-illusion_featured.jpg"
  },
  "/img/img/projects/taller_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1e1da2-5GRSV8ue2KAL7nESX1GLUjyLx8c\"",
    "mtime": "2023-10-27T18:05:37.000Z",
    "size": 1973666,
    "path": "../public/img/img/projects/taller_1.jpg"
  },
  "/img/img/projects/taller_11.jpg": {
    "type": "image/jpeg",
    "etag": "\"180de7-Q1hfGDNgyuAccYgsp3p5TVIzf1E\"",
    "mtime": "2023-10-27T18:05:18.000Z",
    "size": 1576423,
    "path": "../public/img/img/projects/taller_11.jpg"
  },
  "/img/img/projects/taller_12.jpg": {
    "type": "image/jpeg",
    "etag": "\"1eb43a-tDmlpWiuw0SbNyD3rIEv1CRj1+s\"",
    "mtime": "2023-10-27T18:05:33.000Z",
    "size": 2012218,
    "path": "../public/img/img/projects/taller_12.jpg"
  },
  "/img/img/projects/taller_15.jpg": {
    "type": "image/jpeg",
    "etag": "\"b993b-np7XZhceiVyYzDFFb6joLTgur8g\"",
    "mtime": "2025-10-08T13:50:37.147Z",
    "size": 760123,
    "path": "../public/img/img/projects/taller_15.jpg"
  },
  "/img/img/projects/taller_17.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f3666-R3rYv6/3k/CKQFwvkcNEpO5/uiA\"",
    "mtime": "2023-10-27T18:05:49.000Z",
    "size": 2045542,
    "path": "../public/img/img/projects/taller_17.jpg"
  },
  "/img/img/projects/taller_2.jpg": {
    "type": "image/jpeg",
    "etag": "\"227789-cf185wq3WjUk0QjoFJPZVPn1fzw\"",
    "mtime": "2023-10-27T18:05:22.000Z",
    "size": 2258825,
    "path": "../public/img/img/projects/taller_2.jpg"
  },
  "/img/img/projects/taller_21.jpg": {
    "type": "image/jpeg",
    "etag": "\"215531-agsQ6l4dcAnKhBhNPXvvbus4QSA\"",
    "mtime": "2023-10-27T18:03:10.000Z",
    "size": 2184497,
    "path": "../public/img/img/projects/taller_21.jpg"
  },
  "/img/img/projects/taller_23.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f7ff0-y08Rz54r733a18YhIokro03E6rM\"",
    "mtime": "2023-10-27T18:02:38.000Z",
    "size": 2064368,
    "path": "../public/img/img/projects/taller_23.jpg"
  },
  "/img/img/projects/taller_25.jpg": {
    "type": "image/jpeg",
    "etag": "\"1ca99e-mHgVFXbF/onUHZln1cOAQ5RWjN8\"",
    "mtime": "2023-10-27T18:02:03.000Z",
    "size": 1878430,
    "path": "../public/img/img/projects/taller_25.jpg"
  },
  "/img/img/projects/taller_26.jpg": {
    "type": "image/jpeg",
    "etag": "\"1777b2-65NK+AwOlYGnGs0qb/ipTOjJypc\"",
    "mtime": "2023-10-27T18:02:23.000Z",
    "size": 1537970,
    "path": "../public/img/img/projects/taller_26.jpg"
  },
  "/img/img/projects/taller_5.jpg": {
    "type": "image/jpeg",
    "etag": "\"804e5-976dZ9IXgNLQaLY/fizswH5pMnY\"",
    "mtime": "2023-10-27T18:05:42.000Z",
    "size": 525541,
    "path": "../public/img/img/projects/taller_5.jpg"
  },
  "/img/img/projects/taller_8.jpg": {
    "type": "image/jpeg",
    "etag": "\"1bbacd-Ue/g+0pD2WU0g29589Q61Ew2X1s\"",
    "mtime": "2023-10-27T18:02:31.000Z",
    "size": 1817293,
    "path": "../public/img/img/projects/taller_8.jpg"
  },
  "/img/img/projects/vibrant-horizons_1.jpg": {
    "type": "image/jpeg",
    "etag": "\"1f18d9-FcLVbrwKWJm46RMLIz+Yw+o6acA\"",
    "mtime": "2023-10-27T18:05:43.000Z",
    "size": 2037977,
    "path": "../public/img/img/projects/vibrant-horizons_1.jpg"
  },
  "/img/img/projects/vibrant-horizons_featured.jpg": {
    "type": "image/jpeg",
    "etag": "\"266dc5-Myx8JfUSmMcRDXUOYiXprl30Lhc\"",
    "mtime": "2023-10-27T18:02:33.000Z",
    "size": 2518469,
    "path": "../public/img/img/projects/vibrant-horizons_featured.jpg"
  },
  "/_nuxt/builds/meta/db0404e6-bd83-40db-82ec-40dd173e6403.json": {
    "type": "application/json",
    "etag": "\"8b-IlfWTEjVHwGV/ipLs3YAVZbIHT0\"",
    "mtime": "2025-10-26T09:15:16.658Z",
    "size": 139,
    "path": "../public/_nuxt/builds/meta/db0404e6-bd83-40db-82ec-40dd173e6403.json"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_nuxt/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _JIk3Gl = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError$1({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const _25I_kU = defineEventHandler((event) => {
  const path = getHeader(event, "x-forwarded-path") || event.node.req.url || "";
  if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)) {
    return;
  }
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_MxQ1k3 = () => import('../routes/css/_..._.mjs');
const _lazy_RIB6hp = () => import('../routes/img/_..._.mjs');
const _lazy_sxYhSI = () => import('../routes/js/_..._.mjs');
const _lazy_HNrS3l = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _JIk3Gl, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _25I_kU, lazy: false, middleware: true, method: undefined },
  { route: '/css/**', handler: _lazy_MxQ1k3, lazy: true, middleware: false, method: undefined },
  { route: '/img/**', handler: _lazy_RIB6hp, lazy: true, middleware: false, method: undefined },
  { route: '/js/**', handler: _lazy_sxYhSI, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_HNrS3l, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_HNrS3l, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

export { trapUnhandledNodeErrors as a, useNitroApp as b, defineEventHandler as c, destr as d, createError$1 as e, setHeader as f, getRouterParam as g, getResponseStatusText as h, getResponseStatus as i, joinRelativeURL as j, defineRenderHandler as k, getQuery as l, getRouteRules as m, setupGracefulShutdown as s, toNodeListener as t, useRuntimeConfig as u };
//# sourceMappingURL=nitro.mjs.map
