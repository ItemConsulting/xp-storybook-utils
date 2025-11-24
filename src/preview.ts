export type { Preview } from "@storybook/server";

declare const process: { env?: { RESOURCES_DIR?: string; APP_NAME?: string } } | undefined;

export const DEFAULT_XP_SERVER_URL = "http://localhost:8080/webapp/no.item.storybook";

export const DEFAULT_XP_SERVER = {
  url: DEFAULT_XP_SERVER_URL,
  params: {
    xpResourcesDirPath: process?.env?.RESOURCES_DIR,
    xpAppName: process?.env?.APP_NAME,
    matchers: JSON.stringify({
      zonedDateTime: /Date$|Time$/i.toString(),
      region: /Region$/i.toString(),
    }),
  },
};

export function createPreviewServerParams(matchers: {
  localDate?: RegExp;
  zonedDateTime?: RegExp;
  localDateTime?: RegExp;
  number?: RegExp;
  region?: RegExp;
}): { matchers: string } {
  const preparedMatchers = Object.keys(matchers).reduce<Record<string, string>>((res, key) => {
    const matcher = matchers[key as keyof typeof matchers];
    if (matcher) {
      res[key] = matcher.toString();
    }
    return res;
  }, {});

  return {
    matchers: JSON.stringify(preparedMatchers),
  };
}
