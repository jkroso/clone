
REPORTER = dot

all: test test/built.js

test:
	@./node_modules/.bin/mocha test/*.test.js \
		--reporter $(REPORTER) \
		--bail

test/built.js: index.js acyclic.js create.js test/*
	@node_modules/.bin/sourcegraph test/browser.js \
		--plugins mocha,nodeish \
		| node_modules/.bin/bigfile \
			--export null \
			--plugins nodeish > $@

.PHONY: test
