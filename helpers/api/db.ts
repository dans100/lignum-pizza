import {connect} from 'mongoose';


export const connectDb = async () => {
  const {MONGODB_URI} = process.env;

  if (!MONGODB_URI || MONGODB_URI.length === 0) {
    throw new Error("Please add your MongoDB URI to .env");
  }

  const options: any = {
    useUnifiedTopology: true,

    useNewUrlParser: true
  }

  try {
    await connect(MONGODB_URI, options);
  } catch (error) {
    console.log(error);
  }

}

