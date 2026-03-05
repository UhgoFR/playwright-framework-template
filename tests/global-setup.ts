import { chromium, FullConfig } from '@playwright/test';
import { ApiFactory } from '../src/api/factory/ApiFactory';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');
  
  // Set up global test data or configurations
  process.env.TEST_START_TIME = new Date().toISOString();
  
  // Initialize any global services
  const apiFactory = ApiFactory.getInstance();
  
  // Example: Set up test database or mock services
  console.log('✅ Global setup completed');
}

export default globalSetup;
