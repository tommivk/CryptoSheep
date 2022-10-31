type Props = {
  children: JSX.Element | JSX.Element[];
  className?: string;
};

const Card = ({ children, className }: Props) => {
  return (
    <div
      className={`${className} bg-slate-800 dark:bg-gradient-to-r from-darkMain to-darkSecondary w-fit rounded-lg m-auto text-slate-300 relative`}
    >
      {children}
    </div>
  );
};

export default Card;
