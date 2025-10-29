import { z } from 'zod';
export { z } from 'zod';

/**
 * Schema types (used in endpoints)
 */
type SchemaType = z.ZodSchema;
/**
 * Endpoint definition
 */
interface EndpointDef {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, SchemaType>;
    query?: Record<string, SchemaType>;
    body?: Record<string, SchemaType>;
    response: Record<string, SchemaType>;
    description?: string;
    tags?: string[];
}
/**
 * API schema definition
 */
interface APISchema {
    endpoints: Record<string, EndpointDef>;
}
/**
 * Validation result
 */
interface ValidationResult {
    valid: boolean;
    data?: any;
    errors?: string[];
}
/**
 * OpenAPI specification
 */
interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    paths: Record<string, any>;
}

/**
 * Main API Validator - orchestrates everything
 */
declare class APIValidator {
    private schema;
    private validator;
    constructor(schema: APISchema);
    /**
     * Validate incoming request
     */
    validateRequest(method: string, path: string, data?: any): ValidationResult;
    /**
     * Validate outgoing response
     */
    validateResponse(method: string, path: string, data: any): ValidationResult;
    /**
     * Generate OpenAPI spec
     */
    generateOpenAPI(title?: string, version?: string): OpenAPISpec;
    /**
     * Generate TypeScript types
     */
    generateTypeScript(): string;
    /**
     * Generate mock response
     */
    generateMockResponse(method: string, path: string): any;
    /**
     * Generate mock request
     */
    generateMockRequest(method: string, path: string): any;
    /**
     * Get all endpoints
     */
    getEndpoints(): {
        method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
        path: string;
        description: string;
        tags: string[];
    }[];
}

/**
 * Easy way to build API schemas
 */
declare class SchemaBuilder {
    private endpoints;
    /**
     * Add GET endpoint
     */
    get(path: string, config: Omit<EndpointDef, 'method' | 'path'>): this;
    /**
     * Add POST endpoint
     */
    post(path: string, config: Omit<EndpointDef, 'method' | 'path'>): this;
    /**
     * Add PUT endpoint
     */
    put(path: string, config: Omit<EndpointDef, 'method' | 'path'>): this;
    /**
     * Add DELETE endpoint
     */
    delete(path: string, config: Omit<EndpointDef, 'method' | 'path'>): this;
    /**
     * Build and return schema
     */
    build(): APISchema;
}
/**
 * Easy way to create builder
 */
declare function createSchemaBuilder(): SchemaBuilder;

/**
 * Validates API requests and responses
 */
declare class Validator {
    private schema;
    constructor(schema: APISchema);
    /**
     * Get endpoint by method and path
     */
    private getEndpoint;
    /**
     * Convert path with params to pattern
     * e.g., /users/:id => /users/123
     */
    private matchPath;
    /**
     * Validate request
     */
    validateRequest(method: string, path: string, data?: any): ValidationResult;
    /**
     * Validate response
     */
    validateResponse(method: string, path: string, responseData: any): ValidationResult;
}

/**
 * Generates OpenAPI/Swagger documentation
 */
declare class OpenAPIGenerator {
    /**
     * Generate OpenAPI spec from schema
     */
    static generate(schema: APISchema, title?: string, version?: string): OpenAPISpec;
    /**
     * Convert Zod schema to JSON Schema (simple version)
     */
    private static zodToJsonSchema;
}

/**
 * Generates TypeScript type definitions
 */
declare class TypeScriptGenerator {
    /**
     * Generate .d.ts content
     */
    static generate(schema: APISchema): string;
    /**
     * Convert path to operation name
     * GET /users/:id => GetUsersById
     */
    private static pathToName;
}

/**
 * Generates mock/fake data for testing
 */
declare class MockDataGenerator {
    /**
     * Generate mock data for endpoint response
     */
    static generateMockResponse(schema: APISchema, method: string, path: string): any;
    /**
     * Generate mock request body
     */
    static generateMockRequest(schema: APISchema, method: string, path: string): any;
}

/**
 * Easy way to create validator
 */
declare function createAPIValidator(schema: any): any;

export { type APISchema, APIValidator, type EndpointDef, MockDataGenerator, OpenAPIGenerator, type OpenAPISpec, SchemaBuilder, TypeScriptGenerator, type ValidationResult, Validator, createAPIValidator, createSchemaBuilder };
