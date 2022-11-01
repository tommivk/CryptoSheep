type Props = {
  children: JSX.Element | JSX.Element[];
  className?: string;
};

const Card = ({ children, className }: Props) => {
  return (
    <div
      className={`${className} text-slate-700 dark:text-slate-300 bg-lightSecondary border-lightBorder border-2 dark:border-0 dark:bg-darkBackground  dark:bg-gradient-to-r from-darkMain to-darkSecondary w-fit rounded-lg m-auto relative`}
    >
      {children}
    </div>
  );
};

export default Card;
