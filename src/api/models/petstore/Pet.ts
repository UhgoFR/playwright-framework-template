/**
 * Category model for Pet entity
 */
export interface Category {
  id?: number;
  name: string;
}

/**
 * Tag model for Pet entity
 */
export interface Tag {
  id?: number;
  name: string;
}

/**
 * Pet model based on Swagger Petstore API
 */
export interface Pet {
  id?: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: 'available' | 'pending' | 'sold';
}

/**
 * Pet creation request payload
 */
export interface CreatePetRequest {
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: 'available' | 'pending' | 'sold';
}

/**
 * Pet update request payload
 */
export interface UpdatePetRequest {
  id: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status?: 'available' | 'pending' | 'sold';
}

/**
 * Pet query parameters
 */
export interface PetQueryParams {
  status?: 'available' | 'pending' | 'sold';
}

/**
 * Pet response with metadata
 */
export interface PetResponse {
  id: number;
  category?: Category;
  name: string;
  photoUrls: string[];
  tags?: Tag[];
  status: 'available' | 'pending' | 'sold';
}

/**
 * Pet list response
 */
export interface PetListResponse {
  pets: Pet[];
  total: number;
}

/**
 * Pet deletion response
 */
export interface PetDeleteResponse {
  code: number;
  type: string;
  message: string;
}

/**
 * Pet upload image response
 */
export interface PetUploadImageResponse {
  code: number;
  type: string;
  message: string;
}
