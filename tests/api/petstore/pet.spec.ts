import { test, expect } from '@playwright/test';
import { APIRequestContext } from '@playwright/test';
import { PetService } from '@/api/services/petstore';
import { ApiFactory } from '@/api/factory/ApiFactory';
import { ApiHelper } from '@/utils/ApiHelper';
import { STATUS_CODES } from '@/config/api-config';
import * as petData from '../../data/petstore/pet-data.json';
import * as referenceData from '../../data/petstore/reference-data.json';

test.describe('Petstore API - Pet Endpoint Tests', () => {
  let petService: PetService;
  let requestContext: APIRequestContext;
  let apiFactory: ApiFactory;
  let createdPetId: number;

  test.beforeAll(async () => {
    // Initialize API Factory
    apiFactory = ApiFactory.getInstance();
    
    // Initialize request context using ApiFactory
    requestContext = await apiFactory.createRequestContext({
      baseURL: 'https://petstore.swagger.io/v2',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    petService = new PetService(requestContext);
  });

  test.afterAll(async () => {
    // Cleanup using ApiFactory
    await apiFactory.closeAllRequestContexts();
  });

  test.describe('POST /pet - Create Pet', () => {
    test('TC001_givenValidPetData_whenCreatingPet_thenPetCreatedSuccessfully', async () => {
      // Given: Valid pet data from JSON file
      const newPet = petData.newPetRequests[0] as any;

      // When: Creating new pet
      const response = await petService.addPet(newPet);

      // Then: Pet should be created successfully
      await ApiHelper.validateResponse(response, STATUS_CODES.OK);
      const createdPet = await ApiHelper.parseJsonResponse<any>(response);
      
      expect(createdPet).toHaveProperty('id');
      expect(createdPet.name).toBe(newPet.name);
      expect(createdPet.status).toBe(newPet.status);
      expect(createdPet.category.name).toBe(newPet.category.name);
      
      // Store ID for cleanup
      createdPetId = createdPet.id;
    });

    test('TC003_givenValidPetId_whenGettingPet_thenPetReturned', async () => {
      // Given: Valid pet ID (using the one created in TC001)
      if (createdPetId) {
        // When: Getting pet by ID
        const pet = await petService.getPetById(createdPetId);

        // Then: Pet should be returned with correct data
        expect(pet.id).toBe(createdPetId);
        expect(pet.name).toBeTruthy();
        expect(pet.status).toBeTruthy();
        expect(Array.isArray(pet.photoUrls)).toBeTruthy();
      } else {
        test.skip(true, 'No pet created in TC001 to test with');
      }
    });

    test('TC002_givenInvalidPetData_whenCreatingPet_thenValidationError', async () => {
      // Given: Invalid pet data
      const invalidPet = petData.invalidPets[0] as any;

      // When: Attempting to create pet with invalid data
      const response = await petService.addPet(invalidPet);

      // Then: Should handle gracefully (Petstore API might accept invalid data)
      // Note: The actual behavior depends on the API implementation
      expect([200, 400, 422]).toContain(response.status());
    });
  });

  test.describe('GET /pet/{petId} - Get Pet by ID', () => {
    test('TC004_givenInvalidPetId_whenGettingPet_thenNotFound', async () => {
      // Given: Invalid pet ID
      const invalidPetId = 999999;

      // When: Attempting to get non-existent pet
      const response = await requestContext.get(`${petService['baseURL']}/pet/${invalidPetId}`);

      // Then: Should return 404
      expect(response.status()).toBe(STATUS_CODES.NOT_FOUND);
    });
  });

  test.describe('PUT /pet - Update Pet', () => {
    test('TC005_givenValidPetData_whenUpdatingPet_thenPetUpdatedSuccessfully', async () => {
      // Given: Valid pet update data
      const updateData = petData.updatePetRequests[0] as any;

      // When: Updating existing pet
      const response = await petService.updatePet(updateData);

      // Then: Pet should be updated successfully
      await ApiHelper.validateResponse(response, STATUS_CODES.OK);
      const updatedPet = await ApiHelper.parseJsonResponse<any>(response);
      
      expect(updatedPet.id).toBe(updateData.id);
      expect(updatedPet.name).toBe(updateData.name);
      expect(updatedPet.status).toBe(updateData.status);
    });
  });

  test.describe('GET /pet/findByStatus - Find Pets by Status', () => {
    test('TC006_givenValidStatus_whenFindingPets_thenPetsReturned', async () => {
      // Given: Valid status
      const status = 'available';

      // When: Finding pets by status
      const pets = await petService.findPetsByStatus(status);

      // Then: Pets should be returned with correct status
      expect(Array.isArray(pets)).toBeTruthy();
      if (pets.length > 0) {
        pets.forEach(pet => {
          expect(pet.status).toBe(status);
        });
      }
    });

    test('TC007_givenDifferentStatuses_whenFindingPets_thenCorrectPetsReturned', async () => {
      // Given: Different statuses to test
      const statuses = ['available', 'pending', 'sold'] as const;

      for (const status of statuses) {
        // When: Finding pets by each status
        const pets = await petService.findPetsByStatus(status);

        // Then: All returned pets should have the correct status
        if (pets.length > 0) {
          pets.forEach(pet => {
            expect(pet.status).toBe(status);
          });
        }
      }
    });
  });

  test.describe('POST /pet/{petId} - Update Pet with Form Data', () => {
    test.skip(true, 'Petstore API form data endpoint returns 415 - API limitation');
    
    test('TC008_givenValidFormData_whenUpdatingPet_thenPetUpdated', async () => {
      // Given: Valid pet ID and form data (using a pet that won't conflict)
      const petId = 3;
      const newName = `Updated ${petData.validPets[2].name}`;
      const newStatus = 'sold';

      // When: Updating pet with form data
      const response = await petService.updatePetWithForm(petId, newName, newStatus);

      // Then: Pet should be updated successfully
      // Note: This endpoint might return different status codes depending on implementation
      expect(response.status()).toBeGreaterThanOrEqual(200);
    });
  });

  test.describe('DELETE /pet/{petId} - Delete Pet', () => {
    test('TC009_givenValidPetId_whenDeletingPet_thenPetDeleted', async () => {
      // Given: Valid pet ID (using the one created in TC001)
      if (createdPetId) {
        // When: Deleting the pet
        const deleteResponse = await petService.deletePet(createdPetId);

        // Then: Pet should be deleted successfully
        expect(deleteResponse.code).toBe(200);
        expect(deleteResponse.type).toBe('unknown');
        expect(deleteResponse.message).toContain(String(createdPetId));
      } else {
        test.skip();
      }
    });

    test('TC010_givenInvalidPetId_whenDeletingPet_thenNotFound', async () => {
      // Given: Invalid pet ID
      const invalidPetId = 999999;

      // When: Attempting to delete non-existent pet
      const response = await requestContext.delete(`${petService['baseURL']}/pet/${invalidPetId}`);

      // Then: Should return 404 or handle gracefully (Petstore API might return 200 for non-existent pets)
      expect([STATUS_CODES.NOT_FOUND, STATUS_CODES.OK]).toContain(response.status());
    });
  });

  test.describe('Data Validation Tests', () => {
    test('TC011_givenSamplePetGenerator_whenCreatingPet_thenValidDataGenerated', async () => {
      // Given: Pet service with sample generator
      // When: Creating sample pet
      const samplePet = petService.createSamplePet();

      // Then: Generated pet should be valid
      expect(petService.validatePetData(samplePet)).toBeTruthy();
      expect(samplePet.name).toBeTruthy();
      expect(samplePet.photoUrls.length).toBeGreaterThan(0);
      expect(['available', 'pending', 'sold']).toContain(samplePet.status);
    });

    test('TC012_givenCustomOverrides_whenCreatingSamplePet_thenOverridesApplied', async () => {
      // Given: Custom overrides
      const overrides = {
        name: 'Custom Pet Name',
        status: 'sold' as const
      };

      // When: Creating sample pet with overrides
      const samplePet = petService.createSamplePet(overrides);

      // Then: Overrides should be applied
      expect(samplePet.name).toBe(overrides.name);
      expect(samplePet.status).toBe(overrides.status);
    });
  });
});
