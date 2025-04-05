import { jsx } from 'react/jsx-runtime';
import { SignIn } from '@clerk/tanstack-start';

const i = ({ error: e }) => {
  if (e.message === "Not authenticated") return jsx("div", { className: "flex items-center justify-center p-12", children: jsx(SignIn, { routing: "hash", forceRedirectUrl: window.location.href }) });
  throw e;
};

export { i as errorComponent };
//# sourceMappingURL=_authed-2fD3zvzN.mjs.map
