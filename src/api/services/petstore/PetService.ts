import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiService } from '../BaseApiService';
import { 
  Pet, 
  CreatePetRequest, 
  UpdatePetRequest, 
  PetQueryParams, 
  PetResponse, 
  PetListResponse,
  PetDeleteResponse,
  PetUploadImageResponse 
} from '@/api/models/petstore';

/**
 * Pet Service for Petstore API
 * Provides methods to interact with the /pet endpoint
 */
export class PetService extends BaseApiService {
  constructor(requestContext: APIRequestContext, baseURL?: string) {
    super(requestContext, baseURL || 'https://petstore.swagger.io/v2');
  }

  /**
   * Add a new pet to the store
   * @param petData - Pet data to create
   * @returns Promise resolving to APIResponse
   */
  async addPet(petData: CreatePetRequest): Promise<APIResponse> {
    const response = await this.post('/pet', petData);
    await this.logResponse(response, 'AddPet');
    return response;
  }

  /**
   * Update an existing pet
   * @param petData - Pet data to update (must include id)
   * @returns Promise resolving to APIResponse
   */
  async updatePet(petData: UpdatePetRequest): Promise<APIResponse> {
    const response = await this.put('/pet', petData);
    await this.logResponse(response, 'UpdatePet');
    return response;
  }

  /**
   * Find pet by ID
   * @param petId - ID of pet to retrieve
   * @returns Promise resolving to PetResponse
   */
  async getPetById(petId: number): Promise<PetResponse> {
    const response = await this.get(`/pet/${petId}`);
    await this.logResponse(response, 'GetPetById');
    await this.validateResponse(response, 200, 'application/json');
    return this.parseJsonResponse<PetResponse>(response);
  }

  /**
   * Updates a pet in the store with form data
   * @param petId - ID of pet to update
   * @param name - Updated name of the pet
   * @param status - Updated status of the pet
   * @returns Promise resolving to APIResponse
   */
  async updatePetWithForm(petId: number, name?: string, status?: string): Promise<APIResponse> {
    const formData: Record<string, string> = {};
    if (name) formData.name = name;
    if (status) formData.status = status;

    const response = await this.post(`/pet/${petId}`, undefined, {
      form: formData
    });
    await this.logResponse(response, 'UpdatePetWithForm');
    return response;
  }

  /**
   * Delete a pet
   * @param petId - ID of pet to delete
   * @param apiKey - Optional API key for authorization
   * @returns Promise resolving to PetDeleteResponse
   */
  async deletePet(petId: number, apiKey?: string): Promise<PetDeleteResponse> {
    const headers: Record<string, string> = {};
    if (apiKey) {
      headers['api_key'] = apiKey;
    }

    const response = await this.delete(`/pet/${petId}`, { headers });
    await this.logResponse(response, 'DeletePet');
    await this.validateResponse(response, 200, 'application/json');
    return this.parseJsonResponse<PetDeleteResponse>(response);
  }

  /**
   * Uploads an image for a pet
   * @param petId - ID of pet to upload image for
   * @param additionalMetadata - Additional metadata
   * @param file - File to upload (as multipart data)
   * @returns Promise resolving to PetUploadImageResponse
   */
  async uploadPetImage(
    petId: number, 
    additionalMetadata?: string, 
    file?: Buffer
  ): Promise<PetUploadImageResponse> {
    const multipartData: Record<string, any> = {};
    if (additionalMetadata) {
      multipartData.additionalMetadata = additionalMetadata;
    }
    if (file) {
      multipartData.file = file;
    }

    const response = await this.post(`/pet/${petId}/uploadImage`, undefined, {
      multipart: multipartData
    });
    await this.logResponse(response, 'UploadPetImage');
    await this.validateResponse(response, 200, 'application/json');
    return this.parseJsonResponse<PetUploadImageResponse>(response);
  }

  /**
   * Finds pets by status
   * @param status - Status filter (available, pending, sold)
   * @returns Promise resolving to Pet array
   */
  async findPetsByStatus(status: PetQueryParams['status']): Promise<Pet[]> {
    const params: Record<string, string> = {};
    if (status) {
      params.status = status;
    }

    const response = await this.get('/pet/findByStatus', { params });
    await this.logResponse(response, 'FindPetsByStatus');
    await this.validateResponse(response, 200, 'application/json');
    return this.parseJsonResponse<Pet[]>(response);
  }

  /**
   * Finds pets by tags (not implemented in this example, but included for completeness)
   * @param tags - Tags to filter by
   * @returns Promise resolving to Pet array
   */
  async findPetsByTags(tags: string[]): Promise<Pet[]> {
    const params: Record<string, string> = {};
    if (tags.length > 0) {
      params.tags = tags.join(',');
    }

    const response = await this.get('/pet/findByTags', { params });
    await this.logResponse(response, 'FindPetsByTags');
    await this.validateResponse(response, 200, 'application/json');
    return this.parseJsonResponse<Pet[]>(response);
  }

  /**
   * Validates pet data structure
   * @param pet - Pet object to validate
   * @returns boolean indicating if pet data is valid
   */
  validatePetData(pet: Pet): boolean {
    if (!pet.name || pet.name.trim() === '') {
      return false;
    }
    
    if (!pet.photoUrls || pet.photoUrls.length === 0) {
      return false;
    }
    
    if (pet.status && !['available', 'pending', 'sold'].includes(pet.status)) {
      return false;
    }
    
    return true;
  }

  /**
   * Creates a sample pet for testing
   * @param overrides - Optional overrides for default values
   * @returns CreatePetRequest object
   */
  createSamplePet(overrides: Partial<CreatePetRequest> = {}): CreatePetRequest {
    const defaultPet: CreatePetRequest = {
      name: `Test Pet ${this.generateRandomString(5)}`,
      photoUrls: [`https://example.com/photo-${this.generateRandomNumber(1000, 9999)}.jpg`],
      category: {
        id: this.generateRandomNumber(1, 10),
        name: 'Test Category'
      },
      tags: [
        {
          id: this.generateRandomNumber(1, 100),
          name: 'Test Tag'
        }
      ],
      status: 'available'
    };

    return { ...defaultPet, ...overrides };
  }
}
