import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock do getComputedStyle para jsdom
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',  // retorna string vazia para qualquer propriedade
    // pode adicionar outros métodos se necessário, por exemplo:
    // length: 0,
    // item: () => null,
  }),
  writable: true,
});


afterEach(() => {
  cleanup();
});

global.matchMedia =
  global.matchMedia ||
  ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
