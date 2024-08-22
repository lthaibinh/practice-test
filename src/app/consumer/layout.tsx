import React, { FC } from "react";

interface IProps {
  children?: React.ReactNode;
}
export default function RootLayout({ children }: IProps) {
  return <div >{children}</div>;
}
