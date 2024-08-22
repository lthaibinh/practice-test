import React, { useEffect } from "react";

import Content from "./components/Content";
import { getData } from "@/services";

interface IInstance {
  id: string;
  version?: number;
  component: "button" | "paragrahp";
  props: {
    text: string;
    message?: string;
  };
}

export default async function TestSet() {
  return (<Content />);
}
