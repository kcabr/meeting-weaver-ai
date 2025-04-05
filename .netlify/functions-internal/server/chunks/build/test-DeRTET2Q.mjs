import { jsxs, jsx } from 'react/jsx-runtime';
import c__default, { useState } from 'react';
import { Loader2, Lightbulb } from 'lucide-react';
import { i as i$1 } from './AccentButton-L3kOol_A.mjs';
import { t, c, i, m, l } from './card-0DekqH9F.mjs';
import { t as t$1 } from './textarea-D88q28tT.mjs';
import { f } from './input-CVyGX5WE.mjs';
import './button-B3FJhynQ.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@tanstack/react-router';

async function E({ prompt: s, inputText: r }) {
  try {
    const e = await fetch("/api/ai/magic-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: s, inputText: r }) });
    if (!e.ok) throw new Error(`API call failed with status: ${e.status}`);
    return await e.json();
  } catch (e) {
    throw console.error("Error in postAiGetCizzleMagicText:", e), e;
  }
}
const M = ({ prompt: s, value: r, setValue: e, children: n }) => {
  const [a, c] = useState(false), [x, g] = useState(""), m = r !== x, C = (o) => {
    e(o.target.value);
  }, b = async () => {
    if (m && r) {
      c(true);
      try {
        const o = await E({ prompt: s, inputText: r });
        e(o), g(o);
      } catch (o) {
        console.error("Error cleaning text:", o);
      } finally {
        c(false);
      }
    }
  }, T = c__default.cloneElement(n, { value: r, onChange: C, disabled: a || n.props.disabled });
  return jsxs("div", { className: "flex items-center", children: [T, jsx(i$1, { onClick: b, disabled: a || !m, size: "icon", className: "ml-2", children: a ? jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : jsx(Lightbulb, { className: "h-4 w-4" }) })] });
}, J = function() {
  const [r, e] = useState(""), [n, a] = useState("Rewrite this text to make it more professional and concise");
  return jsxs("div", { className: "container py-8", children: [jsx("h1", { className: "text-3xl font-bold mb-8", children: "AI Magic Text Demo" }), jsxs(t, { className: "mb-8", children: [jsxs(c, { children: [jsx(i, { children: "Customize Prompt" }), jsx(m, { children: "Edit the prompt that will be sent to the AI" })] }), jsx(l, { children: jsx(f, { value: n, onChange: (c) => a(c.target.value), placeholder: "Enter an instruction for the AI", className: "w-full" }) })] }), jsxs(t, { children: [jsxs(c, { children: [jsx(i, { children: "Magic Text Input" }), jsx(m, { children: "Enter text below, then click the lightbulb icon to apply AI magic" })] }), jsx(l, { children: jsx(M, { prompt: n, value: r, setValue: e, children: jsx(t$1, { placeholder: "Enter your text here...", className: "min-h-[200px]" }) }) })] })] });
};

export { J as component };
//# sourceMappingURL=test-DeRTET2Q.mjs.map
