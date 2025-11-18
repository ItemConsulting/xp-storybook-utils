import type { Args } from "@storybook/server/dist";
import type { StoryObj as ServerStoryObj } from "@storybook/server/dist";

export type { Meta } from "@storybook/server/dist";

type DateTimeLike = {
  getDayOfMonth(): number;
};

type RegionLike = {
  name: string;
  components: unknown[];
};

type SimpleRegion = {
  name?: string;
  components?: (SimplePartComponent | SimpleLayoutComponent)[];
};

type SimplePartComponent = {
  descriptor: string;
  path: string;
  type?: "part";
  config?: unknown;
};
type SimpleLayoutComponent = {
  descriptor: string;
  path: string;
  type?: "layout";
  config?: unknown;
  regions?: Record<string, SimpleRegion>;
};

export type RemoveJavaTypes<TFreemarkerParams> = {
  [Key in keyof TFreemarkerParams]: TFreemarkerParams[Key] extends DateTimeLike | undefined
    ? string
    : TFreemarkerParams[Key];
};

export type SimplifyRegion<TFreemarkerParams> = {
  [Key in keyof TFreemarkerParams]: TFreemarkerParams[Key] extends RegionLike | undefined
    ? SimpleRegion
    : TFreemarkerParams[Key];
};

export type StoryObj<TArgs = Args> = ServerStoryObj<RemoveJavaTypes<SimplifyRegion<TArgs>>>;
