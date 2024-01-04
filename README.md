# Utilities for Storybook Server integration with Enonic XP

Helper library for using Storybook with Enonic XP. This library helps you prepare the data from your stories before 
sending it to the [Storybook XP-application](https://github.com/ItemConsulting/xp-storybook/).

The XP-Storybook-app helps you test your [Freemarker-templates](https://market.enonic.com/vendors/tineikt/freemarker-xp-library), 
your **CSS** and your **frontend JavaScript**. It does not help you test any serverside JavaScript!

You can mount the templates for your Parts, Layouts and Pages to create stories. Or you can use inline templates which
can import [Freemarker Macros](https://freemarker.apache.org/docs/ref_directive_macro.html) to create stories for 
individual components/partial-templates.

[![npm version](https://badge.fury.io/js/@itemconsulting%2Fxp-storybook-utils.svg)](https://badge.fury.io/js/@itemconsulting%2Fxp-storybook-utils)

## Installation

1. Install the [xp-storybook](https://github.com/ItemConsulting/xp-storybook)-application in your local XP sandbox.
2. Install [Storybook-server](https://github.com/storybookjs/storybook/tree/next/code/renderers/server) in your XP-project
   ```bash
   npx storybook@latest init --type server
   rm -r src/stories
   ```
3. Install this package and [preset-enonic-xp](https://github.com/ItemConsulting/preset-enonic-xp).
   ```bash
   npm i --save-dev @itemconsulting/xp-storybook-utils @itemconsulting/preset-enonic-xp
   ```
4. Add _preset-enonic-xp_ to `addons` in *.storybook/main.ts*
   ```diff
   import type { StorybookConfig } from "@storybook/server-webpack5";
   const config: StorybookConfig = {
     addons: [
       "@storybook/addon-links", 
       "@storybook/addon-essentials",
   +   "@itemconsulting/preset-enonic-xp"
     ],
   };
   export default config;
   ```

### Create an environment file

You should create an [environment file](https://storybook.js.org/docs/configure/environment-variables) named _.env_ in 
the root directory of your project. You need to configure the path to the service exposed by the Storybook XP-application 
with the `STORYBOOK_SERVER_URL` variable.

```dotenv
STORYBOOK_SERVER_URL=http://localhost:8080/_/service/no.item.storybook/freemarker-preview
```

> [!TIP]
> You can add the _.env_ file to your _.gitignore_ file, so that each developer can have their own local setup

### Configuring the preview

In _.storybook/preview.{ts,js}_ we can create a configuration common for all stories.

You must provide Storybook with the `url` of the XP-service that can be used for server-rendering. We recommend using
the environment variable in `process.env.STORYBOOK_SERVER_URL` configured in the previous chapter.

And you can also (optionally) use `createPreviewServerParams()` to set up naming conventions that will ensure that 
[`args`](https://storybook.js.org/docs/writing-stories/args) are automatically deserialized into correct Java-classes 
serverside. 

It takes an `object` where the key is the _data-type-name_ (see the chapter _Keys and their corresponding Java-class_) 
and value is a regex that will be run on keys of the `args` from your stories.

```typescript
import { createPreviewServerParams, type Preview } from "@itemconsulting/xp-storybook-utils";

if(!process.env.STORYBOOK_SERVER_URL) {
  throw Error(
    `Create a file named ".env" with "STORYBOOK_SERVER_URL". Then restart storybook.`
  );
}

const preview: Preview = {
  parameters: {
    server: {
      url: process.env.STORYBOOK_SERVER_URL,
      params: createPreviewServerParams({
        zonedDateTime: /Date$/,
        region: /Region$/i
      })
    },
    controls: {
      matchers: {
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

In this example we are telling the XP-application that we want all arg keys that **end with** `"Date"` to be parsed as
`java.time.ZonedDateTime` before being passed to the template. We are also saying that every arg key that ends with
`"Region"` should be treated as a `com.enonic.xp.region.Region`.

> [!TIP]
> We recommend the wonderful [lib-time](https://github.com/ItemConsulting/lib-xp-time) if you need to work with dates in Enonic XP-projects.

## Stories

### File structure

We prefer to have our _stories.{ts,js}_-files together with the XP-components they are previewing.

<pre>
./src/main/resources/site/
├── pages/
│   └── default/
│       ├── default.css
│       ├── default.ftl
│       ├── default.stories.ts
│       ├── default.ts
│       └── default.xml
└── parts/
    └── article-header/
        ├── article-header.css
        ├── article-header.ftl
        ├── article-header.stories.ts
        ├── article-header.ts
        └── article-header.xml
</pre>

> [!IMPORTANT]  
> Enonic XP and Storybook are **not running in the same environment** (even if they share the same file structure). 
> XP-controllers are running on Nashorn JS, and Storybook is running in NodeJS. 
> 
> You can not import _{js,ts}_-files between these environments. But they can have shared _{js,ts}_-dependencies that
> doesn't depend on 3rd-party imports.

### Story for a part

```typescript
import view from "./article-header.ftl"; // 1
import { renderOnServer, type Meta, type StoryObj } from "@itemconsulting/xp-storybook-utils";
import "./article-header.css"; // 2

type FreemarkerParams = {
  displayName: string;
  intro?: string;
  publishedDate?: ZonedDateTime;
  locale: string;
}

const meta: Meta<FreemarkerParams> = {
  title: "Part/Article Header",
  parameters: renderOnServer({
    layout: "centered", // 3
    view, // 4
  }),
};

export default meta;

export const articleHeader: StoryObj<FreemarkerParams> = { // 5
  name: "Article Header",
  args: {
    displayName: "This is a typical title of a blog article",
    intro: "The intro can be relevant some times. It happens that some editors write a whole article here.",
    publishedDate: "2023-05-23T10:41:37.212Z", // 6
    locale: "en"
  },
};
```

1. We import the template-file we want to test in the story. The addon [preset-enonic-xp](https://github.com/ItemConsulting/preset-enonic-xp)
   provides support for __*.ftl__-files. The value of `view` is your local path on disk to ftl-file
2. We can import css-files used by the story
3. It's possible to change Storybooks layout (legal values are: `"padded"` (default), `"fullscreen"`, `"centered"`).
4. We pass in the `view` to tell the _xp-storybook_-app which local file it should use to render the story.
5. When we create a story object we can pass in a type that defines the shape of data the ftl-file expects. If you are
   writing your controller in TypeScript, you can use this type both in the controller and the story.
6. If _preview.ts_ is configured like above `publishedDate` will give a date picker-input in Storybook, but be parsed
   into a `java.time.ZonedDateTime` serverside before being passed into the ftl-file. This is because `publishedDate` ends
   with the word `Date` which triggers the regex' in preview.ts.

### Story for a partial template

```typescript
import view from "./accordion.ftl";
import { renderOnServer, type Meta, type StoryObj } from "@itemconsulting/xp-storybook-utils";
import "./accordion.css";

type FreemarkerParams = {
  id: string;
  items: {
    title: string;
    body: string;
  }[];
};

const meta: Meta<FreemarkerParams> = {
  title: "Component/Accordion",
  parameters: renderOnServer({
    template: `
      [#import "/site/views/partials/accordion/accordion.ftl" as a]
      [@a.accordion id=id items=items /]
    `, // 1
    view, // 2
  }),
};

export default meta;

export const Accordion: StoryObj<FreemarkerParams> = {
  args: {
    id: "my-accordion-part",
    items: [
      {
        title: "First accordion",
        text: "This is my first test",
      },
      {
        title: "Second accordion",
        text: "This is my second test",
      },
    ],
  },
};
```

1. When rendering a partial template (in this example a Freemarker Macro named `accordion`), we can't pass the parameters
   into the view directly – because that would be like having a function that is never called.
   We can instead define an **inline template** using the `template` property. This _inline template_ can import the macro 
   we want to test and call it with the correct parameters.
2. We are still passing in the `view`, because it is used to locate the file (with the macro) on your local machine.

### Story for a layout or page

It is possible to create composite stories where _pages_ or _layouts_ display _parts_ inside.

This can even be used to compose a story containing an entire page, as it would look deployed in Enonic XP.

```typescript
import { renderOnServer, hideControls, type Meta, type StoryObj } from "@itemconsulting/xp-storybook-utils";
import view from "./default.ftl";
import layout1ColView from "../../layouts/layout-1-col/layout-1-col.ftl";
import articleHeaderView from "../../parts/article-header/article-header.ftl";
import { articleHeader } from "../../parts/article-header/article-header.stories"; // 1
import "../../../assets/styles/main.css";

const meta: Meta = {
  title: "Page/Article",
  argTypes: {
    ...hideControls({ // 2
      id: "text",
      headerMenu: "object",
      homeUrl: "text",
      searchUrl: "text",
      themeColor: "color",
    }),
  },
  parameters: renderOnServer({
    layout: "fullscreen",
    view,
    "com.example:layout-1-col": layout1ColView, // 3
    "com.example:article-header": articleHeaderView,
    "com.example:echo": "<h2>${title}</h2>", // 4
  }),
};

export default meta;

export const Article: StoryObj = {
  args: {
    displayName: "My article page",
    id: "4e34b299-85ef-4684-b941-03ac83aa385e",
    homeUrl: "#",
    headerMenu: {
      menuItems: [],
    },
    themeColor: "#ebfffb",
    searchUrl: "#",
    headerRegion: { // 5
      name: "header",
      components: [
        {
          type: "layout",
          descriptor: "com.example:layout-1-col",
          path: "/header/0",
          config: {
            containerClass: "container-l",
            mainRegion: {
              name: "main",
              components: [
                {
                  type: "part",
                  descriptor: "com.example:article-header",
                  path: "/header/0/main/0",
                  config: articleHeader.args,
                },
              ],
            },
          },
          regions: {},
        },
      ],
    },
    mainRegion: {
      name: "main",
      components: [
        {
          type: "layout",
          descriptor: "com.example:layout-1-col",
          path: "/main/0",
          config: {
            containerClass: "container-m",
            mainRegion: {
              name: "main",
              components: [
                {
                  type: "part",
                  descriptor: "com.example:echo", // 6
                  path: "/main/0/main/0",
                  config: {
                    title: "Echo this title"
                  },
                },
              ],
            },
          },
          regions: {},
        },
      ],
    },
  },
};
```

1. We can import other stories to reuse their `args`
2. The `hideControls()` utility function lets us remove noisy Storybook controls that doesn't provide any value to the
   tester. You must still specify the type of control it would have been, to ensure that the data is still serialized
   correctly when sent to the server as part of the data model.
3. We can specify more named views that can be used to render components inside the _page_ or _layout_.
4. Named views can also be _inline templates_ (instead of imported views)
5. In the _preview.ts_-file above we specified that args that ends with `"Region"` should be handled as a 
   `com.enonic.xp.region.Region` by the renderer on the server. The server will render the views named by `descriptor` 
   with `config` as its data, and populate this _region_ in the parent view.
6. Inline templates are rendered using `config` as data in the same way.

## Java Types

Since all the `args` are sent to the server as query parameters their type can be lost on the way. If you need to 
ensure that an `arg` is deserialized to the correct Java class you can use the `javaTypes` field to specify which class
a string version of this value should be deserialized into.

This is a more fine-grained version of the same mechanism use in `createPreviewServerParams()`.  

```typescript
import view from "./timeline.ftl";
import { renderOnServer, type Meta, type StoryObj } from "@itemconsulting/storybook-xp";

type FreemarkerParams = {
  startYear: number;
  endYear: number;
}

const meta: Meta<FreemarkerParams> = {
  title: "Part/Timeline",
  parameters: renderOnServer({
    view,
    javaTypes: { // 1
      startYear: "number",
      endYear: "number",
    },
  }),
};
export default meta;

export const standardMeasureList: StoryObj<FreemarkerParams> = {
  name: "Standard measure list",
  args: {
    title: "This is a timeline",
    startYear: 2018,
    endYear: 2023,
  },
};
```
1. We can explicitly specify which Java-classes the value of an `arg` should be deserialized as using the `javaTypes`-property.

### Keys and their corresponding Java-class

| Key               | Java type                     |
|-------------------|-------------------------------|
| `"zonedDateTime"` | `java.time.ZonedDateTime`     |
| `"localDateTime"` | `java.time.LocalDateTime`     |
| `"number"`        | `java.lang.Integer`           |
| `"region"`        | `com.enonic.xp.region.Region` |
| `"string"`        | `java.lang.String`            |

## Building

To build he project run the following command

```bash
npm run build
```
