# You Should Watch

An experimental app to try some new stuff

## The Movie DB

You need an API KEY from
https://developers.themoviedb.org/3/getting-started/introduction

Create a `.env` file that looks like this:

```sh
THEMOVIEDB_API_KEY=a807c9..........
```

## Quickstart

Run:

```sh
pnpm install
pnpm run dev
```

To test, run:

```sh
pnpm run lint
pnpm run build
```

## Running tests

To install the Playwright browsers, if you haven't already done so:

```sh
pnpm dlx playwright install
```

```sh
Inside that directory, you can run several commands:

  pnpm dlx playwright test
    Runs the end-to-end tests.

  pnpm dlx playwright test --project=chromium
    Runs the tests only on Desktop Chrome.

  pnpm dlx playwright test example
    Runs the tests in a specific file.

  pnpm dlx playwright test --debug
    Runs the tests in debug mode.

  pnpm dlx playwright codegen
    Auto generate tests with Codegen.

We suggest that you begin by typing:

    pnpm dlx playwright test

```

To run just a single test, try:

```sh
pnpm dlx playwright test tests/basics.spec.ts:16 --project=chromium
```

## Upgrade pnpm packages

Just run:

```sh
pnpm up -i --latest
```
