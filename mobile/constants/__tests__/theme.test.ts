import { Platform } from 'react-native';
import { Colors, Fonts } from '../theme';

// Mock Platform
jest.mock('react-native', () => ({
  Platform: {
    select: jest.fn(),
  },
}));

describe('Theme Constants', () => {
  describe('Colors', () => {
    describe('Light Theme', () => {
      it('should have all required color properties', () => {
        expect(Colors.light).toHaveProperty('text');
        expect(Colors.light).toHaveProperty('background');
        expect(Colors.light).toHaveProperty('tint');
        expect(Colors.light).toHaveProperty('icon');
        expect(Colors.light).toHaveProperty('tabIconDefault');
        expect(Colors.light).toHaveProperty('tabIconSelected');
      });

      it('should have correct light theme colors', () => {
        expect(Colors.light.text).toBe('#11181C');
        expect(Colors.light.background).toBe('#fff');
        expect(Colors.light.tint).toBe('#0a7ea4');
        expect(Colors.light.icon).toBe('#687076');
      });
    });

    describe('Dark Theme', () => {
      it('should have all required color properties', () => {
        expect(Colors.dark).toHaveProperty('text');
        expect(Colors.dark).toHaveProperty('background');
        expect(Colors.dark).toHaveProperty('tint');
      });

      it('should have correct dark theme colors', () => {
        expect(Colors.dark.text).toBe('#ECEDEE');
        expect(Colors.dark.background).toBe('#151718');
        expect(Colors.dark.tint).toBe('#fff');
      });
    });

    describe('Theme Consistency', () => {
      it('should have same properties in both themes', () => {
        const lightKeys = Object.keys(Colors.light).sort();
        const darkKeys = Object.keys(Colors.dark).sort();
        expect(lightKeys).toEqual(darkKeys);
      });

      it('should have different background colors for themes', () => {
        expect(Colors.light.background).not.toBe(Colors.dark.background);
      });
    });
  });
});