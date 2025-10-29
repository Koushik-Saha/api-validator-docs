# api-validator-docs 📋

Type-safe API request/response validator with auto-generated OpenAPI docs and TypeScript types.

## Features

- ✅ Type-safe schema definition
- ✅ Request/response validation
- ✅ Auto-generate OpenAPI/Swagger docs
- ✅ Auto-generate TypeScript types
- ✅ Mock data generation
- ✅ Developer-friendly errors
- ✅ Zero runtime overhead

## Installation

\`\`\`bash
npm install api-validator-docs
\`\`\`

## Usage

### Define Schema Once

\`\`\`typescript
import { createSchemaBuilder, createAPIValidator, z } from 'api-validator-docs';

const schema = createSchemaBuilder()
.get('/users/:id', {
description: 'Get user by ID',
response: {
id: z.number(),
name: z.string(),
email: z.string(),
},
})
.post('/users', {
description: 'Create new user',
body: {
name: z.string(),
email: z.string(),
},
response: {
id: z.number(),
name: z.string(),
email: z.string(),
createdAt: z.string(),
},
})
.build();

const validator = createAPIValidator(schema);
\`\`\`

### Validate Requests

\`\`\`typescript
const result = validator.validateRequest('POST', '/users', {
body: { name: 'John', email: 'john@example.com' }
});

if (result.valid) {
console.log('Valid request:', result.data);
} else {
console.error('Errors:', result.errors);
}
\`\`\`

### Generate OpenAPI Docs

\`\`\`typescript
const openapi = validator.generateOpenAPI('My API', '1.0.0');
console.log(JSON.stringify(openapi, null, 2));
// Ready for Swagger UI or Postman
\`\`\`

### Generate TypeScript Types

\`\`\`typescript
const types = validator.generateTypeScript();
// Auto-generated .d.ts content
\`\`\`

### Mock Data for Testing

\`\`\`typescript
const mockResponse = validator.generateMockResponse('GET', '/users/123');
const mockRequest = validator.generateMockRequest('POST', '/users');
\`\`\`

## License

MIT
