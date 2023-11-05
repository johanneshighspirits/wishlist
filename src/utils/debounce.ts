export const debounce = (callback: Function, ms: number) => {
  let timer: NodeJS.Timeout;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      clearTimeout(timer);
      callback();
    }, ms);
  };
};
