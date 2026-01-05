import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<App />);
      expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
    });

    it('should render Vite logo', () => {
      render(<App />);
      const viteLogo = screen.getByAltText('Vite logo');
      expect(viteLogo).toBeInTheDocument();
      expect(viteLogo).toHaveAttribute('src', '/vite.svg');
    });

    it('should render React logo', () => {
      render(<App />);
      const reactLogo = screen.getByAltText('React logo');
      expect(reactLogo).toBeInTheDocument();
      expect(reactLogo.src).toContain('react.svg');
    });
  });

  describe('Counter Functionality', () => {
    it('should display initial count of 0', () => {
      render(<App />);
      expect(screen.getByText(/count is 0/i)).toBeInTheDocument();
    });

    it('should increment count when button is clicked', async () => {
      render(<App />);
      const button = screen.getByRole('button', { name: /count is 0/i });
      
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/count is 1/i)).toBeInTheDocument();
      });
    });

    it('should increment count multiple times', async () => {
      render(<App />);
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(/count is 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button', () => {
      render(<App />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    it('should have alt text for images', () => {
      render(<App />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.alt).not.toBe('');
      });
    });
  });
});