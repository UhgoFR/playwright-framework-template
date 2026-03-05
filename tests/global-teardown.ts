import { FullConfig } from '@playwright/test';
import { ApiFactory } from '../src/api/factory/ApiFactory';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  // Clean up any global resources
  const apiFactory = ApiFactory.getInstance();
  await apiFactory.closeAllRequestContexts();
  
  // Example: Clean up test database or mock services
  console.log('✅ Global teardown completed');
}

export default globalTeardown;
