import { jsx } from 'react/jsx-runtime';
import * as c$1 from 'react';
import { cva } from 'class-variance-authority';
import { m } from './button-B3FJhynQ.mjs';

const d = cva("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", { variants: { variant: { default: "bg-background text-foreground", destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive" } }, defaultVariants: { variant: "default" } }), n = c$1.forwardRef(({ className: t, variant: e, ...r }, o) => jsx("div", { ref: o, role: "alert", className: m(d({ variant: e }), t), ...r }));
n.displayName = "Alert";
const c = c$1.forwardRef(({ className: t, ...e }, r) => jsx("h5", { ref: r, className: m("mb-1 font-medium leading-none tracking-tight", t), ...e }));
c.displayName = "AlertTitle";
const v = c$1.forwardRef(({ className: t, ...e }, r) => jsx("div", { ref: r, className: m("text-sm [&_p]:leading-relaxed", t), ...e }));
v.displayName = "AlertDescription";

export { n, v };
//# sourceMappingURL=alert-B939vdC4.mjs.map
