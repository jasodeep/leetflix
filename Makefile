.DEFAULT_GOAL := check

.PHONY: dev test lint typecheck format check build start

dev:
	npm run dev

test:
	npm test

lint:
	npm run lint

typecheck:
	npm run typecheck

format:
	npm run format

check:
	npm run check

build:
	npm run build

start:
	npm start
