import type { Parameters } from "@storybook/server";

export type { Preview } from "@storybook/server";

export function createPreviewServerParams(matchers: {
  localDate?: RegExp;
  zonedDateTime?: RegExp;
  localDateTime?: RegExp;
  number?: RegExp;
  region?: RegExp;
}): Parameters {
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
