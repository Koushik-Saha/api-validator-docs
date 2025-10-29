import { createSchemaBuilder, createAPIValidator } from '../index';
import { z } from 'zod';

describe('API Validator with Docs', () => {
    it('should create schema builder', () => {
        const builder = createSchemaBuilder();
        expect(builder).toBeDefined();
    });

    it('should build simple schema', () => {
        const schema = createSchemaBuilder()
            .get('/users', {
                response: {
                    id: z.number(),
                    name: z.string(),
                },
            })
            .build();

        expect(schema.endpoints['GET:/users']).toBeDefined();
    });

    it('should create API validator', () => {
        const schema = createSchemaBuilder()
            .get('/users/:id', {
                response: {
                    id: z.number(),
                    name: z.string(),
                },
            })
            .build();

        const validator = createAPIValidator(schema);
        expect(validator).toBeDefined();
    });

    it('should validate requests', () => {
        const schema = createSchemaBuilder()
            .post('/users', {
                body: {
                    name: z.string(),
                    email: z.string(),
                },
                response: {
                    id: z.number(),
                    name: z.string(),
                },
            })
            .build();

        const validator = createAPIValidator(schema);
        const result = validator.validateRequest('POST', '/users', {
            body: { name: 'John', email: 'john@example.com' },
        });

        expect(result.valid).toBe(true);
    });

    it('should generate OpenAPI spec', () => {
        const schema = createSchemaBuilder()
            .get('/users/:id', {
                description: 'Get user by ID',
                response: {
                    id: z.number(),
                    name: z.string(),
                },
            })
            .build();

        const validator = createAPIValidator(schema);
        const openapi = validator.generateOpenAPI('User API', '1.0.0');

        expect(openapi.info.title).toBe('User API');
        expect(openapi.openapi).toBe('3.0.0');
    });

    it('should generate TypeScript types', () => {
        const schema = createSchemaBuilder()
            .get('/users/:id', {
                response: {
                    id: z.number(),
                    name: z.string(),
                },
            })
            .build();

        const validator = createAPIValidator(schema);
        const types = validator.generateTypeScript();

        expect(types).toContain('Response');
    });

    it('should generate mock data', () => {
        const schema = createSchemaBuilder()
            .get('/users/:id', {
                response: {
                    id: z.number(),
                    name: z.string(),
                },
            })
            .build();

        const validator = createAPIValidator(schema);
        const mockResponse = validator.generateMockResponse('GET', '/users/123');

        expect(mockResponse.id).toBeDefined();
        expect(mockResponse.name).toBeDefined();
    });
});
