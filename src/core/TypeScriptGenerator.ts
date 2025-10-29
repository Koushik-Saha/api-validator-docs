import { APISchema } from '../types';

/**
 * Generates TypeScript type definitions
 */
export class TypeScriptGenerator {
    /**
     * Generate .d.ts content
     */
    static generate(schema: APISchema): string {
        let output = `
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from API schema

`;

        for (const [key, endpoint] of Object.entries(schema.endpoints)) {
            const [method, path] = key.split(':');
            const operationName = this.pathToName(method, path);

            // Response type
            output += `export interface ${operationName}Response {
  // Response fields
  [key: string]: any;
}

`;

            // Request type
            if (endpoint.body) {
                output += `export interface ${operationName}Request {
  // Request fields
  [key: string]: any;
}

`;
            }
        }

        return output;
    }

    /**
     * Convert path to operation name
     * GET /users/:id => GetUsersById
     */
    private static pathToName(method: string, path: string): string {
        const parts = path.split('/').filter((p) => p);
        const name = parts
            .map((p) =>
                p
                    .replace(/:/, '')
                    .split(/[-_]/)
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join('')
            )
            .join('');

        return `${method.charAt(0) + method.slice(1).toLowerCase()}${name}`;
    }
}
