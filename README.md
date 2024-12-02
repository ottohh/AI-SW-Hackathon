# AgriMarket

AgriMarket is an agriculture data marketplace that follows Dublin Core standards.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), you can start a development server:

```bash
npm run dev
```

To start the server and open the app in a new browser tab:

```bash
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Database Management

To start the database:

```bash
npm run db:start
```

To push database changes:

```bash
npm run db:push
```

To run database migrations:

```bash
npm run db:migrate
```

To open the database studio:

```bash
npm run db:studio
```

## Checking

To run type checks:

```bash
npm run check
```

To run type checks in watch mode:

```bash
npm run check:watch
```