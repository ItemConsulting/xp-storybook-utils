---
"@itemconsulting/xp-storybook-utils": patch
---

Omit `xpAppName` from `DEFAULT_XP_SERVER.params` when `APP_NAME` is unset.

`URLSearchParams` stringifies an undefined value to the literal `"undefined"`, so an unset
`APP_NAME` produced `?xpAppName=undefined&…`. The server saw a parameter that was present but
meaningless and failed looking for an application called `undefined`, instead of reporting a
missing parameter.
