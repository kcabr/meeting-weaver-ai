import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { AsyncLocalStorage } from 'node:async_hooks';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join as join$1 } from 'vinxi/lib/path';
import { pathToFileURL } from 'node:url';
import { isRedirect, isNotFound, isPlainObject as isPlainObject$1, encode as encode$1 } from '@tanstack/router-core';
import b$2 from 'tiny-invariant';
import { eventHandler as eventHandler$1, toWebRequest, getResponseStatus, getEvent, defineHandlerCallback, createStartHandler, transformReadableStreamWithRouter, transformPipeableStreamWithRouter, getHeaders } from '@tanstack/start-server-core';
import { startSerializer, createServerFn, mergeHeaders as mergeHeaders$2 } from '@tanstack/start-client-core';
import { createClerkHandler } from '@clerk/tanstack-start/server';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { RouterProvider, createRouter as createRouter$2, createRootRoute, useRouter, useMatch, rootRouteId, ErrorComponent, Link, createFileRoute, lazyRouteComponent, Outlet, HeadContent, Scripts } from '@tanstack/react-router';
import { ClerkProvider, useUser, SignedIn, UserButton, SignedOut, SignInButton } from '@clerk/tanstack-start';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import d$1, { Toaster } from 'react-hot-toast';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, createContext as createContext$1, useContext } from 'react';
import He from 'stripe';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { z as z$2 } from 'zod';
import { PassThrough } from 'node:stream';
import { isbot } from 'isbot';
import $$1 from 'react-dom/server';
import { promises, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

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
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
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
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
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
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
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
function getQuery(input) {
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

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=g(e._destroy,t._destroy);}};function _$2(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function g(...n){return function(...e){for(const t of n)t(...e);}}const m$1=_$2();let A$2 = class A extends m$1{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}};let y$1 = class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A$2;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}};function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E$1=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E$1,t=Array.isArray(n)||H$1(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H$1(n){return typeof n?.entries=="function"}function S(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const C=new Set([101,204,205,304]);async function b$1(n,e){const t=new y$1,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(C.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function O$1(n,e,t={}){try{const r=await b$1(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:S(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

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
    if (this.data !== undefined) {
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
  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== undefined) {
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
  event.node.res.end(JSON.stringify(responseBody, undefined, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
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
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
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
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(undefined);
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
  if (opts.maxAge !== undefined) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
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
      body = await readRawBody(event, false).catch(() => undefined);
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
  if (response._data !== undefined) {
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
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
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
  return input ? Array.isArray(input) ? input : [input] : undefined;
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
  const spacing = options.debug ? 2 : undefined;
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
      const _body = val === undefined ? undefined : await val;
      if (_body !== undefined) {
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
          await options.onAfterResponse(event, undefined);
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
      await options.onAfterResponse(event, undefined);
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
      if (layer.match && !layer.match(_layerPath, undefined)) {
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
    handler = toEventHandler(handler, undefined, input.route);
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
    return send(event, JSON.stringify(val, undefined, jsonSpace), MIMES.json);
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
      route.handlers[method] = toEventHandler(handler, undefined, path);
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
      if (res === undefined && isPreemptive) {
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
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController$1 = globalThis.AbortController || i;
createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController: AbortController$1 });

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

const assets = {
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
  await ensuredir(dirname(path));
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
  await ensuredir(dirname(dir)).catch(ignoreExists);
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
      const entryPath = resolve(dir, entry.name);
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
      const entryPath = resolve(dir, entry.name);
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
  opts.base = resolve(opts.base);
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

storage.mount('/assets', assets);

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

const inlineAppConfig = {};



const appConfig$1 = defuFn(inlineAppConfig);

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
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {}
  }
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
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig$1));
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

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
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
        const query = getQuery(event.path);
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
        const query = getQuery(event.path);
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

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
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

const errorHandlers = [errorHandler$0];

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

const appConfig = {"name":"vinxi","routers":[{"name":"public","type":"static","dir":"./public","base":"/","root":"C:\\git\\cizzle-app-starters\\templates\\tanstack-start-clerk-supabase-shadcn","order":0,"outDir":"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/.vinxi/build/public"},{"name":"client","type":"client","target":"browser","handler":"src/client.tsx","base":"/_build","build":{"sourcemap":true},"root":"C:\\git\\cizzle-app-starters\\templates\\tanstack-start-clerk-supabase-shadcn","outDir":"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/.vinxi/build/client","order":1},{"name":"ssr","type":"http","target":"server","handler":"src/ssr.tsx","link":{"client":"client"},"root":"C:\\git\\cizzle-app-starters\\templates\\tanstack-start-clerk-supabase-shadcn","base":"/","outDir":"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/.vinxi/build/ssr","order":2},{"name":"server","type":"http","target":"server","base":"/_server","handler":"node_modules/@tanstack/start-server-functions-handler/dist/esm/index.js","root":"C:\\git\\cizzle-app-starters\\templates\\tanstack-start-clerk-supabase-shadcn","outDir":"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/.vinxi/build/server","order":3},{"name":"api","base":"/api","type":"http","handler":"src/api.ts","target":"server","root":"C:\\git\\cizzle-app-starters\\templates\\tanstack-start-clerk-supabase-shadcn","outDir":"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/.vinxi/build/api","order":4}],"server":{"preset":"netlify","experimental":{"asyncContext":true}},"root":"C:\\git\\cizzle-app-starters\\templates\\tanstack-start-clerk-supabase-shadcn"};
				const buildManifest = {"client":{"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/styles/app.css":{"file":"assets/app-vZFrISN_.css","src":"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/styles/app.css"},"_AccentButton-1guupTMB.js":{"file":"assets/AccentButton-1guupTMB.js","name":"AccentButton","imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js"]},"_CustomButtonLink-DOih7mnW.js":{"file":"assets/CustomButtonLink-DOih7mnW.js","name":"CustomButtonLink","imports":["_client-Bm6Vdnqp.js"]},"_alert-CgOl55GX.js":{"file":"assets/alert-CgOl55GX.js","name":"alert","imports":["_createLucideIcon-BdBzZ_PZ.js","_client-Bm6Vdnqp.js","_button-1p6NbWQA.js"]},"_button-1p6NbWQA.js":{"file":"assets/button-1p6NbWQA.js","name":"button","imports":["_client-Bm6Vdnqp.js"]},"_card-DtHpFZbu.js":{"file":"assets/card-DtHpFZbu.js","name":"card","imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js"]},"_check-B6B75W4y.js":{"file":"assets/check-B6B75W4y.js","name":"check","imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js","_createLucideIcon-BdBzZ_PZ.js"]},"_checkbox-BwXPwVVv.js":{"file":"assets/checkbox-BwXPwVVv.js","name":"checkbox","imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js","_check-B6B75W4y.js","_label-Db2qutF5.js"]},"_client-Bm6Vdnqp.js":{"file":"assets/client-Bm6Vdnqp.js","name":"client","dynamicImports":["src/routes/ui-showcase.tsx?tsr-split=component","src/routes/test.tsx?tsr-split=component","src/routes/news.tsx?tsr-split=component","src/routes/form.tsx?tsr-split=component","src/routes/_authed.tsx?tsr-split=errorComponent","src/routes/index.tsx?tsr-split=component","src/routes/news.index.tsx?tsr-split=component","src/routes/news.search.tsx?tsr-split=component","src/routes/_authed/todos.tsx?tsr-split=component","src/routes/_authed/subscription.tsx?tsr-split=component","src/routes/_authed/profile.tsx?tsr-split=component","src/routes/_authed/posts.tsx?tsr-split=component","src/routes/_authed/notes.tsx?tsr-split=component","src/routes/_authed/counter.tsx?tsr-split=component","src/routes/_authed/posts.index.tsx?tsr-split=component","src/routes/_authed/subscription.success.tsx?tsr-split=component","src/routes/_authed/profile.$.tsx?tsr-split=component","src/routes/_authed/posts.$postId.tsx?tsr-split=notFoundComponent","src/routes/_authed/posts.$postId.tsx?tsr-split=component"],"assets":["assets/app-vZFrISN_.css"]},"_createLucideIcon-BdBzZ_PZ.js":{"file":"assets/createLucideIcon-BdBzZ_PZ.js","name":"createLucideIcon","imports":["_client-Bm6Vdnqp.js"]},"_input-DhjTea2T.js":{"file":"assets/input-DhjTea2T.js","name":"input","imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js"]},"_label-Db2qutF5.js":{"file":"assets/label-Db2qutF5.js","name":"label","imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js"]},"_switch-Cxhce_M3.js":{"file":"assets/switch-Cxhce_M3.js","name":"switch","imports":["_client-Bm6Vdnqp.js","_check-B6B75W4y.js","_button-1p6NbWQA.js","_label-Db2qutF5.js"]},"_textarea-BvKsEWrI.js":{"file":"assets/textarea-BvKsEWrI.js","name":"textarea","imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js"]},"_useMutation-BIRUDehh.js":{"file":"assets/useMutation-BIRUDehh.js","name":"useMutation","imports":["_client-Bm6Vdnqp.js","_utils-km2FGkQ4.js"]},"_useQuery-Bm7vSMYN.js":{"file":"assets/useQuery-Bm7vSMYN.js","name":"useQuery","imports":["_client-Bm6Vdnqp.js","_utils-km2FGkQ4.js"]},"_utils-km2FGkQ4.js":{"file":"assets/utils-km2FGkQ4.js","name":"utils"},"src/routes/_authed.tsx?tsr-split=errorComponent":{"file":"assets/_authed-Be6KSFs8.js","name":"_authed","src":"src/routes/_authed.tsx?tsr-split=errorComponent","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js"]},"src/routes/_authed/counter.tsx?tsr-split=component":{"file":"assets/counter-DMCl5Swg.js","name":"counter","src":"src/routes/_authed/counter.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js"]},"src/routes/_authed/notes.tsx?tsr-split=component":{"file":"assets/notes-BO4rPC9t.js","name":"notes","src":"src/routes/_authed/notes.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_useMutation-BIRUDehh.js","_card-DtHpFZbu.js","_input-DhjTea2T.js","_textarea-BvKsEWrI.js","_label-Db2qutF5.js","_AccentButton-1guupTMB.js","_utils-km2FGkQ4.js","_button-1p6NbWQA.js"]},"src/routes/_authed/posts.$postId.tsx?tsr-split=component":{"file":"assets/posts._postId-De5Y6VGC.js","name":"posts._postId","src":"src/routes/_authed/posts.$postId.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_useQuery-Bm7vSMYN.js","_utils-km2FGkQ4.js"]},"src/routes/_authed/posts.$postId.tsx?tsr-split=notFoundComponent":{"file":"assets/posts._postId-B9h03sCg.js","name":"posts._postId","src":"src/routes/_authed/posts.$postId.tsx?tsr-split=notFoundComponent","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js"]},"src/routes/_authed/posts.index.tsx?tsr-split=component":{"file":"assets/posts.index-BAZWuRdi.js","name":"posts.index","src":"src/routes/_authed/posts.index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js"]},"src/routes/_authed/posts.tsx?tsr-split=component":{"file":"assets/posts-CQbp84R_.js","name":"posts","src":"src/routes/_authed/posts.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_useQuery-Bm7vSMYN.js","_utils-km2FGkQ4.js"]},"src/routes/_authed/profile.$.tsx?tsr-split=component":{"file":"assets/profile._-CUrCg7uP.js","name":"profile._","src":"src/routes/_authed/profile.$.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js"]},"src/routes/_authed/profile.tsx?tsr-split=component":{"file":"assets/profile-93HD-R3c.js","name":"profile","src":"src/routes/_authed/profile.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js"]},"src/routes/_authed/subscription.success.tsx?tsr-split=component":{"file":"assets/subscription.success-CM0GV_uT.js","name":"subscription.success","src":"src/routes/_authed/subscription.success.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_card-DtHpFZbu.js","_button-1p6NbWQA.js","_alert-CgOl55GX.js","_createLucideIcon-BdBzZ_PZ.js"]},"src/routes/_authed/subscription.tsx?tsr-split=component":{"file":"assets/subscription-BIREckfa.js","name":"subscription","src":"src/routes/_authed/subscription.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_card-DtHpFZbu.js","_button-1p6NbWQA.js","_alert-CgOl55GX.js","_createLucideIcon-BdBzZ_PZ.js"]},"src/routes/_authed/todos.tsx?tsr-split=component":{"file":"assets/todos-TKlYtevA.js","name":"todos","src":"src/routes/_authed/todos.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_useQuery-Bm7vSMYN.js","_useMutation-BIRUDehh.js","_card-DtHpFZbu.js","_input-DhjTea2T.js","_textarea-BvKsEWrI.js","_label-Db2qutF5.js","_checkbox-BwXPwVVv.js","_AccentButton-1guupTMB.js","_utils-km2FGkQ4.js","_button-1p6NbWQA.js","_check-B6B75W4y.js","_createLucideIcon-BdBzZ_PZ.js"]},"src/routes/form.tsx?tsr-split=component":{"file":"assets/form-DOhRr_7U.js","name":"form","src":"src/routes/form.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js","_input-DhjTea2T.js","_label-Db2qutF5.js","_checkbox-BwXPwVVv.js","_switch-Cxhce_M3.js","_check-B6B75W4y.js","_createLucideIcon-BdBzZ_PZ.js"]},"src/routes/index.tsx?tsr-split=component":{"file":"assets/index-DZYgaiQf.js","name":"index","src":"src/routes/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_card-DtHpFZbu.js","_AccentButton-1guupTMB.js","_button-1p6NbWQA.js"]},"src/routes/news.index.tsx?tsr-split=component":{"file":"assets/news.index-vJVx6wpY.js","name":"news.index","src":"src/routes/news.index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_useQuery-Bm7vSMYN.js","_CustomButtonLink-DOih7mnW.js","_utils-km2FGkQ4.js"]},"src/routes/news.search.tsx?tsr-split=component":{"file":"assets/news.search-UIx0YPU2.js","name":"news.search","src":"src/routes/news.search.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_useQuery-Bm7vSMYN.js","_CustomButtonLink-DOih7mnW.js","_utils-km2FGkQ4.js"]},"src/routes/news.tsx?tsr-split=component":{"file":"assets/news-DkenrNyv.js","name":"news","src":"src/routes/news.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js"]},"src/routes/test.tsx?tsr-split=component":{"file":"assets/test-VzF1q6u_.js","name":"test","src":"src/routes/test.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_AccentButton-1guupTMB.js","_createLucideIcon-BdBzZ_PZ.js","_card-DtHpFZbu.js","_textarea-BvKsEWrI.js","_input-DhjTea2T.js","_button-1p6NbWQA.js"]},"src/routes/ui-showcase.tsx?tsr-split=component":{"file":"assets/ui-showcase-BwF75R9g.js","name":"ui-showcase","src":"src/routes/ui-showcase.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-Bm6Vdnqp.js","_button-1p6NbWQA.js","_card-DtHpFZbu.js","_input-DhjTea2T.js","_label-Db2qutF5.js","_textarea-BvKsEWrI.js","_switch-Cxhce_M3.js","_check-B6B75W4y.js","_createLucideIcon-BdBzZ_PZ.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-B_qVtcKn.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_client-Bm6Vdnqp.js"]}},"ssr":{"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/styles/app.css":{"file":"assets/app-vZFrISN_.css","src":"C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/styles/app.css"},"_AccentButton-L3kOol_A.js":{"file":"assets/AccentButton-L3kOol_A.js","name":"AccentButton","imports":["_button-B3FJhynQ.js"]},"_CustomButtonLink-B6Lb5M_T.js":{"file":"assets/CustomButtonLink-B6Lb5M_T.js","name":"CustomButtonLink"},"_alert-B939vdC4.js":{"file":"assets/alert-B939vdC4.js","name":"alert","imports":["_button-B3FJhynQ.js"]},"_button-B3FJhynQ.js":{"file":"assets/button-B3FJhynQ.js","name":"button"},"_card-0DekqH9F.js":{"file":"assets/card-0DekqH9F.js","name":"card","imports":["_button-B3FJhynQ.js"]},"_checkbox-8ie8z6BN.js":{"file":"assets/checkbox-8ie8z6BN.js","name":"checkbox","imports":["_button-B3FJhynQ.js"]},"_input-CVyGX5WE.js":{"file":"assets/input-CVyGX5WE.js","name":"input","imports":["_button-B3FJhynQ.js"]},"_label-CovgPzvG.js":{"file":"assets/label-CovgPzvG.js","name":"label","imports":["_button-B3FJhynQ.js"]},"_ssr-BAVZeLNP.js":{"file":"assets/ssr-BAVZeLNP.js","name":"ssr","dynamicImports":["src/routes/ui-showcase.tsx?tsr-split=component","src/routes/test.tsx?tsr-split=component","src/routes/news.tsx?tsr-split=component","src/routes/form.tsx?tsr-split=component","src/routes/_authed.tsx?tsr-split=errorComponent","src/routes/index.tsx?tsr-split=component","src/routes/news.index.tsx?tsr-split=component","src/routes/news.search.tsx?tsr-split=component","src/routes/_authed/todos.tsx?tsr-split=component","src/routes/_authed/subscription.tsx?tsr-split=component","src/routes/_authed/profile.tsx?tsr-split=component","src/routes/_authed/posts.tsx?tsr-split=component","src/routes/_authed/notes.tsx?tsr-split=component","src/routes/_authed/counter.tsx?tsr-split=component","src/routes/_authed/posts.index.tsx?tsr-split=component","src/routes/_authed/subscription.success.tsx?tsr-split=component","src/routes/_authed/profile.$.tsx?tsr-split=component","src/routes/_authed/posts.$postId.tsx?tsr-split=notFoundComponent","src/routes/_authed/posts.$postId.tsx?tsr-split=component"],"assets":["assets/app-vZFrISN_.css"]},"_switch-m0TDxieA.js":{"file":"assets/switch-m0TDxieA.js","name":"switch","imports":["_button-B3FJhynQ.js"]},"_textarea-D88q28tT.js":{"file":"assets/textarea-D88q28tT.js","name":"textarea","imports":["_button-B3FJhynQ.js"]},"_useServerFn-DtzmTnlI.js":{"file":"assets/useServerFn-DtzmTnlI.js","name":"useServerFn"},"src/routes/_authed.tsx?tsr-split=errorComponent":{"file":"assets/_authed-2fD3zvzN.js","name":"_authed","src":"src/routes/_authed.tsx?tsr-split=errorComponent","isDynamicEntry":true},"src/routes/_authed/counter.tsx?tsr-split=component":{"file":"assets/counter-CFSwNB52.js","name":"counter","src":"src/routes/_authed/counter.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js"]},"src/routes/_authed/notes.tsx?tsr-split=component":{"file":"assets/notes-BkTb-gBf.js","name":"notes","src":"src/routes/_authed/notes.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js","_card-0DekqH9F.js","_input-CVyGX5WE.js","_textarea-D88q28tT.js","_label-CovgPzvG.js","_AccentButton-L3kOol_A.js","_useServerFn-DtzmTnlI.js","_button-B3FJhynQ.js"]},"src/routes/_authed/posts.$postId.tsx?tsr-split=component":{"file":"assets/posts._postId-CFuP4T-1.js","name":"posts._postId","src":"src/routes/_authed/posts.$postId.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js"]},"src/routes/_authed/posts.$postId.tsx?tsr-split=notFoundComponent":{"file":"assets/posts._postId-BlgZU5i-.js","name":"posts._postId","src":"src/routes/_authed/posts.$postId.tsx?tsr-split=notFoundComponent","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js"]},"src/routes/_authed/posts.index.tsx?tsr-split=component":{"file":"assets/posts.index-GrcD0GTd.js","name":"posts.index","src":"src/routes/_authed/posts.index.tsx?tsr-split=component","isDynamicEntry":true},"src/routes/_authed/posts.tsx?tsr-split=component":{"file":"assets/posts-BK34saH5.js","name":"posts","src":"src/routes/_authed/posts.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js"]},"src/routes/_authed/profile.$.tsx?tsr-split=component":{"file":"assets/profile._-DqrFQDQn.js","name":"profile._","src":"src/routes/_authed/profile.$.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js"]},"src/routes/_authed/profile.tsx?tsr-split=component":{"file":"assets/profile-ypuUBJ2d.js","name":"profile","src":"src/routes/_authed/profile.tsx?tsr-split=component","isDynamicEntry":true},"src/routes/_authed/subscription.success.tsx?tsr-split=component":{"file":"assets/subscription.success-Ci4atYtc.js","name":"subscription.success","src":"src/routes/_authed/subscription.success.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js","_card-0DekqH9F.js","_button-B3FJhynQ.js","_alert-B939vdC4.js"]},"src/routes/_authed/subscription.tsx?tsr-split=component":{"file":"assets/subscription-DCF9d3u8.js","name":"subscription","src":"src/routes/_authed/subscription.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js","_card-0DekqH9F.js","_button-B3FJhynQ.js","_alert-B939vdC4.js"]},"src/routes/_authed/todos.tsx?tsr-split=component":{"file":"assets/todos-D4sNZftQ.js","name":"todos","src":"src/routes/_authed/todos.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-BAVZeLNP.js","_card-0DekqH9F.js","_input-CVyGX5WE.js","_textarea-D88q28tT.js","_label-CovgPzvG.js","_checkbox-8ie8z6BN.js","_AccentButton-L3kOol_A.js","_useServerFn-DtzmTnlI.js","_button-B3FJhynQ.js"]},"src/routes/form.tsx?tsr-split=component":{"file":"assets/form-DwcDPiMi.js","name":"form","src":"src/routes/form.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_button-B3FJhynQ.js","_input-CVyGX5WE.js","_label-CovgPzvG.js","_checkbox-8ie8z6BN.js","_switch-m0TDxieA.js"]},"src/routes/index.tsx?tsr-split=component":{"file":"assets/index-D50cUs0C.js","name":"index","src":"src/routes/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_card-0DekqH9F.js","_AccentButton-L3kOol_A.js","_button-B3FJhynQ.js"]},"src/routes/news.index.tsx?tsr-split=component":{"file":"assets/news.index-DfhRzWom.js","name":"news.index","src":"src/routes/news.index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_CustomButtonLink-B6Lb5M_T.js","_ssr-BAVZeLNP.js"]},"src/routes/news.search.tsx?tsr-split=component":{"file":"assets/news.search-3GhHaRX3.js","name":"news.search","src":"src/routes/news.search.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_CustomButtonLink-B6Lb5M_T.js","_ssr-BAVZeLNP.js"]},"src/routes/news.tsx?tsr-split=component":{"file":"assets/news-BG2PFbXI.js","name":"news","src":"src/routes/news.tsx?tsr-split=component","isDynamicEntry":true},"src/routes/test.tsx?tsr-split=component":{"file":"assets/test-DeRTET2Q.js","name":"test","src":"src/routes/test.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_AccentButton-L3kOol_A.js","_card-0DekqH9F.js","_textarea-D88q28tT.js","_input-CVyGX5WE.js","_button-B3FJhynQ.js"]},"src/routes/ui-showcase.tsx?tsr-split=component":{"file":"assets/ui-showcase-DYUc1TPx.js","name":"ui-showcase","src":"src/routes/ui-showcase.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_button-B3FJhynQ.js","_card-0DekqH9F.js","_input-CVyGX5WE.js","_label-CovgPzvG.js","_textarea-D88q28tT.js","_switch-m0TDxieA.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_ssr-BAVZeLNP.js"]}},"server":{"_index-ujMS-7Qz.js":{"file":"assets/index-ujMS-7Qz.js","name":"index"},"_prisma-C1KGuali.js":{"file":"assets/prisma-C1KGuali.js","name":"prisma"},"src/routes/__root.tsx?tsr-directive-use-server=":{"file":"assets/__root-BikZATS_.js","name":"__root","src":"src/routes/__root.tsx?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_prisma-C1KGuali.js","_index-ujMS-7Qz.js"]},"src/utils/notes.ts?tsr-directive-use-server=":{"file":"assets/notes-D709YdQr.js","name":"notes","src":"src/utils/notes.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_prisma-C1KGuali.js","_index-ujMS-7Qz.js"]},"src/utils/posts.ts?tsr-directive-use-server=":{"file":"assets/posts-CZaQTmVw.js","name":"posts","src":"src/utils/posts.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-ujMS-7Qz.js"]},"src/utils/stripe.ts?tsr-directive-use-server=":{"file":"assets/stripe-BbML_eyX.js","name":"stripe","src":"src/utils/stripe.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-ujMS-7Qz.js"]},"src/utils/todos.ts?tsr-directive-use-server=":{"file":"assets/todos-DA9S9F6Y.js","name":"todos","src":"src/utils/todos.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_prisma-C1KGuali.js","_index-ujMS-7Qz.js"]},"virtual:$vinxi/handler/server":{"file":"server.js","name":"server","src":"virtual:$vinxi/handler/server","isEntry":true,"dynamicImports":["src/routes/__root.tsx?tsr-directive-use-server=","src/utils/posts.ts?tsr-directive-use-server=","src/utils/posts.ts?tsr-directive-use-server=","src/utils/stripe.ts?tsr-directive-use-server=","src/utils/stripe.ts?tsr-directive-use-server=","src/utils/stripe.ts?tsr-directive-use-server=","src/utils/stripe.ts?tsr-directive-use-server=","src/utils/notes.ts?tsr-directive-use-server=","src/utils/notes.ts?tsr-directive-use-server=","src/utils/notes.ts?tsr-directive-use-server=","src/utils/notes.ts?tsr-directive-use-server=","src/utils/notes.ts?tsr-directive-use-server=","src/utils/todos.ts?tsr-directive-use-server=","src/utils/todos.ts?tsr-directive-use-server=","src/utils/todos.ts?tsr-directive-use-server=","src/utils/todos.ts?tsr-directive-use-server=","src/utils/todos.ts?tsr-directive-use-server="]}},"api":{"_index-DzKPS_17.js":{"file":"assets/index-DzKPS_17.js","name":"index","dynamicImports":["src/routes/api/ai/magic-text.ts?pick=APIRoute","src/routes/api/ai/magic-text.ts?pick=APIRoute","src/routes/api/stripe/webhooks.ts?pick=APIRoute","src/routes/api/stripe/webhooks.ts?pick=APIRoute"]},"src/routes/api/ai/magic-text.ts?pick=APIRoute":{"file":"magic-text.js","name":"magic-text","src":"src/routes/api/ai/magic-text.ts?pick=APIRoute","isEntry":true,"isDynamicEntry":true,"imports":["_index-DzKPS_17.js"]},"src/routes/api/stripe/webhooks.ts?pick=APIRoute":{"file":"webhooks.js","name":"webhooks","src":"src/routes/api/stripe/webhooks.ts?pick=APIRoute","isEntry":true,"isDynamicEntry":true,"imports":["_index-DzKPS_17.js"]},"virtual:$vinxi/handler/api":{"file":"api.js","name":"api","src":"virtual:$vinxi/handler/api","isEntry":true,"imports":["_index-DzKPS_17.js"]}}};

				const routeManifest = {"api":{}};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join$1(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join$1(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join$1(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 




			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

const j$1 = { "src_routes_root_tsx--fetchClerkAuth_createServerFn_handler": { functionName: "fetchClerkAuth_createServerFn_handler", importer: () => import('../build/__root-BikZATS_.mjs') }, "src_utils_posts_ts--fetchPost_createServerFn_handler": { functionName: "fetchPost_createServerFn_handler", importer: () => import('../build/posts-CZaQTmVw.mjs') }, "src_utils_posts_ts--fetchPosts_createServerFn_handler": { functionName: "fetchPosts_createServerFn_handler", importer: () => import('../build/posts-CZaQTmVw.mjs') }, "src_utils_stripe_ts--createCheckoutSession_createServerFn_handler": { functionName: "createCheckoutSession_createServerFn_handler", importer: () => import('../build/stripe-BbML_eyX.mjs') }, "src_utils_stripe_ts--createPortalSession_createServerFn_handler": { functionName: "createPortalSession_createServerFn_handler", importer: () => import('../build/stripe-BbML_eyX.mjs') }, "src_utils_stripe_ts--getSubscriptionDetails_createServerFn_handler": { functionName: "getSubscriptionDetails_createServerFn_handler", importer: () => import('../build/stripe-BbML_eyX.mjs') }, "src_utils_stripe_ts--checkSubscriptionStatus_createServerFn_handler": { functionName: "checkSubscriptionStatus_createServerFn_handler", importer: () => import('../build/stripe-BbML_eyX.mjs') }, "src_utils_notes_ts--getNotes_createServerFn_handler": { functionName: "getNotes_createServerFn_handler", importer: () => import('../build/notes-D709YdQr.mjs') }, "src_utils_notes_ts--getNoteById_createServerFn_handler": { functionName: "getNoteById_createServerFn_handler", importer: () => import('../build/notes-D709YdQr.mjs') }, "src_utils_notes_ts--createNote_createServerFn_handler": { functionName: "createNote_createServerFn_handler", importer: () => import('../build/notes-D709YdQr.mjs') }, "src_utils_notes_ts--updateNote_createServerFn_handler": { functionName: "updateNote_createServerFn_handler", importer: () => import('../build/notes-D709YdQr.mjs') }, "src_utils_notes_ts--deleteNote_createServerFn_handler": { functionName: "deleteNote_createServerFn_handler", importer: () => import('../build/notes-D709YdQr.mjs') }, "src_utils_todos_ts--getTodos_createServerFn_handler": { functionName: "getTodos_createServerFn_handler", importer: () => import('../build/todos-DA9S9F6Y.mjs') }, "src_utils_todos_ts--getTodoById_createServerFn_handler": { functionName: "getTodoById_createServerFn_handler", importer: () => import('../build/todos-DA9S9F6Y.mjs') }, "src_utils_todos_ts--createTodo_createServerFn_handler": { functionName: "createTodo_createServerFn_handler", importer: () => import('../build/todos-DA9S9F6Y.mjs') }, "src_utils_todos_ts--updateTodo_createServerFn_handler": { functionName: "updateTodo_createServerFn_handler", importer: () => import('../build/todos-DA9S9F6Y.mjs') }, "src_utils_todos_ts--deleteTodo_createServerFn_handler": { functionName: "deleteTodo_createServerFn_handler", importer: () => import('../build/todos-DA9S9F6Y.mjs') } }, $ = eventHandler$1(k$2), u = j$1;
async function k$2(r) {
  const n = toWebRequest(r);
  return await A$1({ request: n, event: r });
}
function D(r) {
  return r.replace(/^\/|\/$/g, "");
}
async function A$1({ request: r, event: n }) {
  const s = new AbortController(), i = s.signal, h = () => s.abort();
  n.node.req.on("close", h);
  const v = r.method, S = new URL(r.url, "http://localhost:3000"), C = new RegExp(`${D("/_server")}/([^/?#]+)`), F = S.pathname.match(C), o = F ? F[1] : null, c = Object.fromEntries(S.searchParams.entries()), f = "createServerFn" in c, R = "raw" in c;
  if (typeof o != "string") throw new Error("Invalid server action param for serverFnId: " + o);
  const m = u[o];
  if (!m) throw console.log("serverFnManifest", u), new Error("Server function info not found for " + o);
  let l;
  if (l = await m.importer(), !l) throw console.log("serverFnManifest", u), new Error("Server function module not resolved for " + o);
  const a = l[m.functionName];
  if (!a) throw console.log("serverFnManifest", u), console.log("fnModule", l), new Error(`Server function module export not resolved for serverFn ID: ${o}`);
  const x = ["multipart/form-data", "application/x-www-form-urlencoded"], _ = await (async () => {
    try {
      let e = await (async () => {
        if (r.headers.get("Content-Type") && x.some((t) => {
          var N;
          return (N = r.headers.get("Content-Type")) == null ? void 0 : N.includes(t);
        })) return b$2(v.toLowerCase() !== "get", "GET requests with FormData payloads are not supported"), await a(await r.formData(), i);
        if (v.toLowerCase() === "get") {
          let t = c;
          return f && (t = c.payload), t = t && startSerializer.parse(t), await a(t, i);
        }
        const d = await r.text(), w = startSerializer.parse(d);
        return f ? await a(w, i) : await a(...w, i);
      })();
      return e.result instanceof Response ? e.result : !f && (e = e.result, e instanceof Response) ? e : isRedirect(e) || isNotFound(e) ? T$1(e) : new Response(e !== void 0 ? startSerializer.stringify(e) : void 0, { status: getResponseStatus(getEvent()), headers: { "Content-Type": "application/json" } });
    } catch (e) {
      return e instanceof Response ? e : isRedirect(e) || isNotFound(e) ? T$1(e) : (console.info(), console.info("Server Fn Error!"), console.info(), console.error(e), console.info(), new Response(startSerializer.stringify(e), { status: 500, headers: { "Content-Type": "application/json" } }));
    }
  })();
  if (n.node.req.removeListener("close", h), R) return _;
  if (_.headers.get("Content-Type") === "application/json") {
    const d = await _.clone().text();
    d && JSON.stringify(JSON.parse(d));
  }
  return _;
}
function T$1(r) {
  const { headers: n, ...s } = r;
  return new Response(JSON.stringify(s), { status: 200, headers: { "Content-Type": "application/json", ...n || {} } });
}

const m = [{ path: "/form", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/form.tsx" }, { path: "/", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/index.tsx" }, { path: "/news/search", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/news.search.tsx" }, { path: "/news", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/news.tsx" }, { path: "/test", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/test.tsx" }, { path: "/ui-showcase", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/ui-showcase.tsx" }, { path: "/_authed", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed.tsx" }, { path: "/__root", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/__root.tsx" }, { path: "/_authed/counter", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/counter.tsx" }, { path: "/_authed/notes", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/notes.tsx" }, { path: "/_authed/posts/:$postId?", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/posts.$postId.tsx" }, { path: "/_authed/posts", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/posts.tsx" }, { path: "/_authed/profile/*splat", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/profile.$.tsx" }, { path: "/_authed/profile", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/profile.tsx" }, { path: "/_authed/subscription/success", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/subscription.success.tsx" }, { path: "/_authed/subscription", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/subscription.tsx" }, { path: "/_authed/todos", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/_authed/todos.tsx" }, { path: "/api/ai/magic-text", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/api/ai/magic-text.ts", $APIRoute: { src: "src/routes/api/ai/magic-text.ts?pick=APIRoute", build: () => import('../build/magic-text.mjs'), import: () => import('../build/magic-text.mjs') } }, { path: "/api/stripe/webhooks", filePath: "C:/git/cizzle-app-starters/templates/tanstack-start-clerk-supabase-shadcn/src/routes/api/stripe/webhooks.ts", $APIRoute: { src: "src/routes/api/stripe/webhooks.ts?pick=APIRoute", build: () => import('../build/webhooks.mjs'), import: () => import('../build/webhooks.mjs') } }], k$1 = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
function b(t) {
  return eventHandler$1(async (a) => {
    const r = toWebRequest(a);
    return await t({ request: r });
  });
}
const _$1 = (t) => (a) => ({ path: t, methods: a });
function P(t, a) {
  const r = t.pathname.split("/").filter(Boolean), p = a.sort((e, s) => {
    const o = e.routePath.split("/").filter(Boolean);
    return s.routePath.split("/").filter(Boolean).length - o.length;
  }).filter((e) => {
    const s = e.routePath.split("/").filter(Boolean);
    return r.length >= s.length;
  });
  for (const e of p) {
    const s = e.routePath.split("/").filter(Boolean), o = {};
    let c = true;
    for (let i = 0; i < s.length; i++) {
      const l = s[i], u = r[i];
      if (l.startsWith("$")) if (l === "$") {
        const n = r.slice(i).join("/");
        if (n !== "") o["*"] = n, o._splat = n;
        else {
          c = false;
          break;
        }
      } else {
        const n = l.slice(1);
        o[n] = u;
      }
      else if (l !== u) {
        c = false;
        break;
      }
    }
    if (c) return { routePath: e.routePath, params: o, payload: e.payload };
  }
}
const h = m.filter((t) => t.$APIRoute);
function z$1(t) {
  const a = [];
  return t.forEach((r) => {
    const e = r.path.split("/").filter(Boolean).map((s) => s === "*splat" ? "$" : s.startsWith(":$") && s.endsWith("?") ? s.slice(1, -1) : s).join("/");
    a.push({ routePath: `/${e}`, payload: r });
  }), a;
}
const x$1 = async ({ request: t }) => {
  if (!h.length) return new Response("No routes found", { status: 404 });
  if (!k$1.includes(t.method)) return new Response("Method not allowed", { status: 405 });
  const a = z$1(h), r = new URL(t.url, "http://localhost:3000"), p = P(r, a);
  if (!p) return new Response("Not found", { status: 404 });
  let e;
  try {
    e = await p.payload.$APIRoute.import().then((c) => c.APIRoute);
  } catch (c) {
    return console.error("Error importing route file:", c), new Response("Internal server error", { status: 500 });
  }
  if (!e) return new Response("Internal server error", { status: 500 });
  const s = t.method, o = e.methods[s];
  return o ? await o({ request: t, params: p.params }) : new Response("Method not allowed", { status: 405 });
};

const d = b(x$1);

function E(e) {
  return jsx(RouterProvider, { router: e.router });
}
const et = defineHandlerCallback(async ({ request: e, router: t, responseHeaders: o }) => {
  if (typeof $$1.renderToReadableStream == "function") {
    const n = await $$1.renderToReadableStream(jsx(E, { router: t }), { signal: e.signal });
    isbot(e.headers.get("User-Agent")) && await n.allReady;
    const s = transformReadableStreamWithRouter(t, n);
    return new Response(s, { status: t.state.statusCode, headers: o });
  }
  if (typeof $$1.renderToPipeableStream == "function") {
    const n = new PassThrough();
    try {
      const u = $$1.renderToPipeableStream(jsx(E, { router: t }), { ...isbot(e.headers.get("User-Agent")) ? { onAllReady() {
        u.pipe(n);
      } } : { onShellReady() {
        u.pipe(n);
      } }, onError: (h, i) => {
        console.error("Error in renderToPipeableStream:", h, i);
      } });
    } catch (u) {
      console.error("Error in renderToPipeableStream:", u);
    }
    const s = transformPipeableStreamWithRouter(t, n);
    return new Response(s, { status: t.state.statusCode, headers: o });
  }
  throw new Error("No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.");
}), tt = () => ({ routes: { __root__: { filePath: "__root.tsx", children: ["/", "/_authed", "/form", "/news", "/test", "/ui-showcase"], preloads: ["\\_build\\assets\\client-B_qVtcKn.js", "\\_build\\assets\\client-Bm6Vdnqp.js"] }, "/": { filePath: "index.tsx" }, "/_authed": { filePath: "_authed.tsx", children: ["/_authed/counter", "/_authed/notes", "/_authed/posts", "/_authed/profile", "/_authed/subscription", "/_authed/todos"] }, "/form": { filePath: "form.tsx" }, "/news": { filePath: "news.tsx", children: ["/news/search", "/news/"] }, "/test": { filePath: "test.tsx" }, "/ui-showcase": { filePath: "ui-showcase.tsx" }, "/_authed/counter": { filePath: "_authed/counter.tsx", parent: "/_authed" }, "/_authed/notes": { filePath: "_authed/notes.tsx", parent: "/_authed" }, "/_authed/posts": { filePath: "_authed/posts.tsx", parent: "/_authed", children: ["/_authed/posts/$postId", "/_authed/posts/"] }, "/_authed/profile": { filePath: "_authed/profile.tsx", parent: "/_authed", children: ["/_authed/profile/$"] }, "/_authed/subscription": { filePath: "_authed/subscription.tsx", parent: "/_authed", children: ["/_authed/subscription/success"] }, "/_authed/todos": { filePath: "_authed/todos.tsx", parent: "/_authed" }, "/news/search": { filePath: "news.search.tsx", parent: "/news" }, "/news/": { filePath: "news.index.tsx", parent: "/news" }, "/_authed/posts/$postId": { filePath: "_authed/posts.$postId.tsx", parent: "/_authed/posts" }, "/_authed/profile/$": { filePath: "_authed/profile.$.tsx", parent: "/_authed/profile" }, "/_authed/subscription/success": { filePath: "_authed/subscription.success.tsx", parent: "/_authed/subscription" }, "/_authed/posts/": { filePath: "_authed/posts.index.tsx", parent: "/_authed/posts" } } });
function rt(e) {
  return globalThis.MANIFEST[e];
}
function ot() {
  var _a;
  const e = tt(), t = e.routes.__root__ = e.routes.__root__ || {};
  t.assets = t.assets || [];
  let o = "";
  const n = rt("client"), s = (_a = n.inputs[n.handler]) == null ? void 0 : _a.output.path;
  return s || b$2(s, "Could not find client entry in vinxi manifest"), t.assets.push({ tag: "script", attrs: { type: "module", suppressHydrationWarning: true, async: true }, children: `${o}import("${s}")` }), e;
}
function nt() {
  const e = ot();
  return { ...e, routes: Object.fromEntries(Object.entries(e.routes).map(([t, o]) => {
    const { preloads: n, assets: s } = o;
    return [t, { preloads: n, assets: s }];
  })) };
}
async function st(e, t, o) {
  var n;
  const s = t[0];
  if (isPlainObject$1(s) && s.method) {
    const i = s, f = i.data instanceof FormData ? "formData" : "payload", v = new Headers({ ...f === "payload" ? { "content-type": "application/json", accept: "application/json" } : {}, ...i.headers instanceof Headers ? Object.fromEntries(i.headers.entries()) : i.headers });
    if (i.method === "GET") {
      const m = encode$1({ payload: startSerializer.stringify({ data: i.data, context: i.context }) });
      m && (e.includes("?") ? e += `&${m}` : e += `?${m}`);
    }
    e.includes("?") ? e += "&createServerFn" : e += "?createServerFn", i.response === "raw" && (e += "&raw");
    const S = await o(e, { method: i.method, headers: v, signal: i.signal, ...at(i) }), b = await j(S);
    if ((n = b.headers.get("content-type")) != null && n.includes("application/json")) {
      const m = startSerializer.decode(await b.json());
      if (isRedirect(m) || isNotFound(m) || m instanceof Error) throw m;
      return m;
    }
    return b;
  }
  const u = await j(await o(e, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(t) })), h = u.headers.get("content-type");
  return h && h.includes("application/json") ? startSerializer.decode(await u.json()) : u.text();
}
function at(e) {
  var _a;
  return e.method === "POST" ? e.data instanceof FormData ? (e.data.set("__TSR_CONTEXT", startSerializer.stringify(e.context)), { body: e.data }) : { body: startSerializer.stringify({ data: (_a = e.data) != null ? _a : null, context: e.context }) } : {};
}
async function j(e) {
  if (!e.ok) {
    const t = e.headers.get("content-type");
    throw t && t.includes("application/json") ? startSerializer.decode(await e.json()) : new Error(await e.text());
  }
  return e;
}
function it(e) {
  return e.replace(/^\/|\/$/g, "");
}
const x = (e, t) => {
  const o = `/${it(t)}/${e}`;
  return Object.assign((...s) => st(o, s, async (u, h) => {
    h.headers = mergeHeaders$2(getHeaders(), h.headers);
    const i = await $fetch.native(u, h), f = getEvent(), v = mergeHeaders$2(i.headers, f.___ssrRpcResponseHeaders);
    return f.___ssrRpcResponseHeaders = v, i;
  }), { url: o, functionId: e });
}, ct = () => useDispatch(), k = useSelector;
function dt({ children: e }) {
  const { mode: t } = k((o) => o.theme);
  return useEffect(() => {
    const o = document.documentElement;
    t === "dark" ? o.classList.add("dark") : t === "light" ? o.classList.remove("dark") : t === "system" && (window.matchMedia("(prefers-color-scheme: dark)").matches ? o.classList.add("dark") : o.classList.remove("dark"));
  }, [t]), jsx(Fragment, { children: e });
}
process.env.STRIPE_SECRET_KEY && new He(process.env.STRIPE_SECRET_KEY || void 0 || "", { apiVersion: "2025-02-24.acacia" });
const Zr = { MONTHLY: { id: "monthly", name: "Monthly Plan", description: "Perfect for individuals", price: "$9.99", period: "month", features: ["Full access to all features", "Priority support", "Regular updates", "Cancel anytime"], priceId: "price_monthly" }, ANNUAL: { id: "annual", name: "Annual Plan", description: "Best value for committed users", price: "$99.99", period: "year", features: ["Everything in Monthly Plan", "2 months free", "Premium support", "Early access to new features"], priceId: "price_annual", isBestValue: true } }, lt = x("src_utils_stripe_ts--createCheckoutSession_createServerFn_handler", "/_server"), pt = createServerFn({ method: "POST" }).validator((e) => e.object({ priceId: e.string(), successUrl: e.string().optional(), cancelUrl: e.string().optional() })).handler(lt), ut = x("src_utils_stripe_ts--createPortalSession_createServerFn_handler", "/_server"), ht = createServerFn({ method: "POST" }).validator((e) => e.object({ returnUrl: e.string().optional() })).handler(ut), mt = x("src_utils_stripe_ts--getSubscriptionDetails_createServerFn_handler", "/_server"), eo = createServerFn({ method: "GET" }).validator((e) => e.object({ sessionId: e.string() })).handler(mt), ft = x("src_utils_stripe_ts--checkSubscriptionStatus_createServerFn_handler", "/_server"), gt = createServerFn({ method: "GET" }).handler(ft), to = { async createCheckout(e) {
  try {
    const t = await pt({ priceId: e });
    return window.location.href = t.url, t;
  } catch (t) {
    throw console.error("Error creating checkout:", t), d$1.error("Failed to start checkout process"), t;
  }
}, async createPortal() {
  try {
    const e = await ht({ returnUrl: window.location.origin + "/subscription" });
    return window.location.href = e.url, e;
  } catch (e) {
    throw console.error("Error creating portal session:", e), d$1.error("Failed to access billing portal"), e;
  }
} }, xt = { isActive: false, planId: void 0, planName: void 0, isLoading: true, refetch: async () => {
} }, O = createContext$1(xt), ro = () => useContext(O);
function yt({ children: e }) {
  const { isSignedIn: t, user: o } = useUser(), [n, s] = useState(false), [u, h] = useState(void 0), [i, f] = useState(void 0), [v, S] = useState(true), b = async () => {
    if (!t) {
      s(false), h(void 0), f(void 0), S(false);
      return;
    }
    try {
      S(true);
      const R = await gt();
      s(R.isActive), h(R.planId), f(R.planName);
    } catch (R) {
      console.error("Error fetching subscription status:", R), d$1.error("Failed to check subscription status"), s(false);
    } finally {
      S(false);
    }
  };
  useEffect(() => {
    b();
  }, [t]);
  const m = { isActive: n, planId: u, planName: i, isLoading: v, refetch: b };
  return jsx(O.Provider, { value: m, children: e });
}
const _t = { mode: "system" }, z = createSlice({ name: "theme", initialState: _t, reducers: { setTheme: (e, t) => {
  e.mode = t.payload;
} } }), { setTheme: bt } = z.actions, wt = z.reducer;
function vt() {
  const e = ct(), { mode: t } = k((n) => n.theme);
  return jsx("div", { className: "bg-white dark:bg-gray-900 shadow-md", children: jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: jsxs("div", { className: "flex justify-between h-16", children: [jsxs("div", { className: "flex", children: [jsx("div", { className: "flex-shrink-0 flex items-center", children: jsx(Link, { to: "/", className: "text-2xl font-bold text-indigo-600 dark:text-indigo-400", children: "Cizzle's TanStack Starter" }) }), jsxs("div", { className: "hidden sm:ml-6 sm:flex sm:space-x-8", children: [jsx(Link, { to: "/", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, activeOptions: { exact: true }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Home" }), jsx(Link, { to: "/todos", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Todos" }), jsx(Link, { to: "/notes", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Notes" }), jsx(Link, { to: "/counter", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Counter" }), jsx(Link, { to: "/posts", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Posts" }), jsx(Link, { to: "/news", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "News" }), jsx(Link, { to: "/ui-showcase", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "UI Components" }), jsx(Link, { to: "/subscription", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Subscription" }), jsx(Link, { to: "/test", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Test" }), jsx(Link, { to: "/form", activeProps: { className: "border-indigo-500 text-gray-900 dark:text-white" }, className: "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium", children: "Form" })] })] }), jsxs("div", { className: "flex items-center space-x-4", children: [jsx("button", { onClick: () => {
    e(bt(t === "dark" ? "light" : "dark"));
  }, className: "p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300", children: t === "dark" ? jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: jsx("path", { fillRule: "evenodd", d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z", clipRule: "evenodd" }) }) : jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: jsx("path", { d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" }) }) }), jsxs("div", { className: "ml-auto", children: [jsx(SignedIn, { children: jsx(UserButton, { afterSignOutUrl: "/" }) }), jsx(SignedOut, { children: jsx(SignInButton, { mode: "modal" }) })] })] })] }) }) });
}
function H({ error: e }) {
  const t = useRouter(), o = useMatch({ strict: false, select: (n) => n.id === rootRouteId });
  return console.error(e), jsxs("div", { className: "min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6", children: [jsx(ErrorComponent, { error: e }), jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [jsx("button", { onClick: () => {
    t.invalidate();
  }, className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", children: "Try Again" }), o ? jsx(Link, { to: "/", className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", children: "Home" }) : jsx(Link, { to: "/", className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", onClick: (n) => {
    n.preventDefault(), window.history.back();
  }, children: "Go Back" })] })] });
}
function B({ children: e }) {
  return jsxs("div", { className: "space-y-2 p-2", children: [jsx("div", { className: "text-gray-600 dark:text-gray-400", children: e || jsx("p", { children: "The page you are looking for does not exist." }) }), jsxs("p", { className: "flex items-center gap-2 flex-wrap", children: [jsx("button", { onClick: () => window.history.back(), className: "bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm", children: "Go back" }), jsx(Link, { to: "/", className: "bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm", children: "Start Over" })] })] });
}
const St = { value: 0 }, L = createSlice({ name: "counter", initialState: St, reducers: { increment: (e) => {
  e.value += 1;
}, decrement: (e) => {
  e.value -= 1;
}, incrementByAmount: (e, t) => {
  e.value += t.payload;
}, reset: (e) => {
  e.value = 0;
} } }), { increment: oo, decrement: no, incrementByAmount: so, reset: ao } = L.actions, Rt = L.reducer, Pt = { notifications: [] }, U = createSlice({ name: "notifications", initialState: Pt, reducers: { addNotification: (e, t) => {
  const o = Date.now().toString();
  e.notifications.push({ ...t.payload, id: o });
}, removeNotification: (e, t) => {
  e.notifications = e.notifications.filter((o) => o.id !== t.payload);
}, clearNotifications: (e) => {
  e.notifications = [];
} } }), { addNotification: io, removeNotification: co, clearNotifications: lo } = U.actions, $t = U.reducer, Ct = configureStore({ reducer: { counter: Rt, theme: wt, notifications: $t } }), Nt = "/_build/assets/app-vZFrISN_.css", kt = x("src_routes_root_tsx--fetchClerkAuth_createServerFn_handler", "/_server"), At = createServerFn({ method: "GET" }).handler(kt), Tt = new QueryClient(), y = createRootRoute({ head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }], links: [{ rel: "stylesheet", href: Nt }, { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }, { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }, { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }, { rel: "manifest", href: "/site.webmanifest", color: "#fffff" }, { rel: "icon", href: "/favicon.ico" }] }), beforeLoad: async () => {
  const { userId: e } = await At();
  return { userId: e };
}, errorComponent: (e) => jsx(G, { children: jsx(H, { ...e }) }), notFoundComponent: () => jsx(B, {}), component: Ft });
function Ft() {
  return jsx(Provider, { store: Ct, children: jsx(QueryClientProvider, { client: Tt, children: jsx(ClerkProvider, { children: jsx(yt, { children: jsxs(G, { children: [jsx(Outlet, {}), jsx(ReactQueryDevtools, { initialIsOpen: false })] }) }) }) }) });
}
function G({ children: e }) {
  const { mode: t } = k((o) => o.theme);
  return jsxs("html", { className: t === "dark" ? "dark" : "", children: [jsx("head", { children: jsx(HeadContent, {}) }), jsxs("body", { className: "bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen", children: [jsxs(dt, { children: [jsx(vt, {}), jsx("main", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: e }), jsx(Toaster, { position: "top-right" }), jsx(TanStackRouterDevtools, { position: "bottom-right" })] }), jsx(Scripts, {})] })] });
}
const It = () => import('../build/ui-showcase-DYUc1TPx.mjs'), W = createFileRoute("/ui-showcase")({ component: lazyRouteComponent(It, "component", () => W.ssr) }), Et = () => import('../build/test-DeRTET2Q.mjs'), K = createFileRoute("/test")({ component: lazyRouteComponent(Et, "component", () => K.ssr), head: () => ({ title: "AI Magic Text Demo", meta: [{ name: "description", content: "Test the AI magic text functionality" }] }) }), V = ({ title: e, description: t, keywords: o, image: n }) => [{ title: e }, { name: "description", content: t }, { name: "keywords", content: o }, { name: "twitter:title", content: e }, { name: "twitter:description", content: t }, { name: "twitter:creator", content: "@tannerlinsley" }, { name: "twitter:site", content: "@tannerlinsley" }, { name: "og:type", content: "website" }, { name: "og:title", content: e }, { name: "og:description", content: t }, ...n ? [{ name: "twitter:image", content: n }, { name: "twitter:card", content: "summary_large_image" }, { name: "og:image", content: n }] : []], jt = () => import('../build/news-BG2PFbXI.mjs'), Y = createFileRoute("/news")({ component: lazyRouteComponent(jt, "component", () => Y.ssr), head: () => ({ title: "News Explorer", meta: [...V({ title: "News Explorer | TanStack Start Demo", description: "Search and explore news articles from around the world" })] }) }), Mt = () => import('../build/form-DwcDPiMi.mjs'), J = createFileRoute("/form")({ component: lazyRouteComponent(Mt, "component", () => J.ssr), head: () => ({ title: "Form Showcase | TanStack Form Demo", meta: [{ name: "description", content: "A comprehensive showcase of TanStack Form's features" }] }) }), Dt = () => import('../build/_authed-2fD3zvzN.mjs'), Ot = createFileRoute("/_authed")({ beforeLoad: ({ context: e }) => {
  if (!e.userId) throw new Error("Not authenticated");
}, errorComponent: lazyRouteComponent(Dt, "errorComponent") }), zt = () => import('../build/index-D50cUs0C.mjs'), Q = createFileRoute("/")({ component: lazyRouteComponent(zt, "component", () => Q.ssr) }), Ht = z$2.object({ source: z$2.object({ id: z$2.string().nullable(), name: z$2.string() }), author: z$2.string().nullable(), title: z$2.string(), description: z$2.string().nullable(), url: z$2.string().url(), urlToImage: z$2.string().url().nullable(), publishedAt: z$2.string(), content: z$2.string().nullable() }), q = z$2.object({ status: z$2.string(), totalResults: z$2.number(), articles: z$2.array(Ht) }), X = "https://newsapi.org/v2";
async function Bt({ data: e }) {
  const t = new URLSearchParams({ apiKey: "2601710ac62f4a5c800a804de80b17cb", category: e.category || "general", country: e.country || "us", pageSize: (e.pageSize || 10).toString(), page: (e.page || 1).toString() });
  try {
    const o = await fetch(`${X}/top-headlines?${t.toString()}`);
    if (!o.ok) {
      const s = await o.json();
      throw new Error(s.message || "Failed to fetch top headlines");
    }
    const n = await o.json();
    return q.parse(n);
  } catch (o) {
    throw console.error("Error fetching top headlines:", o), o;
  }
}
async function po({ data: e }) {
  const t = new URLSearchParams({ apiKey: process.env.NEWSAPI_KEY || void 0 || "", q: e.query, pageSize: (e.pageSize || 10).toString(), page: (e.page || 1).toString(), sortBy: e.sortBy || "publishedAt" });
  try {
    const o = await fetch(`${X}/everything?${t.toString()}`);
    if (!o.ok) {
      const s = await o.json();
      throw new Error(s.message || "Failed to search news");
    }
    const n = await o.json();
    return q.parse(n);
  } catch (o) {
    throw console.error("Error searching news:", o), o;
  }
}
const Lt = () => import('../build/news.index-DfhRzWom.mjs'), Z = createFileRoute("/news/")({ component: lazyRouteComponent(Lt, "component", () => Z.ssr), loader: async () => Bt({ data: { category: "general", pageSize: 12 } }) }), Ut = () => import('../build/news.search-3GhHaRX3.mjs'), ee = createFileRoute("/news/search")({ component: lazyRouteComponent(Ut, "component", () => ee.ssr), head: () => ({ title: "Search News Articles", meta: [...V({ title: "Search News Articles | TanStack Start Demo", description: "Search for news articles from around the world" })] }) }), Gt = () => import('../build/todos-D4sNZftQ.mjs'), te = createFileRoute("/_authed/todos")({ component: lazyRouteComponent(Gt, "component", () => te.ssr) }), Wt = () => import('../build/subscription-DCF9d3u8.mjs'), re = createFileRoute("/_authed/subscription")({ component: lazyRouteComponent(Wt, "component", () => re.ssr) }), Kt = () => import('../build/profile-ypuUBJ2d.mjs'), oe = createFileRoute("/_authed/profile")({ component: lazyRouteComponent(Kt, "component", () => oe.ssr) }), Vt = () => import('../build/posts-BK34saH5.mjs'), ne = createFileRoute("/_authed/posts")({ component: lazyRouteComponent(Vt, "component", () => ne.ssr) }), Yt = () => import('../build/notes-BkTb-gBf.mjs'), se = createFileRoute("/_authed/notes")({ component: lazyRouteComponent(Yt, "component", () => se.ssr) }), Jt = () => import('../build/counter-CFSwNB52.mjs'), ae = createFileRoute("/_authed/counter")({ component: lazyRouteComponent(Jt, "component", () => ae.ssr) }), Qt = () => import('../build/posts.index-GrcD0GTd.mjs'), ie = createFileRoute("/_authed/posts/")({ component: lazyRouteComponent(Qt, "component", () => ie.ssr) }), qt = () => import('../build/subscription.success-Ci4atYtc.mjs'), ce = createFileRoute("/_authed/subscription/success")({ component: lazyRouteComponent(qt, "component", () => ce.ssr) }), Xt = x("src_utils_posts_ts--fetchPost_createServerFn_handler", "/_server"), uo = createServerFn({ method: "GET" }).validator((e) => e).handler(Xt), Zt = x("src_utils_posts_ts--fetchPosts_createServerFn_handler", "/_server"), er = createServerFn({ method: "GET" }).handler(Zt), tr = () => import('../build/profile._-DqrFQDQn.mjs'), de = createFileRoute("/_authed/profile/$")({ loader: () => er(), component: lazyRouteComponent(tr, "component", () => de.ssr) }), rr = () => import('../build/posts._postId-BlgZU5i-.mjs'), or = () => import('../build/posts._postId-CFuP4T-1.mjs'), le = createFileRoute("/_authed/posts/$postId")({ errorComponent: nr, component: lazyRouteComponent(or, "component", () => le.ssr), notFoundComponent: lazyRouteComponent(rr, "notFoundComponent") });
function nr({ error: e }) {
  return jsx(ErrorComponent, { error: e });
}
const sr = W.update({ id: "/ui-showcase", path: "/ui-showcase", getParentRoute: () => y }), ar = K.update({ id: "/test", path: "/test", getParentRoute: () => y }), A = Y.update({ id: "/news", path: "/news", getParentRoute: () => y }), ir = J.update({ id: "/form", path: "/form", getParentRoute: () => y }), _ = Ot.update({ id: "/_authed", getParentRoute: () => y }), cr = Q.update({ id: "/", path: "/", getParentRoute: () => y }), dr = Z.update({ id: "/", path: "/", getParentRoute: () => A }), lr = ee.update({ id: "/search", path: "/search", getParentRoute: () => A }), pr = te.update({ id: "/todos", path: "/todos", getParentRoute: () => _ }), pe = re.update({ id: "/subscription", path: "/subscription", getParentRoute: () => _ }), ue = oe.update({ id: "/profile", path: "/profile", getParentRoute: () => _ }), T = ne.update({ id: "/posts", path: "/posts", getParentRoute: () => _ }), ur = se.update({ id: "/notes", path: "/notes", getParentRoute: () => _ }), hr = ae.update({ id: "/counter", path: "/counter", getParentRoute: () => _ }), mr = ie.update({ id: "/", path: "/", getParentRoute: () => T }), fr = ce.update({ id: "/success", path: "/success", getParentRoute: () => pe }), gr = de.update({ id: "/$", path: "/$", getParentRoute: () => ue }), xr = le.update({ id: "/$postId", path: "/$postId", getParentRoute: () => T }), yr = { AuthedPostsPostIdRoute: xr, AuthedPostsIndexRoute: mr }, _r = T._addFileChildren(yr), br = { AuthedProfileSplatRoute: gr }, wr = ue._addFileChildren(br), vr = { AuthedSubscriptionSuccessRoute: fr }, Sr = pe._addFileChildren(vr), Rr = { AuthedCounterRoute: hr, AuthedNotesRoute: ur, AuthedPostsRoute: _r, AuthedProfileRoute: wr, AuthedSubscriptionRoute: Sr, AuthedTodosRoute: pr }, Pr = _._addFileChildren(Rr), $r = { NewsSearchRoute: lr, NewsIndexRoute: dr }, Cr = A._addFileChildren($r), Nr = { IndexRoute: cr, AuthedRoute: Pr, FormRoute: ir, NewsRoute: Cr, TestRoute: ar, UiShowcaseRoute: sr }, kr = y._addFileChildren(Nr)._addFileTypes();
function Ar() {
  return createRouter$2({ routeTree: kr, defaultPreload: "intent", defaultErrorComponent: H, defaultNotFoundComponent: () => jsx(B, {}), scrollRestoration: true });
}
const Tr = createStartHandler({ createRouter: Ar, getRouterManifest: nt }), Fr = createClerkHandler(Tr), ho = Fr(et);

const handlers = [
  { route: '/_server', handler: $, lazy: false, middleware: true, method: undefined },
  { route: '/api', handler: d, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: ho, lazy: false, middleware: true, method: undefined }
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
  const localCall = (aRequest) => b$1(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return O$1(
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
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
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

export { Bt as B, Z, _$1 as _, Zr as a, no as b, ct as c, ao as d, er as e, eo as f, getRouteRulesForPath as g, de as h, B as i, joinHeaders as j, k, le as l, uo as m, normalizeCookieHeader as n, oo as o, po as p, ro as r, so as s, to as t, useNitroApp as u, x };
//# sourceMappingURL=nitro.mjs.map
