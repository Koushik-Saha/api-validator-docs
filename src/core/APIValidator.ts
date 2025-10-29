import { z } from 'zod';
import { APISchema, ValidationResult } from '../types';
import { Validator } from './Validator';
import { OpenAPIGenerator } from './OpenAPIGenerator';
import { TypeScriptGenerator } from './TypeScriptGenerator';
import { MockDataGenerator } from './MockDataGenerator';

/**
 * Main API Validator - orchestrates everything
 */
export class APIValidator {
    private schema: APISchema;
    private validator: Validator;

    constructor(schema: APISchema) {
        this.schema = schema;
        this.validator = new Validator(schema);
    }

    /**
     * Validate incoming request
     */
    validateRequest(method: string, path: string, data?: any): ValidationResult {
        return this.validator.validateRequest(method, path, data);
    }

    /**
     * Validate outgoing response
     */
    validateResponse(method: string, path: string, data: any): ValidationResult {
        return this.validator.validateResponse(method, path, data);
    }

    /**
     * Generate OpenAPI spec
     */
    generateOpenAPI(title?: string, version?: string) {
        return OpenAPIGenerator.generate(this.schema, title, version);
    }

    /**
     * Generate TypeScript types
     */
    generateTypeScript(): string {
        return TypeScriptGenerator.generate(this.schema);
    }

    /**
     * Generate mock response
     */
    generateMockResponse(method: string, path: string): any {
        return MockDataGenerator.generateMockResponse(this.schema, method, path);
    }

    /**
     * Generate mock request
     */
    generateMockRequest(method: string, path: string): any {
        return MockDataGenerator.generateMockRequest(this.schema, method, path);
    }

    /**
     * Get all endpoints
     */
    getEndpoints() {
        return Object.values(this.schema.endpoints).map((e) => ({
            method: e.method,
            path: e.path,
            description: e.description,
            tags: e.tags,
        }));
    }
}
