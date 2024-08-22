import { getAllData, getData, saveData } from "@/services";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  let data = await getAllData();
  return NextResponse.json(data);
}