import { ConnectOptions, connect } from 'mongoose';

export const connectDb = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI || MONGODB_URI.length === 0) {
    throw new Error('Please add your MongoDB URI to .env');
  }

  type ConnectOptionsExtend = {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };

  const options: ConnectOptions & ConnectOptionsExtend = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    await connect(MONGODB_URI, options);
  } catch (error) {
    console.log(error);
  }
};
