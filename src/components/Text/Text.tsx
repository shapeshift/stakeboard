import type { TextProps } from "@chakra-ui/react";
import { forwardRef, Text as CText } from "@chakra-ui/react";
import type Polyglot from "node-polyglot";

export type TextPropTypes = TextProps & {
  translation: string | null | [string, number | Polyglot.InterpolationOptions];
};

export const RawText = forwardRef<TextProps, "p">((props, ref) => {
  return <CText ref={ref} {...props} />;
});

export const Text = forwardRef<TextPropTypes, "p">((props, ref) => {

  if (Array.isArray(props.translation)) {
    return <CText {...props} ref={ref} />;
  }

  return <CText {...props} ref={ref} />;
});
