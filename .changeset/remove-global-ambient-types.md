---
"@itemconsulting/xp-storybook-utils": minor
---

Remove the bundled `global.d.ts` ambient template-module declarations (`*.ftl`,
`*.ftlh`, `*.ftlx`, `*.html`). These now live in
[`@itemconsulting/storybook-framework-enonic-xp`](https://github.com/ItemConsulting/storybook-framework-enonic-xp),
next to the Vite plugin that produces the behaviour.

Migration: replace `"@itemconsulting/xp-storybook-utils/global"` in your
`tsconfig.json` `compilerOptions.types` with
`"@itemconsulting/storybook-framework-enonic-xp"`.
