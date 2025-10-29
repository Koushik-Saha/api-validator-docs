import { APISchema } from '../types';

/**
 * Generates mock/fake data for testing
 */
export class MockDataGenerator {
    /**
     * Generate mock data for endpoint response
     */
    static generateMockResponse(schema: APISchema, method: string, path: string): any {
        let mockData: any = {};

        // Generate random data based on field names
        mockData.id = Math.floor(Math.random() * 1000);
        mockData.name = 'John Doe';
        mockData.email = 'john@example.com';
        mockData.createdAt = new Date().toISOString();
        mockData.status = 'active';

        return mockData;
    }

    /**
     * Generate mock request body
     */
    static generateMockRequest(schema: APISchema, method: string, path: string): any {
        return {
            name: 'John Doe',
            email: 'john@example.com',
        };
    }
}
