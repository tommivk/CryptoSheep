type Props = {
  header: string;
  value: string;
  className?: string;
};

const InfoBox = ({ header, value, className }: Props) => {
  return (
    <div className="border py-2 px-3 rounded-sm">
      <p className="text-center text-sm text-slate-400">{header}</p>
      <p className={`text-center break-words ${className}`}>{value}</p>
    </div>
  );
};

export default InfoBox;
