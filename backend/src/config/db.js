import moongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        const conn = await moongoose.connect(ENV.DB_URL);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1); // Exit process with failure, 0 means success
    }
}