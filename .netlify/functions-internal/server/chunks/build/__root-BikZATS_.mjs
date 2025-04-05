import { getAuth } from '@clerk/tanstack-start/server';
import { s } from './prisma-C1KGuali.mjs';
import { getWebRequest } from '@tanstack/start-server-core';
import { o } from './index-ujMS-7Qz.mjs';
import { createServerFn } from '@tanstack/start-client-core';
import '@prisma/client';
import 'tiny-invariant';

async function u(r) {
  try {
    const e = r || getWebRequest();
    if (!e) throw new Error("No request object available");
    const t = await getAuth(e);
    if (!t.userId) throw new Error("No user ID available from Clerk");
    const o = e.headers.get("x-forwarded-for") || e.headers.get("x-real-ip") || "127.0.0.1";
    return await s.user.upsert({ where: { id: t.userId }, update: { lastLoginAt: /* @__PURE__ */ new Date(), lastLoginIP: o }, create: { id: t.userId, email: t.userId, lastLoginAt: /* @__PURE__ */ new Date(), lastLoginIP: o } }), await s.user.findUnique({ where: { id: t.userId } });
  } catch (e) {
    throw console.error("Error in handleSuccessfulLogin:", e), e;
  }
}
const d = o("src_routes_root_tsx--fetchClerkAuth_createServerFn_handler", "/_server", (r, e) => h.__executeServer(r, e)), h = createServerFn({ method: "GET" }).handler(d, async () => {
  const { userId: r } = await getAuth(getWebRequest());
  return r && await u(), { userId: r };
});

export { d as fetchClerkAuth_createServerFn_handler };
//# sourceMappingURL=__root-BikZATS_.mjs.map
