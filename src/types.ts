import { z } from 'zod';

/**
 * Schema types (used in endpoints)
 */
export type SchemaType = z.ZodSchema;

/**
 * Endpoint definition
 */
export interface EndpointDef {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, SchemaType>;      // URL parameters
    query?: Record<string, SchemaType>;       // Query string
    body?: Record<string, SchemaType>;        // Request body
    response: Record<string, SchemaType>;     // Response body
    description?: string;
    tags?: string[];
}

/**
 * API schema definition
 */
export interface APISchema {
    endpoints: Record<string, EndpointDef>;
}

/**
 * Validation result
 */
export interface ValidationResult {
    valid: boolean;
    data?: any;
    errors?: string[];
}

/**
 * OpenAPI specification
 */
export interface OpenAPISpec {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    paths: Record<string, any>;
}
