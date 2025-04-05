import { jsx, jsxs } from 'react/jsx-runtime';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import d from 'react-hot-toast';
import { createServerFn } from '@tanstack/start-client-core';
import { x } from '../_/nitro.mjs';
import { t, c, i, l } from './card-0DekqH9F.mjs';
import { f } from './input-CVyGX5WE.mjs';
import { t as t$1 } from './textarea-D88q28tT.mjs';
import { p } from './label-CovgPzvG.mjs';
import { d as d$1 } from './checkbox-8ie8z6BN.mjs';
import { i as i$1 } from './AccentButton-L3kOol_A.mjs';
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
import 'tiny-invariant';
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
import '@radix-ui/react-checkbox';
import 'lucide-react';

const $ = x("src_utils_todos_ts--getTodos_createServerFn_handler", "/_server"), Q = createServerFn({ method: "GET" }).handler($), j = x("src_utils_todos_ts--getTodoById_createServerFn_handler", "/_server");
createServerFn({ method: "GET" }).validator((o) => o).handler(j);
const I = x("src_utils_todos_ts--createTodo_createServerFn_handler", "/_server"), K = createServerFn({ method: "POST" }).validator((o) => o).handler(I), O = x("src_utils_todos_ts--updateTodo_createServerFn_handler", "/_server"), B = createServerFn({ method: "POST" }).validator((o) => o).handler(O), A = x("src_utils_todos_ts--deleteTodo_createServerFn_handler", "/_server"), G = createServerFn({ method: "POST" }).validator((o) => o).handler(A), be = function() {
  const [a, p$1] = useState(""), [h, T] = useState(""), n = useQueryClient(), { data: c$1, isLoading: C, error: g } = useQuery({ queryKey: ["todos"], queryFn: () => Q() }), l$1 = useMutation({ mutationFn: u(K), onSuccess: () => {
    n.invalidateQueries({ queryKey: ["todos"] }), p$1(""), T(""), d.success("Todo created successfully!");
  }, onError: (e) => {
    d.error(`Failed to create todo: ${e.message}`);
  } }), N = useMutation({ mutationFn: u(B), onSuccess: () => {
    n.invalidateQueries({ queryKey: ["todos"] }), d.success("Todo updated successfully!");
  }, onError: (e) => {
    d.error(`Failed to update todo: ${e.message}`);
  } }), b = useMutation({ mutationFn: u(G), onSuccess: () => {
    n.invalidateQueries({ queryKey: ["todos"] }), d.success("Todo deleted successfully!");
  }, onError: (e) => {
    d.error(`Failed to delete todo: ${e.message}`);
  } }), k = (e) => {
    e.preventDefault(), a.trim() && l$1.mutate({ data: { title: a, description: h } });
  }, w = (e) => {
    N.mutate({ data: { id: e.id, title: e.title, description: e.description || void 0, completed: !e.completed } });
  }, E = (e) => {
    b.mutate({ data: e });
  };
  return C ? jsx("div", { className: "container py-10 flex justify-center", children: "Loading todos..." }) : g ? jsxs("div", { className: "container py-10 text-red-500", children: ["Error loading todos: ", g.message] }) : jsxs("div", { className: "container py-10", children: [jsxs("header", { className: "mb-8", children: [jsx("h1", { className: "text-3xl font-bold leading-tight tracking-tight text-foreground", children: "Todo List" }), jsx("p", { className: "mt-2 text-lg text-muted-foreground", children: "Manage your todos with Prisma ORM and Supabase" })] }), jsxs("main", { children: [jsxs(t, { className: "mb-8", children: [jsx(c, { children: jsx(i, { children: "Create New Todo" }) }), jsx(l, { children: jsxs("form", { onSubmit: k, className: "space-y-4", children: [jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: "title", children: "Title" }), jsx(f, { id: "title", value: a, onChange: (e) => p$1(e.target.value), placeholder: "Enter todo title", required: true })] }), jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: "description", children: "Description" }), jsx(t$1, { id: "description", value: h, onChange: (e) => T(e.target.value), placeholder: "Enter todo description (optional)", rows: 3 })] }), jsx(i$1, { type: "submit", disabled: l$1.isPending, isHighlighted: true, children: l$1.isPending ? "Creating..." : "Create Todo" })] }) })] }), jsxs(t, { children: [jsx(c, { children: jsx(i, { children: "Your Todos" }) }), jsx(l, { children: c$1 && c$1.length > 0 ? jsx("ul", { className: "space-y-4", children: c$1.map((e) => jsxs("li", { className: "flex items-start justify-between space-x-2 pb-4 border-b", children: [jsxs("div", { className: "flex items-start space-x-2", children: [jsx(d$1, { id: `todo-${e.id}`, checked: e.completed, onCheckedChange: () => w(e) }), jsxs("div", { children: [jsx("label", { htmlFor: `todo-${e.id}`, className: `font-medium cursor-pointer ${e.completed ? "line-through text-muted-foreground" : "text-foreground"}`, children: e.title }), e.description && jsx("p", { className: "text-sm text-muted-foreground mt-1", children: e.description })] })] }), jsx(i$1, { size: "sm", onClick: () => E(e.id), className: "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800", children: "Delete" })] }, e.id)) }) : jsx("p", { className: "text-muted-foreground", children: "No todos yet. Create one above!" }) })] })] })] });
};

export { be as component };
//# sourceMappingURL=todos-D4sNZftQ.mjs.map
