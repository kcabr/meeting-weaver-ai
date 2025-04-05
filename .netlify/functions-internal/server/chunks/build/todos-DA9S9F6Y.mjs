import { s as s$1 } from './prisma-C1KGuali.mjs';
import { getAuth } from '@clerk/tanstack-start/server';
import { o } from './index-ujMS-7Qz.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import { getWebRequest } from '@tanstack/start-server-core';
import '@prisma/client';
import 'tiny-invariant';

const i = o("src_utils_todos_ts--getTodos_createServerFn_handler", "/_server", (r, e) => w.__executeServer(r, e)), s = o("src_utils_todos_ts--getTodoById_createServerFn_handler", "/_server", (r, e) => l.__executeServer(r, e)), h = o("src_utils_todos_ts--createTodo_createServerFn_handler", "/_server", (r, e) => v.__executeServer(r, e)), _ = o("src_utils_todos_ts--updateTodo_createServerFn_handler", "/_server", (r, e) => f.__executeServer(r, e)), u = o("src_utils_todos_ts--deleteTodo_createServerFn_handler", "/_server", (r, e) => T.__executeServer(r, e)), w = createServerFn({ method: "GET" }).handler(i, async () => {
  try {
    const { userId: r } = await getAuth(getWebRequest());
    if (!r) throw new Error("Unauthorized");
    return await s$1.todo.findMany({ where: { userId: r }, orderBy: { createdAt: "desc" } });
  } catch (r) {
    throw console.error("Error fetching todos:", r), r;
  }
}), l = createServerFn({ method: "GET" }).validator((r) => r).handler(s, async ({ data: r }) => {
  try {
    const { userId: e } = await getAuth(getWebRequest());
    if (!e) throw new Error("Unauthorized");
    const o = await s$1.todo.findUnique({ where: { id: r } });
    if (!o) throw new Error("Todo not found");
    if (o.userId !== e) throw new Error("Unauthorized");
    return o;
  } catch (e) {
    throw console.error("Error fetching todo:", e), e;
  }
}), v = createServerFn({ method: "POST" }).validator((r) => r).handler(h, async ({ data: r }) => {
  try {
    const { userId: e } = await getAuth(getWebRequest());
    if (!e) throw new Error("Unauthorized");
    return await s$1.todo.create({ data: { title: r.title, description: r.description, userId: e } });
  } catch (e) {
    throw console.error("Error creating todo:", e), e;
  }
}), f = createServerFn({ method: "POST" }).validator((r) => r).handler(_, async ({ data: r }) => {
  try {
    const { userId: e } = await getAuth(getWebRequest());
    if (!e) throw new Error("Unauthorized");
    const o = await s$1.todo.findUnique({ where: { id: r.id } });
    if (!o) throw new Error("Todo not found");
    if (o.userId !== e) throw new Error("Unauthorized");
    return await s$1.todo.update({ where: { id: r.id }, data: { title: r.title, description: r.description, completed: r.completed } });
  } catch (e) {
    throw console.error("Error updating todo:", e), e;
  }
}), T = createServerFn({ method: "POST" }).validator((r) => r).handler(u, async ({ data: r }) => {
  try {
    const { userId: e } = await getAuth(getWebRequest());
    if (!e) throw new Error("Unauthorized");
    const o = await s$1.todo.findUnique({ where: { id: r } });
    if (!o) throw new Error("Todo not found");
    if (o.userId !== e) throw new Error("Unauthorized");
    return await s$1.todo.delete({ where: { id: r } });
  } catch (e) {
    throw console.error("Error deleting todo:", e), e;
  }
});

export { h as createTodo_createServerFn_handler, u as deleteTodo_createServerFn_handler, s as getTodoById_createServerFn_handler, i as getTodos_createServerFn_handler, _ as updateTodo_createServerFn_handler };
//# sourceMappingURL=todos-DA9S9F6Y.mjs.map
