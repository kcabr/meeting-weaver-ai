import { jsx } from 'react/jsx-runtime';
import * as c$1 from 'react';
import { m as m$1 } from './button-B3FJhynQ.mjs';

const t = c$1.forwardRef(({ className: a, ...e }, r) => jsx("div", { ref: r, className: m$1("rounded-lg border bg-card text-card-foreground shadow-sm", a), ...e }));
t.displayName = "Card";
const c = c$1.forwardRef(({ className: a, ...e }, r) => jsx("div", { ref: r, className: m$1("flex flex-col space-y-1.5 p-6", a), ...e }));
c.displayName = "CardHeader";
const i = c$1.forwardRef(({ className: a, ...e }, r) => jsx("h3", { ref: r, className: m$1("text-2xl font-semibold leading-none tracking-tight", a), ...e }));
i.displayName = "CardTitle";
const m = c$1.forwardRef(({ className: a, ...e }, r) => jsx("p", { ref: r, className: m$1("text-sm text-muted-foreground", a), ...e }));
m.displayName = "CardDescription";
const l = c$1.forwardRef(({ className: a, ...e }, r) => jsx("div", { ref: r, className: m$1("p-6 pt-0", a), ...e }));
l.displayName = "CardContent";
const n = c$1.forwardRef(({ className: a, ...e }, r) => jsx("div", { ref: r, className: m$1("flex items-center p-6 pt-0", a), ...e }));
n.displayName = "CardFooter";

export { c, i, l, m, n, t };
//# sourceMappingURL=card-0DekqH9F.mjs.map
