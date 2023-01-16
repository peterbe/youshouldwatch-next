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

format:
    pnpm run prettier:write

tsc:
    pnpm run tsc

lint: pretty tsc
    pnpm run lint

test:
    pnpm dlx playwright test

emulate:
    pnpm run emulate
