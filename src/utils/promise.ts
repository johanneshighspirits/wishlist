export const SafePromiseAll = <T>(
  promises: Promise<T>[],
  debug = 'SafePromiseError'
): Promise<T[]> => {
  const result = Promise.allSettled<Promise<T>[]>(promises).then((settled) =>
    settled
      .map((promise) => {
        if (promise.status === 'fulfilled') {
          return promise.value;
        } else {
          console.error(`${debug} ${promise.reason}`);
          return null;
        }
      })
      .filter((w): w is Awaited<T> => w !== null)
  );
  return result;
};
