import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import React from 'react';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn(), language: 'es' }
  }),
}));

describe('Navbar Component', () => {
  it('renders the logo', () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    );
    
    expect(screen.getByText('MONTESCO')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    );
    
    expect(screen.getByText('NAVBAR.CATALOG')).toBeInTheDocument();
    expect(screen.getByText('NAVBAR.SUPPORT')).toBeInTheDocument();
  });

  it('renders login link when user is not logged in', () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    );
    
    expect(screen.getByText('NAVBAR.LOGIN')).toBeInTheDocument();
  });
});
