import { z } from 'zod';
import { EndpointDef, APISchema } from '../types';

/**
 * Easy way to build API schemas
 */
export class SchemaBuilder {
    private endpoints: Record<string, EndpointDef> = {};

    /**
     * Add GET endpoint
     */
    get(path: string, config: Omit<EndpointDef, 'method' | 'path'>) {
        this.endpoints[`GET:${path}`] = {
            ...config,
            path,
            method: 'GET',
        };
        return this;
    }

    /**
     * Add POST endpoint
     */
    post(path: string, config: Omit<EndpointDef, 'method' | 'path'>) {
        this.endpoints[`POST:${path}`] = {
            ...config,
            path,
            method: 'POST',
        };
        return this;
    }

    /**
     * Add PUT endpoint
     */
    put(path: string, config: Omit<EndpointDef, 'method' | 'path'>) {
        this.endpoints[`PUT:${path}`] = {
            ...config,
            path,
            method: 'PUT',
        };
        return this;
    }

    /**
     * Add DELETE endpoint
     */
    delete(path: string, config: Omit<EndpointDef, 'method' | 'path'>) {
        this.endpoints[`DELETE:${path}`] = {
            ...config,
            path,
            method: 'DELETE',
        };
        return this;
    }

    /**
     * Build and return schema
     */
    build(): APISchema {
        return {
            endpoints: this.endpoints,
        };
    }
}

/**
 * Easy way to create builder
 */
export function createSchemaBuilder() {
    return new SchemaBuilder();
}
