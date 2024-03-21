type ControlType =
  | "boolean"
  | "number"
  | "range"
  | "object"
  | "file"
  | "radio"
  | "inline-radio"
  | "check"
  | "inline-check"
  | "select"
  | "multi-select"
  | "text"
  | "color"
  | "date";

type HideArgParam = {
  control: {
    type: ControlType;
  };
  table: {
    disable: boolean;
  };
};

export const HIDE_OBJECT_CONTROL: HideArgParam = {
  control: {
    type: "object",
  },
  table: {
    disable: true,
  },
};

export function hideControls(params: Record<string, ControlType>): Record<string, HideArgParam> {
  return Object.entries(params).reduce<Record<string, HideArgParam>>((res, [key, type]) => {
    res[key] = hideControl(type);
    return res;
  }, {});
}

export function hideControl(type: ControlType = "object"): HideArgParam {
  return {
    control: {
      type,
    },
    table: {
      disable: true,
    },
  };
}
