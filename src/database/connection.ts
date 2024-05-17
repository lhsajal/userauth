import * as mongoDB from "mongodb";

export default class Database {
    private static instance: Database;
    private db: mongoDB.Db;

    private constructor() {
        // Private constructor to prevent instantiation from outside
    }

    static async get(): Promise<mongoDB.Db> {
        if (!Database.instance) {
            Database.instance = new Database();
            await Database.instance.createConnection();
        }
        return Database.instance.db
    }

    private async createConnection(): Promise<void> {
        try {
            const mclient: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.MONGOSURI!);
            await mclient.connect();
            this.db = mclient.db(process.env.DB_NAME);
            loggerG.info("Database Connected");
        } catch (error) {
            console.error('Error connecting to database:', error);
            throw error;
        }
    }
}
