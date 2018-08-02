# Next.js blog system

This is a Next.js application which allows universal JavaScript apps with SSR. It's a personal blog system built around the SERN stack featuring all the nifty blog stuff like: authentication, admin permissions, users, comments, posts, categories, and others. Sessions are stored in a Redux store and kept in cookies to protect private routes server-side (no JWT was used in this application).

This is built around the SERN stack (with Bulma as the CSS framework) which means you will require a MySQL sever to run it. Don't forget to create your database and configure the server to connect to it in the /config folder. 

## Running

```
Clone the repo

npm run dev

```