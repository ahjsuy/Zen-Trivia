# Zen Trivia

## Introduction

This is a Trivia Web App that supports both singleplayer and multiplayer. I'm currently working on hosting it on Firebase, but it is available right now to be locally hosted. All trivia questions are sourced from [The Trivia API](https://the-trivia-api.com/).

## Prerequisites

To host this locally, you must first have React + Vite to launch the front end and ExpressJS, http to launch the backend server.

## Step 1 - Enable CORS

You need to change three lines of code to make sure the frontend and backend servers can communicate effectively. Replace the links in each with where your frontend, backend are going to be launched.

In server.ts

```
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client origin
    methods: ["GET", "POST"],
  },
});
```

In SocketContext.tsx

```
  const socket = useMemo(() => io("http://localhost:4000"), []); // Replace with your server origin

```

In vite.config.ts

```
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:4000", // Replace with your server origin
        ws: true,
      },
    },
  },
});
```

## Step 1 — Launch the ExpressJS server.

Locate the Zen Trivia directory and run this command in the terminal.

```line_numbers,js
npm run server
```

---

## Step 2 — Launch the React server.

Wait a few seconds for the express server to launch. Once it is up, open up another terminal in the Zen Trivia directory and run this command to launch the front end.

```line_numbers,js
npm run dev
```

## Contact Me

Feel free to contact me at angelinasuy3@gmail.com for any bug reports or suggestions!
