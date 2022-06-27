function roundHue(hue: number) {
  return hue > 255 ? 255 : hue < 0 ? 0 : hue;
}

export function lightenDarkenColor(color: string, amount: number) {
  let usePound = false;
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);
  let red = roundHue((num >> 16) + amount);
  let blue = roundHue(((num >> 8) & 0x00ff) + amount);
  let green = roundHue((num & 0x0000ff) + amount);
  return (
    (usePound ? "#" : "") + (green | (blue << 8) | (red << 16)).toString(16)
  );
}
