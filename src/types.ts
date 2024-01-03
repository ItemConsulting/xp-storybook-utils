import type { Args } from "@storybook/types";
import type { StoryObj as ServerStoryObj } from "@storybook/server";

export type { Meta } from "@storybook/server";

type DateTimeLike = {
  getDayOfMonth(): number;
};

export type RemoveJavaTypes<TFreemarkerParams> = {
  [Key in keyof TFreemarkerParams]: TFreemarkerParams[Key] extends DateTimeLike | undefined
    ? string
    : TFreemarkerParams[Key];
};

export type StoryObj<TArgs = Args> = ServerStoryObj<RemoveJavaTypes<TArgs>>;
