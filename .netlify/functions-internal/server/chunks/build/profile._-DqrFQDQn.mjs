import { jsxs, jsx } from 'react/jsx-runtime';
import { Link, Outlet } from '@tanstack/react-router';
import { h as de } from '../_/nitro.mjs';
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
import '@clerk/tanstack-start';
import '@tanstack/react-router-devtools';
import '@tanstack/react-query-devtools';
import '@tanstack/react-query';
import 'react-hot-toast';
import 'react-redux';
import 'react';
import 'stripe';
import '@reduxjs/toolkit';
import 'zod';
import 'node:stream';
import 'isbot';
import 'react-dom/server';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const D = function() {
  const i = de.useLoaderData();
  return jsxs("div", { className: "p-2 flex gap-2", children: [jsx("ul", { className: "list-disc pl-4", children: [...i, { id: "i-do-not-exist", title: "Non-existent Post" }].map((o) => jsx("li", { className: "whitespace-nowrap", children: jsx(Link, { to: "/posts/$postId", params: { postId: o.id }, className: "block py-1 text-blue-800 hover:text-blue-600", activeProps: { className: "text-black font-bold" }, children: jsx("div", { children: o.title.substring(0, 20) }) }) }, o.id)) }), jsx("hr", {}), jsx(Outlet, {})] });
};

export { D as component };
//# sourceMappingURL=profile._-DqrFQDQn.mjs.map
