import styles from '@/components/Label/Label.module.scss';

interface LabelProps {
  label: string;
  required?: boolean;
  htmlFor?: string;
}

const Label = ({ label, required, htmlFor }: LabelProps) => {
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      {required && <span className={styles.required}>*</span>}
      {label}
    </label>
  );
};

export default Label;
export type { LabelProps };
