import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';
import { Colors } from '@/constants/theme';
import * as useColorSchemeModule from '@/hooks/use-color-scheme';

// Mock the useColorScheme hook
jest.mock('@/hooks/use-color-scheme');
const mockedUseColorScheme = useColorSchemeModule.useColorScheme as jest.MockedFunction<
  typeof useColorSchemeModule.useColorScheme
>;

describe('useThemeColor Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return color from Colors.light when theme is light', () => {
      mockedUseColorScheme.mockReturnValue('light');
      const { result } = renderHook(() => useThemeColor({}, 'text'));
      expect(result.current).toBe(Colors.light.text);
    });

    it('should return color from Colors.dark when theme is dark', () => {
      mockedUseColorScheme.mockReturnValue('dark');
      const { result } = renderHook(() => useThemeColor({}, 'text'));
      expect(result.current).toBe(Colors.dark.text);
    });

    it('should default to light theme when colorScheme is null', () => {
      mockedUseColorScheme.mockReturnValue(null);
      const { result } = renderHook(() => useThemeColor({}, 'text'));
      expect(result.current).toBe(Colors.light.text);
    });
  });

  describe('Props Override', () => {
    it('should use light prop value when theme is light', () => {
      mockedUseColorScheme.mockReturnValue('light');
      const customColor = '#FF0000';
      const { result } = renderHook(() => 
        useThemeColor({ light: customColor }, 'text')
      );
      expect(result.current).toBe(customColor);
    });

    it('should use dark prop value when theme is dark', () => {
      mockedUseColorScheme.mockReturnValue('dark');
      const customColor = '#00FF00';
      const { result } = renderHook(() => 
        useThemeColor({ dark: customColor }, 'text')
      );
      expect(result.current).toBe(customColor);
    });
  });

  describe('Theme Switching', () => {
    it('should update color when theme changes from light to dark', () => {
      mockedUseColorScheme.mockReturnValue('light');
      const { result, rerender } = renderHook(() => useThemeColor({}, 'text'));
      
      expect(result.current).toBe(Colors.light.text);
      
      mockedUseColorScheme.mockReturnValue('dark');
      rerender();
      
      expect(result.current).toBe(Colors.dark.text);
    });
  });
});