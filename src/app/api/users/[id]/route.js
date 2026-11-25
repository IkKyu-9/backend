import { NextResponse } from 'next/server';
import db from '../../../lib/db';

const TABLE = 'tbl_employee';
const PK = 'emp_id';
const ALLOWED_FIELDS = [
  'emp_firstname',
  'emp_lastname',
  'emp_department',
  'emp_salary',
];

function parseId(rawId) {
  const numId = Number(rawId);
  if (!Number.isInteger(numId) || numId <= 0) {
    return null;
  }
  return numId;
}

// GET /api/users/[id]
export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const empId = parseId(id);

    if (!empId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const [rows] = await db.query(
      `SELECT * FROM ${TABLE} WHERE ${PK} = ? LIMIT 1`,
      [empId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      data: rows[0],
    });
  } catch (err) {
    console.error('Database GET error:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]
export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const empId = parseId(id);

    if (!empId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const entries = Object.entries(body || {}).filter(([key]) =>
      ALLOWED_FIELDS.includes(key)
    );

    if (entries.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Valid fields are required' },
        { status: 400 }
      );
    }

    const setClause = entries.map(([key]) => `\`${key}\` = ?`).join(', ');
    const values = entries.map(([, value]) => value);

    const [result] = await db.query(
      `UPDATE ${TABLE} SET ${setClause} WHERE ${PK} = ?`,
      [...values, empId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Employee not found' },
        { status: 404 }
      );
    }

    const [updatedRows] = await db.query(
      `SELECT * FROM ${TABLE} WHERE ${PK} = ? LIMIT 1`,
      [empId]
    );

    return NextResponse.json({
      status: 'ok',
      message: 'Updated successfully',
      data: updatedRows[0],
    });
  } catch (err) {
    console.error('Database PUT error:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id]
export async function PATCH(request, context) {
  try {
    const { id } = await context.params;
    const empId = parseId(id);

    if (!empId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const entries = Object.entries(body || {}).filter(([key]) =>
      ALLOWED_FIELDS.includes(key)
    );

    if (entries.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const setClause = entries.map(([key]) => `\`${key}\` = ?`).join(', ');
    const values = entries.map(([, value]) => value);

    const [result] = await db.query(
      `UPDATE ${TABLE} SET ${setClause} WHERE ${PK} = ?`,
      [...values, empId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Employee not found' },
        { status: 404 }
      );
    }

    const [updatedRows] = await db.query(
      `SELECT * FROM ${TABLE} WHERE ${PK} = ? LIMIT 1`,
      [empId]
    );

    return NextResponse.json({
      status: 'ok',
      message: 'Patched successfully',
      data: updatedRows[0],
    });
  } catch (err) {
    console.error('Database PATCH error:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const empId = parseId(id);

    if (!empId) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const [result] = await db.query(
      `DELETE FROM ${TABLE} WHERE ${PK} = ?`,
      [empId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Deleted successfully',
      deletedId: empId,
    });
  } catch (err) {
    console.error('Database DELETE error:', err);
    return NextResponse.json(
      { error: 'Database error', details: err.message },
      { status: 500 }
    );
  }
}