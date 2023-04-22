import React from 'react';

type Props = {
  params: {
    city: string;
    lat: string;
    long: string;
  };
};

export default function WeatherPage(props: Props) {
  console.log(props);
  const { city, lat, long } = props.params;
  return (
    <div>
      <h1>WeatherPage</h1>
      <p>
        Welcome to WeatherPage! {city} {lat} {long}
      </p>
    </div>
  );
}

/*  ## Defining Routes

Inside the `app` directory, folders are used to define routes. Each **folder**
represents a "route segment" that maps to a **URL path**.

Each **folder** represents a "route segment" that maps to URL path. To create a
nested route, you can nest _folders_ inside each other.

Are special `page.js` file make a "route segment" publicly accessible. They used
to create UI for each "route segment". The `page.js` is unique UI to that route,
and also any `layout.js` UI shared across multiple routes.

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
will automatically invalidate the cache. */
