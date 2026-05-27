import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Aumentar el tiempo de espera para las pruebas (útil para la primera descarga del binario de MongoDB)
jest.setTimeout(60000);

// Configurar variables de entorno para pruebas
process.env.JWT_SECRET = 'testsecret123';
process.env.NODE_ENV = 'test';

let mongo;

export const connect = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
};

export const closeDatabase = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

export const clearDatabase = async () => {
  if (mongo) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
};
