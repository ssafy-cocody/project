import { DATE_DIFF_VALUES } from '@/types/weather';

interface Props {
  dateDiff: (typeof DATE_DIFF_VALUES)[keyof typeof DATE_DIFF_VALUES];
}

/**
 *
 * @param dateDiff 오늘(0), 내일(1), 모레(2)
 * @returns YYYYMMDD
 */
export const getDate = ({ dateDiff }: Props) => {
  const today = new Date();
  const date = new Date(today);
  date.setDate(today.getDate() + dateDiff);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateNumber = String(date.getDate()).padStart(2, '0');
  const resultDate = year + month + dateNumber;
  return resultDate;
};
