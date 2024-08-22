import { promises as fs } from "fs";

export interface IInstance {
  id: string;
  version?: number;
  component: "button" | "paragrahp";
  props: {
    text: string;
    message?: string;
  };
}
export interface IHistory {
  id: string;
  isHasUndo?: boolean;
  isHasRedo?: boolean;
  instances: IInstance[];
}

const getDataFromFile = async () => {
  const file = await fs.readFile("./src/fakeDb.json", "utf8");
  return file;
};
const saveDataToFile = async (body: IInstance[]) => {
  let data: IHistory = {
    id: crypto.randomUUID(), // đánh id để undo, redo
    instances: body,
  };
  let prevData = await getDataFromFile();
  let newData = [
    ...(prevData ? JSON.parse(prevData) : []),
  ];
  newData.push(data);
  await fs.writeFile("./src/fakeDb.json", JSON.stringify(newData));

  return {
    message: "success",
  };
};
interface IParams {
  id?: string | null;
  undo?: boolean | null;
  redo?: boolean | null;
}
export async function getData({ id, redo, undo }: IParams): Promise<IHistory | null> {
  const data = await getDataFromFile();
  const resData: IHistory[] = data ? JSON.parse(data) : [];
  if (!data) return null;
  if (!id)
    // lấy state mới nhất
    return {
      ...resData[resData.length - 1],
      isHasUndo: resData.length > 1,
      isHasRedo: false,
    };
  else if (undo) {
    // lấy undo
    let currentIndex = resData.findIndex((item) => item.id === id);
    if (currentIndex === 0) return null;
    return {
      ...resData[currentIndex - 1],
      isHasUndo: currentIndex - 1 > 0,
      isHasRedo: currentIndex - 1 < resData.length - 1,
    };
  } else {
    // lấy redo
    let currentIndex = resData.findIndex((item) => item.id === id);
    if (currentIndex === resData.length - 1) return null;
    return {
      ...resData[currentIndex + 1],
      isHasUndo: currentIndex + 1 > 0,
      isHasRedo: currentIndex + 1 < resData.length - 1,
    };
  }
}

export async function getAllData() {
  const data = await getDataFromFile();
  const resData: IHistory[] = data ? JSON.parse(data) : [];
  return resData;
}
export async function saveData(body: any) {
  if (!body)
    return {
      message: "fail",
    };
  await saveDataToFile(body);
  return {
    message: "success",
  };
}
