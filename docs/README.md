## Google Clone with Next.js 13

This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

To automatically create a new Next.js project using the app directory:

```bash
npx create-next-app@latest --experimental-app
```

Next, opt into the beta `app` directory. A `next.config.js` file in the project
root directory of your project and add the following code:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // 👈
  },
};
module.exports = nextConfig;
```

Create an `app` folder and add a `layout.js` and `page.js` file. Create a root
layout inside `app/layout.js` with the required `<html>` and `<body>` tags:

```jsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

> Good to know: If you forget to create `layout.js`, Next will auto create the
> file for you when running the development server in `next dev`.

In Next.js 13 the `_app.js` file is no longer required and you can instead use a
new `app` directory to configure your application's behavior. A new `app` folder
can contain a `layout.js` file, which is used to define a persistent layout for
your application. Ensures a `layout` is applied consistently to every page from
the `app` folder down, without having to manually wrap each page component.

Before we defined a `_app.js` file but the folder approach does the same thing.
This special file is used to customize app-wide rendering behavior. An (HOF/HOC)
higher-order function/component that "wraps/encloses" as a outer parent closure,
around all other inner child function/component in your application. You can add
global styles, state, providers etc... That flow down the component tree.

Before we too had a `_layout.js` file used to define that persistent layout. The
layout is used to "wrap/enclose" around all individual pages in your application
providing a consistent look and feel across all of them. In this example, we're
defining the layout itself. It wraps by `{children}` props passed by `_app.js`.

```jsx
// _layout.js
function Layout({ children }) {
  return (
    <div>
      <header>My App Header</header>
      {children}
      <footer>My App Footer</footer>
    </div>
  );
}

// _app.js
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
```

Using the `_layout.js` file allows you to define a consistent layout for your
entire application in a single place.

# Routing

## Fundamentals

> https://beta.nextjs.org/docs/routing/fundamentals

Next introduced the new **App Router** built on top of React Server Components
(RSC) support for layouts, nested routing, loading states, error handling, etc.
Here is a convention for visualizing a hierarchical structure:

![alt text](./capture-terminology-component-tree.webp 'Component Tree')

- Tree: Whole component tree parent/children components, `app` folder structure.
- Subtree: Part of a tree, starting at a root (first), ending at leaves (last).
- Root: The first (node) in the whole tree or subtree, such as `RootLayout`.
- Leaf: A subtree node with no `children` as its the last segment in a URL path.

> Good to know: Routes in the older `pages` configuration across the directories
> must not resolve to a same URL path "route segment", otherwise they will cause
> a build-time error to prevent a conflict.

The new **App Router** works in a new directory named `app`. The directory works
alongside `pages` directory to allow for a incremental adoption. This allows you
to opt some routes "pages" of your application into the new behavior while still
keeping other routes in the `pages` directory for previous behavior.

> By default components inside `app` are React Server Components (RSC). This is
> a performance optimization and allow you to easily adopt them. However you can
> also use Client Components.

### Nested Routes & Route Segments

In the `app` directory:

- **Folders** are used to define routes.

Each folder in a route represent a "route segment". Each route segment is mapped
to a corresponding segment in a URL path.

- **Files** are used to create UI that is shown for that route segment.

![alt text](./capture-route-segments-to-path-segments.webp '/dashboard/settings Route')

To create a nested route, you can nest folders inside each other.

- `/` (Root segment)
- `dashboard` (Nested segment)
- `settings` (Leaf segment)

### File Conventions

Next supports special files to create UI with specific behavior:

`page.js`: Creates unique UI of a route and makes that path publicly accessible

`layout.js`: Create shared UI for a segment and its `children` props

`template.js`: Like layout but it keeps mounting a new instance (non-persistent)

`loading.js`: Creates loading UI for a segment and its `children`. Wraps a page
or child segment in (_React Suspense Boundary_)

`error.js`: Creates error UI for segment and its `children`. Wraps page or child
segment in (_React Error Boundary_)

`global-error.js`: Similar to error.js, but specifically for catching errors in
the root `layout.js`. Useful for catching errors globally in your app

`not-found.js`: Create UI to show when a `notFound` function is thrown within a
route segment. Useful for creating a custom 404 page

`route.js`: Create server-side API endpoints for a route. This is useful for API
routes that are not publicly accessible. Similar to `pages/api` directory.

> Good to know: .js, .jsx, .tsx file extensions can be used for special files.

### Component Hierarchy (Rendering Order)

The React components defined in special files of a route segment are rendered in
a specific hierarchy and order.

This is the order/flow of components being rendered:

1. `layout.js` (React Sever Component)
2. `template.js` (React Sever Component)
3. `error.js` (React Sever Component & `<ErrorBoundary>`)
4. `loading.js` (React Sever Component & `<Suspense>`)
5. `not-found.js` (React Sever Component & `<ErrorBoundary>`)
6. `page.js` (React Sever Component)

![alt text](./capture-file-conventions-component-hierarchy.webp 'Component Hierarchy')

In a nested routes, the components of a route segments will be nested inside the
components of its parent segment.

![alt text](./capture-nested-file-conventions-component-hierarchy.webp 'Nested Component Hierarchy')

**App Router:** (controls routing behavior for each route segment)

Notice that React services are used by Next's (**App Router**) to create the UI
and behavior for each route segment in your application. This allows you to use
the same React services in your application as you would in Next.

Unlike older `pages` directory which uses client-side routing first, our now new
router in the `app` uses server-centric routing first. Aligns with everything as
React Server Components (RSC), and also data fetching handled on the server.

Although the router routing is server-centric, it uses "client-side navigation"
with the `Link` Component. Resembling the behavior of a (SPA) application. This
means when a user navigates to a new route "path", the browser will not reload a
full page. Instead that URL will be updated, Next will only render the "segment"
that change. Additionally as users navigate around the app **App Router** stores
React Server Component (RSC) payload results **in-memory client-side cache**.

When you create a `page.js` file with Next 13, it does not mean that you need to
switch to `"use client"` when using `Link` Components. Next handles all the work
for client-side transition between "pages" using the same techniques seen before
even with the introduction of React Server Component (RSC).

Then "cache" is split by route "path/page" segments which allows invalidation at
any level and ensures consistency across concurrent renders. This means that for
certain cases, the cache of a previously fetched segment can be re-used, further
improving performance. Checkout `Link` Component for more details.

**Pages:** (UI that is unique to a route)

- `page.js` required to make a route segment publicly accessible.
- `page.js` are React Server Components by default but can be made as Client.
- `page.js` is always the leaf of the route subtree.
- `page.js` components can fetch data on the server or client.

**Layouts:** (UI that is shared between multiple pages)

- `layout.js` keeps state, remains interactive, stops unnecessary re-render.
- `layout.js` parent wraps child layouts below it by passing `children` props.
- `layout.js` are React Server Components by default but can be made as Client.
- `layout.js` components can fetch data on the server or client.

**Root Layout:** (UI required as the main layout)

- The top-most layout is called the `RootLayout`.
- A `app` directory must include only one root layout `RootLayout`.
- This required layout is shared across all `page.js` in an application.
- The root layout must define `<html>` and `<body>` tags.
- Because Next does not automatically create them.
- You can use the built-in SEO support to manage `<head>` HTML elements.
- `RootLayout` can **only** be the default React Server Component (RSC).
- It can **not** be set to a Client Component.

**Nesting Layouts:** (layout can wrap a page or child layout)

- Layouts defined in folder apply to specific route segments.
- Example `acme.com/dashboard` renders when that `dashboard` "segment" active.
- By default anything under `RootLayout` are child layouts are nested.
- Which means they wrap child layouts via passing `children` props.

```jsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Partial Rendering

Navigating between sibling routes (/dashboard/settings and /dashboard/analytics)
Next will only fetch/render the `layout.js` and `page.js` in routes that change.
Of course after the initial render, Next will fetch/render those files.

It will not "re-fetch" data anywhere above your users current "position" segment
subtree. Meaning routes that share a `layout.js` that UI is preserved for a user
that is navigating between sibling routes/pages.

Without partial rendering, each navigation causes the full page to re-render on
the server. But rendering only the segment that’s updating reduces the amount of
data transferred by the server, leading to improved performance.

## Defining Routes

Inside the `app` directory, folders are used to define routes. Each **folder**
represents a "route segment" that maps to a **URL path**.

Each **folder** represents a "route segment" that maps to URL path. To create a
nested route, you can nest _folders_ inside each other.

Are special `page.js` file make a "route segment" publicly accessible. They used
to create UI for each "route segment". The `page.js` is unique UI to that route,
and also any `layout.js` UI shared across multiple routes.

### Route Groups

> https://beta.nextjs.org/docs/routing/defining-routes#route-groups

The hierarchy of the `app` folder maps directly to **URL paths**. However, it’s
possible to break out of this pattern by creating (route groups).

- Organize routes **without** affecting the URL structure
- Opting-in specific route segments into a layout
- Create multiple root layouts by splitting your application
- Used purely to label your application routes

To organize routes without affecting URL we create a group `(name)` folder that
will be a "placeholder" to keep related "routes" together.

![alt text](./capture-route-group-organisation.webp 'Route Groups')

Even though routes inside `(marketing)` & `(shop)` share the same URL hierarchy,
you can create a different `layout` for each group by adding a `layout.js` file
inside their respective group folder.

**Creating multiple root layouts**

To create multiple root layouts, remove the top-level `layout.js` file and add a
`layout.js` file inside each route groups. Your partitioning an application into
sections that have a completely different UI or experience. A `<html>`, `<body>`
tags will be needed for each root layout.

### Dynamic Segments

> https://beta.nextjs.org/docs/routing/defining-routes#dynamic-segments

When you don't know the exact segment name ahead of time & want to create routes
from dynamic data, you can use (Dynamic Segments). We support this by "wrapping"
a folder in square brackets `[folderName]`. Dynamic segments can pass a `params`
props to `layout.js`, `page.js`, `route.js`.

Example a route/path `app/blog/[slug]/page.js` the `[slug]` ensures its dynamic
and a unique segment for each blog post. An `slug` object is passed to `page.js`
as a `params.slug` prop and can be used to fetch data for that individual post.

```jsx
// app/blog/[slug]/page.js
export default function PostPage({ params }) {
  return <div>My Post</div>;
}
```

- route `app/blog/[slug]/page.js` url `/blog/a` params `{ slug: 'a' }`
- route `app/blog/[slug]/page.js` url `/blog/b` params `{ slug: 'b' }`
- route `app/blog/[slug]/page.js` url `/blog/c` params `{ slug: 'c' }`

> Note: Dynamic Segments is equivalent to Dynamic Routes in a `pages` directory.

Catch-all Segments can be extended to catch-all subsequent segments by adding an
ellipsis inside the brackets `[...folderName]`.

- route `app/shop/[...slug]/page.js` url `/shop/a` params `{ slug: ['a'] }`
- route `app/shop/[...slug]/page.js` url `/shop/a/b` params `{ slug: ['a', 'b'] }`
- route `app/shop/[...slug]/page.js` url `/shop/a/b/c` params `{ slug: ['a', 'b', 'c'] }`

## Linking and Navigating

The Next.js `router` uses server-centric routing with client-side navigation. It
supports instant loading states, and concurrent rendering. That means navigation
maintains client-side state, avoids expensive re-renders & any interruptive race
conditions. There two ways to navigate between routes: `<Link>` & `useRouter`.

### Link Components (primary way to navigate between routes)

> https://beta.nextjs.org/docs/routing/linking-and-navigating

The `Link` component from `next/link` is used to enable client-side navigation
between routes/pages in a Next application.

> `<Link>` no longer requires manually adding child `<a>` tag. This behavior was
> added as experimental in version 12.2 and is now the default. Next 13 `<Link>`
> always renders `<a>` and allows you to forward props to the underlying tag.

The `Link` component to link between pages ensures Next automatically prefetches
the linked page in the background, making navigation faster, seamless for users.
**Prefetching** is done using the browser built-in resource loading capabilities
such as `<link rel="preload">` & `IntersectionObserver`, to determine when start
prefetching the linked page.

In addition to prefetching, `Link` component also automatically sets up correct
"client-side" routing behavior for your Next application.

When a user clicks on a link created with a `Link` component, Next navigates to
the linked page using "client-side" routing, instead of a full-page reload.

```jsx
// app/page.js
import Link from 'next/link';

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>;
}
```

Makes navigation faster and smoother for a user, as they don't have to wait for
a server render for that new page. Using the `Link` also ensures that your app's
optimized for search engines (SEO) and social media crawlers.

As when you create a link using `Link`, Next auto adds the necessary tags to the
page `<head>` section to ensure that search engines "crawlers", and social media
platforms can properly index and display your page in searches.

**Overall:** `Link` greatly improve experience of your Next app enabling faster,
smoother, and more optimized "client-side" navigation between pages.

When linking (Dynamic Segments), you can use template literals and interpolation
to generate a list of `Link`.

```jsx
// app/blog/PostList.jsx
export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}
```

> Recommendation: Use the `<Link>` component to navigate between routes unless
> you have a specific requirement for using `useRouter`.

### useRouter 🪝

The hook allows you to programmatically change routes inside Client Components.
The `useRouter` provides methods such as `push()`, `refresh()`, and more.

```jsx
'use client'; // <- required to use `useRouter` 🪝
import { useRouter } from 'next/navigation';
// `useRouter` 🪝 allows you to programmatically change routes inside (CC). To
// import it from `next/navigation`, and call it inside the component.
export default function Page() {
  // The useRouter provides methods such as push(), refresh() methods
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  );
}
```

### How Navigation Works and Caching

- A route transition is initiated using `<Link>` or calling `router.push()`
- `router` updates the URL in the client/browser’s address bar
- `router` avoids unnecessary work by re-using segments that haven't changed
- Like shared layouts from a client-side cache - known as partial rendering
- "Soft navigation" is non-server so `router` gets a segment from `cache`
- If not "Hard navigation" `router` gets segment (RSC) from a server
- Loading UI can be shown while (RSC) payload being fetched from a server
- `router` either uses cache or fresh payload to render new segments to clients

> Client-side browser cache is different from Server-side Next.js HTTP cache.

The new `router` has an (in-memory client-side cache) that stores the rendered
result of the React Server Components payload. Cache is split by route segments,
which allows invalidation at any level ensuring consistency.

As users navigate around the app, the `router` will store payload of previously
fetched route segments and pre-fetched segments in the cache. The router can so
re-use cache instead of making a new request to the Next server.

The cache can be invalidated using `router.refresh()`. In the future, mutations
will automatically invalidate the cache.

### Prefetching

Its a way to preload a route in the background before it's visited. The rendered
result of prefetched routes is added to a router's client-side cache. This makes
navigating to a prefetched route near-instant.

By default routes prefetch as soon as they become "visible" in the viewport when
using a `<Link>` component. This can happen when a page first loads "mounts" or
through scrolling. If you using a routes with `useRouter` you "programmatically"
can prefetch using a `prefetch` method on the `useRouter` hook.

> Prefetching is only enabled in **production**.
> Prefetching can be disabled by passing `prefetch={false}` to `<Link>`.

**Hard Navigation:** On navigation, cache is invalidated and a server re-fetches
data and re-renders the changed segments.

**Soft Navigation:** On navigation, the cache for changed segments is reused (if
it exists and is unchanged), no new requests are made to the server for data.

Next will use soft if the route you are navigating has been prefetched & either
doesn't include dynamic segments or has the same parameters as a current route.

The cached segments below `/dashboard/[team]/*` will only be invalidated when a
`[team]` dynamic parameter changes. Example:

Navigate from `/dashboard/team-green/*` to `/dashboard/team-green/*` is **soft**
Navigate from `/dashboard/team-green/*` to `/dashboard/team-black/*` is **hard**

### When to use `Link` vs `useRouter`?

In summary, the `useRouter` hook lets you access the router object for more
control over navigation, while the `Link` component is a (HOC) used to create
client-side navigation links. A main difference between them is their use case
as we use `useRouter` for programmatic navigation or access to route info, and
a `Link` component is used to create navigational links within our app.

## Loading UI

> https://beta.nextjs.org/docs/routing/loading-ui

Next 13 introduced a new file convention `loading.js` to help create meaningful
Loading UI with (`React Suspense`). With this convention you can show an instant
loading state from the server as the content of a route segment loads, this new
content is automatically "swapped" into place once rendering is complete.

![alt text](./capture-loading-ui.webp 'Loading UI')

Instant loading state is `fallback` UI thats shown immediately upon navigation.
You can pre-render loading indicators such as "skeletons", spinners, or a small
but meaningful part of future screens like cover photo, title, etc...

```jsx
// app/dashboard/loading.tsx
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />;
}
```

A `loading.js` can be nested inside your root `layout.js`. It'll wrap `page.js`
file, and any `children` below in a React (`<Suspense>`) boundary.

![alt text](./capture-loading-diagram.webp 'Loading with React Suspense')

**Manually Defining Suspense Boundaries**

In addition to `loading.js`, you can also manually create React (`<Suspense>`)
Boundaries for your own UI components if you wish.

> Recommendation: Use the `loading.js` convention for route segments (layouts &
> `pages`) as Next.js optimizes this functionality.

## Error Handling

> https://beta.nextjs.org/docs/routing/error-handling

Next wraps a route segment and its nested children in a React (`ErrorBoundary`).
It isolates errors to affected segments while keeping the app functional. We add
functionality to attempt to recover from an error _without_ a full page reload.

Create error UI by adding an `error.js` inside a route segment.

```jsx
'use client'; // Error components must be Client components
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error,
  reset: () => void,
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

![alt text](./capture-error-diagram.webp 'Errors with React Error Boundary')

- `error.js` auto creates an `fallback` React (`<ErrorBoundary>`)
- It also wraps nested `children` segment or `page.js` component
- This React component exported from the `error.js` file is used as `fallback`
- If `Error` thrown in boundary a errors contained and our `fallback` rendered
- If active the layouts above the boundary maintain state and are interactive

An error component can use the `reset()` via a callback function to prompt the
user to attempt to recover from a error. When executed, the function will try to
re-render the boundary's contents. If successful a `fallback` error component is
(unmounted) replaced with the result of the re-render.

Any nested route with two segments that both include `layout.js` and `error.js`
files are rendered by bubbling up. `Errors` bubble up to a nearest parent error
boundary. This means an `error.js` file will handle errors for all nested child
segments. More or less granular error UI can be achieved by placing a `error.js`
at different levels in the nested folders.

Keep in mine `error.js` boundaries do not catch errors thrown in `layout.js` or
`template.js` components of the same segment level. To handle errors in specific
layouts, place your `error.js` file in the parenting segment.

**Handling Errors in Root Layouts**

A root `app/error.js` boundary does not catch errors thrown in your root `app`,
`layout.js` component. To specifically handle errors at a root level, we need to
define an `app/global-error.js` file located in the root `app` directory.

A `global-error.js` error boundary wraps the entire application and is fallback
component replacing the root `layout` when active. Because of this its important
to setup a `global-error.js` with its own `<html>` and `<body>` tags. This file
is the least granular error UI, considered "catch-all" for the whole app-wide.

```jsx
// app/global-error.tsx
'use client'; // must be Client components
export default function GlobalError({
  error,
  reset,
}: {
  error: Error,
  reset: () => void,
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
```

**Handling Server Errors**

Errors thrown in data fetching or inside a (RSC), your Next/Node server forwards
the resulting `Error` object to the nearest `error.js` file, as a `error` prop.

## Route Handlers

> https://beta.nextjs.org/docs/routing/route-handlers

Route Handlers allow you to create custom request handlers for a given route
using the fetch API `request` and `response` objects.

```jsx
// app/api/route.ts
export async function GET(request: Request) {}
// HTTP methods supported: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
```

> Good to know: Route Handlers are only available in the `app` directory. They
> are equivalent of API Routes inside the `pages` directory meaning you do not
> need to use API Routes and Route Handlers together.

Route Handlers can be nested inside the `app` directory, similar to `page.js`.
But the `route.js` file can't be at the same route segment level as page. As the
`route.js` file is a custom request handler, and not a page. It must be placed
in a different folder, like within an `api` folder for that segment.

In addition to supporting native request and response. Next extends them with
`NextRequest`/`NextResponse` types to provide convenient helpers.

Route Handlers are statically evaluated by default when using the `GET` method
with the `response` object.

```jsx
// app/items/route.ts
import { NextResponse } from 'next/server';
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  });
  const data = await res.json();
  // You can use `NextResponse.json()` for typed responses instead.
  return NextResponse.json({ data });
}
```

Route handlers are evaluated dynamic when a `Request` object used with a `GET`.
Using any other HTTP methods. Using Dynamic Functions like cookies and headers.

```jsx
// app/products/api/route.ts
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    // headers means our request is dynamic
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  });
  const product = await res.json();
  return NextResponse.json({ product });
}
```

Similarly a `POST` method will cause a Route Handler to be evaluated dynamic.

```jsx
import { NextResponse } from 'next/server';
export async function POST() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
```

- You can consider a `route.js` the lowest level routing primitive
- They don't participate in `layout.js` or client-side navigation like `page.js`
- Your `route.js` file can't be at the same route/segment level as `page.js`

```jsx
// `app/page.js`
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// ❌ Conflict
// `app/route.js`
export async function POST(request) {}

// ✅ Valid
// `app/api/route.js`
export async function POST(request) {}
```

**Examples**

The following examples show how to combine Route Handlers:

- Revalidating Static Data

You can revalidate static data fetches using the `next.revalidate` option:

```jsx
// app/items/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  const data = await res.json();

  return NextResponse.json(data);
}
```

- Dynamic Functions

You can read `cookies` from `next/headers`.

This server function can be called directly in a Route Handler, or nested inside
of another function. The `cookies` instance is read-only.

Set cookies by returning a new `Response` with a `Set-Cookie` header.

```jsx
// app/api/route.ts
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token}` }, // Set a cookie
  });
}
```

You can read `headers` from `next/headers`.

This server function can be called directly in a Route Handler, or nested inside
of another function. The `headers` instance is read-only.

To set headers, return a new `Response` with new headers.

```jsx
// app/api/route.ts
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const headersList = headers();
  const referer = headersList.get('referer');

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  });
}
```

- Request Body

  You can read the `Request` body using the standard Web API methods:

```jsx
// app/items/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res = await request.json();
  return NextResponse.json({ res });
}
```

- Edge and Node.js Runtimes

Route Handlers have a isomorphic Web API to support both Edge & Nodejs `runtime`
seamlessly, including support for streaming. Since Route Handlers use the same
route segment configuration as `page` & `layout`, meaning they can support long
awaited features like general-purpose statically regenerated Route Handlers.

You can use the `runtime` segment config option to specify the runtime:

```jsx
export const runtime = 'edge'; // 'nodejs' is the default
```

- Segment Config Options

Route Handlers use the same route segment configuration as `page` & `layout`.

```jsx
// app/items/route.ts
export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = 'auto';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
```

# Rendering

## Fundamentals

There are two environments where your application code can be rendered:

- The **client** refers to the browser on a user’s device.
- It sends a request to a Next/Node server for your application code.
- Turns the response from the server into an interface a user can interact with.

- The **server** refers to the computer in a data center.
- It hosts/stores your application code, receives requests from a client.
- It does all the Next/Node compute and sends back appropriate responses.

Note: "Server" is a general name that can refer to computers in _Origin Regions_
where your application is deployed to, the _Edge Network_ where your application
code is distributed, or _Content Delivery Networks (CDNs)_ where a result of the
rendering work can be cached.

Before **React 18**, the primary way to render your app using React was entirely
on the client. Next provided an easier way to break down your app within "pages"
and pre-render/pre-build them on an server by generating HTML, sending it to the
client to be "hydrated" by React. Now with Server & Client Components, React can
render on the client and the server.

> You can choose rendering environment at the page/component level.

By default, `app` directory uses React Server Components (RSC), allowing you to
easily render components on servers, & reduce the amount of JS sent to clients.

You can interleave Server and Client Components in a component tree by importing
a Client Component into a Server component, or by passing an Server Component as
a child or a prop to a Client Component.

Behind the scenes, React will merge the work of both environments.

In addition to client-side and server-side rendering with React components, Next
gives you the option to optimize rendering on the server.

**Static Rendering (SSG + ISR)**

Both Server & Client Components can be pre-rendered on the server at build time.
The result of the work is cached and reused on subsequent requests. The cached
result can also be revalidated.

> Note: This is equivalent to Static Site Generation (SSG) `getStaticProps` and
> Incremental Static Regeneration (ISR) `revalidate` option.

Server and Client components are rendered differently during Static Rendering:

Client Components have their HTML and JSON pre-rendered & cached on the server.
The cached result is then sent to the client for "hydration".

Server Components are rendered on the server by React, and their payload is used
to generate HTML. The same rendered payload is also used to "hydrate" components
on the client, resulting in no JS needed on the client.

**Dynamic Rendering (SSR)**

**No Caching** occurs dynamic rendering for both Server and Client Components as
they rendered on the server at request time.

> Note: This is equivalent to Server-Side Rendering (SSR) `getServerSideProps`.

## Server Components

> https://beta.nextjs.org/docs/getting-started#thinking-in-server-components

All components inside the `app` directory are **React Server Components** (RSC)
by default including special files and co-located components. This allows you to
auto adopt Server Component (SC) with no extra work, achieve great performance.

![alt text](./capture-server-components.png 'Server Components')

If we were to split the page into smaller components you'll notice that majority
of components are non-interactive and can be rendered on the server. For smaller
pieces of interactive UI, we can "sprinkle" in Client Components.

> This aligns with Next.js server-first approach.

To make this transition easier, Server Components (SC) are default in the `app`
directory, so you do not have to take additional steps to adopt them. Then, you
can optionally opt-in to Client Components (CC) when needed.

When a route is loaded with Next.js, the initial HTML is rendered on the server.
This HTML is then "progressively enhanced" in the browser allowing the client to
take over the application and add interactivity, by asynchronously loading Next
and React "client side" runtime. With Server Components the initial page load is
faster and any "client side" JS bundle size is reduced. A base "client side" run
time is also cache-able, predictable in size and does't increase as a app grows.
Additional JS only added as "client side" interactivity is used, through (CC).

## Client Components

They enable you to add "client-side" interactivity to your application. In Next,
these requests are still prerendered by a server & then "hydrated" in a browser.
`"use client"` "sits" between server-only and client code. Its placed at the top
of a file, above imports to define the cut-off point where it crosses a boundary
from the server-only to the client part. Once `"use client"` is defined in file,
all other modules imported into it, including child components, are considered a
part of the JS client bundle, sent to a client/browser request.

> Good to know: Components in the Server Component (SC) modules are guaranteed
> to be only rendered on the server "completely" built. Components in the Client
> Cmponent module are primarily rendered on the client, BUT the advantage with
> Next! They still pre-rendered on a server but then "hydrated" on the client.

![alt text](./capture-use-client-directive.webp 'Use Client Directive')

- `"use client"` directive must be defined at the top of a file before imports.
- `"use client"` does not need to be defined in every file.
- The Client module boundary only needs to be defined once, at "entry point".
- Then all module imports into it will be considered Client Components.

## When to use Server vs. Client Components?

To simplify the decision, Next recommends using Server Components as a "default"
in the `app` directory, until you have a need to use a Client Component.

- Using the `fetch` API to get data ✅ (SC) ✅ (CC)
- `Link` components `next/link` for navigation ✅ (SC) ✅ (CC)
- Access backend resources directly with `route.js` ✅ (SC) ❌ (CC)
- Keep sensitive info like access tokens, API keys safe ✅ (SC) ❌ (CC)
- Keep large dependencies on server to reduce client-side JS ✅ (SC) ❌ (CC)
- Add interactivity like event listeners `onClick` `onChange` ❌ (SC) ✅ (CC)
- State, lifecycle, effects `useState` `useContext` `useEffect` ❌ (SC) ✅ (CC)
- Using any browser-only APIs like `window` `document` ❌ (SC) ✅ (CC)
- React Class components ❌ (SC) ✅ (CC)

To improve the performance of your application its recommend moving (CC) to the
**leaves** of your component tree where possible.

For example, you may have a Layout that has static elements (e.g. logo, links,
etc) and an interactive search bar that uses state.

Instead of making the whole `layout.js` a Client Component, move the interactive
logic to a Client Component `<SearchBar />` and keep layout and its dependencies
Server Components. This means you don't have to send all the component JS of the
layout to the client. Example below of `layout.js` under the `app` directory.

```jsx
// app/layout.js
import Logo from './Logo'; // 👈🏻 Server Component (default)
import SearchBar from './SearchBar'; // 👈🏻 Client Component

export default function Layout({ children }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  );
}
```

## Importing Server Components into Client Components

Server & Client Components can be interleaved in the same component tree. Behind
the scenes, React will merge the work of both environments. However, React there
is a restriction around importing Server Components inside Client Components as
they likely to handle server-only code (database or filesystem utilities) etc...

```jsx
// app/ClientComponent.js
'use client';
// ❌ This pattern will not work.
import ServerComponent from './ServerComponent';
// You cannot import a Server Component into a Client Component:
export default function ClientComponent() {
  return (
    <>
      <ServerComponent />
    </>
  );
}
```

Instead we pass the Server Component as a child or a prop to a Client Component.
You can do this by wrapping both components in another Server Component.

```jsx
// app/ClientComponent.js
'use client';
// ✅ This pattern works!
export default function ClientComponent({ children }) {
  return <>{children}</>;
}
```

With this pattern, React will know it needs to render `<ServerComponent />` on
the server before sending the result to the client. From the Client Component's
perspective, its child will be already rendered.

This pattern is already applied in `layout.js` and `page.js` with the `children`
props so you don't have to create an additional wrapper component.

```jsx
// app/page.js
// ✅ This pattern works.
import ClientComponent from './ClientComponent';
// You can pass a Server Component as a child to the Client Component.
import ServerComponent from './ServerComponent';
// Pages are Server Components by default
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  );
}
```

## Keeping Server-Only Code out of Client Components (Poisoning)

Its possible code only ever was intended to be run on the server. It sneaked its
way into the Client Component. For example take a data-fetching function:

```jsx
export async function getData() {
  let res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });
  return res.json();
}
```

At first glance, it appears that `getData` works on both the server and client.
But because the environment variable `API_KEY` is not prefixed `NEXT_PUBLIC`, it
is a private variable, only be accessible on a server due to a Server Component.
While making the variable public ensures the function works on clients, it leaks
sensitive info. To prevent this sort of unintended "client usage" of server code
we can use the `server-only` package to give other developers a build-time error
if they ever accidentally import a module into a Client Component (CC).

To use `server-only`, first install the package: `npm install server-only`. Then
import the package into any module that contains "server-only" intended code:

```jsx
import 'server-only'; // 👈🏻 This is the only line you need to add.

export async function getData() {
  let resp = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });
  return resp.json();
}
```

Now any (CC) imports of the function will receive a build-time errors explaining
that this module can only be used on/in a Server Component. It's a corresponding
package to client-only marked modules `"use client"` that accesses say `window`.

## Third-party packages

The `"use client"` directive is a new React feature that was introduced as part
of Server Components. Since React Server Components are so new, many third-party
packages in the ecosystem are only beginning to add it to their components, that
use client only features like `useState`, `useEffect` and `createContext` etc...
If you try to use it directly within a Server Component, you'll see an error:

```jsx
// app/page.js
import { AcmeCarousel } from 'acme-carousel';

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/* 🔴 Error: `useState` can not be used within Server Components */}
      <AcmeCarousel />
    </div>
  );
}
```

For example, let's say you've installed the hypothetical `acme-carousel` package
which has an `<AcmeCarousel />` component. This component uses `useState` but it
doesn't yet have the `"use client"` directive. A solution, wrap your third-party
components that rely on "client-only" features in a custom Client Component (CC)
file, add the `"use client"` directive and export the component.

```jsx
// app/carousel.js
'use client';
import { AcmeCarousel } from 'acme-carousel';
export default AcmeCarousel;
```

Or you could wrap third-party providers in their own Client Component.

## Context

Most React apps rely on `context` to share data between components, directly via
`createContext`, or indirectly via `Provider` components imported from 3rd-party
libraries. In Next 13, `context` is fully supported within Client Components but
it **cannot** be created or consumed directly within Server Component.

```jsx
// app/layout.tsx
import { createContext } from 'react';
// 🔴 `createContext` is not supported in Server Components
export const ThemeContext = createContext({});

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  );
}
```

Because Server Component has no React state (they not interactive) and `context`
primarily used for/by interactive components deep in a component tree after some
React state has been updated, those changes can be seen without prop drilling.

Since **Providers** are typically rendered near the root of a `app` for sharing
global concerns, like the current theme. The problem is they not supported in a
Server Components 🛑. Instead we `createContext` and render `Provider` in Client
Component. Then we import `Provider` into `RootLayout`, wrapping all `children`.

```jsx
// contexts/theme-provider.tsx
'use client';
import { createContext } from 'react';
export const ThemeContext = createContext({});

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}
```

Your Server Component will now be able to directly render your Provider since it
is been marked as a Client Component:

```jsx
//app/layout.js
import ThemeProvider from './contexts/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

With the provider rendered at the (SC) `RootLayout`, all other Client Components
throughout your `app` will be able to consume context. 🥳

> Note: You should render **Providers** as deep as possible in a tree – notice
> `ThemeProvider` only wraps `{children}` instead of a entire `<html>` document.
> It helps Next optimize static parts of your Server Components.

### Rendering third-party context providers in Server Components

Remember third-party packages often include `Providers` that need to be rendered
near the root like `RootLayout` of your application. If those imported providers
include the `"use client"` directive, they can be rendered directly in of your
Server Components. However since React Server Components are so new, third-party
packages may have not set the `Provider` components to use the directive yet.

```jsx
// app/layout.js
import { ThemeProvider } from 'acme-theme';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* 🔴 Error: `createContext` can't be used in Server Components */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

Fix by wrapping package providers in your own custom (CC) `Provider` Component:

```jsx
// app/providers.js
'use client';

import { ThemeProvider } from 'acme-theme';
import { AuthProvider } from 'acme-auth';

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
```

Now, you can import and render `<Providers />` directly within your root:

```jsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

With the providers rendered at the root, all the components and hooks from these
libraries will work as expected in your (Server & Client) component tree.

### Sharing data between Server Components

Since Server Components are not interactive and therefore do not read from React
state, you don't need the full power of context to share data.

You can use native JS patterns like global singletons within module scope if you
have common data that multiple Server Component access. Global singletons refer
to objects or variables that are "instantiated" once, & are accessible anywhere.

```js
// utils/database.js
export const db = new DatabaseConnection(...);
```

Here a module is used to share a database connection across multiple components:

```jsx
// app/users/layout.js
import { db } from "@utils/database";

export async function UsersLayout() {
  let users = await db.query(...);
  // ...
}
```

Each component shares access to a database by import `@utils/database` module.

```jsx
// app/users/[id]/page.js
import { db } from "@utils/database";

export async function DashboardPage() {
  let user = await db.query(...);
  // ...
}
```

### Sharing fetch requests between Server Components

When data fetching, you may want to share results of a `fetch` between a `page`
or `layout` and their `children` components. That is an **unnecessary coupling**
between components. It leads to passing `props` back & forth between components.
Instead, we recommend **co-locating** your data fetching alongside the component
that consumes the data. A `fetch` request will still anyway auto **de-duped** in
Server Components. So each "route segment" can request exactly the data it needs
without worrying about sending duplicate requests.

> Next will read the same value from the fetch cache. For more information on
> this see the Data Fetching section.

## Static and Dynamic Rendering

In Next.js, a route can be statically or dynamically rendered.

In **static** route (SSG + ISR), components are rendered on the server at build
time. The result of the work is cached and reused on subsequent requests.

With a **dynamic** route (SSR) components are rendered on the server at request
time. For more information see Caching and Revalidating sections.

## Edge and Node.js Runtime

In the context of Next "runtime" refers to the set of libraries, APIs, and in
general functionality available to your code during execution. But Next.js has
server **runtime** environments where you can render parts of your code:

### Edge Runtime

- Cold Boot: Instant
- HTTP Streaming: Yes
- IO: `fetch`
- Scalability: Highest
- Security: High
- Latency: Lowest
- npm Packages: A smaller subset

In Next.js, the lightweight Edge Runtime is a subset of available Node.js APIs.
The Edge Runtime is ideal if you need to deliver dynamic, personalized content
at low latency with small, simple functions. The Edge Runtime's speed comes from
its minimal use of resources, but that can be limiting in many scenarios.

For example, code executed in the Edge Runtime on Vercel cannot exceed between 1
MB and 4 MB, this limit includes imported packages, fonts and files, and it will
vary depending on your deployment infrastructure.

### Node.js Runtime

- Cold Boot: ~250ms
- HTTP Streaming: Yes
- IO: All
- Scalability: High
- Security: High
- Latency: Low
- npm Packages: All

A Node.js runtime gives you access to all Node.js APIs and all npm packages that
rely on them. However, it's not as fast to start up as routes vs Edge runtime.

Deploying Next applications on a Node.js server will require managing, scaling,
and configuring your infrastructure. Alternatively, you can consider deploying
your Next to a serverless platform like Vercel, which will handle this for you.

### Serverless Functions

- Cold Boot: /
- HTTP Streaming: Yes
- IO: All
- Scalability: /
- Security: Normal
- Latency: Normal
- npm Packages: All

Serverless is ideal if you need a scalable solution that can handle more complex
computational loads than a Edge Runtime. Serverless Functions on Vercel, example
your overall code size is `50MB` including imported packages, fonts, and files.

The downside compared to routes using the Edge is that it can take hundreds of
milliseconds for Serverless Functions to boot up before processing any requests.
Depending on the amount of traffic your site receives, this could be a frequent
occurrence as the functions are not frequently "warm".

# Data Fetching

## Fundamentals

> https://beta.nextjs.org/docs/data-fetching/fundamentals

The Next **App Router** introduces a new simplified data fetching system built
on React and the Web platform.

> Good to know: Previous Next data fetching methods such as `getServerSideProps`
> and `getStaticProps` are not supported in `app` directory.

### The Fetch API

The new data fetching system is built on top of the native `fetch` Web API and
makes use of `async/await` in Server Components.

- React extends `fetch` to provide automatic request de-duping.
- Next extends the `fetch` options object.
- Each request you can set caching and revalidating rules.

### Fetching Data on the Server

Whenever possible we recommend fetching data inside Server Components as it will
**always fetch data on the server**. This allows you to:

- Have direct access to backend data resources (databases)
- Keep your application more secure by preventing sensitive info leaking
- Stop access tokens and API keys from being exposed to clients
- Fetch data and render it in the same environment
- That reduces client and server back-and-forth communication
- As well as keeping work on the main thread of a client browser
- Perform multiple data fetches with single round-trip
- Instead of multiple individual requests from the client-side
- Reduce client-server waterfalls
- Depending on your CDN region, data fetching can occur closer to you

> Good to know: It's still possible to fetch data client-side. And we recommend
> using libraries such as `SWR` or React Query in Client components.

### Component-level Data Fetching

In this new model you can `fetch` data inside `layout.js`, `page.js` components.
Data fetching is also compatible with Streaming and Suspense.

> Good to know: For layouts, it's **not** possible to pass data between a parent
> layout and its `children`. Recommend, fetch data "directly" inside the layout
> that needs it, even if you requesting the same data multiple times in a route.
> Behind the scenes, React/Next anyways "cache" and dedupe requests to avoid the
> same data being fetched more than once in any case.

**Parallel vs Sequential**

When fetching data inside components, you need to be aware of two data fetching
patterns: Parallel and Sequential.

Parallel: requests in a route are eagerly initiated together

They will load data at the same time. It reduces client-server waterfalls and a
total time it takes to `fetch` and load all the data.

Sequential: requests in a route are dependent on each other create a waterfalls

There may be cases where you want this pattern because one `fetch` depend on the
result of another, or you want a condition satisfied before the next `fetch` to
save resources. Most of the time they unintentionally done and not recommended.

![alt text](./capture-sequential-parallel-data-fetching.webp 'Parallel Recommended')

**Automatic fetch Request De-duping**

If you need to fetch the same data (e.g. current user) in multiple components in
a tree. Next will automatically "cache" `fetch` request `GET` that have the same
input in temporary cache. This optimization prevents the same data fetched more
than once during a rendering pass.

![alt text](./capture-deduplicated-fetch-requests.webp 'Deduplicated Fetch Requests')

- On the server the "cache" lasts a lifetime of the server request, until the
  rendering process/request has complete.

- The optimization applies to `fetch` requests made in `layout.js`, `page.js`,
  Server Components, `generateMetadata`, `generateStaticParams`.

- This optimization also applies during static generation (SSG + ISR).

- Client-side the "cache" lasts the duration of a session (which could include
  multiple client-side re-renders) before a full-page reload.

> Good to know: (`POST`) requests are not automatically de-duplicated. If you're
> unable to use `fetch`, React provides a cache function to allow manual caching
> of data for the duration of the request.

### Types of Data We Fetch (Static vs Dynamic)

**Static Data** doesn't change often like a blog post.

- Before Next 13 we used `getStaticProps` (SSG) & `getStaticPaths` (ISR)
- Data is fetched and then cached
- The cached data is re-used on each request

**Dynamic Data** changes often like a user profile or twitter feed.

- Before Next 13 we used `getServerSideProps` (SSR)
- Data is fetched on every/each request
- If your data is personalized to the user you need to fetch without caching

By default, Next.js automatically does **static** `fetch`. Meaning that the data
will be fetched at build time, cached, and reused on each request. The developer
has control/option in how static data will be `cached` and `revalidated`.

There two benefits to using static data:

1. It reduces the load on your DB by minimizing the number of requests made.
2. The data is automatically cached for improved loading performance.

- Caching Data

Caching is the process of storing data in a location _Content Delivery Network_
so doesn't need to be re-fetched from the original source on each request. The
**Next.js Cache** is a (persistent HTTP cache) that can be globally distributed.

This cache can scale automatically be shared across multiple regions depending
on your platform (_Vercel_). Next extends `options` object of a`fetch` function
to allow each request on a server to set its own (persistent caching behavior).

During server render when Next comes across a `fetch` it 1st checks its "cache"
to see if the data is already available. If so, it will return cached data. If
not, it will `fetch` and store data for future requests.

> Good to know: If you're unable to use server-side `fetch`, React provides a
> `cache` function to manually cache data for the duration of a request.

- Revalidating Data

Revalidation is a process of purging the cache and re-fetching the latest data.
Useful when your data changes and you want to ensure the application shows the
latest version without having to rebuild your entire application.

Next.js provides two types of revalidation:

Background: at a specific time interval.
On-demand: whenever there is an update to the data.

You will learn more about revalidation in the following sections.

- Streaming and Suspense

Streaming & Suspense are new React features allowing you to progressively render
and incrementally stream rendered units of the UI to the client.

With Server Components and nested layouts you're able to instantly render parts
of the page that do not specifically require data, and show a loading state for
parts of the page that are fetching data. This means users does not have to wait
for the entire page to load before they can start interacting with it.

![alt text](./capture-server-rendering-with-streaming-alt.webp 'Server Rendering with Streaming')

## Fetching

> https://beta.nextjs.org/docs/data-fetching/fetching

React & Next 13 introduced a new way to `fetch` and manage data in your app. The
new data fetching system works in our `app` directory and is built on top of the
`fetch` Web API. That "fetches" remote resources that returns a `promise`. React
extends `fetch` to provide automatic request **de-duping**, and Next extends the
`fetch` options object to allow each request to set its caching & revalidating.

> Good to know: This new data fetching model is currently being developed by the
> React team. Recommended read: (support for promises React RFC) introduces your
> `async/await` in Server Components and a new `use` hook for Client Components.

### async/await in Server Components

With proposed React RFC you can `async/await` to fetch data in Server Component.

```jsx
// app/page.tsx
async function getData() {
  // Return value is *not* serialized and you can return Date, Map, Set, etc.
  const res = await fetch('https://api.example.com/...');
  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function Page() {
  const data = await getData(); // 👈🏻 await is allowed in Server Components
  return <main></main>;
}
```

Helpful server functions when fetching data in (SC): `cookies` & `headers`

> Good to know: `use` is a new React function that accepts a promise similar to
> await. `use` handles a promise returned by a function in a way compatible with
> components, hooks, and Suspense. Wrapping `fetch` in `use` is not recommended
> in Client Components and may trigger multiple re-renders. For now, if you need
> to `fetch` data in a Client Component, we recommend using SWR or React Query.

### Fetching Options

**Static Data Fetching / Static Site Generation (SSG)**

By default `fetch` will automatically fetch and **cache data** indefinitely. We
can compare this to using the `getStaticProps` (**SSG**) function.

```jsx
fetch('https://...', { cache: 'force-cache' }); // 👈🏻 is the default
```

**Revalidating Data Fetching / Incremental Static Regeneration (ISR)**

To revalidate cached data at a timed interval, you can use the `next.revalidate`
option in `fetch` to set the `cache` lifetime of a resource in seconds. You can
compare this to using the `getStaticProps` (**ISR**) function.

```jsx
fetch('https://...', { next: { revalidate: 10 } });
```

**Dynamic Data Fetching / Server Side Rendering (SSR)**

To fetch fresh data on every `fetch` request use the `cache: 'no-store'` option.
You can compare this to `getServerSideProps` (**SSR**) function.

```jsx
fetch('https://...', { cache: 'no-store' });
```

### Data Fetching Patterns

**Parallel**

Minimize client-server waterfalls we recommend to fetch data in parallel:

```jsx
// app/artist/[username]/page.jsx
import Albums from './albums';

async function getArtist(username) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}
async function getArtistAlbums(username) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}

export default async function Page({ params: { username } }) {
  // Initiate both requests in parallel
  const artistData = getArtist(username);
  const albumsData = getArtistAlbums(username);
  // Await for the `Promise.all` to resolve and destructure the result,
  const [artist, albums] = await Promise.all([artistData, albumsData]);
  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums}></Albums>
    </>
  );
}
```

Starting the `fetch` calls prior to calling `await` in the Server Component (SC)
will ensure each request can eagerly starting `fetch` requests at the same time.
This sets your components up so you can avoid "waterfalls". We can save time by
initiating both requests in parallel with `Promise.all` calls

Remember the user won't see the rendered result until both promises resolve.

To improve the user experience, you can add a React `<Suspense>` boundary that
breaks up the rendering work, showing part of the result as soon as possible.

```jsx
// app/artist/[username]/page.jsx
export default async function Page({ params: { username } }) {
  // Initiate both requests in parallel
  const artistData = getArtist(username);
  const albumData = getArtistAlbums(username);
  // Wait for the artist's promise to resolve first
  const artist = await artistData;
  return (
    <>
      <h1>{artist.name}</h1>
      {/* Send artist info first and wrap albums in a suspense boundary */}
      <Suspense fallback={<div>Loading...</div>}>
        <Albums promise={albumData} />
      </Suspense>
    </>
  );
}

// Albums Component
async function Albums({ promise }) {
  // Wait for the albums promise to resolve second
  const albums = await promise;
  return (
    <ul>
      {albums.map((album) => (
        <li key={album.id}>{album.name}</li>
      ))}
    </ul>
  );
}
```

**Sequential**

To fetch data sequentially, just fetch directly inside the component as needed.
Meaning you await for a result of `fetch` inside the component that needs it.

```jsx
// app/artist/page.tsx
async function Playlists({ artistID }) {
  // Wait for the playlists
  const playlists = await getArtistPlaylists(artistID);
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}

export default async function Page({ params: { username } }) {
  // Wait for the artist
  const artist = await getArtist(username);
  return (
    <>
      <h1>{artist.name}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}
```

Unintentionally this lands up occurring. We fetch data inside the component and
each fetch request in its "nested segment" for the route cant start fetching its
data and rendering "until" the previous request "segment" has completed.

**Render Blocking in a Route (Warning)**

By fetching data in your `layout.js`, rendering for all "route segments" beneath
it can only start once the data has finished loading, not ideal! 😢

In a `pages` directory seen in Next 12 and earlier, using server-rendering would
show a browser loading UI like a spinner until `getServerSideProps` had finished
then render the React component for that page. This can be described as a all or
nothing data fetching. Either you had the entire data for a page, or none. 😢

But in the `app` directory you have additional "options" to assist this:

1. You can use `loading.js` to show an instant loading state from the server
   while streaming/suspending a result from your data fetching function.

2. And you can move data fetching lower in a component tree, blocking the render
   for the parts of the `page.js` that need it only.

> In summary move data fetching to specific component leaf rather than fetching
> in any root layout. Whenever possible its better to fetch data in segment that
> needs it. This also allows you to show `loading.js` UI for only that part of a
> page that is loading, and not the entire page.

### Data Fetching WITHOUT `fetch`

You may not always have ability to use and configure `fetch` requests directly
if you're using a third-party library such as a ORM or database client. In those
cases where you cannot use `fetch` but still want to control cache or revalidate
behavior of a `layout.js` or `page.js`. You can then rely on the following:

**Default Caching Behavior**

Any data fetching libraries that do not use `fetch` API will directly not affect
caching of a route. But will be static or dynamic depending on a route segment.

If the segment is static (default) being SSG + ISR, the output of a request will
be cached and revalidated (if configured) alongside the rest of the segment.

If the segment is dynamic being plain (SSR), the output of the request will not
be cached and will be re-fetched on every request when the segment is rendered.

> Good to know: Dynamic functions used in a library `cookies()` and `headers()`
> will make the route segment dynamic.

**Segment Cache Configuration**

> https://medium.com/weekly-webtips/how-to-add-segment-to-a-next-js-app-e117835cb919

As temporary solution until caching behavior of third-party queries is supported
use "segment configuration" to customize cache behavior of a entire segment.

Here is the route segment configuration options you can use to change behavior
of a `page`, `layout`, or `route` handler by exporting the following variables:

```jsx
// layout.js | page.js
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
export function generateStaticParams(...)
```

Example here a `page.js` file fetching data from a database using `prisma` isn't
using `fetch` API, but still can have control over caching behavior.

```jsx
// app/page.js
import prisma from './lib/prisma';
export const revalidate = 3600; // revalidate every hour

async function getPosts() {
  const posts = await prisma.post.findMany();
  return posts;
}

export default async function Page() {
  const posts = await getPosts();
  // ...
}
```

In example, the codes fetching data from a database using `prisma` and returning
the posts. The `revalidate` variable is set to 3600 seconds (1 hour) which means
that the data/cache will be revalidate (SSG + ISR), re-fetched after a interval.

To use "segment configuration" you need to add a `config.ts` file in the _same_
directory as your `app/page.js` file fetching data from a database.

```js
// app/config.js
export default {
  cache: {
    api: {
      policy: 'CacheFirst',
      revalidate,
    },
  },
};
```

In this file you can customize the cache behavior of the entire segment. Example
the `api` object is used to configure cache behavior for the "route segment". An
policy property is set to `'CacheFirst'` which means that the data will be first
cached and served from cache if available (SSG + ISR). The `revalidate` property
is set to the value of the revalidate variable defined in `page.jsx` which means
that the data will be revalidated and re-fetched after 1 hour.

- By default, Next uses a global cache policy for API routes.

However you can customize cache behavior per "route segment" via configuration.
This allows you to configure the cache behavior for specific parts of your `app`
and that improves the performance of your application and avoids any blocking.

## Caching

There are two ways of caching in Next.js:

### Segment-level Caching

A caching configure allowing you to determine the cache and revalidate data used
in "route segment". This mechanism allows different segments of a route/path to
control the "cache lifetime" of a "route segment".

Each `page.js` & `layout.js` in the route hierarchy, you can export a revalidate
value that sets revalidation time for that route.

```jsx
// app/page.js
export const revalidate = 60;
// But revalidate this page every 10 seconds as the `getData` fetch request has
// `revalidate: 10`. Meaning the page will revalidate every 10 seconds.
async function getData() {
  const res = await fetch('https://...', {
    next: { revalidate: 10 },
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  // ...
}
```

If a `page.js`, `layout.js`, fetch request all specify a revalidation frequency
that is lower, the lowest value of the three will be used. Example:

```jsx
// app/dashboard/layout.tsx
export const revalidate = 60;
export default function Layout() {
  // ...
}
```

Both the `layout.js` and `page.js` fetch request for that route segment is to be
revalidated at different times. Since the `fetch` request with the shortest time
is applied, the `page.js` will use its value & revalidate every `10` seconds.

```jsx
// app/dashboard/page.tsx
export const revalidate = 30;
async function getData() {
  const res = await fetch('https://...', {
    next: { revalidate: 10 },
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  // ...
}
```

> Good to know: Set `fetchCache` to 'only-cache' or 'force-cache' to ensure that
> all fetch requests opt into caching. But the revalidation frequency may still
> be lowered by individual fetch requests within that "route segment".

### Per-request Caching

Caching that allows you to cache & deduplicate requests on a per-request basis.
React exposes a new function called `cache` that "memoizes" results of a wrapped
function. Meaning the same function called with the same input arguments will so
reuse cached value instead of re-running the function.

It was introduced in the **first-class support for promises RFC**. And a `cache`
call will deduplicate data fetched on a **per-request basis**.

If a function instance with the same arguments has been called before, anywhere
in the server request, then we can return a cached value.

```jsx
// utils/getUser.ts
import { cache } from 'react';
export const getUser = cache(async (id: string) => {
  const user = await db.user.findUnique({ id });
  return user;
});
```

Although the `getUser()` function is called twice in the example, only one query
will be made to the database. This is because `getUser()` function is wrapped in
`cache` HOF/HOC. Meaning the same function return values can be reused.

```jsx
// app/user/[id]/layout.tsx
import { getUser } from '@utils/getUser';
export default async function UserLayout({ params: { id } }) {
  const user = await getUser(id);
  // ...
}
```

Here a second function call/request from `getUser` in `page.js` can again reuse
results from the first function instance return value.

```jsx
// app/user/[id]/page.tsx
import { getUser } from '@utils/getUser';
export default async function UserLayout({
  params: { id },
}: {
  params: { id: string },
}) {
  const user = await getUser(id);
  // ...
}
```

- `fetch` has already been patched to include support for `cache` automatically
- So you don't need to wrap functions that use `fetch` with `cache`
- We recommend **fetching data directly** in the component that needs it
- Even if you're requesting the same data in multiple components again
- Because `fetch` supports deduplication per request so it doesn't matter
- Avoid prop drilling by passing fetched data down the component tree
- As mentioned rather `fetch` again using the same function instance
- Wrap functions you don't control such as third-party libraries with `cache`
- That gives the same per-request caching behavior as seen with `fetch`
- Using `cache` allows shared data fetching
- Without having to known if a parent layout was rendered during a request
- We recommend using the server-only packages
- Ensures server data fetching functions are not accidentally used in client

## Revalidating

Next allows you to update specific static routes without needing to rebuild
your entire site. Revalidation known as Incremental Static Regeneration (ISR)
allows you to retain benefits of static while scaling millions of `page.js`.

There are two types of revalidation: Background and On-demand.

### Background Revalidation

To revalidate cached data at a specific interval, you can use the `next` objects
`revalidate` option in `fetch` to set a cache lifetime of a resource.

```jsx
fetch('https://...', { next: { revalidate: 60 } }); // (SSG + ISR)
```

If you want to `revalidate` data that does not use fetch (using external package
or query builder), you can use that segment's "route segment" configuration.

```jsx
// app/page.tsx
export const revalidate = 60; // revalidate this page every 60 seconds
```

In addition to `fetch`, you can also revalidate data using `cache`.

**How it works**

1. When a request is made to the route/page that was static rendered at build
   time, it will initially show the cached data.

2. Any requests to the route after the initial request and before 60 seconds are
   also cached and instantaneous.

3. However, after the 60-second window, the next request will still show cached
   (stale) data. So Next triggers a data "regeneration" in the background.

4. Once a route generates successfully, Next invalidates older cache and serves
   the updated route. If background regeneration fails the old data unaltered.

When a request is made to a "route segment" that hasn’t been generated yet, Next
will dynamically (SSR) render that route on a first request. But future requests
serves the static route segments from the cache (SSG + ISR).

> Note: Check if your upstream data provider has caching enabled by default. You
> might need to disable (`useCdn: false`) otherwise a revalidation won't be able
> to pull fresh data to update the (**ISR cache**). To check if its occurring at
> your CDN (for an endpoint being requested) look for `Cache-Control` headers.
> **ISR** on Vercel "persists" the cache globally and handles rollbacks.

### On-demand Revalidation

If you set a `revalidate` time of `60`, all visitors will see the same generated
version of your site for one minute. The only way to invalidate the cache is if
someone visits the page after the minute has passed. But starting with Next 12.2
it supports **On-Demand ISR** to manually "purge" the Next cache for a specific
page. This makes it easier to update your site when say:

- Content from a headless CMS is created or updated.
- E-commerce metadata changes (price, description, category, reviews, etc).

First, create a secret token only known by your Next.js app. This secret will be
used to prevent unauthorized access to the revalidation API route. You access an
route (either manually or with a webhook) with the following URL structure:

`https://<your-site.com>/api/revalidate?secret=<token>`

Next, add the secret as an Environment Variable to your application.

```js
// .env
MY_SECRET_TOKEN=<token>
```

Finally create the on-demand revalidation API route:

```jsx
// pages/api/revalidate.js;
export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // This should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate('/path-to-revalidate');
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
```

## Streaming and Suspense

The `app` directory introduces support for streaming with React `Suspense` for
both Nodejs and Edge runtime.

> https://beta.nextjs.org/docs/data-fetching/streaming-and-suspense

### What is Streaming?

Too learn how streaming works in React and Next.js, it's helpful to understand
Server-Side Rendering (SSR) and its limitations. With SSR, there's a series of
steps that need completed before a user can see and interact with a `page`:

1. First all data for a given `page.js` is fetched on the server for a (SC).
2. The server then renders the html for the `page.js`.
3. The html, css, and js for the `page.js` are sent to the requesting client.
4. A non-interactive interface is shown using generated html/css as skeleton.
5. Finally on the client, React **hydrates** the user to make it interactive.

![alt text](./capture-ssr-chart.webp 'SSR Chart')

> These steps are sequential and blocking.

That means the server can only render the html for a page once all the data has
been fetched. And, on the client-side, React only **hydrates** the UI once code
for all components in the `page.js` has been downloaded.

(SSR) with React & Next helps improve perceived loading performance by showing a
non-interactive _skeleton_ page to the user as soon as possible.

However, it can still be slow as all data fetching on server needs be completed
before the `page.js` can be shown to a user. Streaming allows you to break down
the html into smaller chunks, progressively send chunks from server to client.

![alt text](./capture-server-rendering-with-streaming.webp 'Streaming Chart')

This enables parts of the page to be displayed sooner, without waiting for all
the data to load before any UI can be rendered.

**Streaming** works well with React components because each component can be
considered a "chunk". Example component that has higher priority (product info)
or that don't rely on data can be sent first (`layout`), React starts hydration
earlier. But components that have lower priority (reviews, related products etc)
can be sent in the same server request, after their data has been fetched.

Streaming is particularly beneficial when you want to prevent long data requests
from blocking the page from rendering.

### Streaming in Next

Implement streaming in Next simply by defining a `loading.js` file (for a entire
route segment) or with a direct React `<SuspenseBoundary>` setup.

For more granular control, wrap your components in **React Suspense Boundary**.
`<Suspense>` works by wrapping a component that performs an asynchronous action
like a component that will `fetch` data) and React Suspense will show `fallback`
UI like a skeleton or spinner). Then swaps components once `fetch` completes.

```jsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { PostFeed, Weather } from './Components';

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <PostFeed />
      </Suspense>
      <Suspense fallback={<p>Loading weather...</p>}>
        <Weather />
      </Suspense>
    </section>
  );
}
```

By using `<SuspenseBoundary>`, you get the benefits of:

- Streaming Server Rendering - Progressive rendering html from server to client.
- Selective Hydration - React prioritizes components to make interactive first.

For more Suspense examples and use cases, please see the React Documentation.

### Streaming and SEO

Next will wait for data fetching inside `generateMetadata` to complete before
streaming UI to a client. This guarantees the first part of a streamed response
includes `<head>` tags. Since streaming is server-rendered, it will not impact
SEO. You can use the "Mobile Friendly Test" tools from Google to see how your
page appears to Google's web crawlers and view the serialized html (source).

## Generating Static Params

The `generateStaticParams` function can be used in combination with a dynamic
route segments to statically generate route at build time instead of on-demand
at request time. The primary benefit of the `generateStaticParams` function is
its smart retrieval of data.

```jsx
// app/blog/[slug]/page.jsx;
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json());
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

If content is fetched within the `generateStaticParams` function using a fetch
request, they are automatically deduplicated. This means a `fetch` request with
the same arguments across multiple `generateStaticParams`, layouts & pages will
only be made once, which decreases build times. Use the migration guide if you
are migrating from the `pages` directory.

See `generateStaticParams` server function documentation for more information
for advanced use cases.

## API Routes

API Routes have been replaced by Route Handlers in Next.js 13.2. API Routes are
still supported in the pages directory with Next.js 13.2

We recommend using Route Handlers instead with `app`.

### Route Handlers

> https://beta.nextjs.org/docs/routing/route-handlers

Route Handlers allow you to create custom request handlers for a given route
using the fetch API `request` and `response` objects.

```jsx
// app/api/route.ts
export async function GET(request: Request) {}
// HTTP methods supported: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
```

> Good to know: Route Handlers are only available in the `app` directory. They
> are equivalent of API Routes inside the `pages` directory meaning you do not
> need to use API Routes and Route Handlers together.

Route Handlers can be nested inside the `app` directory, similar to `page.js`.
But the `route.js` file can't be at the same route segment level as page. As the
`route.js` file is a custom request handler, and not a page. It must be placed
in a different folder, like within an `api` folder for that segment.

In addition to supporting native request and response. Next extends them with
`NextRequest`/`NextResponse` types to provide convenient helpers.

Route Handlers are statically evaluated by default when using the `GET` method
with the `response` object.

```jsx
// app/items/route.ts
import { NextResponse } from 'next/server';
export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  });
  const data = await res.json();
  // You can use `NextResponse.json()` for typed responses instead.
  return NextResponse.json({ data });
}
```

Route handlers are evaluated dynamic when a `Request` object used with a `GET`.
Using any other HTTP methods. Using Dynamic Functions like cookies and headers.

```jsx
// app/products/api/route.ts
import { NextResponse } from 'next/server';
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const res = await fetch(`https://data.mongodb-api.com/product/${id}`, {
    // headers means our request is dynamic
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  });
  const product = await res.json();
  return NextResponse.json({ product });
}
```

Similarly a `POST` method will cause a Route Handler to be evaluated dynamic.

```jsx
import { NextResponse } from 'next/server';
export async function POST() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
    body: JSON.stringify({ time: new Date().toISOString() }),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
```

- You can consider a `route.js` the lowest level routing primitive
- They don't participate in `layout.js` or client-side navigation like `page.js`
- Your `route.js` file can't be at the same route/segment level as `page.js`

```jsx
// `app/page.js`
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// ❌ Conflict
// `app/route.js`
export async function POST(request) {}

// ✅ Valid
// `app/api/route.js`
export async function POST(request) {}
```

**Examples**

The following examples show how to combine Route Handlers:

- Revalidating Static Data

You can revalidate static data fetches using the `next.revalidate` option:

```jsx
// app/items/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  const data = await res.json();

  return NextResponse.json(data);
}
```

- Dynamic Functions

You can read `cookies` from `next/headers`.

This server function can be called directly in a Route Handler, or nested inside
of another function. The `cookies` instance is read-only.

Set cookies by returning a new `Response` with a `Set-Cookie` header.

```jsx
// app/api/route.ts
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { 'Set-Cookie': `token=${token}` }, // Set a cookie
  });
}
```

You can read `headers` from `next/headers`.

This server function can be called directly in a Route Handler, or nested inside
of another function. The `headers` instance is read-only.

To set headers, return a new `Response` with new headers.

```jsx
// app/api/route.ts
import { headers } from 'next/headers';

export async function GET(request: Request) {
  const headersList = headers();
  const referer = headersList.get('referer');

  return new Response('Hello, Next.js!', {
    status: 200,
    headers: { referer: referer },
  });
}
```

- Request Body

  You can read the `Request` body using the standard Web API methods:

```jsx
// app/items/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const res = await request.json();
  return NextResponse.json({ res });
}
```

- Edge and Node.js Runtimes

Route Handlers have a isomorphic Web API to support both Edge & Nodejs `runtime`
seamlessly, including support for streaming. Since Route Handlers use the same
route segment configuration as `page` & `layout`, meaning they can support long
awaited features like general-purpose statically regenerated Route Handlers.

You can use the `runtime` segment config option to specify the runtime:

```jsx
export const runtime = 'edge'; // 'nodejs' is the default
```

- Segment Config Options

Route Handlers use the same route segment configuration as `page` & `layout`.

```jsx
// app/items/route.ts
export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = false;
export const fetchCache = 'auto';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
```
