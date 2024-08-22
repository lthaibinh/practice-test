"use client";
import React, { useEffect } from "react";

interface IInstance {
  id: string;
  version?: number;
  component: "button" | "paragrahp";
  props: {
    text: string;
    message?: string;
  };
}

export default function Content() {
  let [instances, setInstances] = React.useState<IInstance[]>([]);

  useEffect(() => {
    fetch("/api/data").then((res) => {
      res.json().then((data) => {
        setInstances(data?.instances);
      });
    });
  }, []);

  return (
    <div className="h-screen">
      <div className="my-10 mx-10">
        <div className=" h-[80vh] bg-slate-400 flex flex-col gap-4 items-center">
          {instances?.map((instance) => {
            if (instance.component === "button")
              return (
                <button
                  onClick={() => {
                    alert(instance.props.message);
                  }}
                  className="border-2 border-solid w-fit px-4 py-2"
                >
                  {instance.props.text}
                </button>
              );
            return <div className="p-4">{instance.props.text}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
