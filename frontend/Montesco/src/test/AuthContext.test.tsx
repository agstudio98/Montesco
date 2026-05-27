import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import React from 'react';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('should start with empty user and cart', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.cart).toEqual([]);
  });

  it('should handle login successfully', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const userInfo = { _id: '1', name: 'Test', email: 'test@test.com', isAdmin: false, token: 'abc' };

    act(() => {
      result.current.login(userInfo);
    });

    expect(result.current.user).toEqual(userInfo);
    expect(window.localStorage.getItem('userInfo')).toBe(JSON.stringify(userInfo));
  });

  it('should handle logout successfully', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const userInfo = { _id: '1', name: 'Test', email: 'test@test.com', isAdmin: false, token: 'abc' };

    act(() => {
      result.current.login(userInfo);
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(window.localStorage.getItem('userInfo')).toBeNull();
  });

  it('should add items to cart', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const product = { _id: 'p1', name: 'Product 1', price: 100, image: 'img.jpg' };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(1);
    expect(result.current.cart[0]._id).toBe('p1');
  });

  it('should increment quantity if same item is added to cart', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const product = { _id: 'p1', name: 'Product 1', price: 100, image: 'img.jpg' };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.cart.length).toBe(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  it('should remove items from cart', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const product = { _id: 'p1', name: 'Product 1', price: 100, image: 'img.jpg' };

    act(() => {
      result.current.addToCart(product);
    });

    act(() => {
      result.current.removeFromCart('p1');
    });

    expect(result.current.cart.length).toBe(0);
  });
});
