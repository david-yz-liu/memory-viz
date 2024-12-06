# MemoryViz Documentation Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

The commands described in this README assume your current working directory is `memory-viz/docs`.
You can instead run them in the root project directory by adding the argument `--workspace=docs`.

## Local Development

```console
$ npm start
```

This command starts a local development server and opens up a browser window.
Most changes are reflected live without having to restart the server.

## Build

```console
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```console
$ USE_SSH=true npm run deploy
```

Not using SSH:

```console
$ GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
