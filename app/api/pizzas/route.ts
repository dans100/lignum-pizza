import { NextRequest, NextResponse } from 'next/server';
import { connectDb } from '@/utils/db';
import Pizza from '@/models/Pizza';
import Operation from '@/models/Operation';
import mongoose from 'mongoose';
import Ingredient from '@/models/Ingredient';
import { AllPizzaResponse } from '@/types/pizza-response.interface';
import { PizzaCreate } from '@/types/pizza-create.interface';

export async function GET() {
  await connectDb();

  try {
    const data: AllPizzaResponse = await Pizza.find(
      {},
      { _id: 1, name: 1, imageUrl: 1 },
    );

    if (data.length > 0) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'No pizzas found',
        },
        {
          status: 404,
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
  try {
    await connectDb();
    const data: PizzaCreate = await req.json();

    const { ingredients } = data;

    if (!ingredients) {
      return NextResponse.json(
        {
          success: false,
          message: 'Required minimum one valid ingredientId',
        },
        {
          status: 400,
        },
      );
    }

    const pizza = new Pizza(data);

    for (const ingredientId of ingredients) {
      if (!mongoose.Types.ObjectId.isValid(ingredientId.toString())) {
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

      const operation = await Operation.findOne({
        ingredients: { $in: [ingredientId] },
      });

      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient)
        return NextResponse.json(
          {
            success: false,
            message: 'Ingredients not found',
          },
          {
            status: 400,
          },
        );

      if (!pizza.operations.includes(operation._id))
        pizza.operations.push(operation._id);
      if (!operation.pizzas.includes(pizza._id))
        operation.pizzas.push(pizza._id);
      if (!ingredient.pizzas.includes(pizza._id))
        ingredient.pizzas.push(pizza._id);

      await operation.save();
      await ingredient.save();
    }

    const errors = pizza.validateSync();

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

    const pizzaSave = await pizza.save();

    if (pizzaSave) {
      return NextResponse.json({ success: true, message: 'Pizza added to DB' });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to add Pizza to DB. Please try again!',
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
          message: 'Pizza with this name already exists',
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
