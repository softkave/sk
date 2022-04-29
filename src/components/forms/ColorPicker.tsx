import React from "react";

// TODO: Nano uses css-grid thus it won't work in older browsers.
import "@simonwep/pickr/dist/themes/nano.min.css"; // 'nano' theme

// Modern or es5 bundle (pay attention to the note below!)
import Pickr from "@simonwep/pickr";

export interface IColorPickerProps {
  onChange: (value: string) => void;
  disabled?: boolean;
  value?: string;
}

const ColorPicker: React.FC<IColorPickerProps> = (props) => {
  const { value, onChange, disabled } = props;
  const divRef = React.createRef<HTMLDivElement>();
  const pickr = React.useRef<Pickr | null>(null);
  const toggleDisabled = React.useCallback(() => {
    if (pickr.current) {
      if (disabled) {
        pickr.current.disable();
      } else {
        pickr.current.enable();
      }
    }
  }, [disabled]);

  React.useEffect(() => {
    if (divRef.current && !pickr.current) {
      const colorPicker = Pickr.create({
        el: divRef.current,
        theme: "nano",
        default: value,

        swatches: [
          "rgb(244, 67, 54)",
          "rgb(233, 30, 99)",
          "rgb(156, 39, 176)",
          "rgb(103, 58, 183)",
          "rgb(63, 81, 181)",
          "rgb(33, 150, 243)",
          "rgb(3, 169, 244)",
          "rgb(0, 188, 212)",
          "rgb(0, 150, 136)",
          "rgb(76, 175, 80)",
          "rgb(139, 195, 74)",
          "rgb(205, 220, 57)",
          "rgb(255, 235, 59)",
          "rgb(255, 193, 7)",
        ],

        components: {
          // Main components
          preview: true,
          // opacity: true,
          hue: true,

          // Input / output Options
          interaction: {
            hex: true,
            rgba: true,
            // hsla: true,
            // hsva: true,
            // cmyk: true,
            input: true,
            clear: false,
            save: true,
          },
        },
      });

      pickr.current = colorPicker;
      toggleDisabled();
    }
  }, [value, divRef, toggleDisabled]);

  const internalOnChange = React.useCallback(() => {
    if (pickr.current) {
      const color = pickr.current.getColor()!.toHEXA().toString();
      pickr.current.hide();

      if (color !== value) {
        onChange(color);
      }
    }
  }, [onChange, value]);

  React.useEffect(() => {
    if (pickr.current) {
      toggleDisabled();
      pickr.current.on("save", internalOnChange);
    }

    return () => {
      if (pickr.current) {
        pickr.current.off("save", internalOnChange);
      }
    };
  }, [disabled, pickr, internalOnChange]);

  return <div ref={divRef}></div>;
};

export default React.memo(ColorPicker);
