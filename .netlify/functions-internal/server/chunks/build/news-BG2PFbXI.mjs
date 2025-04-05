import { jsx, jsxs } from 'react/jsx-runtime';
import { Outlet } from '@tanstack/react-router';

const i = function() {
  return jsx("div", { className: "py-6", children: jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [jsx("h1", { className: "text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white", children: "News Explorer" }), jsx("p", { className: "mt-2 text-lg text-gray-600 dark:text-gray-300", children: "Search for news articles or browse the latest headlines." }), jsx("div", { className: "mt-6", children: jsx(Outlet, {}) })] }) });
};

export { i as component };
//# sourceMappingURL=news-BG2PFbXI.mjs.map
