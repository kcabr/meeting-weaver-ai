import { s } from './prisma-C1KGuali.mjs';
import { getAuth } from '@clerk/tanstack-start/server';
import { o } from './index-ujMS-7Qz.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import { getWebRequest } from '@tanstack/start-server-core';
import '@prisma/client';
import 'tiny-invariant';

const i = o("src_utils_notes_ts--getNotes_createServerFn_handler", "/_server", (e, r) => w.__executeServer(e, r)), d = o("src_utils_notes_ts--getNoteById_createServerFn_handler", "/_server", (e, r) => l.__executeServer(e, r)), h = o("src_utils_notes_ts--createNote_createServerFn_handler", "/_server", (e, r) => v.__executeServer(e, r)), _ = o("src_utils_notes_ts--updateNote_createServerFn_handler", "/_server", (e, r) => f.__executeServer(e, r)), u = o("src_utils_notes_ts--deleteNote_createServerFn_handler", "/_server", (e, r) => E.__executeServer(e, r)), w = createServerFn({ method: "GET" }).handler(i, async () => {
  try {
    const { userId: e } = await getAuth(getWebRequest());
    if (!e) throw new Error("Unauthorized");
    return await s.note.findMany({ where: { userId: e }, orderBy: { createdAt: "desc" } });
  } catch (e) {
    throw console.error("Error fetching notes:", e), e;
  }
}), l = createServerFn({ method: "GET" }).validator((e) => e).handler(d, async ({ data: e }) => {
  try {
    const { userId: r } = await getAuth(getWebRequest());
    if (!r) throw new Error("Unauthorized");
    const t = await s.note.findUnique({ where: { id: e } });
    if (!t) throw new Error("Note not found");
    if (t.userId !== r) throw new Error("Unauthorized");
    return t;
  } catch (r) {
    throw console.error("Error fetching note:", r), r;
  }
}), v = createServerFn({ method: "POST" }).validator((e) => e).handler(h, async ({ data: e }) => {
  try {
    const { userId: r } = await getAuth(getWebRequest());
    if (!r) throw new Error("Unauthorized");
    return await s.note.create({ data: { title: e.title, content: e.content, userId: r } });
  } catch (r) {
    throw console.error("Error creating note:", r), r;
  }
}), f = createServerFn({ method: "PUT" }).validator((e) => e).handler(_, async ({ data: e }) => {
  try {
    const { userId: r } = await getAuth(getWebRequest());
    if (!r) throw new Error("Unauthorized");
    const t = await s.note.findUnique({ where: { id: e.id } });
    if (!t) throw new Error("Note not found");
    if (t.userId !== r) throw new Error("Unauthorized");
    return await s.note.update({ where: { id: e.id }, data: { title: e.title, content: e.content } });
  } catch (r) {
    throw console.error("Error updating note:", r), r;
  }
}), E = createServerFn({ method: "DELETE" }).validator((e) => e).handler(u, async ({ data: e }) => {
  try {
    const { userId: r } = await getAuth(getWebRequest());
    if (!r) throw new Error("Unauthorized");
    const t = await s.note.findUnique({ where: { id: e } });
    if (!t) throw new Error("Note not found");
    if (t.userId !== r) throw new Error("Unauthorized");
    return await s.note.delete({ where: { id: e } });
  } catch (r) {
    throw console.error("Error deleting note:", r), r;
  }
});

export { h as createNote_createServerFn_handler, u as deleteNote_createServerFn_handler, d as getNoteById_createServerFn_handler, i as getNotes_createServerFn_handler, _ as updateNote_createServerFn_handler };
//# sourceMappingURL=notes-D709YdQr.mjs.map
