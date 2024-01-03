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

export function hideControls(params: Record<string, ControlType>): Record<string, HideArgParam> {
  return Object.entries(params).reduce<Record<string, HideArgParam>>((res, [key, value]) => {
    res[key] = {
      control: {
        type: value,
      },
      table: {
        disable: true,
      },
    };
    return res;
  }, {});
}
