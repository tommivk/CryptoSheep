type Props = {
  code?: number;
  text?: string;
};

const ErrorPage = ({ code, text }: Props) => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-theme(spacing.navbarHeight))]">
      <div className="flex flex-col">
        <h1 className="text-9xl mb-10">{code}</h1>
        <p className="text-center">{text}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
