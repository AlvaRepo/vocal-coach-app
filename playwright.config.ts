import { defineConfig, devices } from '@playwright/test';  
  
export default defineConfig({  
  testDir: './tests',  
  testMatch: /.*\.spec\.ts/,  
  fullyParallel: true,  
  use: {  
    headless: true,  
  },  
  projects: [  
    { name: 'Chromium', use: { browserName: 'chromium' } },  
  ],  
}); 
