import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/utils/db';
import Ingredient from '@/models/Ingredient';
import mongoose from 'mongoose';
import Operation from '@/models/Operation';
import { AllIngredientResponse } from '@/types/ingredient-resopnse.interface';
import { IngredientCreate } from '@/types/ingredient-create.interface';

export async function GET() {
  await connectDb();

  try {
    const data: AllIngredientResponse = await Ingredient.find(
      {},
      { _id: 1, name: 1, imageUrl: 1 },
    );
    if (data.length > 0) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'No ingredients found',
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

export async function POST(req: NextRequest) {
  await connectDb();
  const data: IngredientCreate = await req.json();
  const { operationId } = data;

  try {
    if (!mongoose.Types.ObjectId.isValid(operationId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ingredient must contains valid operationId',
        },
        {
          status: 400,
        },
      );
    }

    const ingredient = new Ingredient(data);
    ingredient.operation = operationId;
    const errors = ingredient.validateSync();

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

    const operation = await Operation.findById(operationId);

    if (!operation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation not found. Ingredient must contains operation',
        },
        {
          status: 400,
        },
      );
    }

    operation.ingredients.push(ingredient._id);
    const saveIngredient = await ingredient.save();
    const saveOperation = await operation.save();

    if (saveIngredient && saveOperation) {
      return NextResponse.json({
        success: true,
        message: 'Ingredient added to DB',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to add ingredient to DB. Please try again!',
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
          message: 'Ingredient with this name already exists',
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
