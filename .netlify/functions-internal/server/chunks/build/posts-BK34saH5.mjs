import { jsx, jsxs } from 'react/jsx-runtime';
import { Link, Outlet } from '@tanstack/react-router';
import { e as er } from '../_/nitro.mjs';
import { useQuery } from '@tanstack/react-query';
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

const F = function() {
  const { data: i, isLoading: s, error: a } = useQuery({ queryKey: ["posts"], queryFn: () => er() });
  return s ? jsx("div", { className: "py-10 flex justify-center", children: jsxs("div", { className: "animate-pulse flex space-x-4 items-center", children: [jsx("div", { className: "rounded-full bg-slate-300 dark:bg-slate-700 h-10 w-10" }), jsx("div", { className: "h-4 w-36 bg-slate-300 dark:bg-slate-700 rounded" })] }) }) : a ? jsxs("div", { className: "py-10 text-red-500", children: ["Error loading posts: ", a instanceof Error ? a.message : "Unknown error"] }) : jsxs("div", { className: "py-10", children: [jsx("header", { children: jsxs("div", { className: "mx-auto max-w-7xl", children: [jsx("h1", { className: "text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white", children: "Posts" }), jsx("p", { className: "mt-2 text-lg text-gray-600 dark:text-gray-300", children: "Posts fetched using React Query for data management" })] }) }), jsx("main", { className: "mt-10", children: jsx("div", { className: "mx-auto max-w-7xl", children: jsxs("div", { className: "bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex gap-6", children: [jsxs("div", { className: "w-1/3 border-r border-gray-200 dark:border-gray-700 pr-6", children: [jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900 dark:text-white", children: "Post List" }), jsx("ul", { className: "space-y-2", children: i && [...i, { id: "i-do-not-exist", title: "Non-existent Post" }].map((t) => jsx("li", { className: "border-b border-gray-100 dark:border-gray-700 last:border-b-0 pb-2 last:pb-0", children: jsxs(Link, { to: "/posts/$postId", params: { postId: t.id }, className: "block py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200", activeProps: { className: "block py-2 px-3 rounded-md bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-medium" }, children: [t.title.substring(0, 30), t.title.length > 30 ? "..." : ""] }) }, t.id)) })] }), jsx("div", { className: "flex-1", children: jsx(Outlet, {}) })] }) }) })] });
};

export { F as component };
//# sourceMappingURL=posts-BK34saH5.mjs.map
