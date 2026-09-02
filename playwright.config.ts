import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';

const BRAVE_PATH_64 = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const BRAVE_PATH_86 = 'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

const braveExecutablePath = fs.existsSync(BRAVE_PATH_64)
  ? BRAVE_PATH_64
  : fs.existsSync(BRAVE_PATH_86)
  ? BRAVE_PATH_86
  : undefined;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    headless: false,
    launchOptions: {
      executablePath: braveExecutablePath,
      headless: false,
      slowMo: 1000,
    },
  },
  projects: [
    {
      name: 'brave',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        launchOptions: {
          executablePath: braveExecutablePath,
          headless: false,
          slowMo: 1000,
        },
      },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
