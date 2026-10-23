# @itemconsulting/xp-storybook-utils

## 1.0.0

### Major Changes

- 1e1b06d: Stop sending `xpResourcesDirPath`

  The Enonic XP storybook app reads templates out of an installed application rather than from a
  directory the browser names, so the parameter is gone. `xpAppName`, which the framework already
  derives from `appName` in gradle.properties, is what identifies the project now.

  Requires xp-storybook 3.0 and `@itemconsulting/storybook-framework-enonic-xp` 1.0; no version of
  either works across the change.

- 1e1b06d: Point `DEFAULT_XP_SERVER_URL` at the new Universal API endpoint.

  `xp-storybook` 2.0 moves the rendering endpoint from a webapp to an XP 8
  [Universal API](https://developer.enonic.com/docs/code/stable/web/apis):

  ```diff
  -http://localhost:8080/webapp/no.item.storybook
  +http://localhost:8080/api/no.item.storybook:preview
  ```

  Migration: upgrade the `xp-storybook` application in your sandbox to 2.0 or later. If you set
  `parameters.server.url` yourself instead of using `DEFAULT_XP_SERVER`, update it to the new URL.
  If you route through vhosts, replace the `mapping.webapp.*` block with `mapping.api.*`.

  The app no longer reads `no.item.storybook.cfg` at all — it renders only when XP runs in
  development mode, which `enonic sandbox start` does by default. Delete that file; everything the
  renderer needs now comes from the request, and `DEFAULT_XP_SERVER` supplies it.

### Minor Changes

- 1e1b06d: Remove the bundled `global.d.ts` ambient template-module declarations (`*.ftl`,
  `*.ftlh`, `*.ftlx`, `*.html`). These now live in
  [`@itemconsulting/storybook-framework-enonic-xp`](https://github.com/ItemConsulting/storybook-framework-enonic-xp),
  next to the Vite plugin that produces the behaviour.

  Migration: replace `"@itemconsulting/xp-storybook-utils/global"` in your
  `tsconfig.json` `compilerOptions.types` with
  `"@itemconsulting/storybook-framework-enonic-xp"`.

### Patch Changes

- 1e1b06d: Omit `xpAppName` from `DEFAULT_XP_SERVER.params` when `APP_NAME` is unset.

  `URLSearchParams` stringifies an undefined value to the literal `"undefined"`, so an unset
  `APP_NAME` produced `?xpAppName=undefined&…`. The server saw a parameter that was present but
  meaningless and failed looking for an application called `undefined`, instead of reporting a
  missing parameter.

## 0.3.0

### Minor Changes

- 00dbded: Use moduleResolution=bundler in tsconfig.json
- 2d0238c: Expose DEFAULT_XP_SERVER constant that can be used to configure Storybook in most XP-projects

## 0.2.0

### Minor Changes

- 52c8936: Upgrade dependencies to Storybook 10

## 0.1.0

### Minor Changes

- 1b438af: Add types for ftlh and ftlx files
- a726466: Support java type "localDate".
- 233ab91: Upgrade dependency to Storybook 9
