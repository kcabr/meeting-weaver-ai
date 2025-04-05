import { notFound } from '@tanstack/react-router';
import o$1 from 'redaxios';
import { o } from './index-ujMS-7Qz.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import 'tiny-invariant';

const a = o("src_utils_posts_ts--fetchPost_createServerFn_handler", "/_server", (e, r) => i.__executeServer(e, r)), h = o("src_utils_posts_ts--fetchPosts_createServerFn_handler", "/_server", (e, r) => p.__executeServer(e, r)), i = createServerFn({ method: "GET" }).validator((e) => e).handler(a, async ({ data: e }) => (console.info(`Fetching post with id ${e}...`), await o$1.get(`https://jsonplaceholder.typicode.com/posts/${e}`).then((t) => t.data).catch((t) => {
  throw console.error(t), t.status === 404 ? notFound() : t;
}))), p = createServerFn({ method: "GET" }).handler(h, async () => (console.info("Fetching posts..."), await new Promise((e) => setTimeout(e, 1e3)), o$1.get("https://jsonplaceholder.typicode.com/posts").then((e) => e.data.slice(0, 10))));

export { a as fetchPost_createServerFn_handler, h as fetchPosts_createServerFn_handler };
//# sourceMappingURL=posts-CZaQTmVw.mjs.map
