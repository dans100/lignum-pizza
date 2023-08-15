import { NextResponse } from 'next/server';
import { connectDb } from '@/utils/db';
import Operation from '@/models/Operation';
import { AllOperationResponse } from '@/types/operation-response.interface';
import { OperationCreate } from '@/types/operation-create.interface';

export async function GET() {
  await connectDb();

  try {
    const data: AllOperationResponse = await Operation.find(
      {},
      { _id: 1, name: 1, imageUrl: 1 },
    );
    if (data.length > 0) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'No operations found',
        },
        {
          status: 204,
        },
      );
    }
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again',
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDb();
    const data: OperationCreate = await req.json();
    const operation = new Operation(data);
    const errors = operation.validateSync();

    if (errors)
      return NextResponse.json(
        {
          success: false,
          message: errors.message,
        },
        {
          status: 400,
        },
      );

    const saveData = await operation.save();
    if (saveData) {
      return NextResponse.json({
        success: true,
        message: 'Operation added to DB',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to add operation to DB. Please try again!',
        },
        {
          status: 500,
        },
      );
    }
  } catch (e: any) {
    console.log(e);

    if (e.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation with this name already exists',
        },
        {
          status: 409,
        },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again',
      },
      {
        status: 500,
      },
    );
  }
}
