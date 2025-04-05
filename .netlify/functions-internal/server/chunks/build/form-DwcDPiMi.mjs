import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { g } from './button-B3FJhynQ.mjs';
import { f } from './input-CVyGX5WE.mjs';
import { p } from './label-CovgPzvG.mjs';
import { d } from './checkbox-8ie8z6BN.mjs';
import { n } from './switch-m0TDxieA.mjs';
import '@radix-ui/react-slot';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import '@radix-ui/react-label';
import '@radix-ui/react-checkbox';
import 'lucide-react';
import '@radix-ui/react-switch';

const m = z.object({ personal: z.object({ firstName: z.string().min(2, { message: "First name must be at least 2 characters" }), lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }), email: z.string().email({ message: "Please enter a valid email address" }), age: z.string().optional().transform((o) => o ? parseInt(o, 10) : void 0) }), address: z.object({ street: z.string().min(5, { message: "Street address must be at least 5 characters" }), city: z.string().min(2, { message: "City must be at least 2 characters" }), state: z.string().min(2, { message: "State must be at least 2 characters" }), zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, { message: "Please enter a valid zip code" }) }), preferences: z.object({ receiveEmails: z.boolean().default(false), receiveSMS: z.boolean().default(false), theme: z.enum(["light", "dark", "system"]).default("system") }), terms: z.boolean().refine((o) => o === true, { message: "You must accept the terms and conditions" }) });
function v() {
  const [o, u] = useState(""), s = useForm({ defaultValues: { personal: { firstName: "", lastName: "", email: "", age: "" }, address: { street: "", city: "", state: "", zipCode: "" }, preferences: { receiveEmails: false, receiveSMS: false, theme: "system" }, terms: false }, onSubmit: async ({ value: e }) => {
    await new Promise((t) => setTimeout(t, 1e3)), u(JSON.stringify(e, null, 2));
  } });
  return jsxs("div", { className: "max-w-3xl mx-auto p-6", children: [jsx("h1", { className: "text-2xl font-bold mb-6", children: "TanStack Form Demo" }), jsxs("form", { onSubmit: (e) => {
    e.preventDefault(), e.stopPropagation(), s.handleSubmit();
  }, className: "space-y-8", children: [jsxs("div", { className: "bg-card p-6 rounded-lg shadow-sm", children: [jsx("h2", { className: "text-lg font-semibold mb-4", children: "Personal Information" }), jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [jsx(s.Field, { name: "personal.firstName", validators: { onChange: (e) => {
    try {
      return m.shape.personal.shape.firstName.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "First name must be at least 2 characters" };
    }
  }, onBlur: (e) => {
    try {
      return m.shape.personal.shape.firstName.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "First name must be at least 2 characters" };
    }
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "First Name" }), jsx(f, { id: e.name, name: e.name, value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } }), jsx(s.Field, { name: "personal.lastName", validators: { onChange: (e) => {
    try {
      return m.shape.personal.shape.lastName.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Last name must be at least 2 characters" };
    }
  }, onBlur: (e) => {
    try {
      return m.shape.personal.shape.lastName.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Last name must be at least 2 characters" };
    }
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "Last Name" }), jsx(f, { id: e.name, name: e.name, value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } }), jsx(s.Field, { name: "personal.email", validators: { onChange: (e) => {
    try {
      return m.shape.personal.shape.email.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Please enter a valid email address" };
    }
  }, onBlur: (e) => {
    try {
      return m.shape.personal.shape.email.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Please enter a valid email address" };
    }
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "Email" }), jsx(f, { id: e.name, name: e.name, type: "email", value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } }), jsx(s.Field, { name: "personal.age", validators: { onChange: (e) => {
    if (!e) return { status: "success" };
    const t = parseInt(e, 10);
    return isNaN(t) ? { status: "error", error: "Age must be a number" } : t < 18 ? { status: "error", error: "You must be at least 18 years old" } : { status: "success" };
  }, onBlur: (e) => {
    if (!e) return { status: "success" };
    const t = parseInt(e, 10);
    return isNaN(t) ? { status: "error", error: "Age must be a number" } : t < 18 ? { status: "error", error: "You must be at least 18 years old" } : { status: "success" };
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "Age" }), jsx(f, { id: e.name, name: e.name, type: "number", value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } })] })] }), jsxs("div", { className: "bg-card p-6 rounded-lg shadow-sm", children: [jsx("h2", { className: "text-lg font-semibold mb-4", children: "Address" }), jsxs("div", { className: "grid grid-cols-1 gap-4", children: [jsx(s.Field, { name: "address.street", validators: { onChange: (e) => {
    try {
      return m.shape.address.shape.street.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Street address must be at least 5 characters" };
    }
  }, onBlur: (e) => {
    try {
      return m.shape.address.shape.street.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Street address must be at least 5 characters" };
    }
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "Street" }), jsx(f, { id: e.name, name: e.name, value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } }), jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [jsx(s.Field, { name: "address.city", validators: { onChange: (e) => {
    try {
      return m.shape.address.shape.city.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "City must be at least 2 characters" };
    }
  }, onBlur: (e) => {
    try {
      return m.shape.address.shape.city.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "City must be at least 2 characters" };
    }
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "City" }), jsx(f, { id: e.name, name: e.name, value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } }), jsx(s.Field, { name: "address.state", validators: { onChange: (e) => {
    try {
      return m.shape.address.shape.state.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "State must be at least 2 characters" };
    }
  }, onBlur: (e) => {
    try {
      return m.shape.address.shape.state.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "State must be at least 2 characters" };
    }
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "State" }), jsx(f, { id: e.name, name: e.name, value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } }), jsx(s.Field, { name: "address.zipCode", validators: { onChange: (e) => {
    try {
      return m.shape.address.shape.zipCode.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Please enter a valid zip code" };
    }
  }, onBlur: (e) => {
    try {
      return m.shape.address.shape.zipCode.parse(e), { status: "success" };
    } catch {
      return { status: "error", error: "Please enter a valid zip code" };
    }
  } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "Zip Code" }), jsx(f, { id: e.name, name: e.name, value: e.state.value, onBlur: e.handleBlur, onChange: (t) => e.handleChange(t.target.value) }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } })] })] })] }), jsxs("div", { className: "bg-card p-6 rounded-lg shadow-sm", children: [jsx("h2", { className: "text-lg font-semibold mb-4", children: "Preferences" }), jsxs("div", { className: "space-y-4", children: [jsx(s.Field, { name: "preferences.receiveEmails", children: (e) => jsxs("div", { className: "flex items-center space-x-2", children: [jsx(d, { id: e.name, checked: e.state.value, onCheckedChange: e.handleChange }), jsx(p, { htmlFor: e.name, children: "Receive Email Updates" })] }) }), jsx(s.Field, { name: "preferences.receiveSMS", children: (e) => jsxs("div", { className: "flex items-center space-x-2", children: [jsx(n, { id: e.name, checked: e.state.value, onCheckedChange: e.handleChange }), jsx(p, { htmlFor: e.name, children: "Receive SMS Updates" })] }) }), jsx(s.Field, { name: "preferences.theme", children: (e) => jsxs("div", { className: "space-y-2", children: [jsx(p, { htmlFor: e.name, children: "Theme Preference" }), jsxs("div", { className: "flex space-x-4", children: [jsxs("div", { className: "flex items-center space-x-2", children: [jsx("input", { type: "radio", id: "theme-light", name: e.name, value: "light", checked: e.state.value === "light", onChange: () => e.handleChange("light") }), jsx(p, { htmlFor: "theme-light", children: "Light" })] }), jsxs("div", { className: "flex items-center space-x-2", children: [jsx("input", { type: "radio", id: "theme-dark", name: e.name, value: "dark", checked: e.state.value === "dark", onChange: () => e.handleChange("dark") }), jsx(p, { htmlFor: "theme-dark", children: "Dark" })] }), jsxs("div", { className: "flex items-center space-x-2", children: [jsx("input", { type: "radio", id: "theme-system", name: e.name, value: "system", checked: e.state.value === "system", onChange: () => e.handleChange("system") }), jsx(p, { htmlFor: "theme-system", children: "System" })] })] })] }) })] })] }), jsx(s.Field, { name: "terms", validators: { onChange: (e) => e ? { status: "success" } : { status: "error", error: "You must accept the terms and conditions" }, onBlur: (e) => e ? { status: "success" } : { status: "error", error: "You must accept the terms and conditions" } }, children: (e) => {
    var _a;
    return jsxs("div", { className: "space-y-2", children: [jsxs("div", { className: "flex items-center space-x-2", children: [jsx(d, { id: e.name, checked: e.state.value, onCheckedChange: e.handleChange }), jsx(p, { htmlFor: e.name, children: "I agree to the Terms and Conditions" })] }), e.state.meta.errors && ((_a = e.state.meta.errors[0]) == null ? void 0 : _a.error) ? jsx("p", { className: "text-sm text-destructive", children: e.state.meta.errors[0].error }) : null] });
  } }), jsxs("div", { className: "flex justify-between items-center", children: [jsx(g, { type: "button", variant: "outline", onClick: () => s.reset(), children: "Reset" }), jsxs("div", { className: "space-x-2", children: [jsx(g, { type: "button", variant: "outline", onClick: () => {
    s.validate();
  }, children: "Validate" }), jsx(g, { type: "submit", disabled: s.state.isSubmitting, children: s.state.isSubmitting ? "Submitting..." : "Submit" })] })] })] }), jsxs("div", { className: "mt-8 space-y-4", children: [jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [jsx("h3", { className: "text-lg font-semibold mb-2", children: "Form State" }), jsxs("div", { className: "grid grid-cols-2 gap-4", children: [jsxs("div", { children: [jsxs("p", { children: [jsx("strong", { children: "Dirty:" }), " ", s.state.isDirty ? "Yes" : "No"] }), jsxs("p", { children: [jsx("strong", { children: "Valid:" }), " ", s.state.isValid ? "Yes" : "No"] }), jsxs("p", { children: [jsx("strong", { children: "Submitting:" }), " ", s.state.isSubmitting ? "Yes" : "No"] })] }), jsxs("div", { children: [jsxs("p", { children: [jsx("strong", { children: "Submitted:" }), " ", s.state.isSubmitted ? "Yes" : "No"] }), jsxs("p", { children: [jsx("strong", { children: "Validating:" }), " ", s.state.isValidating ? "Yes" : "No"] }), jsxs("p", { children: [jsx("strong", { children: "Touched:" }), " ", s.state.isTouched ? "Yes" : "No"] })] })] })] }), o && jsxs("div", { className: "p-4 bg-muted rounded-lg", children: [jsx("h3", { className: "text-lg font-semibold mb-2", children: "Form Submission" }), jsx("pre", { className: "bg-card p-4 rounded-md text-xs overflow-auto", children: o })] })] })] });
}
const V = function() {
  return jsx("div", { className: "container py-8", children: jsx(v, {}) });
};

export { V as component };
//# sourceMappingURL=form-DwcDPiMi.mjs.map
