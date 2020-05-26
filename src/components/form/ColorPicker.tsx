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
  const [pickr, setPickr] = React.useState<Pickr | null>(null);

  React.useEffect(() => {
    if (divRef.current && !pickr) {
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

      setPickr(colorPicker);
    }
  }, [value, divRef, pickr]);

  React.useEffect(() => {
    if (pickr) {
      if (disabled) {
        pickr.disable();
      } else {
        pickr.enable();
      }

      pickr.on("save", () => {
        const color = pickr.getColor()!.toHEXA().toString();
        onChange(color);
        pickr.hide();
      });
    }
  }, [pickr, disabled, onChange]);

  return <div ref={divRef}></div>;
};

export default React.memo(ColorPicker);
