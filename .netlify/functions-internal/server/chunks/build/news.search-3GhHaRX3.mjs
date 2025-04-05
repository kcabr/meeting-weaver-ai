import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { N, v as v$1 } from './CustomButtonLink-B6Lb5M_T.mjs';
import { p as po } from '../_/nitro.mjs';
import 'date-fns';
import '@tanstack/react-router';
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
import 'stripe';
import '@reduxjs/toolkit';
import 'zod';
import 'node:stream';
import 'isbot';
import 'react-dom/server';
import 'node:fs';
import 'node:path';
import 'node:crypto';

function v({ onSearch: c, initialQuery: r = "", isLoading: o = false }) {
  const [t, n] = useState(r);
  return jsx("form", { onSubmit: (d) => {
    d.preventDefault(), t.trim() && c(t.trim());
  }, className: "mb-6", children: jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [jsx("div", { className: "flex-grow", children: jsx("input", { type: "text", value: t, onChange: (d) => n(d.target.value), placeholder: "Search for news articles...", className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white", required: true }) }), jsxs("button", { type: "submit", disabled: o || !t.trim(), className: "inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed", children: [o ? jsxs("svg", { className: "animate-spin -ml-1 mr-2 h-4 w-4 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }) : null, "Search"] })] }) });
}
const G = function() {
  const [r, o] = useState({ query: "", page: 1, pageSize: 9 }), { data: t, isLoading: n, isError: m, error: d, isFetching: h } = useQuery({ queryKey: ["newsSearch", r], queryFn: () => po({ data: r }), enabled: !!r.query, gcTime: 1e3 * 60 * 5 }), x = (i) => {
    o((l) => ({ ...l, query: i, page: 1 }));
  }, g = (i) => {
    o((l) => ({ ...l, page: i })), window.scrollTo({ top: 0, behavior: "smooth" });
  }, s = (t == null ? void 0 : t.totalResults) || 0, p = (t == null ? void 0 : t.articles) || [];
  return jsx("div", { className: "mb-8", children: jsxs("div", { className: "mb-4", children: [jsx(N, { to: "/news", variant: "text", color: "primary", className: "mb-2", startIcon: jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: jsx("path", { fillRule: "evenodd", d: "M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z", clipRule: "evenodd" }) }), children: "Back to headlines" }), jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4", children: "Search News Articles" }), jsx(v, { onSearch: x, initialQuery: r.query, isLoading: h }), n && r.query ? jsx("div", { className: "flex justify-center py-8", children: jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" }) }) : m ? jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-800 dark:text-red-200 mb-4", children: jsxs("p", { children: ["Error: ", (d == null ? void 0 : d.message) || "Failed to load articles"] }) }) : t && r.query ? jsxs(Fragment, { children: [jsxs("div", { className: "flex justify-between items-center mb-4", children: [jsxs("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: ["Found ", s, ' results for "', r.query, '"'] }), h && jsx("div", { className: "animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full" })] }), jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 mb-6 pt-4" }), p.length > 0 ? jsxs(Fragment, { children: [jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: p.map((i, l) => jsx("div", { children: jsx(v$1, { article: i }) }, `${i.url}-${l}`)) }), s > r.pageSize && jsx("div", { className: "flex justify-center mt-6", children: jsxs("nav", { className: "flex items-center", children: [jsx("button", { onClick: () => g(Math.max(1, r.page - 1)), disabled: r.page === 1, className: "mr-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-300", children: ["Page ", r.page, " of", " ", Math.ceil(s / r.pageSize)] }), jsx("button", { onClick: () => g(Math.min(Math.ceil(s / r.pageSize), r.page + 1)), disabled: r.page >= Math.ceil(s / r.pageSize), className: "ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed", children: "Next" })] }) })] }) : jsxs("div", { className: "text-center py-12", children: [jsx("h3", { className: "text-xl font-semibold text-gray-800 dark:text-white", children: "No articles found" }), jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Try a different search term" })] })] }) : jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 p-8 text-center rounded-lg border border-gray-200 dark:border-gray-700", children: [jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: "Search for news articles" }), jsx("p", { className: "text-gray-500 dark:text-gray-400", children: "Enter a search term above to find articles from around the world" })] })] }) });
};

export { G as component };
//# sourceMappingURL=news.search-3GhHaRX3.mjs.map
