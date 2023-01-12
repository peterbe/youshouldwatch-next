# https://github.com/casey/just
# https://just.systems/

dev:
    pnpm run dev

build:
    pnpm run build

start: build
    pnpm run start

pretty:
    pnpm run prettier:check

lint: pretty
    pnpm run lint

headlesstest:
    pnpm dlx playwright test
