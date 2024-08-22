import { getData, saveData } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id") || null
  const undo = Boolean(searchParams.get("undo")) 
  const redo = Boolean(searchParams.get("redo"))

  let data = await getData({id, undo, redo});
  return NextResponse.json(data);
}
export async function POST(request: Request) {
  const body = await request.json();
  let res = saveData(body);
  try {
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({});
  }
}
