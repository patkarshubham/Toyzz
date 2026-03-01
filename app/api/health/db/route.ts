import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    return NextResponse.json({
      ok: true,
      dbName: conn.connection.name,
      host: conn.connection.host,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    );
  }
}

