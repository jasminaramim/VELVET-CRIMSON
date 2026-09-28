import app, { initMongoDB } from '../server';

let isDbConnected = false;

export default async function handler(req: any, res: any) {
  if (!isDbConnected) {
    await initMongoDB();
    isDbConnected = true;
  }
  return app(req, res);
}
