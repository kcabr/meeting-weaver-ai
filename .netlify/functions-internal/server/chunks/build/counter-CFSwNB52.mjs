import { jsxs, jsx } from 'react/jsx-runtime';
import { k, c as ct, o as oo, b as no, d as ao, s as so } from '../_/nitro.mjs';
import { useState } from 'react';
import d from 'react-hot-toast';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import '@tanstack/router-core';
import 'tiny-invariant';
import '@tanstack/start-server-core';
import '@tanstack/start-client-core';
import '@clerk/tanstack-start/server';
import '@tanstack/react-router';
import '@clerk/tanstack-start';
import '@tanstack/react-router-devtools';
import '@tanstack/react-query-devtools';
import '@tanstack/react-query';
import 'react-redux';
import 'stripe';
import '@reduxjs/toolkit';
import 'zod';
import 'node:stream';
import 'isbot';
import 'react-dom/server';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const K = function() {
  const s = k((i) => i.counter.value), n = ct(), [o, c] = useState(2);
  return jsxs("div", { className: "py-10", children: [jsx("header", { children: jsxs("div", { className: "mx-auto max-w-7xl", children: [jsx("h1", { className: "text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white", children: "Redux Counter Demo" }), jsx("p", { className: "mt-2 text-lg text-gray-600 dark:text-gray-300", children: "This page demonstrates Redux Toolkit integration with global state management." })] }) }), jsx("main", { className: "mt-10", children: jsx("div", { className: "mx-auto max-w-7xl", children: jsx("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg p-6", children: jsxs("div", { className: "flex flex-col items-center justify-center space-y-6", children: [jsx("div", { className: "flex items-center justify-center w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900", children: jsx("span", { className: "text-5xl font-bold text-indigo-800 dark:text-indigo-200", children: s }) }), jsxs("div", { className: "flex flex-wrap gap-3 justify-center", children: [jsx("button", { onClick: () => {
    n(oo()), d.success("Counter incremented!");
  }, className: "px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500", children: "Increment" }), jsx("button", { onClick: () => {
    n(no()), d.success("Counter decremented!");
  }, className: "px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500", children: "Decrement" }), jsx("button", { onClick: () => {
    n(ao()), d.success("Counter reset!");
  }, className: "px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500", children: "Reset" })] }), jsxs("div", { className: "flex items-center space-x-3", children: [jsx("input", { className: "block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white", type: "number", value: o, onChange: (i) => c(Number(i.target.value) || 0) }), jsx("button", { onClick: () => {
    n(so(o)), d.success(`Counter incremented by ${o}!`);
  }, className: "px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Add Amount" })] })] }) }) }) })] });
};

export { K as component };
//# sourceMappingURL=counter-CFSwNB52.mjs.map
