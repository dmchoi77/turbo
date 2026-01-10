import { cloneDeep } from "lodash";



/**
 * 두 숫자를 곱하는 함수
 * @param a - 첫 번째 숫자
 * @param b - 두 번째 숫자
 * @returns 두 숫자의 곱
 */
export const multiply = (a: number, b: number): number => {
  return a * b;
};

/**
 * lodash.cloneDeep을 사용하여 객체를 깊은 복사하는 함수
 * @param obj - 복사할 객체
 * @returns 깊은 복사된 새로운 객체
 */
export const deepCloneObject = <T>(obj: T): T => {
  return cloneDeep(obj);
};
