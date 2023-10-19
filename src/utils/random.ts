export const randomRadialGradient = (maxColors: number) => {
  const x = Math.round(Math.random() * 100);
  const y = Math.round(Math.random() * 100);
  const nrOfColors = Math.ceil(Math.random() * maxColors) + 1;
  const hues = Array.from({ length: nrOfColors }, () =>
    Math.round(Math.random() * 360)
  );
  const colors = hues.map((hue, i) => {
    const point = i / (nrOfColors - 1);
    return `hsl(${hue} 40% 40% / 0.3) ${Math.round(point * 100)}%`;
  });
  return `radial-gradient(farthest-corner at ${x}% ${y}%, ${colors.join(
    ', '
  )})`;
};
