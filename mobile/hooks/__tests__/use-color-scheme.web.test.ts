import { renderHook, waitFor, act } from '@testing-library/react-native';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Mock react-native
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

describe('useColorScheme Hook (Web)', () => {
  const mockedUseRNColorScheme = useRNColorScheme as jest.MockedFunction<typeof useRNColorScheme>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  describe('Web Implementation (use-color-scheme.web.ts)', () => {
    it('should return light before hydration', () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result } = renderHook(() => useColorScheme());
      
      // Before hydration, should return 'light'
      expect(result.current).toBe('light');
    });

    it('should return actual color scheme after hydration', async () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result } = renderHook(() => useColorScheme());
      
      // Wait for hydration effect
      await waitFor(() => {
        expect(result.current).toBe('dark');
      });
    });

    it('should handle light color scheme after hydration', async () => {
      mockedUseRNColorScheme.mockReturnValue('light');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result } = renderHook(() => useColorScheme());
      
      await waitFor(() => {
        expect(result.current).toBe('light');
      });
    });

    it('should handle null color scheme gracefully', async () => {
      mockedUseRNColorScheme.mockReturnValue(null);
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result } = renderHook(() => useColorScheme());
      
      // Before hydration
      expect(result.current).toBe('light');
      
      // After hydration
      await waitFor(() => {
        expect(result.current).toBe(null);
      });
    });

    it('should handle undefined color scheme gracefully', async () => {
      mockedUseRNColorScheme.mockReturnValue(undefined);
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result } = renderHook(() => useColorScheme());
      
      expect(result.current).toBe('light');
      
      await waitFor(() => {
        expect(result.current).toBe(undefined);
      });
    });
  });

  describe('Hydration Behavior', () => {
    it('should set hasHydrated to true after mount', async () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result } = renderHook(() => useColorScheme());
      
      // Initially not hydrated
      expect(result.current).toBe('light');
      
      // After hydration
      await waitFor(() => {
        expect(result.current).not.toBe('light');
      });
    });

    it('should only run hydration effect once', async () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result, rerender } = renderHook(() => useColorScheme());
      
      await waitFor(() => {
        expect(result.current).toBe('dark');
      });
      
      const afterHydration = result.current;
      
      // Rerender shouldn't change the state
      rerender();
      expect(result.current).toBe(afterHydration);
    });
  });

  describe('Static Rendering Support', () => {
    it('should support server-side rendering with light default', () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result } = renderHook(() => useColorScheme());
      
      // SSR should get 'light' to avoid hydration mismatch
      expect(result.current).toBe('light');
    });

    it('should prevent hydration mismatch by defaulting to light', () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      
      // Multiple renders before hydration should be consistent
      const { result: result1 } = renderHook(() => useColorScheme());
      const { result: result2 } = renderHook(() => useColorScheme());
      
      expect(result1.current).toBe('light');
      expect(result2.current).toBe('light');
    });
  });

  describe('Color Scheme Updates', () => {
    it('should update when system color scheme changes after hydration', async () => {
      mockedUseRNColorScheme.mockReturnValue('light');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result, rerender } = renderHook(() => useColorScheme());
      
      await waitFor(() => {
        expect(result.current).toBe('light');
      });
      
      mockedUseRNColorScheme.mockReturnValue('dark');
      rerender();
      
      expect(result.current).toBe('dark');
    });

    it('should handle rapid color scheme changes', async () => {
      mockedUseRNColorScheme.mockReturnValue('light');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result, rerender } = renderHook(() => useColorScheme());
      
      await waitFor(() => {
        expect(result.current).toBe('light');
      });
      
      // Rapid changes
      mockedUseRNColorScheme.mockReturnValue('dark');
      rerender();
      expect(result.current).toBe('dark');
      
      mockedUseRNColorScheme.mockReturnValue('light');
      rerender();
      expect(result.current).toBe('light');
      
      mockedUseRNColorScheme.mockReturnValue('dark');
      rerender();
      expect(result.current).toBe('dark');
    });
  });

  describe('Edge Cases', () => {
    it('should handle unmounting before hydration', () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result, unmount } = renderHook(() => useColorScheme());
      
      expect(result.current).toBe('light');
      unmount();
      // Should not throw or cause memory leaks
    });

    it('should handle remounting after unmount', async () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme.web');
      
      const { result: result1, unmount: unmount1 } = renderHook(() => useColorScheme());
      expect(result1.current).toBe('light');
      unmount1();
      
      const { result: result2 } = renderHook(() => useColorScheme());
      expect(result2.current).toBe('light');
      
      await waitFor(() => {
        expect(result2.current).toBe('dark');
      });
    });

    it('should handle switching between null and defined values', async () => {
      mockedUseRNColorScheme.mockReturnValue(null);
      const { useColorScheme } = require('../use-color-scheme.web');
      const { result, rerender } = renderHook(() => useColorScheme());
      
      await waitFor(() => {
        expect(result.current).toBe(null);
      });
      
      mockedUseRNColorScheme.mockReturnValue('dark');
      rerender();
      expect(result.current).toBe('dark');
      
      mockedUseRNColorScheme.mockReturnValue(null);
      rerender();
      expect(result.current).toBe(null);
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      mockedUseRNColorScheme.mockReturnValue('light');
      const { useColorScheme } = require('../use-color-scheme.web');
      
      let renderCount = 0;
      const { rerender } = renderHook(() => {
        renderCount++;
        return useColorScheme();
      });
      
      await waitFor(() => {
        // Should render: 1) initial, 2) after hydration
        expect(renderCount).toBeLessThanOrEqual(2);
      });
      
      const countAfterHydration = renderCount;
      
      // Additional rerenders without prop changes shouldn't increase count
      rerender();
      expect(renderCount).toBe(countAfterHydration);
    });
  });
});