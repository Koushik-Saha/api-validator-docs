import { z } from 'zod';
export { z }; // Export zod so users can use it

export { APIValidator } from './core/APIValidator';
export { SchemaBuilder, createSchemaBuilder } from './core/SchemaBuilder';
export { Validator } from './core/Validator';
export { OpenAPIGenerator } from './core/OpenAPIGenerator';
export { TypeScriptGenerator } from './core/TypeScriptGenerator';
export { MockDataGenerator } from './core/MockDataGenerator';
export { EndpointDef, APISchema, ValidationResult, OpenAPISpec } from './types';

/**
 * Easy way to create validator
 */
export function createAPIValidator(schema: any) {
    return new (require('./core/APIValidator').APIValidator)(schema);
}
