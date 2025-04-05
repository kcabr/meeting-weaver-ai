import { z } from 'zod';
import p from 'openai';
import { _ } from '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import '@tanstack/router-core';
import 'tiny-invariant';
import '@tanstack/start-server-core';
import '@tanstack/start-client-core';
import '@clerk/tanstack-start/server';
import 'react/jsx-runtime';
import '@tanstack/react-router';
import '@clerk/tanstack-start';
import '@tanstack/react-router-devtools';
import '@tanstack/react-query-devtools';
import '@tanstack/react-query';
import 'react-hot-toast';
import 'react-redux';
import 'react';
import 'stripe';
import '@reduxjs/toolkit';
import 'node:stream';
import 'isbot';
import 'react-dom/server';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const a = z.object({ prompt: z.string(), inputText: z.string() }), i = new p({ apiKey: process.env.OPENAI_API_KEY }), l = _("/api/ai/magic-text")({ POST: async ({ request: o }) => {
  try {
    const e = await o.json(), { prompt: r, inputText: s } = a.parse(e), n = await i.chat.completions.create({ model: "gpt-4o", messages: [{ role: "user", content: [{ type: "text", text: r }, { type: "text", text: s }] }] });
    return Response.json(n.choices[0].message.content);
  } catch (e) {
    return console.error("Error processing magic text request:", e), Response.json({ error: "Failed to process request" }, { status: 500 });
  }
} });

export { l as APIRoute };
//# sourceMappingURL=magic-text.mjs.map
