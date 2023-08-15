import { NextRequest, NextResponse } from 'next/server';
import Pizza from '@/models/Pizza';
import Operation from '@/models/Operation';
import { connectDb } from '@/utils/db';
import Ingredient from '@/models/Ingredient';
import mongoose, { ObjectId } from 'mongoose';
import { PizzaResponse } from '@/types/pizza-response.interface';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDb();

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid pizza id',
      },
      {
        status: 400,
      },
    );
  }

  const pizza = await Pizza.findById(params.id);
  if (!pizza) {
    return NextResponse.json(
      {
        success: false,
        message: 'Pizza not found',
      },
      {
        status: 404,
      },
    );
  }

  const ingredients = (
    await Ingredient.find({
      pizzas: { $in: [params.id] },
    })
  ).map((ingredient) => ingredient.name);

  const operations = (
    await Operation.find({
      pizzas: { $in: [params.id] },
    })
  ).map((operation) => operation.name);

  const data: PizzaResponse = {
    name: pizza.name,
    imageUrl: pizza.imageUrl,
    ingredients,
    operations,
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
        message: 'Invalid pizza id',
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
        message: 'Invalid Ingredient id',
      },
      {
        status: 400,
      },
    );
  }

  try {
    const pizza = await Pizza.findById(params.id);
    if (!pizza) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pizza not found',
        },
        {
          status: 404,
        },
      );
    }

    const ingredient = await Ingredient.findById(ingredientId);
    const operation = await Operation.findOne({
      ingredients: { $in: [ingredientId] },
    });

    if (!ingredient || !operation) {
      return NextResponse.json({
        success: false,
        message: 'Ingredient or operation not found. Are required',
      });
    }

    if (!pizza.ingredients.includes(ingredientId))
      pizza.ingredients.push(ingredientId);
    if (!pizza.operations.includes(operation._id))
      pizza.operations.push(operation._id);
    if (!ingredient.pizzas.includes(pizza._id))
      ingredient.pizzas.push(pizza._id);
    if (!operation.pizzas.includes(pizza._id)) operation.pizzas.push(pizza._id);

    await pizza.save();
    await ingredient.save();
    await operation.save();

    return NextResponse.json({
      success: true,
      message: 'Pizza updated',
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
    const pizza = await Pizza.findByIdAndDelete(params.id);

    if (!pizza)
      return NextResponse.json(
        {
          success: false,
          message: 'Pizza not found',
        },
        {
          status: 404,
        },
      );

    const ingredientsId = pizza.ingredients.map(
      (ingredientId: ObjectId) => ingredientId,
    );
    const operationsId = pizza.operations.map(
      (operationId: ObjectId) => operationId,
    );

    for (const ingredientId of ingredientsId) {
      const ingredient = await Ingredient.findById(ingredientId);
      ingredient.pizzas = ingredient.pizzas.filter(
        (pizzaId: ObjectId) => pizzaId.toString() !== params.id,
      );
      await ingredient.save();
    }

    for (const operationId of operationsId) {
      const operation = await Operation.findById(operationId);
      operation.pizzas = operation.pizzas.filter(
        (pizzaId: ObjectId) => pizzaId.toString() !== params.id,
      );
      await operation.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Pizza deleted',
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
