# Petstore API Automation - Framework Example

Este proyecto demuestra la implementación completa de automatización de APIs utilizando el framework Playwright. Sirve como referencia y ejemplo de mejores prácticas para estructurar tests de APIs.

## 📋 Tabla de Contenidos

- [Arquitectura](#-arquitectura)
- [Estructura de Proyecto](#-estructura-de-proyecto)
- [Configuración](#-configuración)
- [Modelos de Datos](#-modelos-de-datos)
- [Servicios de API](#-servicios-de-api)
- [Datos de Prueba](#-datos-de-prueba)
- [Ejecución de Tests](#-ejecución-de-tests)
- [Buenas Prácticas](#-buenas-prácticas)
- [Troubleshooting](#-troubleshooting)

## 🏗️ Arquitectura

El framework sigue una arquitectura modular y escalable:

```
src/api/
├── models/          # Definiciones de tipos TypeScript
├── services/        # Clases de servicio para APIs
├── factory/         # Factory pattern para request contexts
└── config/          # Configuraciones de API

tests/
├── api/            # Tests de API
├── data/           # Datos de prueba en JSON
└── web/            # Tests de UI (si aplica)
```

### Principios de Diseño

- **Separation of Concerns**: Cada componente tiene una responsabilidad única
- **Type Safety**: Uso extensivo de TypeScript para validación de tipos
- **Reusability**: Componentes reutilizables entre diferentes tests
- **Maintainability**: Código organizado y documentado
- **Scalability**: Fácil de extender para nuevos endpoints y APIs

## 📁 Estructura de Proyecto

### Models (`src/api/models/petstore/`)

Los modelos definen la estructura de datos para la API Petstore:

```typescript
// Pet.ts
export interface Pet {
  id?: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: 'available' | 'pending' | 'sold';
}

export interface CreatePetRequest {
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: 'available' | 'pending' | 'sold';
}
```

**Características:**
- Tipos específicos para diferentes operaciones (Create, Update, Response)
- Union types para valores restringidos (status)
- Interfaces opcionales para campos no requeridos

### Services (`src/api/services/petstore/`)

Los servicios encapsulan la lógica de interacción con la API:

```typescript
// PetService.ts
export class PetService extends BaseApiService {
  constructor(requestContext: APIRequestContext, baseURL?: string) {
    super(requestContext, baseURL || 'https://petstore.swagger.io/v2');
  }

  async addPet(petData: CreatePetRequest): Promise<APIResponse> {
    const response = await this.post('/pet', petData);
    await this.logResponse(response, 'AddPet');
    return response;
  }

  async getPetById(petId: number): Promise<PetResponse> {
    const response = await this.get(`/pet/${petId}`);
    await this.validateResponse(response, 200, 'application/json');
    return this.parseJsonResponse<PetResponse>(response);
  }
}
```

**Características:**
- Hereda de `BaseApiService` para funcionalidad común
- Métodos específicos para cada endpoint
- Logging automático de requests y responses
- Validación de respuestas
- Type safety en parseo de JSON

### Datos de Prueba (`tests/data/petstore/`)

Los datos de prueba están organizados en archivos JSON:

```json
// pet-data.json
{
  "validPets": [...],
  "newPetRequests": [...],
  "updatePetRequests": [...],
  "invalidPets": [...]
}

// reference-data.json
{
  "categories": [...],
  "tags": [...],
  "statuses": [...]
}
```

**Características:**
- Separación de datos válidos e inválidos
- Datos de referencia para valores reutilizables
- Fácil mantenimiento y actualización

## ⚙️ Configuración

### Environment Setup

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
cp .env.example .env
```

### API Factory Pattern

El framework utiliza el patrón Factory para gestionar request contexts:

```typescript
// En los tests
test.beforeAll(async () => {
  apiFactory = ApiFactory.getInstance();
  requestContext = await apiFactory.createRequestContext({
    baseURL: 'https://petstore.swagger.io/v2',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  petService = new PetService(requestContext);
});
```

**Tipos de Request Context:**
- `createRequestContext()` - Básico
- `createAuthenticatedRequestContext()` - Con Bearer token
- `createBasicAuthRequestContext()` - Con Basic auth
- `createApiKeyRequestContext()` - Con API key

## 🧪 Ejecución de Tests

### Comandos Básicos

```bash
# Ejecutar todos los tests de Petstore
npx playwright test tests/api/petstore/

# Ejecutar un test específico
npx playwright test --grep "TC001_givenValidPetData_whenCreatingPet_thenPetCreatedSuccessfully"

# Ejecutar con modo headed
npx playwright test tests/api/petstore/ --headed

# Ejecutar con debug
npx playwright test tests/api/petstore/ --debug

# Generar reporte HTML
npx playwright show-report test-results/reports/html
```

### Estructura de Tests

Los tests siguen el patrón Given-When-Then:

```typescript
test('TC001_givenValidPetData_whenCreatingPet_thenPetCreatedSuccessfully', async () => {
  // Given: Datos de entrada válidos
  const newPet = petData.newPetRequests[0] as any;

  // When: Ejecutar la operación
  const response = await petService.addPet(newPet);

  // Then: Validar resultados
  await ApiHelper.validateResponse(response, STATUS_CODES.OK);
  const createdPet = await ApiHelper.parseJsonResponse<any>(response);
  expect(createdPet).toHaveProperty('id');
  expect(createdPet.name).toBe(newPet.name);
});
```

### Convenciones de Nomenclatura

- **Test Cases**: `TCXXX_givenCondition_whenAction_thenExpectedOutcome`
- **Files**: `{entity}.spec.ts`
- **Services**: `{Entity}Service.ts`
- **Models**: `{Entity}.ts`

## 🔧 Buenas Prácticas

### 1. Organización de Código

```typescript
// ✅ Bueno: Servicios específicos por entidad
class PetService extends BaseApiService { }
class UserService extends BaseApiService { }

// ❌ Evitar: Servicios genéricos
class ApiService { } // Demasiado genérico
```

### 2. Manejo de Datos

```typescript
// ✅ Bueno: Datos externos en JSON
const newPet = petData.newPetRequests[0];

// ✅ Bueno: Generación dinámica
const samplePet = petService.createSamplePet();

// ❌ Evitar: Datos hardcodeados
const pet = { name: "Test Pet", status: "available" };
```

### 3. Validación de Respuestas

```typescript
// ✅ Bueno: Validación específica
await ApiHelper.validateResponse(response, STATUS_CODES.OK);
const pet = await ApiHelper.parseJsonResponse<PetResponse>(response);

// ✅ Bueno: Validaciones de negocio
expect(pet.status).toBe('available');
expect(pet.photoUrls.length).toBeGreaterThan(0);
```

### 4. Error Handling

```typescript
// ✅ Bueno: Manejo específico de errores
try {
  const pet = await petService.getPetById(petId);
  // Validaciones
} catch (error) {
  if (error.status === 404) {
    // Manejo específico
  }
}
```

### 5. Test Isolation

```typescript
// ✅ Bueno: Tests independientes
test('TC001_create_pet', async () => {
  const pet = await createPet();
  // Validaciones sin depender de otros tests
});

// ❌ Evitar: Dependencia entre tests
test('TC002_get_pet', async () => {
  // Depende del pet creado en TC001
});
```

## 📊 Reportes y Logs

### Logging Automático

El framework incluye logging automático:

```typescript
// Logs de requests
Curl Command: curl -X POST '/pet' -d '{"name":"Test Pet"}'

// Logs de responses
=== AddPet Response ===
Status: 200
Headers: {...}
Body: {"id":123,"name":"Test Pet"}
```

### Reportes HTML

```bash
# Generar y ver reporte
npx playwright show-report test-results/reports/html
```

El reporte incluye:
- Resultados de tests
- Tiempos de ejecución
- Screenshots (si aplica)
- Logs detallados

## 🚀 Extensión del Framework

### Agregar Nueva Entidad

1. **Crear Modelos**:
```typescript
// src/api/models/newentity/NewEntity.ts
export interface NewEntity {
  id?: number;
  name: string;
  // otros campos
}
```

2. **Crear Servicio**:
```typescript
// src/api/services/newentity/NewEntityService.ts
export class NewEntityService extends BaseApiService {
  async createEntity(data: CreateEntityRequest): Promise<APIResponse> {
    return this.post('/newentity', data);
  }
}
```

3. **Crear Datos de Prueba**:
```json
// tests/data/newentity/newentity-data.json
{
  "validEntities": [...],
  "invalidEntities": [...]
}
```

4. **Crear Tests**:
```typescript
// tests/api/newentity/newentity.spec.ts
test.describe('NewEntity API Tests', () => {
  // Tests específicos
});
```

### Configuración de Entornos

```typescript
// playwright.config.ts
use: {
  baseURL: process.env.API_BASE_URL || 'https://api.example.com',
  extraHTTPHeaders: {
    'Authorization': `Bearer ${process.env.API_TOKEN}`
  }
}
```

## 🔍 Troubleshooting

### Problemas Comunes

1. **TypeScript Errors**:
   - Verificar imports de alias (`@/`)
   - Actualizar tipos en `tsconfig.json`

2. **API Response Issues**:
   - Validar status codes esperados
   - Revisar content-type headers

3. **Test Dependencies**:
   - Asegurar independencia entre tests
   - Usar datos dinámicos cuando sea posible

4. **Request Context Issues**:
   - Proper cleanup en `afterAll`
   - Usar ApiFactory para gestión centralizada

### Debug Tips

```bash
# Ejecutar con modo debug
npx playwright test --debug

# Ver logs detallados
DEBUG=pw:* npx playwright test

# Ejecutar test específico
npx playwright test --grep "test_name"
```

## 📚 Referencias

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Petstore API Documentation](https://petstore.swagger.io/)

## 🤝 Contribución

Este proyecto sirve como ejemplo y referencia. Para contribuir:

1. Seguir las convenciones establecidas
2. Mantener la documentación actualizada
3. Agregar tests para nuevas funcionalidades
4. Seguir los principios de clean code

---

**Nota**: Esta rama (`api-test-petstore`) está diseñada como ejemplo de implementación del framework. No debe ser fusionada directamente sin revisión, pero sirve como guía para otros proyectos de automatización de APIs.
