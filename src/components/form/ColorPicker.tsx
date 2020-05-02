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
  const pickrRef = React.useRef<Pickr>();

  React.useEffect(() => {
    // if (disabled) {
    //   return;
    // }

    pickrRef.current = Pickr.create({
      disabled,
      el: divRef.current!,
      theme: "nano",
      default: value,

      swatches: [
        "rgba(244, 67, 54, 1)",
        "rgba(233, 30, 99, 0.95)",
        "rgba(156, 39, 176, 0.9)",
        "rgba(103, 58, 183, 0.85)",
        "rgba(63, 81, 181, 0.8)",
        "rgba(33, 150, 243, 0.75)",
        "rgba(3, 169, 244, 0.7)",
        "rgba(0, 188, 212, 0.7)",
        "rgba(0, 150, 136, 0.75)",
        "rgba(76, 175, 80, 0.8)",
        "rgba(139, 195, 74, 0.85)",
        "rgba(205, 220, 57, 0.9)",
        "rgba(255, 235, 59, 0.95)",
        "rgba(255, 193, 7, 1)",
      ],

      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: false,
          save: true,
        },
      },
    });

    pickrRef.current.on("save", () => {
      onChange(pickrRef.current?.getColor()!.toHEXA().toString());
      pickrRef.current?.hide();
    });
  }, []);

  React.useEffect(() => {
    if (disabled) {
      if (pickrRef.current) {
        pickrRef.current.disable();
      }
    } else {
      if (pickrRef.current) {
        pickrRef.current.enable();
      }
    }
  });

  // if (disabled) {
  //   return (
  //     <span
  //       style={{
  //         backgroundColor: value,
  //         width: "28px",
  //         height: "28px",
  //         borderRadius: "2.1px",
  //       }}
  //     ></span>
  //   );
  // }

  return <div ref={divRef}></div>;
};

export default React.memo(ColorPicker);
