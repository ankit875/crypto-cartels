/* eslint-disable @typescript-eslint/no-explicit-any */
export { showToast } from "./ToastUtil";
export { Cycled } from "./Cycled";

export function curry(inputFunction:any) {
  return function curried(this: any, ...args:any) {
    if (args.length >= inputFunction.length) {
      return inputFunction.apply(this, args);
    }
    return (...args2:any) => curried.apply(this, args.concat(args2));
  };
}
