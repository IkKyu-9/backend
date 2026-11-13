// นำเข้า NextResponse จาก next/server เพื่อใช้จัดการและส่งค่า HTTP Response กลับไปยังไคลเอนต์
import { NextResponse } from "next/server";
import db from '../../lib/db'; // แก้ไขพาธชี้ไปยังโฟลเดอร์ lib/db ให้ถูกต้อง

//================================================================================
// GET Function (/src/app/api/users/route.js)
//================================================================================
/**
 * Route Handler สำหรับ HTTP Method: GET
 * ทำหน้าที่รองรับ Request แบบ GET ที่เข้ามายัง Endpoint นี้
 */
export async function GET() {
  try {
    // พิมพ์ Log ข้อความลงในฝั่งเซิร์ฟเวอร์ (Server Console) เพื่อใช้ในการ Monitor หรือ Debug
    console.log({ success: true, message: "ดึงข้อมูลผู้ใช้สำเร็จ", status: 200 });

    // ดึงข้อมูลผู้ใช้ทั้งหมดจากตาราง tbl_users ในฐานข้อมูล
    const [rows] = await db.query('SELECT * FROM tbl_users');

    // ส่ง Response กลับไปยังฝั่ง Client ในรูปแบบ JSON
    return NextResponse.json(
      {
        success: true,
        message: "ดึงข้อมูลผู้ใช้สำเร็จ",
        total: rows.length,
        data: rows,
      },
      { status: 200 }
    );
  } catch (error) {
    // ดักจับ Error ที่อาจเกิดขึ้นระหว่างการทำงานใน try block
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

//================================================================================
// POST Function (/src/app/api/users/route.js)
//================================================================================
export async function POST() {
  try {
    console.log({ success: true, message: "เพิ่มข้อมูลผู้ใช้สำเร็จ", status: 201 });
    return NextResponse.json(
      {
        success: true,
        message: "เพิ่มข้อมูลผู้ใช้สำเร็จ",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}