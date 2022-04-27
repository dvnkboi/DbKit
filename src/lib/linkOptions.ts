interface TextOptions {
  text: string;
  fontSize?: string;
  fontColor?: string;
  fontStyle?: string;
  fontWeight?: string;
  padding?: string;
}

interface LinkOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  innerOffsetStart?: number;
  innerOffsetEnd?: number;
  curve?: number,
  updateOnEnd?: boolean;
  opacity?: number;
  dash?: number[];
  linkStartSide?: string;
  linkStartText?: TextOptions;
  linkEndText?: TextOptions;
  linkMidText?: TextOptions;
}

export default LinkOptions;

export {
  TextOptions,
  LinkOptions
};

