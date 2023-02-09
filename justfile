# https://github.com/casey/just
# https://just.systems/

dev:
    pnpm run dev

dev-without-emulation:
    NEXT_PUBLIC_EMULATE_FIREBASE=false pnpm run dev

build:
    pnpm run build

start: build
    pnpm run start

start-without-emulation:
    NEXT_PUBLIC_EMULATE_FIREBASE=false pnpm run build
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
    pnpm dlx playwright test --project="Google Chrome"

emulate:
    pnpm run emulate


upgrade:
    pnpm install
    pnpm up -i --latest

playwright-codegen:
    pnpm dlx playwright codegen
