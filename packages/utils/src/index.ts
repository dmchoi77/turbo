// Import from @repo/core for use within this file
import { multiply } from '@repo/core';
import moment from 'moment';
import _ from 'lodash';

// Re-export all exports from @repo/core for downstream consumers
export * from '@repo/core';

/**
 * 두 숫자를 더하는 함수
 * @param a - 첫 번째 숫자
 * @param b - 두 번째 숫자
 * @returns 두 숫자의 합
 */
export const sum = (a: number, b: number): number => {
  return a + b;
};

/**
 * 문자열의 첫 글자를 대문자로 변경하는 함수
 * @param str - 입력 문자열
 * @returns 첫 글자가 대문자로 변환된 문자열
 */
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * 두 숫자를 곱한 후 세 번째 숫자를 더하는 함수
 * @param a - 곱할 첫 번째 숫자
 * @param b - 곱할 두 번째 숫자
 * @param c - 더할 숫자
 * @returns (a * b) + c
 */
export const sumAndMultiply = (a: number, b: number, c: number): number => {
  // 'multiply' is now correctly imported and available for use here.
  return sum(multiply(a, b), c);
};

// ========== Array Utilities ==========

/**
 * 배열을 청크로 나누는 함수
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  return _.chunk(array, size);
};

/**
 * 배열에서 중복 제거
 */
export const unique = <T>(array: T[]): T[] => {
  return _.uniq(array);
};

/**
 * 배열을 평탄화
 */
export const flatten = <T>(array: T[][]): T[] => {
  return _.flatten(array);
};

/**
 * 배열을 깊이 평탄화
 */
export const flattenDeep = <T>(array: any[]): T[] => {
  return _.flattenDeep(array);
};

/**
 * 배열 필터링
 */
export const filterArray = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return _.filter(array, predicate);
};

/**
 * 배열 그룹화
 */
export const groupBy = <T>(array: T[], key: string | ((item: T) => string)) => {
  return _.groupBy(array, key);
};

/**
 * 배열 정렬
 */
export const sortBy = <T>(array: T[], iteratees: string | string[] | ((item: T) => any)) => {
  return _.sortBy(array, iteratees);
};

/**
 * 배열 셔플
 */
export const shuffle = <T>(array: T[]): T[] => {
  return _.shuffle(array);
};

/**
 * 배열에서 랜덤 요소 선택
 */
export const sample = <T>(array: T[]): T | undefined => {
  return _.sample(array);
};

/**
 * 배열에서 여러 랜덤 요소 선택
 */
export const sampleSize = <T>(array: T[], n: number): T[] => {
  return _.sampleSize(array, n);
};

/**
 * 배열의 차집합
 */
export const difference = <T>(array: T[], ...values: T[][]): T[] => {
  return _.difference(array, ...values);
};

/**
 * 배열의 교집합
 */
export const intersection = <T>(...arrays: T[][]): T[] => {
  return _.intersection(...arrays);
};

/**
 * 배열의 합집합
 */
export const union = <T>(...arrays: T[][]): T[] => {
  return _.union(...arrays);
};

/**
 * 배열에서 최대값 찾기
 */
export const max = <T>(array: T[]): T | undefined => {
  return _.max(array);
};

/**
 * 배열에서 최소값 찾기
 */
export const min = <T>(array: T[]): T | undefined => {
  return _.min(array);
};

/**
 * 배열의 합계 계산
 */
export const sumArray = (array: number[]): number => {
  return _.sum(array);
};

/**
 * 배열의 평균 계산
 */
export const mean = (array: number[]): number => {
  return _.mean(array);
};

// ========== String Utilities ==========

/**
 * 문자열을 카멜케이스로 변환
 */
export const camelCase = (str: string): string => {
  return _.camelCase(str);
};

/**
 * 문자열을 케밥케이스로 변환
 */
export const kebabCase = (str: string): string => {
  return _.kebabCase(str);
};

/**
 * 문자열을 스네이크케이스로 변환
 */
export const snakeCase = (str: string): string => {
  return _.snakeCase(str);
};

/**
 * 문자열을 파스칼케이스로 변환
 */
export const pascalCase = (str: string): string => {
  return _.upperFirst(_.camelCase(str));
};

/**
 * 문자열을 시작 대문자로 변환
 */
export const startCase = (str: string): string => {
  return _.startCase(str);
};

/**
 * 문자열 트림
 */
export const trim = (str: string, chars?: string): string => {
  return _.trim(str, chars);
};

/**
 * 문자열 시작 부분 트림
 */
export const trimStart = (str: string, chars?: string): string => {
  return _.trimStart(str, chars);
};

/**
 * 문자열 끝 부분 트림
 */
export const trimEnd = (str: string, chars?: string): string => {
  return _.trimEnd(str, chars);
};

/**
 * 문자열 반복
 */
export const repeat = (str: string, n: number): string => {
  return _.repeat(str, n);
};

/**
 * 문자열 패딩
 */
export const pad = (str: string, length: number, chars?: string): string => {
  return _.pad(str, length, chars);
};

/**
 * 문자열 시작 부분 패딩
 */
export const padStart = (str: string, length: number, chars?: string): string => {
  return _.padStart(str, length, chars);
};

/**
 * 문자열 끝 부분 패딩
 */
export const padEnd = (str: string, length: number, chars?: string): string => {
  return _.padEnd(str, length, chars);
};

/**
 * 문자열 이스케이프
 */
export const escape = (str: string): string => {
  return _.escape(str);
};

/**
 * 문자열 언이스케이프
 */
export const unescape = (str: string): string => {
  return _.unescape(str);
};

/**
 * 문자열을 단어로 분할
 */
export const words = (str: string, pattern?: RegExp | string): string[] => {
  return _.words(str, pattern);
};

/**
 * 문자열 데바운스
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  return _.debounce(func, wait);
};

/**
 * 문자열 쓰로틀
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  return _.throttle(func, wait);
};

// ========== Date Utilities ==========

/**
 * 현재 날짜 포맷팅
 */
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  return moment(date).format(format);
};

/**
 * 날짜 더하기
 */
export const addDays = (date: Date | string, days: number): Date => {
  return moment(date).add(days, 'days').toDate();
};

/**
 * 날짜 빼기
 */
export const subtractDays = (date: Date | string, days: number): Date => {
  return moment(date).subtract(days, 'days').toDate();
};

/**
 * 날짜 차이 계산 (일)
 */
export const diffInDays = (date1: Date | string, date2: Date | string): number => {
  return moment(date1).diff(moment(date2), 'days');
};

/**
 * 날짜 차이 계산 (시간)
 */
export const diffInHours = (date1: Date | string, date2: Date | string): number => {
  return moment(date1).diff(moment(date2), 'hours');
};

/**
 * 날짜 차이 계산 (분)
 */
export const diffInMinutes = (date1: Date | string, date2: Date | string): number => {
  return moment(date1).diff(moment(date2), 'minutes');
};

/**
 * 상대 시간 표시 (예: "2시간 전")
 */
export const fromNow = (date: Date | string): string => {
  return moment(date).fromNow();
};

/**
 * 상대 시간 표시 (예: "2시간 후")
 */
export const toNow = (date: Date | string): string => {
  return moment(date).toNow();
};

/**
 * 날짜가 유효한지 확인
 */
export const isValidDate = (date: any): boolean => {
  return moment(date).isValid();
};

/**
 * 날짜 비교 (이전인지)
 */
export const isBefore = (date1: Date | string, date2: Date | string): boolean => {
  return moment(date1).isBefore(moment(date2));
};

/**
 * 날짜 비교 (이후인지)
 */
export const isAfter = (date1: Date | string, date2: Date | string): boolean => {
  return moment(date1).isAfter(moment(date2));
};

/**
 * 날짜 비교 (같은지)
 */
export const isSame = (date1: Date | string, date2: Date | string, unit?: moment.unitOfTime.StartOf): boolean => {
  return moment(date1).isSame(moment(date2), unit);
};

/**
 * 날짜가 범위 내에 있는지 확인
 */
export const isBetween = (
  date: Date | string,
  start: Date | string,
  end: Date | string
): boolean => {
  return moment(date).isBetween(moment(start), moment(end));
};

// ========== Math Utilities ==========

/**
 * 숫자를 범위로 제한
 */
export const clamp = (number: number, lower: number, upper: number): number => {
  return _.clamp(number, lower, upper);
};

/**
 * 숫자 반올림
 */
export const round = (number: number, precision: number = 0): number => {
  return _.round(number, precision);
};

/**
 * 숫자 내림
 */
export const floor = (number: number, precision: number = 0): number => {
  return _.round(Math.floor(number * Math.pow(10, precision)) / Math.pow(10, precision), precision);
};

/**
 * 숫자 올림
 */
export const ceil = (number: number, precision: number = 0): number => {
  return _.round(Math.ceil(number * Math.pow(10, precision)) / Math.pow(10, precision), precision);
};

/**
 * 랜덤 숫자 생성
 */
export const random = (lower: number = 0, upper: number = 1, floating: boolean = false): number => {
  return _.random(lower, upper, floating);
};

/**
 * 숫자가 범위 내에 있는지 확인
 */
export const inRange = (number: number, start: number, end: number): boolean => {
  return _.inRange(number, start, end);
};

/**
 * 숫자 절대값
 */
export const abs = (number: number): number => {
  return Math.abs(number);
};

/**
 * 숫자 제곱근
 */
export const sqrt = (number: number): number => {
  return Math.sqrt(number);
};

/**
 * 숫자 제곱
 */
export const pow = (base: number, exponent: number): number => {
  return Math.pow(base, exponent);
};

/**
 * 숫자 로그
 */
export const log = (number: number): number => {
  return Math.log(number);
};

/**
 * 숫자 지수
 */
export const exp = (number: number): number => {
  return Math.exp(number);
};

// ========== Object Utilities ==========

/**
 * 객체 병합
 */
export const merge = <T extends object>(...sources: Partial<T>[]): T => {
  return _.merge({}, ...sources) as T;
};

/**
 * 객체 깊은 병합
 */
export const mergeDeep = <T extends object>(...sources: Partial<T>[]): T => {
  return _.mergeWith({}, ...sources, (objValue: any, srcValue: any) => {
    if (_.isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  }) as T;
};

/**
 * 객체 키 가져오기
 */
export const keys = <T extends object>(object: T): string[] => {
  return _.keys(object);
};

/**
 * 객체 값 가져오기
 */
export const values = <T extends object>(object: T): T[keyof T][] => {
  return _.values(object);
};

/**
 * 객체 엔트리 가져오기
 */
export const entries = <T extends object>(object: T): [string, T[keyof T]][] => {
  return _.toPairs(object);
};

/**
 * 객체에서 키로 값 가져오기
 */
export const get = <T>(object: any, path: string | string[], defaultValue?: T): T => {
  return _.get(object, path, defaultValue) as T;
};

/**
 * 객체에 값 설정
 */
export const set = (object: any, path: string | string[], value: any): any => {
  return _.set(object, path, value);
};

/**
 * 객체에서 키 제거
 */
export const omit = <T extends object, K extends keyof T>(object: T, ...keys: K[]): Omit<T, K> => {
  return _.omit(object, keys) as Omit<T, K>;
};

/**
 * 객체에서 특정 키만 선택
 */
export const pick = <T extends object, K extends keyof T>(object: T, ...keys: K[]): Pick<T, K> => {
  return _.pick(object, keys) as Pick<T, K>;
};

/**
 * 객체가 비어있는지 확인
 */
export const isEmpty = (value: any): boolean => {
  return _.isEmpty(value);
};

/**
 * 객체가 같은지 확인 (깊은 비교)
 */
export const isEqual = (value: any, other: any): boolean => {
  return _.isEqual(value, other);
};

/**
 * 객체 타입 확인
 */
export const isObject = (value: any): boolean => {
  return _.isObject(value);
};

/**
 * 객체가 배열인지 확인
 */
export const isArray = (value: any): boolean => {
  return _.isArray(value);
};

/**
 * 객체가 함수인지 확인
 */
export const isFunction = (value: any): boolean => {
  return _.isFunction(value);
};

/**
 * 객체가 문자열인지 확인
 */
export const isString = (value: any): boolean => {
  return _.isString(value);
};

/**
 * 객체가 숫자인지 확인
 */
export const isNumber = (value: any): boolean => {
  return _.isNumber(value);
};

/**
 * 객체가 불린인지 확인
 */
export const isBoolean = (value: any): boolean => {
  return _.isBoolean(value);
};

/**
 * 객체가 날짜인지 확인
 */
export const isDate = (value: any): boolean => {
  return _.isDate(value);
};

/**
 * 객체가 null인지 확인
 */
export const isNull = (value: any): boolean => {
  return _.isNull(value);
};

/**
 * 객체가 undefined인지 확인
 */
export const isUndefined = (value: any): boolean => {
  return _.isUndefined(value);
};

/**
 * 객체가 null 또는 undefined인지 확인
 */
export const isNil = (value: any): boolean => {
  return _.isNil(value);
};

// ========== Validation Utilities ==========

/**
 * 이메일 유효성 검사
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * URL 유효성 검사
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 전화번호 유효성 검사
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * 비밀번호 강도 검사
 */
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('비밀번호는 최소 8자 이상이어야 합니다.');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('소문자를 포함해야 합니다.');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('대문자를 포함해야 합니다.');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('숫자를 포함해야 합니다.');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('특수문자를 포함해야 합니다.');

  return { score, feedback };
};

/**
 * 숫자 범위 검사
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * 문자열 길이 검사
 */
export const isLength = (str: string, min: number, max?: number): boolean => {
  if (max !== undefined) {
    return str.length >= min && str.length <= max;
  }
  return str.length >= min;
};

// ========== Formatting Utilities ==========

/**
 * 숫자를 통화 형식으로 포맷팅
 */
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * 숫자를 천 단위 구분자로 포맷팅
 */
export const formatNumber = (number: number, locale: string = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(number);
};

/**
 * 숫자를 퍼센트로 포맷팅
 */
export const formatPercent = (number: number, decimals: number = 2): string => {
  return `${(number * 100).toFixed(decimals)}%`;
};

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * 시간을 읽기 쉬운 형식으로 변환
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// ========== Async Utilities ==========

/**
 * 딜레이 함수
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * 타임아웃이 있는 Promise
 */
export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms)),
  ]);
};

/**
 * 재시도 로직
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await delay(delayMs);
    return retry(fn, retries - 1, delayMs);
  }
};

// ========== Collection Utilities ==========

/**
 * 맵 함수
 */
export const map = <T, U>(collection: T[], iteratee: (item: T, index: number) => U): U[] => {
  return _.map(collection, iteratee);
};

/**
 * 리듀스 함수
 */
export const reduce = <T, U>(
  collection: T[],
  iteratee: (accumulator: U, item: T, index: number) => U,
  accumulator: U
): U => {
  return _.reduce(collection, iteratee, accumulator);
};

/**
 * 필터 함수
 */
export const filter = <T>(collection: T[], predicate: (item: T, index: number) => boolean): T[] => {
  return _.filter(collection, predicate);
};

/**
 * 찾기 함수
 */
export const find = <T>(collection: T[], predicate: (item: T, index: number) => boolean): T | undefined => {
  return _.find(collection, predicate);
};

/**
 * 찾기 인덱스 함수
 */
export const findIndex = <T>(collection: T[], predicate: (item: T, index: number) => boolean): number => {
  return _.findIndex(collection, predicate);
};

/**
 * 모든 요소가 조건을 만족하는지 확인
 */
export const every = <T>(collection: T[], predicate: (item: T, index: number) => boolean): boolean => {
  return _.every(collection, predicate);
};

/**
 * 하나라도 조건을 만족하는지 확인
 */
export const some = <T>(collection: T[], predicate: (item: T, index: number) => boolean): boolean => {
  return _.some(collection, predicate);
};

/**
 * 컬렉션 크기
 */
export const size = (collection: any[] | object): number => {
  return _.size(collection);
};

/**
 * 컬렉션이 비어있는지 확인
 */
export const isEmptyCollection = (collection: any[] | object): boolean => {
  return _.isEmpty(collection);
};
