Below represents the documentation for Tanstack Start the fullstack react framework. Use it to model best practices when generating code.

================================================================
File Summary
================================================================

## Purpose:

This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format:

The content is organized as follows:

1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
   a. A separator line (================)
   b. The file path (File: path/to/file)
   c. Another separator line
   d. The full contents of the file
   e. A blank line

## Usage Guidelines:

- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes:

- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching these patterns are excluded: \*\*/config.json
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded

## Additional Info:

================================================================
Directory Structure
================================================================
framework/react/api-routes.md
framework/react/authentication.md
framework/react/build-from-scratch.md
framework/react/databases.md
framework/react/getting-started.md
framework/react/hosting.md
framework/react/learn-the-basics.md
framework/react/middleware.md
framework/react/observability.md
framework/react/overview.md
framework/react/path-aliases.md
framework/react/quick-start.md
framework/react/server-functions.md
framework/react/ssr.md
framework/react/static-prerendering.md
framework/react/static-server-functions.md

================================================================
Files
================================================================

================
File: framework/react/api-routes.md
================

---

id: api-routes
title: API Routes

---

API Routes are a powerful feature of TanStack Start that allow you to create server-side endpoints in your application without the need for a separate server. API Routes are useful for handling form submissions, user authentication, and more.

By default, API Routes are defined in your `./app/routes/api` directory of your project and are automatically handled by the TanStack Start server.

> 🧠 This means that by default, your API Routes will be prefixed with `/api` and will be served from the same server as your application. You can customize this base path by changing the `server.apiBaseURL` in your TanStack Start config.

## File Route Conventions

API Routes in TanStack Start, follow the same file-based routing conventions as TanStack Router. This means that each file in your `routes` directory that is prefixed with `api` (which can be configured) will be treated as an API route. Here are a few examples:

- `routes/api.users.ts` will create an API route at `/api/users`
- `routes/api/users.ts` will **also** create an API route at `/api/users`
- `routes/api/users.index.ts` will **also** create an API route at `/api/users`
- `routes/api/users/$id.ts` will create an API route at `/api/users/$id`
- `routes/api/users/$id/posts.ts` will create an API route at `/api/users/$id/posts`
- `routes/api.users.$id.posts.ts` will **also** create an API route at `/api/users/$id/posts`
- `routes/api/file/$.ts` will create an API route at `/api/file/$`

Your route files that are prefixed with `api`, can be thought of as the handlers for the given API route path.

It's important to remember that each route can only have a single handler file associated with it. So, if you have a file named `routes/api/users.ts` which'd equal the request path of `/api/users`, you cannot have other files that'd also resolve to the same route, like:

- `routes/api/users.index.ts`
- `routes/api.users.ts`.
- `routes/api.users.index.ts`.

❗ One more thing, API Routes do not have the concept of pathless layout routes or parallel routes. So, a file named:

- `routes/api/_pathlessLayout/users.ts` would resolve to `/api/_pathlessLayout/users` and **NOT** `/api/users`.

## Nested Directories vs File-names

In the examples above, you may have noticed that the file naming conventions are flexible and allow you to mix and match directories and file names. This is intentional and allows you to organize your API Routes in a way that makes sense for your application. You can read more about this in the [TanStack Router File-based Routing Guide](/router/latest/docs/framework/react/routing/file-based-routing#s-or-s).

## Setting up the entry handler

Before you can create your API routes, you need to set up the entry handler for your TanStack Start project. This entry handler, similar to `client` and `ssr`, handles the API incoming requests and routes them to the appropriate API route handler. The API entry handler is defined in the `app/api.ts` file in your project.

Here's an example implementation:

```ts
// app/api.ts
import {
  createStartAPIHandler,
  defaultAPIFileRouteHandler,
} from "@tanstack/react-start/api";

export default createStartAPIHandler(defaultAPIFileRouteHandler);
```

This file is responsible for creating the API handler that will be used to route incoming requests to the appropriate API route handler. The `defaultAPIFileRouteHandler` is a helper function that will automatically load and execute the appropriate API route handler based on the incoming request.

## Defining an API Route

API Routes export an APIRoute instance by calling the `createAPIFileRoute` function. Similar to other file-based routes in TanStack Router, the first argument to this function is the path of the route. The function returned is called again with an object that defines the route handlers for each HTTP method.

> [!TIP]
> If you've already got the dev server running, when you create a new API route, it'll automatically have the initial handler set up for you. From there on, you can customize the handler as needed.

```ts
// routes/api/hello.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/hello")({
  GET: async ({ request }) => {
    return new Response("Hello, World! from " + request.url);
  },
});
```

Each HTTP method handler receives an object with the following properties:

- `request`: The incoming request object. You can read more about the `Request` object in the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Request).
- `params`: An object containing the dynamic path parameters of the route. For example, if the route path is `/users/$id`, and the request is made to `/users/123`, then `params` will be `{ id: '123' }`. We'll cover dynamic path parameters and wildcard parameters later in this guide.

Once you've processed the request, you need to return a `Response` object or `Promise<Response>`. This can be done by creating a new `Response` object and returning it from the handler. You can read more about the `Response` object in the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Response).

## Dynamic Path Params

API Routes support dynamic path parameters, which are denoted by a `$` followed by the parameter name. For example, a file named `routes/api/users/$id.ts` will create an API route at `/api/users/$id` that accepts a dynamic `id` parameter.

```ts
// routes/api/users/$id.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/users/$id")({
  GET: async ({ params }) => {
    const { id } = params;
    return new Response(`User ID: ${id}`);
  },
});

// Visit /api/users/123 to see the response
// User ID: 123
```

You can also have multiple dynamic path parameters in a single route. For example, a file named `routes/api/users/$id/posts/$postId.ts` will create an API route at `/api/users/$id/posts/$postId` that accepts two dynamic parameters.

```ts
// routes/api/users/$id/posts/$postId.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/users/$id/posts/$postId")({
  GET: async ({ params }) => {
    const { id, postId } = params;
    return new Response(`User ID: ${id}, Post ID: ${postId}`);
  },
});

// Visit /api/users/123/posts/456 to see the response
// User ID: 123, Post ID: 456
```

## Wildcard/Splat Param

API Routes also support wildcard parameters at the end of the path, which are denoted by a `$` followed by nothing. For example, a file named `routes/api/file/$.ts` will create an API route at `/api/file/$` that accepts a wildcard parameter.

```ts
// routes/api/file/$.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/file/$")({
  GET: async ({ params }) => {
    const { _splat } = params;
    return new Response(`File: ${_splat}`);
  },
});

// Visit /api/file/hello.txt to see the response
// File: hello.txt
```

## Handling requests with a body

To handle POST requests,you can add a `POST` handler to the route object. The handler will receive the request object as the first argument, and you can access the request body using the `request.json()` method.

```ts
// routes/api/hello.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/hello")({
  POST: async ({ request }) => {
    const body = await request.json();
    return new Response(`Hello, ${body.name}!`);
  },
});

// Send a POST request to /api/hello with a JSON body like { "name": "Tanner" }
// Hello, Tanner!
```

This also applies to other HTTP methods like `PUT`, `PATCH`, and `DELETE`. You can add handlers for these methods in the route object and access the request body using the appropriate method.

It's important to remember that the `request.json()` method returns a `Promise` that resolves to the parsed JSON body of the request. You need to `await` the result to access the body.

This is a common pattern for handling POST requests in API Routes. You can also use other methods like `request.text()` or `request.formData()` to access the body of the request.

## Responding with JSON

When returning JSON using a Response object, this is a common pattern:

```ts
// routes/api/hello.ts
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/hello")({
  GET: async ({ request }) => {
    return new Response(JSON.stringify({ message: "Hello, World!" }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
});

// Visit /api/hello to see the response
// {"message":"Hello, World!"}
```

## Using the `json` helper function

Or you can use the `json` helper function to automatically set the `Content-Type` header to `application/json` and serialize the JSON object for you.

```ts
// routes/api/hello.ts
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/hello")({
  GET: async ({ request }) => {
    return json({ message: "Hello, World!" });
  },
});

// Visit /api/hello to see the response
// {"message":"Hello, World!"}
```

## Responding with a status code

You can set the status code of the response by either:

- Passing it as a property of the second argument to the `Response` constructor

  ```ts
  // routes/api/hello.ts
  import { json } from "@tanstack/react-start";
  import { createAPIFileRoute } from "@tanstack/react-start/api";

  export const APIRoute = createAPIFileRoute("/users/$id")({
    GET: async ({ request, params }) => {
      const user = await findUser(params.id);
      if (!user) {
        return new Response("User not found", {
          status: 404,
        });
      }
      return json(user);
    },
  });
  ```

- Using the `setResponseStatus` helper function from `@tanstack/react-start/server`

  ```ts
  // routes/api/hello.ts
  import { json } from "@tanstack/react-start";
  import { createAPIFileRoute } from "@tanstack/react-start/api";
  import { setResponseStatus } from "@tanstack/react-start/server";

  export const APIRoute = createAPIFileRoute("/users/$id")({
    GET: async ({ request, params }) => {
      const user = await findUser(params.id);
      if (!user) {
        setResponseStatus(404);
        return new Response("User not found");
      }
      return json(user);
    },
  });
  ```

In this example, we're returning a `404` status code if the user is not found. You can set any valid HTTP status code using this method.

## Setting headers in the response

Sometimes you may need to set headers in the response. You can do this by either:

- Passing an object as the second argument to the `Response` constructor.

  ```ts
  // routes/api/hello.ts
  import { createAPIFileRoute } from "@tanstack/react-start/api";

  export const APIRoute = createAPIFileRoute("/api/hello")({
    GET: async ({ request }) => {
      return new Response("Hello, World!", {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    },
  });

  // Visit /api/hello to see the response
  // Hello, World!
  ```

- Or using the `setHeaders` helper function from `@tanstack/react-start/server`.

  ```ts
  // routes/api/hello.ts
  import { createAPIFileRoute } from "@tanstack/react-start/api";
  import { setHeaders } from "@tanstack/react-start/server";

  export const APIRoute = createAPIFileRoute("/api/hello")({
    GET: async ({ request }) => {
      setHeaders({
        "Content-Type": "text/plain",
      });
      return new Response("Hello, World!");
    },
  });
  ```

================
File: framework/react/authentication.md
================

---

id: authentication
title: Authentication

---

<!-- We need some placeholder content here for authentication. One of our partners, Clerk, should get preferential treatment as the "preferred" way of doing auth with TanStack, but we'll support any and all other authentication providers and strategies. Write some general authentication content here until we have docs for both Clerk and other auth providers: -->

Authentication is the process of verifying the identity of a user. This is a critical part of any application that requires users to log in or access protected resources. TanStack Start provides the necessary full-stack APIs to implement authentication in your application.

## What should I use?

TanStack Start is **designed to work with any authentication provider**, so if you already have an authentication provider or strategy in mind, you can use either find an existing example or implement your own authentication logic using the full-stack APIs provided by TanStack Start.

That said, authentication is not something to be taken lightly. After much vetting, usage and reviewing on our end, we highly recommend using [Clerk](https://clerk.dev) for the best possible authentication experience. Clerk provides a full suite of authentication APIs and UI components that make it easy to implement authentication in your application and provide a seamless user experience.

## What is Clerk?

<a href="https://go.clerk.com/wOwHtuJ" alt="Clerk Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/clerk-logo-dark.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/clerk-logo-light.svg" width="280">
    <img alt="Convex logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/clerk-logo-light.svg" width="280">
  </picture>
</a>

Clerk is a modern authentication platform that provides a full suite of authentication APIs and UI components to help you implement authentication in your application. Clerk is designed to be easy to use and provides a seamless user experience. With Clerk, you can implement authentication in your application in minutes and provide your users with a secure and reliable authentication experience.

- To learn more about Clerk, visit the [Clerk website](https://go.clerk.com/wOwHtuJ)
- To sign up, visit the [Clerk dashboard](https://go.clerk.com/PrSDXti)
- To get started with Clerk, check out our [official Start + Clerk examples!](../examples/start-clerk-basic/)

## Documentation & APIs

Documentation for implementing your own authentication logic with TanStack Start is coming soon! In the meantime, you can check out any of the `-auth` prefixed [examples](../examples) for a starting point.

================
File: framework/react/build-from-scratch.md
================

---

id: build-from-scratch
title: Build a Project from Scratch

---

> [!NOTE]
> If you chose to quick start with an example or cloned project, you can skip this guide and move on to the [Learn the Basics](../learn-the-basics) guide.

_So you want to build a TanStack Start project from scratch?_

This guide will help you build a **very** basic TanStack Start web application. Together, we will use TanStack Start to:

- Serve an index page...
- Which displays a counter...
- With a button to increment the counter persistently.

[Here is what that will look like](https://stackblitz.com/github/tanstack/router/tree/main/examples/react/start-counter)

Let's create a new project directory and initialize it.

```shell
mkdir myApp
cd myApp
npm init -y
```

> [!NOTE] > We use `npm` in all of these examples, but you can use your package manager of choice instead.

## TypeScript Configuration

We highly recommend using TypeScript with TanStack Start. Create a `tsconfig.json` file with at least the following settings:

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true,
  },
}
```

> [!NOTE] > Enabling `verbatimModuleSyntax` can result in server bundles leaking into client bundles. It is recommended to keep this option disabled.

## Install Dependencies

TanStack Start is (currently\*) powered by [Vinxi](https://vinxi.vercel.app/) and [TanStack Router](https://tanstack.com/router) and requires them as dependencies.

> [!NOTE] > \*Vinxi will be removed before version 1.0.0 is released and TanStack will rely only on Vite and Nitro. The commands and APIs that use Vinxi will likely be replaced with a Vite plugin or dedicated TanStack Start CLI.

To install them, run:

```shell
npm i @tanstack/react-start @tanstack/react-router vinxi
```

You'll also need React and the Vite React plugin, so install them too:

```shell
npm i react react-dom
npm i -D @vitejs/plugin-react vite-tsconfig-paths
```

and some TypeScript:

```shell
npm i -D typescript @types/react @types/react-dom
```

## Update Configuration Files

We'll then update our `package.json` to use Vinxi's CLI and set `"type": "module"`:

```json
{
  // ...
  "type": "module",
  "scripts": {
    "dev": "vinxi dev",
    "build": "vinxi build",
    "start": "vinxi start"
  }
}
```

Then configure TanStack Start's `app.config.ts` file:

```typescript
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
```

## Add the Basic Templating

There are four required files for TanStack Start usage:

1. The router configuration
2. The server entry point
3. The client entry point
4. The root of your application

Once configuration is done, we'll have a file tree that looks like the following:

```
.
├── app/
│   ├── routes/
│   │   └── `__root.tsx`
│   ├── `client.tsx`
│   ├── `router.tsx`
│   ├── `routeTree.gen.ts`
│   └── `ssr.tsx`
├── `.gitignore`
├── `app.config.ts`
├── `package.json`
└── `tsconfig.json`
```

## The Router Configuration

This is the file that will dictate the behavior of TanStack Router used within Start. Here, you can configure everything
from the default [preloading functionality](../guide/preloading.md) to [caching staleness](../guide/data-loading.md).

```tsx
// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
```

> `routeTree.gen.ts` is not a file you're expected to have at this point.
> It will be generated when you run TanStack Start (via `npm run dev` or `npm run start`) for the first time.

## The Server Entry Point

As TanStack Start is an [SSR](https://unicorn-utterances.com/posts/what-is-ssr-and-ssg) framework, we need to pipe this router
information to our server entry point:

```tsx
// app/ssr.tsx
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";

import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
```

This allows us to know what routes and loaders we need to execute when the user hits a given route.

## The Client Entry Point

Now we need a way to hydrate our client-side JavaScript once the route resolves to the client. We do this by piping the same
router information to our client entry point:

```tsx
// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);
```

This enables us to kick off client-side routing once the user's initial server request has fulfilled.

## The Root of Your Application

Finally, we need to create the root of our application. This is the entry point for all other routes. The code in this file will wrap all other routes in the application.

```tsx
// app/routes/__root.tsx
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

## Writing Your First Route

Now that we have the basic templating setup, we can write our first route. This is done by creating a new file in the `app/routes` directory.

```tsx
// app/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0")
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate();
        });
      }}
    >
      Add 1 to {state}?
    </button>
  );
}
```

That's it! 🤯 You've now set up a TanStack Start project and written your first route. 🎉

You can now run `npm run dev` to start your server and navigate to `http://localhost:3000` to see your route in action.

You want to deploy your application? Check out the [hosting guide](./hosting.md).

================
File: framework/react/databases.md
================

---

id: databases
title: Databases

---

Databases are at the core of any dynamic application, providing the necessary infrastructure to store, retrieve, and manage data. TanStack Start makes it easy to integrate with a variety of databases, offering a flexible approach to managing your application's data layer.

## What should I use?

TanStack Start is **designed to work with any database provider**, so if you already have a preferred database system, you can integrate it with TanStack Start using the provided full-stack APIs. Whether you're working with SQL, NoSQL, or other types of databases, TanStack Start can handle your needs.

That said, the choice of a database is critical to your application's performance, scalability, and reliability, which is we highly recommend using [Convex](https://convex.dev?utm_source=tanstack) for the best possible database experience.

## What is Convex?

<a href="https://convex.dev?utm_source=tanstack" alt="Convex Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/convex-white.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/convex-color.svg" width="280">
    <img alt="Convex logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/convex-color.svg" width="280">
  </picture>
</a>

Convex is a powerful, serverless database platform that simplifies the process of managing your application's data. With Convex, you can build full-stack applications without the need to manually manage database servers or write complex queries. Convex provides a real-time, scalable, and transactional data backend that seamlessly integrates with TanStack Start, making it an excellent choice for modern web applications.

Convex’s declarative data model and automatic conflict resolution ensure that your application remains consistent and responsive, even at scale. It’s designed to be developer-friendly, with a focus on simplicity and productivity.

- To learn more about Convex, visit the [Convex website](https://convex.dev?utm_source=tanstack)
- To sign up, visit the [Convex dashboard](https://dashboard.convex.dev/signup?utm_source=tanstack)

## Documentation & APIs

Documentation for integrating different databases with TanStack Start is coming soon! In the meantime, keep an eye on our examples and guide to learn how to fully leverage your data layer across your TanStack Start application.

================
File: framework/react/getting-started.md
================

---

id: getting-started
title: Getting Started

---

To set up a TanStack Start project, you can:

<!-- - Use the [TanStack Start CLI](https://github.com/tanstack/start/tree/main/packages/start-cli) to generate a new project and learn as you go -->

- Use the [Quick Start Examples](../quick-start) to rapidly learn as you go
- [Build a project from scratch](../build-from-scratch) to learn how TanStack Start works from the ground up

================
File: framework/react/hosting.md
================

---

id: hosting
title: Hosting

---

Hosting is the process of deploying your application to the internet so that users can access it. This is a critical part of any web development project, ensuring your application is available to the world. TanStack Start is built on [Nitro](https://nitro.unjs.io/), a powerful server toolkit for deploying web applications anywhere. Nitro allows TanStack Start to provide a unified API for SSR, streaming, and hydration on any hosting provider.

## What should I use?

TanStack Start is **designed to work with any hosting provider**, so if you already have a hosting provider in mind, you can deploy your application there using the full-stack APIs provided by TanStack Start.

However, since hosting is one of the most crucial aspects of your application's performance, reliability, and scalability, we highly recommend using our Official Hosting Partner [Netlify](https://www.netlify.com?utm_source=tanstack).

## What is Netlify?

<a href="https://www.netlify.com?utm_source=tanstack" alt="Netlify Logo">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/netlify-dark.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/netlify-light.svg" width="280">
    <img alt="Netlify logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/netlify-light.svg" width="280">
  </picture>
</a>

Netlify is a leading hosting platform that provides a fast, secure, and reliable environment for deploying your web applications. With Netlify, you can deploy your TanStack Start application in just a few clicks and benefit from features like a global edge network, automatic scaling, and seamless integrations with GitHub and GitLab. Netlify is designed to make your development process as smooth as possible, from local development to production deployment.

- To learn more about Netlify, visit the [Netlify website](https://www.netlify.com?utm_source=tanstack)
- To sign up, visit the [Netlify dashboard](https://www.netlify.com/signup?utm_source=tanstack)

## Deployment

> [!WARNING]
> The page is still a work in progress. We'll keep updating this page with guides on deployment to different hosting providers soon!

When a TanStack Start application is being deployed, the `server.preset` value in the `app.config.ts` file determines the deployment target. The deployment target can be set to one of the following values:

- [`netlify`](#netlify): Deploy to Netlify
- [`vercel`](#vercel): Deploy to Vercel
- [`cloudflare-pages`](#cloudflare-pages): Deploy to Cloudflare Pages
- [`node-server`](#nodejs): Deploy to a Node.js server
- [`bun`](#bun): Deploy to a Bun server
- ... and more to come!

Once you've chosen a deployment target, you can follow the deployment guidelines below to deploy your TanStack Start application to the hosting provider of your choice.

### Netlify

Set the `server.preset` value to `netlify` in your `app.config.ts` file.

```ts
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    preset: "netlify",
  },
});
```

Or you can use the `--preset` flag with the `build` command to specify the deployment target when building the application:

```sh
npm run build --preset netlify
```

Deploy you application to Netlify using their one-click deployment process, and you're ready to go!

### Vercel

Deploying your TanStack Start application to Vercel is easy and straightforward. Just set the `server.preset` value to `vercel` in your `app.config.ts` file, and you're ready to deploy your application to Vercel.

```ts
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    preset: "vercel",
  },
});
```

Or you can use the `--preset` flag with the `build` command to specify the deployment target when building the application:

```sh
npm run build --preset vercel
```

Deploy you application to Vercel using their one-click deployment process, and you're ready to go!

### Cloudflare Pages

When deploying to Cloudflare Pages, you'll need to complete a few extra steps before your users can start using your app.

1. Installation

First you will need to install `unenv`

```sh
npm install unenv
```

2. Update `app.config.ts`

Set the `server.preset` value to `cloudflare-pages` and the `server.unenv` value to the `cloudflare` from `unenv` in your `app.config.ts` file.

```ts
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import { cloudflare } from "unenv";

export default defineConfig({
  server: {
    preset: "cloudflare-pages",
    unenv: cloudflare,
  },
});
```

3. Add a `wrangler.toml` config file

```toml
# wrangler.toml
name = "your-cloudflare-project-name"
pages_build_output_dir = "./dist"
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2024-11-13"
```

Deploy you application to Cloudflare Pages using their one-click deployment process, and you're ready to go!

### Node.js

Set the `server.preset` value to `node-server` in your `app.config.ts` file.

```ts
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    preset: "node-server",
  },
});

// Or you can use the --preset flag with the build command
// to specify the deployment target when building the application:
// npm run build --preset node-server
```

Then you can run the following command to build and start your application:

```sh
npm run build
```

You're now ready to deploy your application to a Node.js server. You can start your application by running:

```sh
node .output/server/index.mjs
```

### Bun

> [!IMPORTANT]
> Currently, the Bun specific deployment guidelines only work with React 19. If you are using React 18, please refer to the [Node.js](#nodejs) deployment guidelines.

Make sure that your `react` and `react-dom` packages are set to version 19.0.0 or higher in your `package.json` file. If not, run the following command to upgrade the packages:

```sh
npm install react@rc react-dom@rc
```

Set the `server.preset` value to `bun` in your `app.config.ts` file.

```ts
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    preset: "bun",
  },
});

// Or you can use the --preset flag with the build command
// to specify the deployment target when building the application:
// npm run build --preset bun
```

Then you can run the following command to build and start your application:

```sh
bun run build
```

You're now ready to deploy your application to a Bun server. You can start your application by running:

```sh
bun run .output/server/index.mjs
```

================
File: framework/react/learn-the-basics.md
================

---

id: learn-the-basics
title: Learn the Basics

---

This guide will help you learn the basics behind how TanStack Start works, regardless of how you set up your project.

## Dependencies

TanStack Start is (currently\*) powered by [Vinxi](https://vinxi.vercel.app/), [Nitro](https://nitro.unjs.io/) and [TanStack Router](https://tanstack.com/router).

- **TanStack Router**: A router for building web applications.
- **Nitro**: A framework for building server applications.
- **Vinxi**: A server framework for building web applications.

> [!NOTE] Vinxi will be removed before version 1.0.0 is released and TanStack will rely only on Vite and Nitro. The commands and APIs that use Vinxi will likely be replaced with a Vite plugin.

## It all "Starts" with the Router

This is the file that will dictate the behavior of TanStack Router used within Start. Here, you can configure everything
from the default [preloading functionality](/router/latest/docs/framework/react/guide/preloading) to [caching staleness](/router/latest/docs/framework/react/guide/data-loading).

```tsx
// app/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
```

- Notice the `scrollRestoration` property. This is used to restore the scroll position of the page when navigating between routes.

## Route Generation

The `routeTree.gen.ts` file is generated when you run TanStack Start (via `npm run dev` or `npm run start`) for the first time. This file contains the generated route tree and a handful of TS utilities that make TanStack Start fully type-safe.

## The Server Entry Point

Although TanStack Start is designed with client-first APIs, it is by and large, a full-stack framework. This means that all use cases, including both dynamic and static rely on a server or build-time entry to render our application's initial HTML payload.

This is done via the `app/ssr.tsx` file:

```tsx
// app/ssr.tsx
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";

import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
```

Whether we are statically generating our app or serving it dynamically, the `ssr.tsx` file is the entry point for doing all SSR-related work.

- It's important that a new router is created for each request. This ensures that any data handled by the router is unique to the request.
- The `getRouterManifest` function is used to generate the router manifest, which is used to determine many aspects of asset management and preloading for our application.
- The `defaultStreamHandler` function is used to render our application to a stream, allowing us to take advantage of streaming HTML to the client. (This is the default handler, but you can also use other handlers like `defaultRenderHandler`, or even build your own)

## The Client Entry Point

Getting our html to the client is only half the battle. Once there, we need to hydrate our client-side JavaScript once the route resolves to the client. We do this by hydrating the root of our application with the `StartClient` component:

```tsx
// app/client.tsx
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);
```

This enables us to kick off client-side routing once the user's initial server request has fulfilled.

## The Root of Your Application

Other than the client entry point, the `__root` route of your application is the entry point for your application. The code in this file will wrap all other routes in the app, including your home page. It behaves like a pathless layout route for your whole application.

Because it is **always rendered**, it is the perfect place to construct your application shell and take care of any global logic.

```tsx
// app/routes/__root.tsx
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

- This layout may change in the future as we roll out SPA mode, which allows the root route to render the SPA shell without any page-specific content.
- Notice the `Scripts` component. This is used to load all of the client-side JavaScript for the application.

## Routes

Routes are an extensive feature of TanStack Router, and are covered thoroughly in the [Routing Guide](/router/latest/docs/framework/react/routing/file-based-routing). As a summary:

- Routes are defined using the `createFileRoute` function.
- Routes are automatically code-split and lazy-loaded.
- Critical data fetching is coordinated from a Route's loader
- Much more!

```tsx
// app/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0")
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + data}`);
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 }).then(() => {
          router.invalidate();
        });
      }}
    >
      Add 1 to {state}?
    </button>
  );
}
```

## Navigation

TanStack Start builds 100% on top of TanStack Router, so all of the navigation features of TanStack Router are available to you. In summary:

- Use the `Link` component to navigate to a new route.
- Use the `useNavigate` hook to navigate imperatively.
- Use the `useRouter` hook anywhere in your application to access the router instance and perform invalidations.
- Every router hook that returns state is reactive, meaning it will automatically re-run when the appropriate state changes.

Here's a quick example of how you can use the `Link` component to navigate to a new route:

```tsx
import { Link } from "@tanstack/react-router";

function Home() {
  return <Link to="/about">About</Link>;
}
```

For more in-depth information on navigation, check out the [navigation guide](/router/latest/docs/framework/react/guide/navigation).

## Server Functions (RPCs)

You may have noticed the **server function** we created above using `createServerFn`. This is one of TanStack's most powerful features, allowing you to create server-side functions that can be called from both the server during SSR and the client!

Here's a quick overview of how server functions work:

- Server functions are created using the `createServerFn` function.
- They can be called from both the server during SSR and the client.
- They can be used to fetch data from the server, or to perform other server-side actions.

Here's a quick example of how you can use server functions to fetch and return data from the server:

```tsx
import { createServerFn } from "@tanstack/react-start";
import * as fs from "node:fs";
import { z } from "zod";

const getUserById = createServerFn({ method: "GET" })
  // Always validate data sent to the function, here we use Zod
  .validator(z.string())
  // The handler function is where you perform the server-side logic
  .handler(async ({ data }) => {
    return db.query.users.findFirst({ where: eq(users.id, data) });
  });

// Somewhere else in your application
const user = await getUserById({ data: "1" });
```

To learn more about server functions, check out the [server functions guide](../server-functions).

### Mutations

Server Functions can also be used to perform mutations on the server. This is also done using the same `createServerFn` function, but with the additional requirement that you invalidate any data on the client that was affected by the mutation.

- If you're using TanStack Router only, you can use the `router.invalidate()` method to invalidate all router data and re-fetch it.
- If you're using TanStack Query, you can use the `queryClient.invalidateQueries()` method to invalidate data, among other more specific methods to target specific queries.

Here's a quick example of how you can use server functions to perform a mutation on the server and invalidate the data on the client:

```tsx
import { createServerFn } from "@tanstack/react-start";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const updateUser = createServerFn({ method: "POST" })
  .validator(UserSchema)
  .handler(async ({ data }) => {
    return db
      .update(users)
      .set({ name: data.name })
      .where(eq(users.id, data.id));
  });

// Somewhere else in your application
await updateUser({ data: { id: "1", name: "John" } });
```

To learn more about mutations, check out the [mutations guide](/router/latest/docs/framework/react/guide/data-mutations).

## Data Loading

Another powerful feature of TanStack Router is data loading. This allows you to fetch data for SSR and preload route data before it is rendered. This is done using the `loader` function of a route.

Here's a quick overview of how data loading works:

- Data loading is done using the `loader` function of a route.
- Data loaders are **isomorphic**, meaning they are executed on both the server and the client.
- For performing server-only logic, call a server function from within the loader.
- Similar to TanStack Query, data loaders are cached on the client and are re-used and even re-fetched in the background when the data is stale.

To learn more about data loading, check out the [data loading guide](/router/latest/docs/framework/react/guide/data-loading).

================
File: framework/react/middleware.md
================

---

id: middleware
title: Middleware

---

## What is Server Function Middleware?

Middleware allows you to customize the behavior of server functions created with `createServerFn` with things like shared validation, context, and much more. Middleware can even depend on other middleware to create a chain of operations that are executed hierarchically and in order.

## What kinds of things can I do with Middleware in my Server Functions?

- **Authentication**: Verify a user's identity before executing a server function.
- **Authorization**: Check if a user has the necessary permissions to execute a server function.
- **Logging**: Log requests, responses, and errors.
- **Observability**: Collect metrics, traces, and logs.
- **Provide Context**: Attach data to the request object for use in other middleware or server functions.
- **Error Handling**: Handle errors in a consistent way.
- And many more! The possibilities are up to you!

## Defining Middleware for Server Functions

Middleware is defined using the `createMiddleware` function. This function returns a `Middleware` object that can be used to continue customizing the middleware with methods like `middleware`, `validator`, `server`, and `client`.

```tsx
import { createMiddleware } from "@tanstack/react-start";

const loggingMiddleware = createMiddleware().server(async ({ next, data }) => {
  console.log("Request received:", data);
  const result = await next();
  console.log("Response processed:", result);
  return result;
});
```

## Using Middleware in Your Server Functions

Once you've defined your middleware, you can use it in combination with the `createServerFn` function to customize the behavior of your server functions.

```tsx
import { createServerFn } from "@tanstack/react-start";
import { loggingMiddleware } from "./middleware";

const fn = createServerFn()
  .middleware([loggingMiddleware])
  .handler(async () => {
    // ...
  });
```

## Middleware Methods

Several methods are available to customize the middleware. If you are (hopefully) using TypeScript, the order of these methods is enforced by the type system to ensure maximum inference and type safety.

- `middleware`: Add a middleware to the chain.
- `validator`: Modify the data object before it is passed to this middleware and any nested middleware.
- `server`: Define server-side logic that the middleware will execute before any nested middleware and ultimately a server function, and also provide the result to the next middleware.
- `client`: Define client-side logic that the middleware will execute before any nested middleware and ultimately the client-side RPC function (or the server-side function), and also provide the result to the next middleware.

## The `middleware` method

The `middleware` method is used to dependency middleware to the chain that will executed **before** the current middleware. Just call the `middleware` method with an array of middleware objects.

```tsx
import { createMiddleware } from "@tanstack/react-start";

const loggingMiddleware = createMiddleware().middleware([
  authMiddleware,
  loggingMiddleware,
]);
```

Type-safe context and payload validation are also inherited from parent middlewares!

## The `validator` method

The `validator` method is used to modify the data object before it is passed to this middleware, nested middleware, and ultimately the server function. This method should receive a function that takes the data object and returns a validated (and optionally modified) data object. It's common to use a validation library like `zod` to do this. Here is an example:

```tsx
import { createMiddleware } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const mySchema = z.object({
  workspaceId: z.string(),
});

const workspaceMiddleware = createMiddleware()
  .validator(zodValidator(mySchema))
  .server(({ next, data }) => {
    console.log("Workspace ID:", data.workspaceId);
    return next();
  });
```

## The `server` method

The `server` method is used to define **server-side** logic that the middleware will execute both before and after any nested middleware and ultimately a server function. This method receives an object with the following properties:

- `next`: A function that, when called, will execute the next middleware in the chain.
- `data`: The data object that was passed to the server function.
- `context`: An object that stores data from parent middleware. It can be extended with additional data that will be passed to child middleware.

## Returning the required result from `next`

The `next` function is used to execute the next middleware in the chain. **You must await and return (or return directly) the result of the `next` function provided to you** for the chain to continue executing.

```tsx
import { createMiddleware } from "@tanstack/react-start";

const loggingMiddleware = createMiddleware().server(async ({ next }) => {
  console.log("Request received");
  const result = await next();
  console.log("Response processed");
  return result;
});
```

## Providing context to the next middleware via `next`

The `next` function can be optionally called with an object that has a `context` property with an object value. Whatever properties you pass to this `context` value will be merged into the parent `context` and provided to the next middleware.

```tsx
import { createMiddleware } from "@tanstack/react-start";

const awesomeMiddleware = createMiddleware().server(({ next }) => {
  return next({
    context: {
      isAwesome: Math.random() > 0.5,
    },
  });
});

const loggingMiddleware = createMiddleware().server(
  async ({ next, context }) => {
    console.log("Is awesome?", context.isAwesome);
    return next();
  }
);
```

## Client-Side Logic

Despite server functions being mostly server-side bound operations, there is still plenty of client-side logic surrounding the outgoing RPC request from the client. This means that we can also define client-side logic in middleware that will execute on the client side around any nested middleware and ultimately the RPC function and its response to the client.

## Client-side Payload Validation

By default, middleware validation is only performed on the server to keep the client bundle size small. However, you may also choose to validate data on the client side by passing the `validateClient: true` option to the `createMiddleware` function. This will cause the data to be validated on the client side before being sent to the server, potentially saving a round trip.

> Why can't I pass a different validation schema for the client?
>
> The client-side validation schema is derived from the server-side schema. This is because the client-side validation schema is used to validate the data before it is sent to the server. If the client-side schema were different from the server-side schema, the server would receive data that it did not expect, which could lead to unexpected behavior.

```tsx
import { createMiddleware } from "@tanstack/react-start";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const workspaceMiddleware = createMiddleware({ validateClient: true })
  .validator(zodValidator(mySchema))
  .server(({ next, data }) => {
    console.log("Workspace ID:", data.workspaceId);
    return next();
  });
```

## The `client` method

Client middleware logic is defined using the `client` method on a `Middleware` object. This method is used to define client-side logic that the middleware will execute both before and after any nested middleware and ultimately the client-side RPC function (or the server-side function if you're doing SSR or calling this function from another server function).

**Client-side middleware logic shares much of the same API as logic created with the `server` method, but it is executed on the client side.** This includes:

- Requiring the `next` function to be called to continue the chain.
- The ability to provide context to the next client middleware via the `next` function.
- The ability to modify the data object before it is passed to the next client middleware.

Similar to the `server` function, it also receives an object with the following properties:

- `next`: A function that, when called, will execute the next client middleware in the chain.
- `data`: The data object that was passed to the client function.
- `context`: An object that stores data from parent middleware. It can be extended with additional data that will be passed to child middleware.

```tsx
const loggingMiddleware = createMiddleware().client(async ({ next }) => {
  console.log("Request sent");
  const result = await next();
  console.log("Response received");
  return result;
});
```

## Sending client context to the server

**Client context is NOT sent to the server by default since this could end up unintentionally sending large payloads to the server.** If you need to send client context to the server, you must call the `next` function with a `sendContext` property and object to transmit any data to the server. Any properties passed to `sendContext` will be merged, serialized and sent to the server along with the data and will be available on the normal context object of any nested server middleware.

```tsx
const requestLogger = createMiddleware()
  .client(async ({ next, context }) => {
    return next({
      sendContext: {
        // Send the workspace ID to the server
        workspaceId: context.workspaceId,
      },
    });
  })
  .server(async ({ next, data, context }) => {
    // Woah! We have the workspace ID from the client!
    console.log("Workspace ID:", context.workspaceId);
    return next();
  });
```

## Client-Sent Context Security

You may have noticed that in the example above that while client-sent context is type-safe, it is is not required to be validated at runtime. If you pass dynamic user-generated data via context, that could pose a security concern, so **if you are sending dynamic data from the client to the server via context, you should validate it in the server-side middleware before using it.** Here's an example:

```tsx
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const requestLogger = createMiddleware()
  .client(async ({ next, context }) => {
    return next({
      sendContext: {
        workspaceId: context.workspaceId,
      },
    });
  })
  .server(async ({ next, data, context }) => {
    // Validate the workspace ID before using it
    const workspaceId = zodValidator(z.number()).parse(context.workspaceId);
    console.log("Workspace ID:", workspaceId);
    return next();
  });
```

## Sending server context to the client

Similar to sending client context to the server, you can also send server context to the client by calling the `next` function with a `sendContext` property and object to transmit any data to the client. Any properties passed to `sendContext` will be merged, serialized and sent to the client along with the response and will be available on the normal context object of any nested client middleware. The returned object of calling `next` in `client` contains the context sent from server to the client and is type-safe. Middleware is able to infer the context sent from the server to the client from previous middleware chained from the `middleware` function.

> [!WARNING]
> The return type of `next` in `client` can only be inferred from middleware known in the current middleware chain. Therefore the most accurate return type of `next` is in middleware at the end of the middleware chain

```tsx
const serverTimer = createMiddleware().server(async ({ next }) => {
  return next({
    sendContext: {
      // Send the current time to the client
      timeFromServer: new Date(),
    },
  });
});

const requestLogger = createMiddleware()
  .middleware([serverTimer])
  .client(async ({ next }) => {
    const result = await next();
    // Woah! We have the time from the server!
    console.log("Time from the server:", result.context.timeFromServer);

    return result;
  });
```

## Reading/Modifying the Server Response

Middleware that uses the `server` method executes in the same context as server functions, so you can follow the exact same [Server Function Context Utilities](./server-functions#server-function-context) to read and modify anything about the request headers, status codes, etc.

## Modifying the Client Request

Middleware that uses the `client` method executes in a **completely different client-side context** than server functions, so you can't use the same utilities to read and modify the request. However, you can still modify the request returning additional properties when calling the `next` function. Currently supported properties are:

- `headers`: An object containing headers to be added to the request.

Here's an example of adding an `Authorization` header any request using this middleware:

```tsx
import { getToken } from "my-auth-library";

const authMiddleware = createMiddleware().client(async ({ next }) => {
  return next({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
});
```

## Using Middleware

Middleware can be used in two different ways:

- **Global Middleware**: Middleware that should be executed for every request.
- **Server Function Middleware**: Middleware that should be executed for a specific server function.

## Global Middleware

Global middleware runs automatically for every server function in your application. This is useful for functionality like authentication, logging, and monitoring that should apply to all requests.

To use global middleware, create a `global-middleware.ts` file in your project (typically at `app/global-middleware.ts`). This file runs in both client and server environments and is where you register global middleware.

Here's how to register global middleware:

```tsx
// app/global-middleware.ts
import { registerGlobalMiddleware } from "@tanstack/react-start";
import { authMiddleware } from "./middleware";

registerGlobalMiddleware({
  middleware: [authMiddleware],
});
```

### Global Middleware Type Safety

Global middleware types are inherently **detached** from server functions themselves. This means that if a global middleware supplies additional context to server functions or other server function specific middleware, the types will not be automatically passed through to the server function or other server function specific middleware.

```tsx
// app/global-middleware.ts
registerGlobalMiddleware({
  middleware: [authMiddleware],
});
```

```tsx
// authMiddleware.ts
const authMiddleware = createMiddleware().server(({ next, context }) => {
  console.log(context.user); // <-- This will not be typed!
  // ...
});
```

To solve this, add the global middleware you are trying to reference to the server function's middleware array. **The global middleware will be deduped to a single entry (the global instance), and your server function will receive the correct types.**

Here's an example of how this works:

```tsx
import { authMiddleware } from "./authMiddleware";

const fn = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    console.log(context.user);
    // ...
  });
```

## Middleware Execution Order

Middleware is executed dependency-first, starting with global middleware, followed by server function middleware. The following example will log the following in this order:

- `globalMiddleware1`
- `globalMiddleware2`
- `a`
- `b`
- `c`
- `d`

```tsx
const globalMiddleware1 = createMiddleware().server(async ({ next }) => {
  console.log("globalMiddleware1");
  return next();
});

const globalMiddleware2 = createMiddleware().server(async ({ next }) => {
  console.log("globalMiddleware2");
  return next();
});

registerGlobalMiddleware({
  middleware: [globalMiddleware1, globalMiddleware2],
});

const a = createMiddleware().server(async ({ next }) => {
  console.log("a");
  return next();
});

const b = createMiddleware()
  .middleware([a])
  .server(async ({ next }) => {
    console.log("b");
    return next();
  });

const c = createMiddleware()
  .middleware()
  .server(async ({ next }) => {
    console.log("c");
    return next();
  });

const d = createMiddleware()
  .middleware([b, c])
  .server(async () => {
    console.log("d");
  });

const fn = createServerFn()
  .middleware([d])
  .server(async () => {
    console.log("fn");
  });
```

## Environment Tree Shaking

Middleware functionality is tree-shaken based on the environment for each bundle produced.

- On the server, nothing is tree-shaken, so all code used in middleware will be included in the server bundle.
- On the client, all server-specific code is removed from the client bundle. This means any code used in the `server` method is always removed from the client bundle. If `validateClient` is set to `true`, the client-side validation code will be included in the client bundle, otherwise `data` validation code will also be removed.

================
File: framework/react/observability.md
================

---

id: observability
title: Observability

---

Observability is a critical aspect of modern web development, enabling you to monitor, trace, and debug your application’s performance and errors. TanStack Start integrates seamlessly with observability tools to provide comprehensive insights into how your application behaves in production, helping you ensure that everything runs smoothly.

## What should I use?

TanStack Start is **designed to work with any observability tool**, so you can integrate your preferred solution using the full-stack APIs provided by TanStack Start. Whether you need logging, tracing, or error monitoring, TanStack Start is flexible enough to meet your observability needs.

However, for the best observability experience, we highly recommend using [Sentry](https://sentry.io?utm_source=tanstack). Sentry is a powerful, full-featured observability platform that provides real-time insights into your application's performance and error tracking.

## What is Sentry?

<a href="https://sentry.io?utm_source=tanstack" alt='Sentry Logo'>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/sentry-wordmark-light.svg" width="280">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/sentry-wordmark-dark.svg" width="280">
    <img alt="Convex logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/sentry-wordmark-light.svg" width="280">
  </picture>
</a>

Sentry is a leading observability platform that helps developers monitor and fix crashes in real-time. With Sentry, you can track errors, performance issues, and trends across your entire stack, from the frontend to the backend. Sentry integrates seamlessly with TanStack Start, enabling you to identify and resolve issues faster, maintain a high level of performance, and deliver a better experience to your users.

Sentry’s comprehensive dashboards, alerting capabilities, and in-depth error analysis tools make it an invaluable resource for any development team looking to maintain control over their application’s health in production.

- To learn more about Sentry, visit the [Sentry website](https://sentry.io?utm_source=tanstack)
- To sign up, visit the [Sentry dashboard](https://sentry.io/signup?utm_source=tanstack)

## Documentation & APIs

Documentation for integrating different observability tools with TanStack Start is coming soon! Stay tuned for more examples and guides on how to use Sentry effectively with your TanStack Start projects.

================
File: framework/react/overview.md
================

---

id: overview
title: TanStack Start Overview

---

TanStack Start is a full-stack React framework powered by TanStack Router. It provides a full-document SSR, streaming, server functions, bundling, and more using tools like [Nitro](https://nitro.unjs.io/) and [Vite](https://vitejs.dev/). It is ready to deploy to your favorite hosting provider!

## Router or Start?

TanStack Router is a powerful, type-safe, and full-featured routing system for React applications. It is designed to handle the beefiest of full-stack routing requirements with ease. TanStack Start builds on top of Router's type system to provide type-safe full-stack APIs that keep you in the fast lane.

What you get with TanStack Router:

- 100% inferred TypeScript support
- Typesafe navigation
- Nested Routing and pathless layout routes
- Built-in Route Loaders w/ SWR Caching
- Designed for client-side data caches (TanStack Query, SWR, etc.)
- Automatic route prefetching
- Asynchronous route elements and error boundaries
- File-based Route Generation
- Typesafe JSON-first Search Params state management APIs
- Path and Search Parameter Schema Validation
- Search Param Navigation APIs
- Custom Search Param parser/serializer support
- Search param middleware
- Route matching/loading middleware

What you get with TanStack Start:

- Full-document SSR
- Streaming
- Server Functions / RPCs
- Bundling
- Deployment
- Full-Stack Type Safety

**In summary, use TanStack Router for client-side routing and TanStack Start for full-stack routing.**

## How does it work?

TanStack Start uses [Nitro](https://nitro.unjs.io/) and [Vite](https://vitejs.dev/) to bundle and deploy your application. In fact, these are the same tools that power Solid Start! With these tools, we can do a few things we couldn't do before:

- Provide a unified API for SSR, streaming, and hydration
- Extract server-only code from your client-side code (e.g. server functions)
- Bundle your application for deployment to any hosting provider

## When should I use it?

TanStack Start is perfect for you if you want to build a full-stack React application with the following requirements:

- Full-document SSR & Hydration
- Streaming
- Server Functions / RPCs
- Full-Stack Type Safety
- Robust Routing
- Rich Client-Side Interactivity

## When might I not want to use it?

TanStack Start is not for you if:

- Your site will be 100% static
- Your goal is a server-rendered site with zero JS or minimal client-side interactivity
- You're looking for a React-Server-Component-first framework. (We'll support RSCs soon in our own awesome flavor!)

## How is TanStack Start funded?

TanStack works closely with our partners to provide the best possible developer experience while also providing solutions that work anywhere and are vetted by industry experts. Each of our partners plays a unique role in the TanStack ecosystem:

- **Netlify**
  <a href="https://www.netlify.com?utm_source=tanstack" alt="Netlify Logo">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/netlify-dark.svg" style="height: 90px;">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/netlify-light.svg" style="height: 90px;">
    <img alt="Netlify logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/netlify-light.svg" style="height: 90px;">
  </picture>
  </a>
  The leading hosting platform for web applications that provides a fast, secure, and reliable environment for deploying your web applications. We work closely with Netlify to ensure that TanStack Start applications not only deploy seamlessly to their platform, but also implement best practices for performance, security, and reliability regardless of where you end up deploying.
- **Clerk**
  <a href="https://go.clerk.com/wOwHtuJ" alt="Clerk Logo">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/clerk-logo-dark.svg" style="height: 40px;">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/clerk-logo-light.svg" style="height: 40px;">
  <img alt="Convex logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/clerk-logo-light.svg" style="height: 40px;">
  </picture>
  </a>
  The best possible authentication experience for modern web applications, including TanStack Start applications. Clerk provides TanStack Start users with first-class integrations and solutions to auth and collaborates closely with the TanStack team to ensure that TanStack Start provides APIs that are up to date with the latest in auth best practices.
- **Convex**
  <a href="https://convex.dev?utm_source=tanstack" alt="Convex Logo">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/convex-white.svg" style="height: 40px;">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/convex-color.svg" style="height: 40px;">
  <img alt="Convex logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/convex-color.svg" style="height: 40px;">
  </picture>
  </a>
  A serverless database platform that integrates seamlessly with TanStack Start. Convex is designed to simplify the process of managing your application's data and provides a real-time, scalable, and transactional data backend that works well with TanStack Start applications. Convex also collaborates closely with the TanStack team to ensure that TanStack Start provides APIs that are up to date with the latest in database best practices.
- **Sentry**
  <a href="https://sentry.io?utm_source=tanstack" alt='Sentry Logo'>
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/sentry-wordmark-light.svg" style="height: 60px;">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/sentry-wordmark-dark.svg" style="height: 60px;">
  <img alt="Convex logo" src="https://raw.githubusercontent.com/tanstack/tanstack.com/main/app/images/sentry-wordmark-light.svg" style="height: 60px;">
  </picture>
  </a>
  A powerful, full-featured observability platform that integrates seamlessly with TanStack Start. Sentry helps developers monitor and fix crashes in real-time and provides insights into your application's performance and error tracking. Sentry collaborates closely with the TanStack team to ensure that TanStack Start provides APIs that are up to date with the latest in observability best practices.

## Ready to get started?

Proceed to the next page to learn how to install TanStack Start and create your first app!

================
File: framework/react/path-aliases.md
================

---

id: path-aliases
title: Path Aliases

---

Path aliases are a useful feature of TypeScript that allows you to define a shortcut for a path that could be distant in your project's directory structure. This can help you avoid long relative imports in your code and make it easier to refactor your project's structure. This is especially useful for avoiding long relative imports in your code.

By default, TanStack Start does not include path aliases. However, you can easily add them to your project by updating your `tsconfig.json` file in the root of your project and adding the following configuration:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

In this example, we've defined the path alias `~/*` that maps to the `./src/*` directory. This means that you can now import files from the `src` directory using the `~` prefix.

After updating your `tsconfig.json` file, you'll need to install the `vite-tsconfig-paths` plugin to enable path aliases in your TanStack Start project. You can do this by running the following command:

```sh
npm install -D vite-tsconfig-paths
```

Now, you'll need to update your `app.config.ts` file to include the following:

```ts
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  vite: {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
```

Once this configuration has completed, you'll now be able to import files using the path alias like so:

```ts
// app/routes/posts/$postId/edit.tsx
import { Input } from "~/components/ui/input";

// instead of

import { Input } from "../../../components/ui/input";
```

================
File: framework/react/quick-start.md
================

---

id: quick-start
title: Quick Start

---

## Impatient?

If you're impatient, you can clone and run the [Basic](../examples/start-basic) example right away with the following commands:

```bash
npx degit https://github.com/tanstack/router/examples/react/start-basic start-basic
cd start-basic
npm install
npm run dev
```

If you'd like to use a different example, you can replace `start-basic` above with the slug of the example you'd like to use from the list below.

Once you've cloned the example you want, head back to the [Learn the Basics](../learn-the-basics) guide to learn how to use TanStack Start!

## Examples

TanStack Start has load of examples to get you started. Pick one of the examples below to get started!

- [Basic](../examples/start-basic) (start-basic)
- [Basic + Auth](../examples/start-basic-auth) (start-basic-auth)
- [Basic + Counter](../examples/start-basic-counter) (start-basic-counter)
- [Basic + React Query](../examples/start-basic-react-query) (start-basic-react-query)
- [Clerk Auth](../examples/start-clerk-basic) (start-clerk-basic)
- [Convex + Trellaux](../examples/start-convex-trellaux) (start-convex-trellaux)
- [Supabase](../examples/start-supabase-basic) (start-supabase-basic)
- [Trellaux](../examples/start-trellaux) (start-trellaux)
- [Material UI](../examples/start-material-ui) (start-material-ui)

### Stackblitz

Each example above has an embedded stackblitz preview to find the one that feels like a good starting point

### Quick Deploy

To quickly deploy an example, click the **Deploy to Netlify** button on an example's page to both clone and deploy the example to Netlify.

### Manual Deploy

To manually clone and deploy the example to anywhere else you'd like, use the following commands replacing `EXAMPLE_SLUG` with the slug of the example you'd like to use from above:

```bash
npx degit https://github.com/tanstack/router/examples/react/EXAMPLE_SLUG my-new-project
cd my-new-project
npm install
npm run dev
```

Once you've clone or deployed an example, head back to the [Learn the Basics](../learn-the-basics) guide to learn how to use TanStack Start!

## Other Router Examples

While not Start-specific examples, these may help you understand more about how TanStack Router works:

- [Quickstart (file-based)](../examples/quickstart-file-based)
- [Quickstart (code-based)](../examples/quickstart)
- [Basic (file-based)](../examples/basic-file-based)
- [Basic (code-based)](../examples/basic)
- [Kitchen Sink (file-based)](../examples/kitchen-sink-file-based)
- [Kitchen Sink (code-based)](../examples/kitchen-sink)
- [Kitchen Sink + React Query (file-based)](../examples/kitchen-sink-react-query-file-based)
- [Kitchen Sink + React Query (code-based)](../examples/kitchen-sink-react-query)
- [Location Masking](../examples/location-masking)
- [Authenticated Routes](../examples/authenticated-routes)
- [Scroll Restoration](../examples/scroll-restoration)
- [Deferred Data](../examples/deferred-data)
- [Navigation Blocking](../examples/navigation-blocking)
- [With tRPC](../examples/with-trpc)
- [With tRPC + React Query](../examples/with-trpc-react-query)
- [Monorepo basic](../examples/router-monorepo-simple)
- [Monorepo with React Query](../examples/router-monorepo-react-query)

================
File: framework/react/server-functions.md
================

---

id: server-functions
title: Server Functions

---

## What are Server Functions?

Server functions allow you to specify logic that can be invoked almost anywhere (even the client), but run **only** on the server. In fact, they are not so different from an API Route, but with a few key differences:

- They do not have stable public URL (but you'll be able to do this very soon!)
- They can be called from anywhere in your application, including loaders, hooks, components, etc., but cannot be called from API Routes.

However, they are similar to regular API Routes in that:

- They have access to the request context, allowing you to read headers, set cookies, and more
- They can access sensitive information, such as environment variables, without exposing them to the client
- They can be used to perform any kind of server-side logic, such as fetching data from a database, sending emails, or interacting with other services
- They can return any value, including primitives, JSON-serializable objects, and even raw Response objects
- They can throw errors, including redirects and notFounds, which can be handled automatically by the router

> How are server functions different from "React Server Functions"?
>
> - TanStack Server Functions are not tied to a specific front-end framework, and can be used with any front-end framework or none at all.
> - TanStack Server Functions are backed by standard HTTP requests and can be called as often as you like without suffering from serial-execution bottlenecks.

## How do they work?

Server functions can be defined anywhere in your application, but must be defined at the top level of a file. They can be called throughout your application, including loaders, hooks, etc. Traditionally, this pattern is known as a Remote Procedure Call (RPC), but due to the isomorphic nature of these functions, we refer to them as server functions.

- On the server bundle, server functions logic is left alone. Nothing needs to be done since they are already in the correct place.
- On the client, server functions will be removed; they exist only on the server. Any calls to the server function on the client will be replaced with a `fetch` request to the server to execute the server function, and send the response back to the client.

## Server Function Middleware

Server functions can use middleware to share logic, context, common operations, prerequisites, and much more. To learn more about server function middleware, be sure to read about them in the [Middleware guide](./middleware.md).

## Defining Server Functions

> We'd like to thank the [tRPC](https://trpc.io/) team for both the inspiration of TanStack Start's server function design and guidance while implementing it. We love (and recommend) using tRPC for API Routes so much that we insisted on server functions getting the same 1st class treatment and developer experience. Thank you!

Server functions are defined with the `createServerFn` function, from the `@tanstack/react-start` package. This function takes an optional `options` argument for specifying configuration like the HTTP method and response type, and allows you to chain off the result to define things like the body of the server function, input validation, middleware, etc. Here's a simple example:

```tsx
// getServerTime.ts
import { createServerFn } from "@tanstack/react-start";

export const getServerTime = createServerFn().handler(async () => {
  // Wait for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return the current time
  return new Date().toISOString();
});
```

### Configuration Options

When creating a server function, you can provide configuration options to customize its behavior:

```tsx
import { createServerFn } from "@tanstack/react-start";

export const getData = createServerFn({
  method: "GET", // HTTP method to use
  response: "data", // Response handling mode
}).handler(async () => {
  // Function implementation
});
```

#### Available Options

**`method`**

Specifies the HTTP method for the server function request:

```tsx
method?: 'GET' | 'POST'
```

By default, server functions use `GET` if not specified.

**`response`**

Controls how responses are processed and returned:

```tsx
response?: 'data' | 'full' | 'raw'
```

- `'data'` (default): Automatically parses JSON responses and returns just the data
- `'full'`: Returns a response object with result data, error information, and context
- `'raw'`: Returns the raw Response object directly, enabling streaming responses and custom headers

## Where can I call server functions?

- From server-side code
- From client-side code
- From other server functions

> [!WARNING]
> Server functions cannot be called from API Routes. If you need to share business logic between server functions and API Routes, extract the shared logic into utility functions that can be imported by both.

## Accepting Parameters

Server functions accept a single parameter, which can be a variety of types:

- Standard JavaScript types
  - `string`
  - `number`
  - `boolean`
  - `null`
  - `Array`
  - `Object`
- FormData
- ReadableStream (of any of the above)
- Promise (of any of the above)

Here's an example of a server function that accepts a simple string parameter:

```tsx
import { createServerFn } from "@tanstack/react-start";

export const greet = createServerFn({
  method: "GET",
})
  .validator((data: string) => data)
  .handler(async (ctx) => {
    return `Hello, ${ctx.data}!`;
  });

greet({
  data: "John",
});
```

## Runtime Input Validation / Type Safety

Server functions can be configured to validate their input data at runtime, while adding type safety. This is useful for ensuring the input is of the correct type before executing the server function, and providing more friendly error messages.

This is done with the `validator` method. It will accept whatever input is passed to the server function. The value (and type) you return from this function will become the input passed to the actual server function handler.

Validators also integrate seamlessly with external validators, if you want to use something like Zod.

### Basic Validation

Here's a simple example of a server function that validates the input parameter:

```tsx
import { createServerFn } from "@tanstack/react-start";

type Person = {
  name: string;
};

export const greet = createServerFn({ method: "GET" })
  .validator((person: unknown): Person => {
    if (typeof person !== "object" || person === null) {
      throw new Error("Person must be an object");
    }

    if ("name" in person && typeof person.name !== "string") {
      throw new Error("Person.name must be a string");
    }

    return person as Person;
  })
  .handler(async ({ data }) => {
    return `Hello, ${data.name}!`;
  });
```

### Using a Validation Library

Validation libraries like Zod can be used like so:

```tsx
import { createServerFn } from "@tanstack/react-start";

import { z } from "zod";

const Person = z.object({
  name: z.string(),
});

export const greet = createServerFn({ method: "GET" })
  .validator((person: unknown) => {
    return Person.parse(person);
  })
  .handler(async (ctx) => {
    return `Hello, ${ctx.data.name}!`;
  });

greet({
  data: {
    name: "John",
  },
});
```

## Type Safety

Since server-functions cross the network boundary, it's important to ensure the data being passed to them is not only the right type, but also validated at runtime. This is especially important when dealing with user input, as it can be unpredictable. To ensure developers validate their I/O data, types are reliant on validation. The return type of the `validator` function will be the input to the server function's handler.

```tsx
import { createServerFn } from "@tanstack/react-start";

type Person = {
  name: string;
};

export const greet = createServerFn({ method: "GET" })
  .validator((person: unknown): Person => {
    if (typeof person !== "object" || person === null) {
      throw new Error("Person must be an object");
    }

    if ("name" in person && typeof person.name !== "string") {
      throw new Error("Person.name must be a string");
    }

    return person as Person;
  })
  .handler(
    async ({
      data, // Person
    }) => {
      return `Hello, ${data.name}!`;
    }
  );

function test() {
  greet({ data: { name: "John" } }); // OK
  greet({ data: { name: 123 } }); // Error: Argument of type '{ name: number; }' is not assignable to parameter of type 'Person'.
}
```

## Inference

Server functions infer their input, and output types based on the input to the `validator`, and return value of `handler` functions, respectively. In fact, the `validator` you define can even have its own separate input/output types, which can be useful if your validator performs transformations on the input data.

To illustrate this, let's take a look at an example using the `zod` validation library:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const transactionSchema = z.object({
  amount: z.string().transform((val) => parseInt(val, 10)),
});

const createTransaction = createServerFn()
  .validator(transactionSchema)
  .handler(({ data }) => {
    return data.amount; // Returns a number
  });

createTransaction({
  data: {
    amount: "123", // Accepts a string
  },
});
```

## Non-Validated Inference

While we highly recommend using a validation library to validate your network I/O data, you may, for whatever reason _not_ want to validate your data, but still have type safety. To do this, provide type information to the server function using an identity function as the `validator`, that types the input, and or output to the correct types:

```tsx
import { createServerFn } from "@tanstack/react-start";

type Person = {
  name: string;
};

export const greet = createServerFn({ method: "GET" })
  .validator((d: Person) => d)
  .handler(async (ctx) => {
    return `Hello, ${ctx.data.name}!`;
  });

greet({
  data: {
    name: "John",
  },
});
```

## JSON Parameters

Server functions can accept JSON-serializable objects as parameters. This is useful for passing complex data structures to the server:

```tsx
import { createServerFn } from "@tanstack/react-start";

type Person = {
  name: string;
  age: number;
};

export const greet = createServerFn({ method: "GET" })
  .validator((data: Person) => data)
  .handler(async ({ data }) => {
    return `Hello, ${data.name}! You are ${data.age} years old.`;
  });

greet({
  data: {
    name: "John",
    age: 34,
  },
});
```

## FormData Parameters

Server functions can accept `FormData` objects as parameters

```tsx
import { createServerFn } from "@tanstack/react-start";

export const greetUser = createServerFn({ method: "POST" })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }
    const name = data.get("name");
    const age = data.get("age");

    if (!name || !age) {
      throw new Error("Name and age are required");
    }

    return {
      name: name.toString(),
      age: parseInt(age.toString(), 10),
    };
  })
  .handler(async ({ data: { name, age } }) => {
    return `Hello, ${name}! You are ${age} years old.`;
  });

// Usage
function Test() {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await greetUser({ data: formData });
        console.log(response);
      }}
    >
      <input name="name" />
      <input name="age" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Server Function Context

In addition to the single parameter that server functions accept, you can also access server request context from within any server function using utilities from `@tanstack/react-start/server`. Under the hood, we use [Unjs](https://unjs.io/)'s `h3` package to perform cross-platform HTTP requests.

There are many context functions available to you for things like:

- Accessing the request context
- Accessing/setting headers
- Accessing/setting sessions/cookies
- Setting response status codes and status messages
- Dealing with multi-part form data
- Reading/Setting custom server context properties

For a full list of available context functions, see all of the available [h3 Methods](https://h3.unjs.io/utils/request) or inspect the [@tanstack/react-start/server Source Code](https://github.com/tanstack/router/tree/main/packages/start/src/server/index.tsx).

For starters, here are a few examples:

## Accessing the Request Context

Let's use the `getWebRequest` function to access the request itself from within a server function:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

export const getServerTime = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();

    console.log(request.method); // GET

    console.log(request.headers.get("User-Agent")); // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
  }
);
```

## Accessing Headers

Use the `getHeaders` function to access all headers from within a server function:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "@tanstack/react-start/server";

export const getServerTime = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log(getHeaders());
    // {
    //   "accept": "*/*",
    //   "accept-encoding": "gzip, deflate, br",
    //   "accept-language": "en-US,en;q=0.9",
    //   "connection": "keep-alive",
    //   "host": "localhost:3000",
    //   ...
    // }
  }
);
```

You can also access individual headers using the `getHeader` function:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { getHeader } from "@tanstack/react-start/server";

export const getServerTime = createServerFn({ method: "GET" }).handler(
  async () => {
    console.log(getHeader("User-Agent")); // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3
  }
);
```

## Returning Values

Server functions can return a few different types of values:

- Primitives
- JSON-serializable objects
- `redirect` errors (can also be thrown)
- `notFound` errors (can also be thrown)
- Raw Response objects

## Returning Primitives and JSON

To return any primitive or JSON-serializable object, simply return the value from the server function:

```tsx
import { createServerFn } from "@tanstack/react-start";

export const getServerTime = createServerFn({ method: "GET" }).handler(
  async () => {
    return new Date().toISOString();
  }
);

export const getServerData = createServerFn({ method: "GET" }).handler(
  async () => {
    return {
      message: "Hello, World!",
    };
  }
);
```

By default, server functions assume that any non-Response object returned is either a primitive or JSON-serializable object.

## Responding with Custom Headers

To respond with custom headers, you can use the `setHeader` function:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { setHeader } from "@tanstack/react-start/server";

export const getServerTime = createServerFn({ method: "GET" }).handler(
  async () => {
    setHeader("X-Custom-Header", "value");
    return new Date().toISOString();
  }
);
```

## Responding with Custom Status Codes

To respond with a custom status code, you can use the `setResponseStatus` function:

```tsx
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";

export const getServerTime = createServerFn({ method: "GET" }).handler(
  async () => {
    setResponseStatus(201);
    return new Date().toISOString();
  }
);
```

## Returning Raw Response objects

To return a raw Response object, return a Response object from the server function and set `response: 'raw'`:

```tsx
import { createServerFn } from "@tanstack/react-start";

export const getServerTime = createServerFn({
  method: "GET",
  response: "raw",
}).handler(async () => {
  // Read a file from s3
  return fetch("https://example.com/time.txt");
});
```

The response: 'raw' option also allows for streaming responses among other things:

```tsx
import { createServerFn } from "@tanstack/react-start";

export const streamEvents = createServerFn({
  method: "GET",
  response: "raw",
}).handler(async ({ signal }) => {
  // Create a ReadableStream to send chunks of data
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial response immediately
      controller.enqueue(new TextEncoder().encode("Connection established\n"));

      let count = 0;
      const interval = setInterval(() => {
        // Check if the client disconnected
        if (signal.aborted) {
          clearInterval(interval);
          controller.close();
          return;
        }

        // Send a data chunk
        controller.enqueue(
          new TextEncoder().encode(
            `Event ${++count}: ${new Date().toISOString()}\n`
          )
        );

        // End after 10 events
        if (count >= 10) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);

      // Ensure we clean up if the request is aborted
      signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  // Return a streaming response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});
```

The `response: 'raw'` option is particularly useful for:

- Streaming APIs where data is sent incrementally
- Server-sent events
- Long-polling responses
- Custom content types and binary data

## Throwing Errors

Aside from special `redirect` and `notFound` errors, server functions can throw any custom error. These errors will be serialized and sent to the client as a JSON response along with a 500 status code.

```tsx
import { createServerFn } from "@tanstack/react-start";

export const doStuff = createServerFn({ method: "GET" }).handler(async () => {
  throw new Error("Something went wrong!");
});

// Usage
function Test() {
  try {
    await doStuff();
  } catch (error) {
    console.error(error);
    // {
    //   message: "Something went wrong!",
    //   stack: "Error: Something went wrong!\n    at doStuff (file:///path/to/file.ts:3:3)"
    // }
  }
}
```

## Cancellation

On the client, server function calls can be cancelled via an `AbortSignal`.
On the server, an `AbortSignal` will notify if the request closed before execution finished.

```tsx
import { createServerFn } from "@tanstack/react-start";

export const abortableServerFn = createServerFn().handler(
  async ({ signal }) => {
    return new Promise<string>((resolve, reject) => {
      if (signal.aborted) {
        return reject(new Error("Aborted before start"));
      }
      const timerId = setTimeout(() => {
        console.log("server function finished");
        resolve("server function result");
      }, 1000);
      const onAbort = () => {
        clearTimeout(timerId);
        console.log("server function aborted");
        reject(new Error("Aborted"));
      };
      signal.addEventListener("abort", onAbort, { once: true });
    });
  }
);

// Usage
function Test() {
  const controller = new AbortController();
  const serverFnPromise = abortableServerFn({
    signal: controller.signal,
  });
  await new Promise((resolve) => setTimeout(resolve, 500));
  controller.abort();
  try {
    const serverFnResult = await serverFnPromise;
    console.log(serverFnResult); // should never get here
  } catch (error) {
    console.error(error); // "signal is aborted without reason"
  }
}
```

## Calling server functions from within route lifecycles

Server functions can be called normally from route `loader`s, `beforeLoad`s, or any other router-controlled APIs. These APIs are equipped to handle errors, redirects, and notFounds thrown by server functions automatically.

```tsx
import { getServerTime } from "./getServerTime";

export const Route = createFileRoute("/time")({
  loader: async () => {
    const time = await getServerTime();

    return {
      time,
    };
  },
});
```

## Calling server functions from hooks and components

Server functions can throw `redirect`s or `notFound`s and while not required, it is recommended to catch these errors and handle them appropriately. To make this easier, the `@tanstack/react-start` package exports a `useServerFn` hook that can be used to bind server functions to components and hooks:

```tsx
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getServerTime } from "./getServerTime";

export function Time() {
  const getTime = useServerFn(getServerTime);

  const timeQuery = useQuery({
    queryKey: "time",
    queryFn: () => getTime(),
  });
}
```

## Calling server functions anywhere else

When using server functions, be aware that redirects and notFounds they throw will only be handled automatically when called from:

- Route lifecycles
- Components using the useServerFn hook

For other usage locations, you'll need to handle these cases manually.

## Redirects

Server functions can throw a `redirect` error to redirect the user to a different URL. This is useful for handling authentication, authorization, or other scenarios where you need to redirect the user to a different page.

- During SSR, redirects are handled by sending a 302 response to the client with the new location
- On the client, redirects are handled by the router automatically from within a route lifecycle or a component that uses the `useServerFn` hook. If you call a server function from anywhere else, redirects will not be handled automatically.

To throw a redirect, you can use the `redirect` function exported from the `@tanstack/react-router` package:

```tsx
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const doStuff = createServerFn({ method: "GET" }).handler(async () => {
  // Redirect the user to the home page
  throw redirect({
    to: "/",
  });
});
```

Redirects can utilize all of the same options as `router.navigate`, `useNavigate()` and `<Link>` components. So feel free to also pass:

- Path Params
- Search Params
- Hash

Redirects can also set the status code of the response by passing a `status` option:

```tsx
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const doStuff = createServerFn({ method: "GET" }).handler(async () => {
  // Redirect the user to the home page with a 301 status code
  throw redirect({
    to: "/",
    status: 301,
  });
});
```

You can also redirect to an external target using `href`:

```tsx
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const auth = createServerFn({ method: "GET" }).handler(async () => {
  // Redirect the user to the auth provider
  throw redirect({
    href: "https://authprovider.com/login",
  });
});
```

> ⚠️ Do not use `@tanstack/react-start/server`'s `sendRedirect` function to send soft redirects from within server functions. This will send the redirect using the `Location` header and will force a full page hard navigation on the client.

## Redirect Headers

You can also set custom headers on a redirect by passing a `headers` option:

```tsx
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const doStuff = createServerFn({ method: "GET" }).handler(async () => {
  // Redirect the user to the home page with a custom header
  throw redirect({
    to: "/",
    headers: {
      "X-Custom-Header": "value",
    },
  });
});
```

## Not Found

While calling a server function from a `loader` or `beforeLoad` route lifecycle, a special `notFound` error can be thrown to indicate to the router that the requested resource was not found. This is more useful than a simple 404 status code, as it allows you to render a custom 404 page, or handle the error in a custom way. If notFound is thrown from a server function used outside of a route lifecycle, it will not be handled automatically.

To throw a notFound, you can use the `notFound` function exported from the `@tanstack/react-router` package:

```tsx
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getStuff = createServerFn({ method: "GET" }).handler(async () => {
  // Randomly return a not found error
  if (Math.random() < 0.5) {
    throw notFound();
  }

  // Or return some stuff
  return {
    stuff: "stuff",
  };
});

export const Route = createFileRoute("/stuff")({
  loader: async () => {
    const stuff = await getStuff();

    return {
      stuff,
    };
  },
});
```

Not found errors are a core feature of TanStack Router,

## Handling Errors

If a server function throws a (non-redirect/non-notFound) error, it will be serialized and sent to the client as a JSON response along with a 500 status code. This is useful for debugging, but you may want to handle these errors in a more user-friendly way. You can do this by catching the error and handling it in your route lifecycle, component, or hook as you normally would.

```tsx
import { createServerFn } from "@tanstack/react-start";

export const doStuff = createServerFn({ method: "GET" }).handler(async () => {
  undefined.foo();
});

export const Route = createFileRoute("/stuff")({
  loader: async () => {
    try {
      await doStuff();
    } catch (error) {
      // Handle the error:
      // error === {
      //   message: "Cannot read property 'foo' of undefined",
      //   stack: "TypeError: Cannot read property 'foo' of undefined\n    at doStuff (file:///path/to/file.ts:3:3)"
    }
  },
});
```

## No-JS Server Functions

Without JavaScript enabled, there's only one way to execute server functions: by submitting a form.

This is done by adding a `form` element to the page
with [the HTML attribute `action`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/action).

> Notice that we mentioned the **HTML** attribute `action`. This attribute only accepts a string in HTML, just like all
> other attributes.
>
> While React
> 19 [added support for passing a function to `action`](https://react.dev/reference/react-dom/components/form#form),
> it's
> a React-specific feature and not part of the HTML standard.

The `action` attribute tells the browser where to send the form data when the form is submitted. In this case, we want
to send the form data to the server function.

To do this, we can utilize the `url` property of the server function:

```ts
const yourFn = createServerFn({ method: "POST" })
  .validator((formData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const name = formData.get("name");

    if (!name) {
      throw new Error("Name is required");
    }

    return name;
  })
  .handler(async ({ data: name }) => {
    console.log(name); // 'John'
  });

console.info(yourFn.url);
```

And pass this to the `action` attribute of the form:

```tsx
function Component() {
  return (
    <form action={yourFn.url} method="POST">
      <input name="name" defaultValue="John" />
      <button type="submit">Click me!</button>
    </form>
  );
}
```

When the form is submitted, the server function will be executed.

### No-JS Server Function Arguments

To pass arguments to a server function when submitting a form, you can use the `input` element with the `name` attribute
to attach the argument to the [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) passed to your
server function:

```tsx
const yourFn = createServerFn({ method: "POST" })
  .validator((formData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const age = formData.get("age");

    if (!age) {
      throw new Error("age is required");
    }

    return age.toString();
  })
  .handler(async ({ data: formData }) => {
    // `age` will be '123'
    const age = formData.get("age");
    // ...
  });

function Component() {
  return (
    //  We need to tell the server that our data type is `multipart/form-data` by setting the `encType` attribute on the form.
    <form action={yourFn.url} method="POST" encType="multipart/form-data">
      <input name="age" defaultValue="34" />
      <button type="submit">Click me!</button>
    </form>
  );
}
```

When the form is submitted, the server function will be executed with the form's data as an argument.

### No-JS Server Function Return Value

Regardless of whether JavaScript is enabled, the server function will return a response to the HTTP request made from
the client.

When JavaScript is enabled, this response can be accessed as the return value of the server function in the client's
JavaScript code.

```ts
const yourFn = createServerFn().handler(async () => {
  return "Hello, world!";
});

// `.then` is not available when JavaScript is disabled
yourFn().then(console.log);
```

However, when JavaScript is disabled, there is no way to access the return value of the server function in the client's
JavaScript code.

Instead, the server function can provide a response to the client, telling the browser to navigate in a certain way.

When combined with a `loader` from TanStack Router, we're able to provide an experience similar to a single-page application, even when
JavaScript is disabled;
all by telling the browser to reload the current page with new data piped through the `loader`:

```tsx
import * as fs from "fs";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const filePath = "count.txt";

async function readCount() {
  return parseInt(
    await fs.promises.readFile(filePath, "utf-8").catch(() => "0")
  );
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((formData) => {
    if (!(formData instanceof FormData)) {
      throw new Error("Invalid form data");
    }

    const addBy = formData.get("addBy");

    if (!addBy) {
      throw new Error("addBy is required");
    }

    return parseInt(addBy.toString());
  })
  .handler(async ({ data: addByAmount }) => {
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + addByAmount}`);
    // Reload the page to trigger the loader again
    return new Response("ok", { status: 301, headers: { Location: "/" } });
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const state = Route.useLoaderData();

  return (
    <div>
      <form
        action={updateCount.url}
        method="POST"
        encType="multipart/form-data"
      >
        <input type="number" name="addBy" defaultValue="1" />
        <button type="submit">Add</button>
      </form>
      <pre>{state}</pre>
    </div>
  );
}
```

## Static Server Functions

When using prerendering/static-generation, server functions can also be "static", which enables their results to be cached at build time and served as static assets.

Learn all about this pattern on the [Static Server Functions](../static-server-functions) page.

## How are server functions compiled?

Under the hood, server functions are extracted out of the client bundle and into a separate server bundle. On the server, they are executed as-is, and the result is sent back to the client. On the client, server functions proxy the request to the server, which executes the function and sends the result back to the client, all via `fetch`.

The process looks like this:

- When `createServerFn` is found in a file, the inner function is checked for a `use server` directive
- If the `use server` directive is missing, it is added to the top of the function
- On the client, the inner function is extracted out of the client bundle and into a separate server bundle
- The client-side server function is replaced with a proxy function that sends a request to the server to execute the function that was extracted
- On the server, the server function is not extracted, and is executed as-is
- After extraction occurs, each bundle applies a dead-code elimination process to remove any unused code from each bundle.

================
File: framework/react/ssr.md
================

---

id: ssr
title: SSR

---

Server-side rendering (SSR) is the process of rendering your application on the server and sending or streaming the rendered HTML to the client. This can be useful for both improving the performance of your application and improving SEO, as it allows users to see the content of your application faster and allows search engines to crawl your application more easily.

## SSR Basics

TanStack Start supports server-side rendering out of the box. To enable server-side rendering, create an `app/ssr.tsx` file in your project:

```tsx
// app/ssr.tsx

import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { getRouterManifest } from "@tanstack/react-start/router-manifest";

import { createRouter } from "./router";

export default createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);
```

This file exports a function that creates a server-side rendering handler. The handler is created using the `createStartHandler` function from `@tanstack/react-start/server`, which takes an object with the following properties:

- `createRouter`: A function that creates a router for your application. This function should return a new router instance each time it is called.
- `getRouterManifest`: A function that returns a manifest of all the routes in your application.

The handler is then called with the `defaultStreamHandler` function from `@tanstack/react-start/server`, which is a function that streams the response to the client.

================
File: framework/react/static-prerendering.md
================

---

id: static-prerendering
title: Static Prerendering

---

> Static Prerendering is a feature of Nitro, and while it is available in TanStack Start, we are still exploring the best practices for using it. Tread lightly!

Static prerendering is the process of generating static HTML files for your application. This can be useful for either improving the performance of your application, as it allows you to serve pre-rendered HTML files to users without having to generate them on the fly or for deploying static sites to platforms that do not support server-side rendering.

## Prerendering, powered by Nitro

TanStack Start is built on Nitro, which means we can take advantage of Nitro's prerendering capabilities. Nitro can prerender your application to static HTML files, which can then be served to users without having to generate them on the fly. To prerender your application, you can add the `server.prerender` option to your `app.config.js` file:

```js
// app.config.js

import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },
});
```

Many of the options available for prerendering are documented in the [Nitro config prerender documentation](https://nitro.unjs.io/config#prerender).

## Prerendering dynamic routes with Nitro

Nitro ships with some prebuilt hooks that let you customize the prerendering process among other things. One of these hooks is the `prerender:routes` hook. This hook allows you to fetch async data and add routes to a `Set` of routes to be prerendered.

For this example, let's pretend we have a blog with a list of posts. We want to prerender each post page. Our post route looks like `/posts/$postId`. We can use the `prerender:routes` hook to fetch the all of our posts and add each post path to the routes set.

```ts
// app.config.ts
import { defineConfig } from "@tanstack/react-start/config";

export default defineConfig({
  server: {
    hooks: {
      "prerender:routes": async (routes) => {
        // fetch the pages you want to render
        const posts = await fetch("https://api.example.com/posts");
        const postsData = await posts.json();

        // add each post path to the routes set
        postsData.forEach((post) => {
          routes.add(`/posts/${post.id}`);
        });
      },
    },
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },
});
```

As of writing, the [Nitro hooks documentation](https://nitro.build/config#hooks) does not include any information on the provided hooks.

================
File: framework/react/static-server-functions.md
================

---

id: static-server-functions
title: Static Server Functions

---

## What are Static Server Functions?

Static server functions are server functions that are executed at build time and cached as static assets when using prerendering/static-generation. They can be set to "static" mode by passing the `type: 'static'` option to `createServerFn`:

```tsx
const myServerFn = createServerFn({ type: "static" }).handler(async () => {
  return "Hello, world!";
});
```

This pattern goes as follows:

- Build-time
  - During build-time prerendering, a server function with `type: 'static'` is executed
  - The result is cached with your build output as a static JSON file under a derived key (function ID + params/payload hash)
  - The result is returned as normal during prerendering/static-generation and used to prerender the page
- Runtime
  - Initially, the prerendered page's html is served and the server function data is embedded in the html
  - When the client mounts, the embedded server function data is hydrated
  - For future client-side invocations, the server function is replaced with a fetch call to the static JSON file

## Customizing the Server Functions Static Cache

By default, the static server function cache implementation stores and retrieves static data in the build output directory via node's `fs` module and likewise fetches the data at runtime using a `fetch` call to the same static file.

This interface can be customized by importing and calling the `createServerFnStaticCache` function to create a custom cache implementation and then calling `setServerFnStaticCache` to set it:

```tsx
import {
  createServerFnStaticCache,
  setServerFnStaticCache,
} from "@tanstack/react-start/client";

const myCustomStaticCache = createServerFnStaticCache({
  setItem: async (ctx, data) => {
    // Store the static data in your custom cache
  },
  getItem: async (ctx) => {
    // Retrieve the static data from your custom cache
  },
  fetchItem: async (ctx) => {
    // During runtime, fetch the static data from your custom cache
  },
});

setServerFnStaticCache(myCustomStaticCache);
```

================================================================
End of Codebase
================================================================
