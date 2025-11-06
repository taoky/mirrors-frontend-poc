# Mirrors Frontend PoC

A proof of concept frontend that uses no frameworks and could build with everything from Debian official packages.

Modified from <https://git.lug.ustc.edu.cn/mirrors/mirrors-index/>.

## TODO

- [x] Status page

## Dependency Requirements

- esbuild (<https://packages.debian.org/trixie/esbuild>)
- typescript (<https://packages.debian.org/trixie/node-typescript>)

## Build Instructions

Type check:

```sh
make typecheck
```

Development build (You need to start HTTP server yourself):

```sh
make dev
```

Production build:

```sh
make prod
```
