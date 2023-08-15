import { connectDb } from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';
import { IngredientUpdateInterface } from '@/types/ingredient-update.interface';
import Ingredient from '@/models/Ingredient';
import { ObjectId } from 'mongodb';
import Operation from '@/models/Operation';
import mongoose from 'mongoose';
import Pizza from '@/models/Pizza';
import { IngredientResponse } from '@/types/ingredient-resopnse.interface';

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

  const ingredient = await Ingredient.findById(params.id);
  if (!ingredient) {
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

  const pizzas = (
    await Pizza.find({
      ingredients: { $in: [params.id] },
    })
  ).map((pizza) => pizza.name);

  const operation = await Operation.findById(ingredient.operation);

  const data: IngredientResponse = {
    name: ingredient.name,
    imageUrl: ingredient.imageUrl,
    pizzas,
    operation: operation.name,
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
  const body: IngredientUpdateInterface = await req.json();
  const { operationId } = body;

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

  if (!mongoose.Types.ObjectId.isValid(operationId)) {
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

  try {
    const ingredient = await Ingredient.findById(params.id);
    if (!ingredient) {
      return NextResponse.json(
        {
          success: false,
          message: 'Ingredient not found.',
        },
        {
          status: 404,
        },
      );
    }

    const operation = await Operation.findById(operationId);

    if (!operation)
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid update data.',
        },
        {
          status: 400,
        },
      );

    ingredient.operation = new ObjectId(operationId);
    await ingredient.save();
    if (!operation.ingredients.includes(params.id))
      operation.ingredients.push(params.id);
    await operation.save();

    return NextResponse.json({
      success: true,
      message: 'Ingredient updated',
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
    const ingredient = await Ingredient.findByIdAndDelete(params.id);

    if (!ingredient) {
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

    const pizzasId = ingredient.pizzas.map((pizzaId: ObjectId) => pizzaId);

    for (const pizzaId of pizzasId) {
      const pizza = await Pizza.findById(pizzaId);
      pizza.ingredients = pizza.ingredients.filter(
        (ingredientId: ObjectId) => ingredientId.toString() !== params.id,
      );
      await pizza.save();
    }

    const operation = await Operation.findById(ingredient.operation);

    operation.ingredients = operation.ingredients.filter(
      (ingredientId: ObjectId) => ingredientId.toString() !== params.id,
    );
    await operation.save();

    return NextResponse.json({
      success: true,
      message: 'Ingredient deleted',
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
