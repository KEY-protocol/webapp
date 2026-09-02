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
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    launchOptions: {
      executablePath: braveExecutablePath,
    },
  },
  projects: [
    {
      name: 'brave',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: braveExecutablePath,
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
