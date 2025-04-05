import { jsx } from 'react/jsx-runtime';
import c__default from 'react';
import { m, g } from './button-B3FJhynQ.mjs';
import { Link } from '@tanstack/react-router';

const i = c__default.forwardRef(({ className: l, to: e, isHighlighted: c, children: r, ...a }, o) => {
  const b = m(l, c ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800");
  return e ? jsx(Link, { to: e, className: "w-fit", children: jsx(g, { ref: o, className: b, ...a, children: r }) }) : jsx(g, { ref: o, className: b, ...a, children: r });
});
i.displayName = "AccentButton";

export { i };
//# sourceMappingURL=AccentButton-L3kOol_A.mjs.map
