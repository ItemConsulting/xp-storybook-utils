import type { ComponentDescriptor } from "@enonic-types/core";
import type { Parameters } from "@storybook/server";

export type RenderOnServerParams = {
  layout?: "padded" | "fullscreen" | "centered";
  javaTypes?: Record<string, "string" | "zonedDateTime" | "localDateTime" | "number" | "region">;
  template?: string;
  id?: string;

  [key: ComponentDescriptor]: string | { template: string };
};

export function renderOnServer(params: RenderOnServerParams | string): Parameters {
  if (typeof params === "string") {
    return {
      server: {
        params: {
          template: params,
        },
      },
    };
  }

  const { layout, id, ...serverParams } = params;

  return {
    layout: layout ?? "padded",
    server: {
      id,
      params: Object.keys(serverParams).reduce<Record<string, string>>((res, key) => {
        const value = serverParams[key as ComponentDescriptor];
        res[key] = typeof value === "string" ? value : JSON.stringify(value);
        return res;
      }, {}),
    },
  };
}
