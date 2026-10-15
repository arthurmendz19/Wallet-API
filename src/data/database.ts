import mysql from "mysql2/promise";

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const db = await mysql.createConnection({
    host: getRequiredEnv("DB_HOST"),
    user: getRequiredEnv("DB_USER"),
    password: getRequiredEnv("DB_PASSWORD"),
    database: getRequiredEnv("DB_NAME")
}); 