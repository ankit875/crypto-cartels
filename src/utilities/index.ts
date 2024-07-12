export { showToast } from "./ToastUtil";
export { Cycled } from "./Cycled";

export function curry(inputFunction: any) {
  return function curried(...args) {
    if (args.length >= inputFunction.length) {
      return inputFunction.apply(this, args);
    }
    return (...args2) => curried.apply(this, args.concat(args2));
  };
}
