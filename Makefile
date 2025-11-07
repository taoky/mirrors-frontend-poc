OUTDIR := dist
STATIC := $(OUTDIR)/static
PUBDIR := public
ENTRIES := src/index-csr.tsx src/status.tsx

JSX_FLAGS := --jsx-factory=h --jsx-fragment=Fragment
LOADERS := --loader:.json=json --loader:.woff2=file

COMMON_FLAGS := --bundle --outdir=$(STATIC) --outbase=src \
				--asset-names=assets/[ext]/[name]-[hash] \
				--target=es6 --define:__NODE__=false \
                $(JSX_FLAGS) $(LOADERS)
COMMON_FLAGS_NODE := --bundle --outdir=$(STATIC) --outbase=src \
					 --asset-names=assets/[ext]/[name]-[hash] \
					 --target=node20 --define:__NODE__=true --platform=node \
					 $(JSX_FLAGS) $(LOADERS)
COMMON_FLAGS_HYDRATE := --bundle --outdir=$(STATIC) --outbase=src \
						--asset-names=assets/[ext]/[name]-[hash] \
						--target=es6 --define:__NODE__=true \
                		$(JSX_FLAGS) $(LOADERS)

.PHONY: dev prod clean copy dirs typecheck ssr

dev: copy dirs
	echo "Note: Please manually start a local server to serve the '$(OUTDIR)' directory."
	esbuild $(ENTRIES) $(COMMON_FLAGS) --sourcemap --watch

prod: clean copy dirs typecheck
	esbuild $(ENTRIES) $(COMMON_FLAGS) --minify

ssr:
	@cp -ar $(PUBDIR)/static $(OUTDIR)/
	esbuild src/index-ssr.jsx $(COMMON_FLAGS_NODE)
	esbuild src/index-client.tsx --format=esm $(COMMON_FLAGS_HYDRATE)
	mv $(STATIC)/index-ssr.js $(OUTDIR)/index-ssr.js

copy: $(DIST_FILES)
	@mkdir -p $(STATIC)
	@cp -a $(PUBDIR)/index.html $(OUTDIR)/
	@cp -a $(PUBDIR)/status.html $(OUTDIR)/
	@cp -ar $(PUBDIR)/static $(OUTDIR)/
	@cp -ar $(PUBDIR)/data $(OUTDIR)/

typecheck:
	tsc -p tsconfig.json --noEmit

clean:
	rm -rf $(OUTDIR)
