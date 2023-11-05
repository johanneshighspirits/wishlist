export const cropImageSize = (
  img: { width: number; height: number },
  options: { width: number; height: number }
) => {
  const isInputLandscape = img.width > img.height;
  const isOutputLandscape = options.width > options.height;

  const croppedWidth = isInputLandscape
    ? img.width * (options.height / img.height)
    : options.width;
  const croppedHeight = isInputLandscape
    ? options.height
    : img.height * (options.width / img.width);

  const x = (options.width - croppedWidth) / 2;
  const y = (options.height - croppedHeight) / 2;
  return {
    x,
    y,
    width: croppedWidth,
    height: croppedHeight,
  };
};
