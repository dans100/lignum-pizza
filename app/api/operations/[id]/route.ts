import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/utils/db';
import mongoose from 'mongoose';
import Operation from '@/models/Operation';
import Ingredient from '@/models/Ingredient';
import Pizza from '@/models/Pizza';
import { OperationResponse } from '@/types/operation-response.interface';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDb();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid ingredient id',
      },
      {
        status: 400,
      },
    );
  }

  const operation = await Operation.findById(params.id);
  if (!operation) {
    return NextResponse.json(
      {
        success: false,
        message: 'Operation not found',
      },
      {
        status: 404,
      },
    );
  }

  const pizzas = (
    await Pizza.find({
      operations: { $in: [params.id] },
    })
  ).map((pizza) => pizza.name);

  const ingredients = (
    await Ingredient.find({
      operation: operation._id,
    })
  ).map((ingredient) => ingredient.name);

  const data: OperationResponse = {
    name: operation.name,
    imageUrl: operation.imageUrl,
    pizzas,
    ingredients,
  };

  return NextResponse.json({
    success: true,
    data,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDb();
  const body = await req.json();
  const { ingredientId } = body;

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid operation id',
      },
      {
        status: 400,
      },
    );
  }

  if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid IngredientId',
      },
      {
        status: 400,
      },
    );
  }

  try {
    const operation = await Operation.findById(params.id);
    if (!operation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Operation not found.',
        },
        {
          status: 404,
        },
      );
    }

    const ingredient = await Ingredient.findById(ingredientId);

    if (!ingredient)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid update data.',
        },
        {
          status: 400,
        },
      );

    if (!operation.ingredients.includes(ingredientId))
      operation.ingredients.push(ingredientId);
    await operation.save();

    return NextResponse.json({
      success: true,
      message: 'Operation updated',
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again.',
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDb();

  try {
    const ingredients = await Ingredient.find({
      operation: params.id,
    });

    if (ingredients.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete operation when has relation with ingredient',
        },
        {
          status: 409,
        },
      );
    }

    const operation = await Operation.findByIdAndDelete(params.id);

    if (!operation) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ingredient not found',
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Operation deleted',
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong',
      },
      {
        status: 500,
      },
    );
  }
}
