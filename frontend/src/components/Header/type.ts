export interface HeaderProps {
  title: string;
  RightComponent?: React.ReactNode;
  onClickPreviousButton?: () => void;
  hasPreviousLink?: boolean;
}
