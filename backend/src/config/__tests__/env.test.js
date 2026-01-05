import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('ENV Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    // Clear module cache to get fresh ENV object
    jest.resetModules();
  });

  describe('Environment Variable Loading', () => {
    it('should load NODE_ENV from environment', async () => {
      process.env.NODE_ENV = 'test';
      const { ENV } = await import('../env.js');
      expect(ENV.NODE_ENV).toBe('test');
    });

    it('should load PORT from environment', async () => {
      process.env.PORT = '8080';
      const { ENV } = await import('../env.js');
      expect(ENV.PORT).toBe('8080');
    });

    it('should load DB_URL from environment', async () => {
      process.env.DB_URL = 'mongodb://localhost:27017/testdb';
      const { ENV } = await import('../env.js');
      expect(ENV.DB_URL).toBe('mongodb://localhost:27017/testdb');
    });

    it('should handle undefined environment variables', async () => {
      delete process.env.NODE_ENV;
      delete process.env.PORT;
      delete process.env.DB_URL;
      const { ENV } = await import('../env.js');
      expect(ENV.NODE_ENV).toBeUndefined();
      expect(ENV.PORT).toBeUndefined();
      expect(ENV.DB_URL).toBeUndefined();
    });
  });

  describe('ENV Object Structure', () => {
    it('should export ENV object with all expected properties', async () => {
      const { ENV } = await import('../env.js');
      expect(ENV).toHaveProperty('NODE_ENV');
      expect(ENV).toHaveProperty('PORT');
      expect(ENV).toHaveProperty('DB_URL');
    });

    it('should have exactly 3 properties', async () => {
      const { ENV } = await import('../env.js');
      expect(Object.keys(ENV)).toHaveLength(3);
    });
  });

  describe('Production Environment', () => {
    it('should correctly identify production environment', async () => {
      process.env.NODE_ENV = 'production';
      process.env.PORT = '3000';
      const { ENV } = await import('../env.js');
      expect(ENV.NODE_ENV).toBe('production');
      expect(ENV.PORT).toBe('3000');
    });

    it('should handle production DB URL', async () => {
      process.env.NODE_ENV = 'production';
      process.env.DB_URL = 'mongodb://prod-server:27017/proddb';
      const { ENV } = await import('../env.js');
      expect(ENV.DB_URL).toBe('mongodb://prod-server:27017/proddb');
    });
  });

  describe('Development Environment', () => {
    it('should correctly identify development environment', async () => {
      process.env.NODE_ENV = 'development';
      const { ENV } = await import('../env.js');
      expect(ENV.NODE_ENV).toBe('development');
    });

    it('should handle development DB URL', async () => {
      process.env.NODE_ENV = 'development';
      process.env.DB_URL = 'mongodb://localhost:27017/devdb';
      const { ENV } = await import('../env.js');
      expect(ENV.DB_URL).toBe('mongodb://localhost:27017/devdb');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', async () => {
      process.env.NODE_ENV = '';
      process.env.PORT = '';
      const { ENV } = await import('../env.js');
      expect(ENV.NODE_ENV).toBe('');
      expect(ENV.PORT).toBe('');
    });

    it('should handle numeric PORT values', async () => {
      process.env.PORT = '3000';
      const { ENV } = await import('../env.js');
      expect(ENV.PORT).toBe('3000');
      expect(typeof ENV.PORT).toBe('string');
    });

    it('should handle special characters in DB_URL', async () => {
      process.env.DB_URL = 'mongodb://user:p@ss!word@localhost:27017/db?authSource=admin';
      const { ENV } = await import('../env.js');
      expect(ENV.DB_URL).toBe('mongodb://user:p@ss!word@localhost:27017/db?authSource=admin');
    });
  });
});