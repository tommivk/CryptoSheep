import React from "react";

const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={`rounded-lg bg-slate-600 hover:bg-slate-500 px-5 py-2 text-slate-200 ${props.className}`}
    >
      {children}
    </button>
  );
};

export default Button;
