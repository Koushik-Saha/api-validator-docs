import { z } from 'zod';
import { EndpointDef, APISchema, ValidationResult } from '../types';

/**
 * Validates API requests and responses
 */
export class Validator {
    private schema: APISchema;

    constructor(schema: APISchema) {
        this.schema = schema;
    }

    /**
     * Get endpoint by method and path
     */
    private getEndpoint(method: string, path: string): EndpointDef | null {
        const key = `${method}:${path}`;
        return this.schema.endpoints[key] || null;
    }

    /**
     * Convert path with params to pattern
     * e.g., /users/:id => /users/123
     */
    private matchPath(method: string, actualPath: string): EndpointDef | null {
        for (const [key, endpoint] of Object.entries(this.schema.endpoints)) {
            const [endpointMethod, endpointPath] = key.split(':');

            if (endpointMethod !== method) continue;

            // Exact match
            if (endpointPath === actualPath) return endpoint;

            // Pattern match (e.g., /users/:id matches /users/123)
            const pattern = endpointPath
                .replace(/:[^/]+/g, '[^/]+')
                .replace(/\//g, '\\/')
                .replace(/\./g, '\\.');

            if (new RegExp(`^${pattern}$`).test(actualPath)) {
                return endpoint;
            }
        }

        return null;
    }

    /**
     * Validate request
     */
    validateRequest(method: string, path: string, data?: any): ValidationResult {
        const endpoint = this.matchPath(method, path);

        if (!endpoint) {
            return {
                valid: false,
                errors: [`Endpoint not found: ${method} ${path}`],
            };
        }

        try {
            // Validate params (from path)
            if (endpoint.params) {
                const paramSchema = z.object(endpoint.params as any);
                paramSchema.parse({});
            }

            // Validate query
            if (endpoint.query && data?.query) {
                const querySchema = z.object(endpoint.query as any);
                querySchema.parse(data.query);
            }

            // Validate body
            if (endpoint.body && data?.body) {
                const bodySchema = z.object(endpoint.body as any);
                const validated = bodySchema.parse(data.body);
                return { valid: true, data: validated };
            }

            return { valid: true, data };
        } catch (error: any) {
            return {
                valid: false,
                errors: [error.message],
            };
        }
    }

    /**
     * Validate response
     */
    validateResponse(method: string, path: string, responseData: any): ValidationResult {
        const endpoint = this.matchPath(method, path);

        if (!endpoint) {
            return {
                valid: false,
                errors: [`Endpoint not found: ${method} ${path}`],
            };
        }

        try {
            const responseSchema = z.object(endpoint.response as any);
            const validated = responseSchema.parse(responseData);
            return { valid: true, data: validated };
        } catch (error: any) {
            return {
                valid: false,
                errors: [error.message],
            };
        }
    }
}
