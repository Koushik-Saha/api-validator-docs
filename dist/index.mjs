var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/core/Validator.ts
import { z } from "zod";
var Validator;
var init_Validator = __esm({
  "src/core/Validator.ts"() {
    Validator = class {
      constructor(schema) {
        this.schema = schema;
      }
      /**
       * Get endpoint by method and path
       */
      getEndpoint(method, path) {
        const key = `${method}:${path}`;
        return this.schema.endpoints[key] || null;
      }
      /**
       * Convert path with params to pattern
       * e.g., /users/:id => /users/123
       */
      matchPath(method, actualPath) {
        for (const [key, endpoint] of Object.entries(this.schema.endpoints)) {
          const [endpointMethod, endpointPath] = key.split(":");
          if (endpointMethod !== method) continue;
          if (endpointPath === actualPath) return endpoint;
          const pattern = endpointPath.replace(/:[^/]+/g, "[^/]+").replace(/\//g, "\\/").replace(/\./g, "\\.");
          if (new RegExp(`^${pattern}$`).test(actualPath)) {
            return endpoint;
          }
        }
        return null;
      }
      /**
       * Validate request
       */
      validateRequest(method, path, data) {
        const endpoint = this.matchPath(method, path);
        if (!endpoint) {
          return {
            valid: false,
            errors: [`Endpoint not found: ${method} ${path}`]
          };
        }
        try {
          if (endpoint.params) {
            const paramSchema = z.object(endpoint.params);
            paramSchema.parse({});
          }
          if (endpoint.query && data?.query) {
            const querySchema = z.object(endpoint.query);
            querySchema.parse(data.query);
          }
          if (endpoint.body && data?.body) {
            const bodySchema = z.object(endpoint.body);
            const validated = bodySchema.parse(data.body);
            return { valid: true, data: validated };
          }
          return { valid: true, data };
        } catch (error) {
          return {
            valid: false,
            errors: [error.message]
          };
        }
      }
      /**
       * Validate response
       */
      validateResponse(method, path, responseData) {
        const endpoint = this.matchPath(method, path);
        if (!endpoint) {
          return {
            valid: false,
            errors: [`Endpoint not found: ${method} ${path}`]
          };
        }
        try {
          const responseSchema = z.object(endpoint.response);
          const validated = responseSchema.parse(responseData);
          return { valid: true, data: validated };
        } catch (error) {
          return {
            valid: false,
            errors: [error.message]
          };
        }
      }
    };
  }
});

// src/core/OpenAPIGenerator.ts
var OpenAPIGenerator;
var init_OpenAPIGenerator = __esm({
  "src/core/OpenAPIGenerator.ts"() {
    OpenAPIGenerator = class {
      /**
       * Generate OpenAPI spec from schema
       */
      static generate(schema, title = "API", version = "1.0.0") {
        const paths = {};
        for (const [key, endpoint] of Object.entries(schema.endpoints)) {
          const [method, path] = key.split(":");
          if (!paths[path]) {
            paths[path] = {};
          }
          const operation = {
            summary: endpoint.description || `${method} ${path}`,
            tags: endpoint.tags || ["default"],
            responses: {
              200: {
                description: "Success",
                content: {
                  "application/json": {
                    schema: this.zodToJsonSchema(endpoint.response)
                  }
                }
              }
            }
          };
          if (endpoint.params) {
            operation.parameters = Object.entries(endpoint.params).map(([name]) => ({
              name,
              in: "path",
              required: true,
              schema: { type: "string" }
            }));
          }
          if (endpoint.query) {
            if (!operation.parameters) operation.parameters = [];
            Object.entries(endpoint.query).forEach(([name]) => {
              operation.parameters.push({
                name,
                in: "query",
                required: false,
                schema: { type: "string" }
              });
            });
          }
          if (endpoint.body) {
            operation.requestBody = {
              required: true,
              content: {
                "application/json": {
                  schema: this.zodToJsonSchema(endpoint.body)
                }
              }
            };
          }
          paths[path][method.toLowerCase()] = operation;
        }
        return {
          openapi: "3.0.0",
          info: { title, version },
          paths
        };
      }
      /**
       * Convert Zod schema to JSON Schema (simple version)
       */
      static zodToJsonSchema(schema) {
        return {
          type: "object",
          properties: {},
          required: []
        };
      }
    };
  }
});

// src/core/TypeScriptGenerator.ts
var TypeScriptGenerator;
var init_TypeScriptGenerator = __esm({
  "src/core/TypeScriptGenerator.ts"() {
    TypeScriptGenerator = class {
      /**
       * Generate .d.ts content
       */
      static generate(schema) {
        let output = `
// AUTO-GENERATED - DO NOT EDIT MANUALLY
// Generated from API schema

`;
        for (const [key, endpoint] of Object.entries(schema.endpoints)) {
          const [method, path] = key.split(":");
          const operationName = this.pathToName(method, path);
          output += `export interface ${operationName}Response {
  // Response fields
  [key: string]: any;
}

`;
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
      static pathToName(method, path) {
        const parts = path.split("/").filter((p) => p);
        const name = parts.map(
          (p) => p.replace(/:/, "").split(/[-_]/).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("")
        ).join("");
        return `${method.charAt(0) + method.slice(1).toLowerCase()}${name}`;
      }
    };
  }
});

// src/core/MockDataGenerator.ts
var MockDataGenerator;
var init_MockDataGenerator = __esm({
  "src/core/MockDataGenerator.ts"() {
    MockDataGenerator = class {
      /**
       * Generate mock data for endpoint response
       */
      static generateMockResponse(schema, method, path) {
        let mockData = {};
        mockData.id = Math.floor(Math.random() * 1e3);
        mockData.name = "John Doe";
        mockData.email = "john@example.com";
        mockData.createdAt = (/* @__PURE__ */ new Date()).toISOString();
        mockData.status = "active";
        return mockData;
      }
      /**
       * Generate mock request body
       */
      static generateMockRequest(schema, method, path) {
        return {
          name: "John Doe",
          email: "john@example.com"
        };
      }
    };
  }
});

// src/core/APIValidator.ts
var APIValidator_exports = {};
__export(APIValidator_exports, {
  APIValidator: () => APIValidator
});
var APIValidator;
var init_APIValidator = __esm({
  "src/core/APIValidator.ts"() {
    init_Validator();
    init_OpenAPIGenerator();
    init_TypeScriptGenerator();
    init_MockDataGenerator();
    APIValidator = class {
      constructor(schema) {
        this.schema = schema;
        this.validator = new Validator(schema);
      }
      /**
       * Validate incoming request
       */
      validateRequest(method, path, data) {
        return this.validator.validateRequest(method, path, data);
      }
      /**
       * Validate outgoing response
       */
      validateResponse(method, path, data) {
        return this.validator.validateResponse(method, path, data);
      }
      /**
       * Generate OpenAPI spec
       */
      generateOpenAPI(title, version) {
        return OpenAPIGenerator.generate(this.schema, title, version);
      }
      /**
       * Generate TypeScript types
       */
      generateTypeScript() {
        return TypeScriptGenerator.generate(this.schema);
      }
      /**
       * Generate mock response
       */
      generateMockResponse(method, path) {
        return MockDataGenerator.generateMockResponse(this.schema, method, path);
      }
      /**
       * Generate mock request
       */
      generateMockRequest(method, path) {
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
          tags: e.tags
        }));
      }
    };
  }
});

// src/index.ts
init_APIValidator();
import { z as z2 } from "zod";

// src/core/SchemaBuilder.ts
var SchemaBuilder = class {
  constructor() {
    this.endpoints = {};
  }
  /**
   * Add GET endpoint
   */
  get(path, config) {
    this.endpoints[`GET:${path}`] = {
      ...config,
      path,
      method: "GET"
    };
    return this;
  }
  /**
   * Add POST endpoint
   */
  post(path, config) {
    this.endpoints[`POST:${path}`] = {
      ...config,
      path,
      method: "POST"
    };
    return this;
  }
  /**
   * Add PUT endpoint
   */
  put(path, config) {
    this.endpoints[`PUT:${path}`] = {
      ...config,
      path,
      method: "PUT"
    };
    return this;
  }
  /**
   * Add DELETE endpoint
   */
  delete(path, config) {
    this.endpoints[`DELETE:${path}`] = {
      ...config,
      path,
      method: "DELETE"
    };
    return this;
  }
  /**
   * Build and return schema
   */
  build() {
    return {
      endpoints: this.endpoints
    };
  }
};
function createSchemaBuilder() {
  return new SchemaBuilder();
}

// src/index.ts
init_Validator();
init_OpenAPIGenerator();
init_TypeScriptGenerator();
init_MockDataGenerator();
function createAPIValidator(schema) {
  return new (init_APIValidator(), __toCommonJS(APIValidator_exports)).APIValidator(schema);
}
export {
  APIValidator,
  MockDataGenerator,
  OpenAPIGenerator,
  SchemaBuilder,
  TypeScriptGenerator,
  Validator,
  createAPIValidator,
  createSchemaBuilder,
  z2 as z
};
