import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, isValidElement } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/start-client-core';
import { x } from '../_/nitro.mjs';
import d from 'react-hot-toast';
import { t, c, i, m, l } from './card-0DekqH9F.mjs';
import { f } from './input-CVyGX5WE.mjs';
import { t as t$1 } from './textarea-D88q28tT.mjs';
import { p } from './label-CovgPzvG.mjs';
import { i as i$1 } from './AccentButton-L3kOol_A.mjs';
import b from 'tiny-invariant';
import { u } from './useServerFn-DtzmTnlI.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import '@tanstack/router-core';
import '@tanstack/start-server-core';
import '@clerk/tanstack-start/server';
import '@tanstack/react-router';
import '@clerk/tanstack-start';
import '@tanstack/react-router-devtools';
import '@tanstack/react-query-devtools';
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
import './button-B3FJhynQ.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-label';

function E(e) {
  if (isValidElement(e)) return e;
  if (typeof e == "object" && !e.state && (e.state = { status: "pending", promise: Promise.resolve().then(() => {
    b(false, "renderRSC() is coming soon!");
  }).then((r) => {
    e.state.value = r, e.state.status = "success";
  }).catch((r) => {
    e.state.status = "error", e.state.error = r;
  }) }), e.state.status === "pending") throw e.state.promise;
  return e.state.value;
}
const k = x("src_utils_notes_ts--getNotes_createServerFn_handler", "/_server"), P = createServerFn({ method: "GET" }).handler(k), R = x("src_utils_notes_ts--getNoteById_createServerFn_handler", "/_server");
createServerFn({ method: "GET" }).validator((e) => e).handler(R);
const D = x("src_utils_notes_ts--createNote_createServerFn_handler", "/_server"), L = createServerFn({ method: "POST" }).validator((e) => e).handler(D), q = x("src_utils_notes_ts--updateNote_createServerFn_handler", "/_server");
createServerFn({ method: "PUT" }).validator((e) => e).handler(q);
const A = x("src_utils_notes_ts--deleteNote_createServerFn_handler", "/_server");
createServerFn({ method: "DELETE" }).validator((e) => e).handler(A);
async function I() {
  const e = await P();
  return !e || e.length === 0 ? jsx("div", { className: "text-center p-8 text-gray-500 dark:text-gray-400", children: "No notes yet. Create your first note!" }) : jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: e.map((r) => jsx(j, { note: r }, r.id)) });
}
function j({ note: e }) {
  return jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200", children: [jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white mb-2", children: e.title }), jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4 line-clamp-3", children: e.content }), jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: new Date(e.createdAt).toLocaleDateString() })] });
}
const Ne = function() {
  const [r, d$1] = useState(""), [i$2, l$1] = useState(""), N = useQueryClient(), c$1 = useMutation({ mutationFn: u(L), onSuccess: () => {
    N.invalidateQueries({ queryKey: ["notes"] }), d$1(""), l$1(""), d.success("Note created successfully!");
  }, onError: (o) => {
    d.error(`Failed to create note: ${o.message}`);
  } });
  return jsxs("div", { className: "py-10", children: [jsx("header", { children: jsxs("div", { className: "mx-auto max-w-7xl", children: [jsx("h1", { className: "text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white", children: "Notes" }), jsx("p", { className: "mt-2 text-lg text-gray-600 dark:text-gray-300", children: "Create and manage your notes with React Server Components (RSC)" })] }) }), jsx("main", { className: "mt-10", children: jsxs("div", { className: "mx-auto max-w-7xl space-y-8", children: [jsxs(t, { children: [jsxs(c, { children: [jsx(i, { children: "Create New Note" }), jsx(m, { children: "Add a new note to your collection" })] }), jsx(l, { children: jsxs("form", { onSubmit: (o) => {
    o.preventDefault(), !(!r.trim() || !i$2.trim()) && c$1.mutate({ data: { title: r, content: i$2 } });
  }, className: "space-y-6", children: [jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: "title", children: "Title" }), jsx(f, { id: "title", value: r, onChange: (o) => d$1(o.target.value), placeholder: "Enter note title", required: true })] }), jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: "content", children: "Content" }), jsx(t$1, { id: "content", value: i$2, onChange: (o) => l$1(o.target.value), placeholder: "Enter note content", rows: 5, required: true })] }), jsx(i$1, { type: "submit", isHighlighted: true, disabled: c$1.isPending, children: c$1.isPending ? "Creating..." : "Create Note" })] }) })] }), jsxs(t, { children: [jsx(c, { children: jsx(i, { children: "Your Notes" }) }), jsx(l, { children: E(jsx(I, {})) })] })] }) })] });
};

export { Ne as component };
//# sourceMappingURL=notes-BkTb-gBf.mjs.map
