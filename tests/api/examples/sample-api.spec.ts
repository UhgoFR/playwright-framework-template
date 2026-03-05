import { test, expect } from '@playwright/test';
import { ApiFactory } from '@/api/factory/ApiFactory';
import { ApiHelper } from '@/utils/ApiHelper';
import { STATUS_CODES } from '@/config/api-config';

test.describe('Sample API Tests', () => {
  let apiFactory: ApiFactory;
  let requestContext: any;

  test.beforeAll(async () => {
    apiFactory = ApiFactory.getInstance();
    requestContext = await apiFactory.createRequestContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    await ApiHelper.setRequestContext(requestContext);
  });

  test.afterAll(async () => {
    await apiFactory.closeAllRequestContexts();
  });

  test('TC001_givenValidRequest_whenGettingPosts_thenPostsReturned', async () => {
    // Given: Valid API endpoint
    const endpoint = '/posts';

    // When: Making GET request
    const response = await requestContext.get(`${(requestContext as any)._options.baseURL}${endpoint}`);
    await ApiHelper.logResponse(response, 'TC001_GetPosts');

    // Then: Posts should be returned
    await ApiHelper.validateResponse(response, STATUS_CODES.OK);
    const posts = await ApiHelper.parseJsonResponse<any[]>(response);
    
    expect(Array.isArray(posts)).toBeTruthy();
    expect(posts.length).toBeGreaterThan(0);
    
    // Validate post structure
    const firstPost = posts[0];
    expect(firstPost).toHaveProperty('id');
    expect(firstPost).toHaveProperty('title');
    expect(firstPost).toHaveProperty('body');
    expect(firstPost).toHaveProperty('userId');
  });

  test('TC002_givenValidPostId_whenGettingPostById_thenPostReturned', async () => {
    // Given: Valid post ID
    const postId = 1;
    const endpoint = `/posts/${postId}`;

    // When: Making GET request for specific post
    const response = await requestContext.get(`${(requestContext as any)._options.baseURL}${endpoint}`);
    await ApiHelper.logResponse(response, 'TC002_GetPostById');

    // Then: Specific post should be returned
    await ApiHelper.validateResponse(response, STATUS_CODES.OK);
    const post = await ApiHelper.parseJsonResponse<any>(response);
    
    expect(post).toHaveProperty('id', postId);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post).toHaveProperty('userId');
  });

  test('TC003_givenValidPostData_whenCreatingPost_thenPostCreated', async () => {
    // Given: Valid post data
    const postData = {
      title: `Test Post ${ApiHelper.generateRandomString()}`,
      body: 'This is a test post created via API automation',
      userId: ApiHelper.generateRandomNumber(1, 10)
    };
    const endpoint = '/posts';

    // When: Creating new post
    const response = await requestContext.post(`${requestContext['_options'].baseURL}${endpoint}`, {
      data: postData
    });
    await ApiHelper.logResponse(response, 'TC003_CreatePost');

    // Then: Post should be created successfully
    await ApiHelper.validateResponse(response, STATUS_CODES.CREATED);
    const createdPost = await ApiHelper.parseJsonResponse<any>(response);
    
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(postData.title);
    expect(createdPost.body).toBe(postData.body);
    expect(createdPost.userId).toBe(postData.userId);
  });

  test('TC004_givenInvalidPostId_whenGettingPost_thenNotFoundReturned', async () => {
    // Given: Invalid post ID
    const invalidPostId = 999999;
    const endpoint = `/posts/${invalidPostId}`;

    // When: Making GET request for non-existent post
    const response = await requestContext.get(`${(requestContext as any)._options.baseURL}${endpoint}`);
    await ApiHelper.logResponse(response, 'TC004_GetNonExistentPost');

    // Then: Not found error should be returned
    await ApiHelper.validateResponse(response, STATUS_CODES.NOT_FOUND);
  });

  test('TC005_givenValidPostData_whenUpdatingPost_thenPostUpdated', async () => {
    // Given: Valid post data for update
    const postId = 1;
    const updateData = {
      title: `Updated Post ${ApiHelper.generateRandomString()}`,
      body: 'This post has been updated via API automation'
    };
    const endpoint = `/posts/${postId}`;

    // When: Updating existing post
    const response = await requestContext.put(`${requestContext['_options'].baseURL}${endpoint}`, {
      data: updateData
    });
    await ApiHelper.logResponse(response, 'TC005_UpdatePost');

    // Then: Post should be updated successfully
    await ApiHelper.validateResponse(response, STATUS_CODES.OK);
    const updatedPost = await ApiHelper.parseJsonResponse<any>(response);
    
    expect(updatedPost).toHaveProperty('id', postId);
    expect(updatedPost.title).toBe(updateData.title);
    expect(updatedPost.body).toBe(updateData.body);
  });

  test('TC006_givenValidPostId_whenDeletingPost_thenPostDeleted', async () => {
    // Given: Valid post ID
    const postId = 1;
    const endpoint = `/posts/${postId}`;

    // When: Deleting post
    const response = await requestContext.delete(`${requestContext['_options'].baseURL}${endpoint}`);
    await ApiHelper.logResponse(response, 'TC006_DeletePost');

    // Then: Post should be deleted successfully
    await ApiHelper.validateResponse(response, STATUS_CODES.OK);
  });
});
