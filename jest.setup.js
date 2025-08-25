import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for libraries (e.g., react-router) that rely on them in JSDOM
import { TextEncoder, TextDecoder } from 'util'

if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder
}

if (!global.TextDecoder) {
	// @ts-ignore - Node's TextDecoder type is compatible for our purposes
	global.TextDecoder = TextDecoder
}

// Ant Design and other UI libs rely on matchMedia in the browser
if (!window.matchMedia) {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: jest.fn(), // deprecated
			removeListener: jest.fn(), // deprecated
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		})),
	});
}

// Polyfill ResizeObserver used by AntD components
if (!('ResizeObserver' in global)) {
	class ResizeObserverMock {
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	// @ts-ignore
	global.ResizeObserver = ResizeObserverMock
}

// Override incondicional do getComputedStyle (JSDOM define mas lança "not implemented")
	Object.defineProperty(window, 'getComputedStyle', {
		writable: true,
		value: () => ({
			getPropertyValue: () => '',
			overflow: 'visible',
			overflowX: 'visible',
			overflowY: 'visible',
		}),
	});