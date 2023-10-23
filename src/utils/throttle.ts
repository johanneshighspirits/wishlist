export const throttle = (callback: Function, ms: number) => {
  let timer: NodeJS.Timeout;
  let isThrottled = false;
  return () => {
    if (!isThrottled) {
      callback();
    }
    isThrottled = true;
    timer = setTimeout(() => {
      clearTimeout(timer);
      isThrottled = false;
    }, ms);
  };
};
