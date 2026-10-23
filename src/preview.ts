export type { Preview } from "@storybook/server";

declare const process: { env?: { APP_NAME?: string } } | undefined;

export const DEFAULT_XP_SERVER_URL = "http://localhost:8080/api/no.item.storybook:preview";

export const DEFAULT_XP_SERVER = {
  url: DEFAULT_XP_SERVER_URL,
  params: {
    // Only send this when it is actually set. URLSearchParams stringifies an undefined value to the
    // literal "undefined", which the server would then treat as a real application name — and its
    // "missing xpAppName" error says more than a lookup of an application called "undefined" would.
    ...(process?.env?.APP_NAME && { xpAppName: process.env.APP_NAME }),
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
