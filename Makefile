OUTDIR := dist
STATIC := $(OUTDIR)/static
PUBDIR := public
ENTRIES := src/index.tsx

JSX_FLAGS := --jsx-factory=h --jsx-fragment=Fragment
LOADERS := --loader:.json=json --loader:.woff2=file

COMMON_FLAGS := --bundle --outdir=$(STATIC) --outbase=src \
				--asset-names=assets/[ext]/[name]-[hash] \
                $(JSX_FLAGS) $(LOADERS)

.PHONY: dev prod clean copy dirs typecheck

dev: copy dirs
	echo "Note: Please manually start a local server to serve the '$(OUTDIR)' directory."
	esbuild $(ENTRIES) $(COMMON_FLAGS) --sourcemap --watch

prod: clean copy dirs typecheck
	esbuild $(ENTRIES) $(COMMON_FLAGS) --minify

copy: $(DIST_FILES)
	@mkdir -p $(STATIC)
	@cp -a $(PUBDIR)/index.html $(OUTDIR)/
	@cp -ar $(PUBDIR)/static $(OUTDIR)/

typecheck:
	tsc -p tsconfig.json --noEmit

clean:
	rm -rf $(OUTDIR)
