.PHONY: clean logs prodlogs

bundle.js: $(wildcard ./src/*)
	deno bundle --import-map=import_map.json src/index.ts $@

stage: bundle.js
	wrangler publish -e staging

deploy: bundle.js
	wrangler publish -e production

logs:
	wrangler tail -e staging

prodlogs:
	wrangler tail -e production

clean:
	rm bundle.js
