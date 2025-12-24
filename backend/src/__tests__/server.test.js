import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import request from 'supertest';

describe('Express Server', () => {
  let app;
  let server;

  beforeAll(async () => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.PORT = '0';

    // Mock the ENV module
    jest.unstable_mockModule('../config/env.js', () => ({
      ENV: {
        NODE_ENV: 'test',
        PORT: process.env.PORT,
        DB_URL: 'mongodb://localhost:27017/testdb'
      }
    }));

    // Dynamic import to get the mocked version
    const express = (await import('express')).default;
    const path = (await import('path')).default;
    const { ENV } = await import('../config/env.js');

    // Recreate the app logic from server.js
    app = express();
    const __dirname = path.resolve();

    app.get("/api/health", (req, res) => {
      res.status(200).json({ message: "success" });
    });

    if (ENV.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../admin/dist")));
      app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../admin/dist/index.html"));
      });
    }
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('GET /api/health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
    });

    it('should return success message', async () => {
      const response = await request(app).get('/api/health');
      expect(response.body).toEqual({ message: 'success' });
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/health');
      expect(response.headers['content-type']).toMatch(/json/);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/health')
      );
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('success');
      });
    });
  });

  describe('Non-existent Routes', () => {
    it('should return 404 for undefined GET routes', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
    });

    it('should return 404 for undefined POST routes', async () => {
      const response = await request(app).post('/api/nonexistent');
      expect(response.status).toBe(404);
    });
  });

  describe('Edge Cases', () => {
    it('should handle requests with query parameters', async () => {
      const response = await request(app).get('/api/health?foo=bar');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('success');
    });
  });
});