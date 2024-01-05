import type { ComponentDescriptor } from "@enonic-types/core";
import type { Parameters } from "@storybook/server";

export type RenderOnServerParams = {
  layout?: "padded" | "fullscreen" | "centered";
  javaTypes?: Record<string, "string" | "zonedDateTime" | "localDateTime" | "number" | "region">;
  template?: string;
  view?: string;
  filePath?: string;

  [key: ComponentDescriptor]: string;
};

const FILE_PATH_HASH_PARAM = "?hash=";

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

  const { javaTypes, layout, view, ...serverParams } = params;

  const result: Record<string, string> = serverParams;
  const filePath = serverParams.filePath ?? view;

  if (filePath) {
    result.filePath = cleanFilePath(filePath);
  }

  if (javaTypes) {
    result.javaTypes = JSON.stringify(javaTypes);
  }

  Object.keys(params)
    .filter(isComponentDescriptor)
    .forEach((componentDescriptor) => {
      const value = params[componentDescriptor];
      serverParams[componentDescriptor] = JSON.stringify(
        isFilePath(value)
          ? {
              filePath: cleanFilePath(value),
            }
          : {
              template: value,
              filePath: params.view ? cleanFilePath(params.view) : undefined,
            },
      );
    });

  return {
    layout: layout ?? "padded",
    server: {
      params: serverParams,
    },
  };
}

function isFilePath(value: string): boolean {
  return value.includes(FILE_PATH_HASH_PARAM);
}

function isComponentDescriptor(str: String): str is ComponentDescriptor {
  return str.indexOf(":") !== -1;
}

function cleanFilePath(filePath: string): string {
  const index = filePath.indexOf("?");

  return index === -1 ? filePath : filePath.substring(0, index);
}
