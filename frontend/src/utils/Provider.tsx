import SessionProvider from '@/utils/SessionProvider';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
