---
"@itemconsulting/xp-storybook-utils": major
---

Stop sending `xpResourcesDirPath`

The Enonic XP storybook app reads templates out of an installed application rather than from a
directory the browser names, so the parameter is gone. `xpAppName`, which the framework already
derives from `appName` in gradle.properties, is what identifies the project now.

Requires xp-storybook 3.0 and `@itemconsulting/storybook-framework-enonic-xp` 1.0; no version of
either works across the change.
