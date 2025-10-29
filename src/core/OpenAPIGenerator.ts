import { APISchema, OpenAPISpec } from '../types';

/**
 * Generates OpenAPI/Swagger documentation
 */
export class OpenAPIGenerator {
    /**
     * Generate OpenAPI spec from schema
     */
    static generate(schema: APISchema, title: string = 'API', version: string = '1.0.0'): OpenAPISpec {
        const paths: Record<string, any> = {};

        for (const [key, endpoint] of Object.entries(schema.endpoints)) {
            const [method, path] = key.split(':');

            if (!paths[path]) {
                paths[path] = {};
            }

            const operation: any = {
                summary: endpoint.description || `${method} ${path}`,
                tags: endpoint.tags || ['default'],
                responses: {
                    200: {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: this.zodToJsonSchema(endpoint.response),
                            },
                        },
                    },
                },
            };

            // Add parameters if exists
            if (endpoint.params) {
                operation.parameters = Object.entries(endpoint.params).map(([name]) => ({
                    name,
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                }));
            }

            // Add query if exists
            if (endpoint.query) {
                if (!operation.parameters) operation.parameters = [];
                Object.entries(endpoint.query).forEach(([name]) => {
                    operation.parameters.push({
                        name,
                        in: 'query',
                        required: false,
                        schema: { type: 'string' },
                    });
                });
            }

            // Add request body if exists
            if (endpoint.body) {
                operation.requestBody = {
                    required: true,
                    content: {
                        'application/json': {
                            schema: this.zodToJsonSchema(endpoint.body),
                        },
                    },
                };
            }

            paths[path][method.toLowerCase()] = operation;
        }

        return {
            openapi: '3.0.0',
            info: { title, version },
            paths,
        };
    }

    /**
     * Convert Zod schema to JSON Schema (simple version)
     */
    private static zodToJsonSchema(schema: any): any {
        return {
            type: 'object',
            properties: {},
            required: [],
        };
    }
}
