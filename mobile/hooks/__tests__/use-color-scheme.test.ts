import { renderHook } from '@testing-library/react-native';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Mock react-native
jest.mock('react-native', () => ({
  useColorScheme: jest.fn(),
}));

describe('useColorScheme Hook', () => {
  const mockedUseRNColorScheme = useRNColorScheme as jest.MockedFunction<typeof useRNColorScheme>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Native Implementation (use-color-scheme.ts)', () => {
    it('should export useColorScheme from react-native', () => {
      // This tests the re-export
      const { useColorScheme } = require('../use-color-scheme');
      expect(useColorScheme).toBeDefined();
    });

    it('should return light color scheme from react-native', () => {
      mockedUseRNColorScheme.mockReturnValue('light');
      const { useColorScheme } = require('../use-color-scheme');
      const { result } = renderHook(() => useColorScheme());
      expect(result.current).toBe('light');
    });

    it('should return dark color scheme from react-native', () => {
      mockedUseRNColorScheme.mockReturnValue('dark');
      const { useColorScheme } = require('../use-color-scheme');
      const { result } = renderHook(() => useColorScheme());
      expect(result.current).toBe('dark');
    });

    it('should return null when color scheme is unavailable', () => {
      mockedUseRNColorScheme.mockReturnValue(null);
      const { useColorScheme } = require('../use-color-scheme');
      const { result } = renderHook(() => useColorScheme());
      expect(result.current).toBe(null);
    });

    it('should return undefined when color scheme is undefined', () => {
      mockedUseRNColorScheme.mockReturnValue(undefined);
      const { useColorScheme } = require('../use-color-scheme');
      const { result } = renderHook(() => useColorScheme());
      expect(result.current).toBe(undefined);
    });
  });

  describe('Type Safety', () => {
    it('should handle all valid color scheme values', () => {
      const validSchemes: Array<'light' | 'dark' | null | undefined> = [
        'light',
        'dark',
        null,
        undefined,
      ];

      validSchemes.forEach((scheme) => {
        mockedUseRNColorScheme.mockReturnValue(scheme);
        const { useColorScheme } = require('../use-color-scheme');
        const { result } = renderHook(() => useColorScheme());
        expect(result.current).toBe(scheme);
      });
    });
  });

  describe('Hook Behavior', () => {
    it('should not cause re-renders unnecessarily', () => {
      mockedUseRNColorScheme.mockReturnValue('light');
      const { useColorScheme } = require('../use-color-scheme');
      const { result, rerender } = renderHook(() => useColorScheme());
      
      const firstResult = result.current;
      rerender();
      
      expect(result.current).toBe(firstResult);
    });

    it('should update when color scheme changes', () => {
      mockedUseRNColorScheme.mockReturnValue('light');
      const { useColorScheme } = require('../use-color-scheme');
      const { result, rerender } = renderHook(() => useColorScheme());
      
      expect(result.current).toBe('light');
      
      mockedUseRNColorScheme.mockReturnValue('dark');
      rerender();
      
      expect(result.current).toBe('dark');
    });
  });
});