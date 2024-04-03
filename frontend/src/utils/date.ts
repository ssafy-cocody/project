// 한자리 수 숫자 앞에 0을 붙이는 함수
export const paddingDigit = (digit: Number) => digit.toString().padStart(2, '0');

// 한자리 수 숫자인 달 앞에 0을 붙이는 함수
export const paddingMonth = (month_: Number) => paddingDigit(month_);

/**
 * yyyy-MM-dd 포맷
 */
export const yearMonthDateFormatter = (year: Number, month: Number, date: Number) => {
  return `${year}-${paddingDigit(month)}-${paddingDigit(date)}`;
};
