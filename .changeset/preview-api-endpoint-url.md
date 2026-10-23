---
"@itemconsulting/xp-storybook-utils": major
---

Point `DEFAULT_XP_SERVER_URL` at the new Universal API endpoint.

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
