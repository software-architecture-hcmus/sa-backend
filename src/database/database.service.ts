import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm";
import AppDataSource from "./data-source";

export class DatabaseService {
    private static instance: DatabaseService;
    private dataSource: DataSource;

    private constructor() {
        this.dataSource = AppDataSource;
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
        return this.dataSource.getRepository(entity);
    }

    public async initialize(): Promise<void> {
        try {
            await this.dataSource.initialize();
            console.log('🌟 Database initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing database:', error);
            throw error;
        }
    }
}