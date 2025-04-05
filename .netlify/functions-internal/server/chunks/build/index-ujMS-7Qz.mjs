import b from 'tiny-invariant';

function i(r) {
  return r.replace(/^\/|\/$/g, "");
}
const o = (r, t, e) => {
  b(e, "\u{1F6A8}splitImportFn required for the server functions server runtime, but was not provided.");
  const n = `/${i(t)}/${r}`;
  return Object.assign(e, { url: n, functionId: r });
};

export { o };
//# sourceMappingURL=index-ujMS-7Qz.mjs.map
