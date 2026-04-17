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
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
  },
}); 
