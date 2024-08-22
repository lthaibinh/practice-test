"use client";
import React, { useEffect, useRef } from "react";
import { ParagraphItem } from "./ParagraphItem";
import { BtnItem } from "./BtnItem";
import { useRouter } from "next/navigation";
import { IHistory, IInstance } from "@/services";

export default function Content() {
  let [histories, setHistories] = React.useState<IHistory[]>([]);
  let [history, setHistory] = React.useState<IHistory | null>(null);
  // let [instances, setInstances] = React.useState<IInstance[]>([]);
  let [currentEdittingItem, setCurrentEdittingItem] =
    React.useState<IInstance>();
  let router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [mousePosition, setMousePosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  let fetchAllHistory = () => {
    fetch("/api/history").then((res) => {
      res.json().then((data) => {
        if (data) {
          console.log("datadata", data);
          setHistories(data);
        }
      });
    });
  };
  let fetchNewHistory = () => {
    fetch("/api/data").then((res) => {
      res.json().then((data) => {
        setHistory(data);
      });
    });
  };
  useEffect(() => {
    fetchNewHistory();
    fetchAllHistory();
  }, []);
  let textOnchange = (text: string) => {
    if (!currentEdittingItem) return;
    setHistory((prev) => {
      if (!prev) return null;
      let instances = prev?.instances?.map((item) => {
        if (item.id === currentEdittingItem.id) {
          return {
            ...item,
            props: {
              ...item.props,
              text: text,
            },
          };
        }
        return item;
      });
      return {
        ...prev,
        instances,
      };
    });
  };
  let messageOnchange = (message: string) => {
    if (!currentEdittingItem) return;
    setHistory((prev) => {
      if (!prev) return null;
      let instances = prev?.instances?.map((item) => {
        if (item.id === currentEdittingItem.id) {
          return {
            ...item,
            props: {
              ...item.props,
              message,
            },
          };
        }
        return item;
      });
      return {
        ...prev,
        instances,
      };
    });
  };
  let renderInfoSection = () => {
    if (!currentEdittingItem) return;
    if (currentEdittingItem.component === "button") {
      return (
        <div>
          <p>Button Text</p>
          <input
            value={
              history?.instances?.find(
                (item) => item.id === currentEdittingItem.id
              )?.props.text
            }
            onChange={(e) => {
              textOnchange(e.target.value);
            }}
          ></input>

          <p>Alert Message</p>
          <input
            value={
              history?.instances?.find(
                (item) => item.id === currentEdittingItem.id
              )?.props.message
            }
            onChange={(e) => messageOnchange(e.target.value)}
          ></input>
        </div>
      );
    }

    return (
      <div>
        <p>Paragraph Text</p>
        <input
          value={
            history?.instances?.find(
              (item) => item.id === currentEdittingItem.id
            )?.props.text
          }
          onChange={(e) => {
            textOnchange(e.target.value);
          }}
        ></input>
      </div>
    );
  };
  const onSaveData = () => {
    let test = fetch("/api/data", {
      method: "POST",
      body: JSON.stringify(history?.instances),
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then(() => {
        fetchAllHistory();
        fetchNewHistory();
      });
  };
  const onUndo = () => {
    if (history?.isHasUndo)
      fetch(`/api/data?id=${history?.id}&undo=true`).then((res) => {
        res.json().then((data) => {
          setHistory(data);
        });
      });
  };
  const onRedo = () => {
    if (history?.isHasRedo)
      fetch(`/api/data?id=${history?.id}&redo=true`).then((res) => {
        res.json().then((data) => {
          setHistory(data);
        });
      });
  };
  const onExport = () => {
    // is an object and I wrote it to file as
    // json

    // create file in browser
    const fileName = "export-all-history-file";
    const json = JSON.stringify(histories, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };
  useEffect(() => {
    if (!droppableRef.current) return;
    const onMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    droppableRef.current.addEventListener("mousemove", onMouseMove);
    return () => {
      droppableRef.current?.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
  const droppableRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <div className="header h-20 flex gap-4 items-center justify-center">
        <button
          className="border-solid border-2 bg-orange-500 p-2 text-white"
          onClick={() => {
            onSaveData();
          
          }}
        >
          Save
        </button>
        <button
          className="border-solid border-2 bg-orange-500 p-2 text-white"
          style={
            history?.isHasUndo
              ? {}
              : { cursor: "not-allowed", backgroundColor: "grey" }
          }
          onClick={onUndo}
        >
          Undo
        </button>
        <button
          className="border-solid border-2 bg-orange-500 p-2 text-white"
          style={
            history?.isHasRedo
              ? {}
              : { cursor: "not-allowed", backgroundColor: "grey" }
          }
          onClick={onRedo}
        >
          Redo
        </button>
        <button
          className="border-solid border-2 bg-orange-500 p-2 text-white"
          onClick={onExport}
        >
          Export
        </button>
        {/* <input
          type="file"
          
          value={""}
          className="border-solid border-2 bg-orange-500 p-2 text-white"
        > </input> */}
        <div>
          <label
            htmlFor="importFile"
            className="border-solid border-2 bg-orange-500 p-2 text-white cursor-pointer"
          >
            Import File
          </label>
          <input
            type="file"
            id="importFile"
            className="hidden"
            ref={fileInput}
            onChange={(e) => {
              let file = e.target.files?.[0];
              var reader = new FileReader();
              reader.onload = function (e) {
                if (!e.target) return;
                var contents = e.target.result;
                if (!contents) return;
                var json = JSON.parse(contents as string);
                setHistories(json);
                setHistory(json[json.length - 1]);
              };
              file && reader.readAsText(file);

              // reader.readAsText(event.target.files[0]);
            }}
          />
        </div>
        <button
          className="border-solid border-2 bg-orange-500 p-2 text-white"
          onClick={() => router.push("/consumer")}
        >
          View
        </button>
      </div>
      <div className="h-[calc(100vh-80px)] flex">
        <div className="w-96 bg-red-400 flex flex-col items-center gap-4 pt-4">
          <ParagraphItem />
          <BtnItem />
        </div>
        <div
          ref={droppableRef}
          className="flex-1 bg-yellow-100 h-[calc(100vh-80px)] pb-10 overflow-y-auto"
        >
          <div className="p-4 px-10">
            <p>Thông tin</p>
            <p>Mouse: {mousePosition ? JSON.stringify(mousePosition) : ""}</p>
            <p>instances: {history?.instances?.length || 0}</p>
            <p>config: {JSON.stringify(history || "")}</p>
          </div>
          <div className="my-4 mx-10 ">
            <p>Kéo thả vào ô bên dưới</p>
            <div
              className="h-[calc(100vh-400px)]  bg-slate-400 flex flex-col items-center gap-4 "
              onDrop={(e) => {
                e.preventDefault();
                var componentName = e.dataTransfer.getData("componentName");
                if (componentName === "button") {
                  setHistory((prev) => {
                    if (!prev)
                      return {
                        id: crypto.randomUUID(),
                        instances: [
                          {
                            id: crypto.randomUUID(),
                            component: "button",
                            props: { text: "button" },
                          },
                        ],
                      };
                    return {
                      ...prev,
                      instances: [
                        ...(prev.instances || []),
                        {
                          id: crypto.randomUUID(),
                          component: "button",
                          props: { text: "button" },
                        },
                      ],
                    };
                  });
                } else {
                  setHistory((prev) => {
                    if (!prev) {
                      return {
                        id: crypto.randomUUID(),
                        instances: [
                          {
                            id: crypto.randomUUID(),
                            component: "paragrahp",
                            props: { text: "paragrahp" },
                          },
                        ],
                      };
                    }
                    return {
                      ...prev,
                      instances: [
                        ...(prev.instances || []),
                        {
                          id: crypto.randomUUID(),
                          component: "paragrahp",
                          props: { text: "paragrahp" },
                        },
                      ],
                    };
                  });
                }
                // let element = e.target as HTMLElement;
                // let newElement = document.getElementById(data);
                // if (newElement) element.appendChild(newElement);
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              {history?.instances?.map((instance) => {
                if (instance.component === "button")
                  return (
                    <button
                      className="border-2 border-solid py-2 px-4"
                      onClick={(e) => {
                        setCurrentEdittingItem(instance);
                      }}
                    >
                      {instance.props.text}
                    </button>
                  );
                return (
                  <div
                    className="p-4"
                    onClick={() => {
                      setCurrentEdittingItem(instance);
                    }}
                  >
                    {instance.props.text}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="editting-info px-10">{renderInfoSection()}</div>
        </div>
        <div className="w-96 bg-red-400 flex flex-col items-center gap-4">
          <p>Lịch sử lưu</p>
          {histories.map((el, index) => (
            <div
              key={el.id}
              style={
                el.id === history?.id
                  ? {
                      backgroundColor: "green",
                    }
                  : {}
              }
            >
              version {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
