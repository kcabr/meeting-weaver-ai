import { jsx, jsxs } from 'react/jsx-runtime';
import { ErrorComponent } from '@tanstack/react-router';
import { l as le, m as uo, i as B } from '../_/nitro.mjs';
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

const Q = function() {
  const { postId: o } = le.useParams(), { data: t, isLoading: s, error: a } = useQuery({ queryKey: ["post", o], queryFn: () => uo({ data: o }) });
  return s ? jsx("div", { className: "py-10", children: jsxs("div", { className: "animate-pulse space-y-4", children: [jsx("div", { className: "h-6 w-3/4 bg-slate-300 dark:bg-slate-700 rounded" }), jsxs("div", { className: "space-y-2", children: [jsx("div", { className: "h-4 bg-slate-300 dark:bg-slate-700 rounded" }), jsx("div", { className: "h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6" }), jsx("div", { className: "h-4 bg-slate-300 dark:bg-slate-700 rounded w-4/6" })] })] }) }) : a ? jsx(ErrorComponent, { error: a }) : t ? jsxs("div", { children: [jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: t.title }), jsx("div", { className: "bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-inner", children: jsx("p", { className: "text-gray-700 dark:text-gray-300 whitespace-pre-line", children: t.body }) })] }) : jsx(B, { children: "Post not found" });
};

export { Q as component };
//# sourceMappingURL=posts._postId-CFuP4T-1.mjs.map
