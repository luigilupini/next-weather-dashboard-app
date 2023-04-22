This is a [Next.js](https://nextjs.org/) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Navigation in Next.js

`useRouter` and the `Link` component are part of Next.js. These two utilities
are mainly used for client-side navigation in a Next.js application.

1. `useRouter`:

`useRouter` is a custom React hook provided by Next.js that allows you to access
the `router` object within your components.

With `router` object, you can manipulate the current "route", query parameters,
and other functionalities related to navigation. This hook useful when you need
to programmatically navigate or access route information inside a component.

> A route is a combination of a `pathname` and `query` object. The `pathname`
> represents the current path of the page, while the `query` object contains the
> key-value pairs of the query string.

Here's a code example with line comments explaining `useRouter`:

```javascript
import { useRouter } from 'next/router';

export default function MyComponent() {
  // Use the useRouter hook to access the router object
  const router = useRouter();
  // Function to navigate to another page programmatically
  const navigateToProfile = () => {
    // Push the new route to the router
    router.push('/profile');
  };
  return (
    <div>
      <button onClick={navigateToProfile}>Go to Profile</button>
    </div>
  );
}
```

2. `Link` component:

`Link` is a higher-order component provided by Next for client-side navigation.
It's used to create links in your app that don't require full page refresh, thus
enabling a smooth user experience. When using the `Link` component, Next.js will
only update parts of the page changed, instead of reloading the entire page.

Here's a code example with line comments explaining the `Link` component:

```javascript
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      {/* The Link component wraps the anchor tag */}
      <Link href="/">
        {/* The content inside the Link component is what the user interacts with */}
        <a>Home</a>
      </Link>

      <Link href="/about">
        <a>About</a>
      </Link>

      <Link href="/contact">
        <a>Contact</a>
      </Link>
    </nav>
  );
}
```

In summary, `useRouter` is a hook that lets you access the `router` object for
more control over your navigation "route", while the `Link` component is a "HOC"
used to create client-side navigation links. The main difference between them is
their use case: use `useRouter` when you need programmatic navigation or access
to route information, and use the `Link` component to create navigational links
within your application.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[http://localhost:3000/api/hello](http://localhost:3000/api/hello) is an endpoint that uses [Route Handlers](https://beta.nextjs.org/docs/routing/route-handlers). This endpoint can be edited in `app/api/hello/route.ts`.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
