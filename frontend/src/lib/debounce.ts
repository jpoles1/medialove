type Procedure = (...args: any[]) => void;

/**
 * Debounces a function to limit the rate at which it is called.
 * @param fn The function to debounce.
 * @param delay The delay in milliseconds before invoking the debounced function (timer is reset each time the debounced function is invoked).
 * @param refractory The duration in milliseconds where the function is blocked after it has been invoked.
 * @returns A debounced version of the original function.
 */
export const debounce = <F extends (...args: any[]) => any>(fn: F, delay: number, refractory: number) => {
  let timer: NodeJS.Timeout;
  let refractoryTimer: NodeJS.Timeout;
  let inRefractoryPeriod = false;
  return (...args: Parameters<F>) => {
    if (inRefractoryPeriod) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      inRefractoryPeriod = true;
      refractoryTimer = setTimeout(() => inRefractoryPeriod = false, refractory);
    }, delay);
  };
};
