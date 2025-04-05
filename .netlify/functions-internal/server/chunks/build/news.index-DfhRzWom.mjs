import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import c__default from 'react';
import { useQuery } from '@tanstack/react-query';
import { N, v } from './CustomButtonLink-B6Lb5M_T.mjs';
import { Z, B as Bt } from '../_/nitro.mjs';
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

const b = ["general", "business", "entertainment", "health", "science", "sports", "technology"], O = function() {
  var _a, _b;
  const o = Z.useLoaderData(), [a, s] = c__default.useState("general"), { data: i, isLoading: d, isError: l, error: n } = useQuery({ queryKey: ["topHeadlines", a], queryFn: () => Bt({ data: { category: a, pageSize: 12 } }), initialData: a === "general" ? o : void 0 });
  return jsxs("div", { children: [jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6", children: [jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0", children: "Top Headlines" }), jsx(N, { to: "/news/search", variant: "contained", color: "primary", children: "Search Articles" })] }), jsxs("div", { className: "mb-6", children: [jsx("label", { htmlFor: "category-select", className: "block mb-2 text-sm font-medium text-gray-900 dark:text-white", children: "Category" }), jsx("select", { id: "category-select", value: a, onChange: (r) => s(r.target.value), className: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-52 p-2.5", children: b.map((r) => jsx("option", { value: r, className: "capitalize", children: r }, r)) })] }), d && !i ? jsxs("div", { className: "text-center py-8", children: [jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto" }), jsx("p", { className: "mt-4 text-gray-600 dark:text-gray-300", children: "Loading headlines..." })] }) : l ? jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-red-800 dark:text-red-200", children: jsxs("p", { children: ["Error loading headlines: ", (n == null ? void 0 : n.message) || "Unknown error"] }) }) : jsxs(Fragment, { children: [jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: (_a = i == null ? void 0 : i.articles) == null ? void 0 : _a.map((r, m) => jsx("div", { children: jsx(v, { article: r }) }, `${r.url}-${m}`)) }), ((_b = i == null ? void 0 : i.articles) == null ? void 0 : _b.length) === 0 && jsxs("div", { className: "text-center py-12", children: [jsx("h3", { className: "text-xl font-semibold text-gray-800 dark:text-white", children: "No articles found for this category" }), jsx("p", { className: "mt-2 text-gray-600 dark:text-gray-400", children: "Try selecting a different category" })] })] })] });
};

export { O as component };
//# sourceMappingURL=news.index-DfhRzWom.mjs.map
