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

// Ensure React 18 act environment flag is enabled for tests
if (!globalThis.IS_REACT_ACT_ENVIRONMENT) {
	// @ts-ignore
	globalThis.IS_REACT_ACT_ENVIRONMENT = true;
}

// Suppress noisy React act warnings that are not actionable in our tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

console.error = (...args) => {
	const first = args[0];
	if (typeof first === 'string') {
		if (first.includes('not configured to support act') || first.includes('not wrapped in act')) {
			return;
		}
		// Expected errors in PermissaoUsuario tests (simulated API failures)
		if (first.includes('Falha ao carregar usuários/grupos') || first.includes('Falha ao atualizar permissões') || first.includes('Falha ao atualizar is_active')) {
			return;
		}
		// React warning when non-boolean or unknown props are passed to DOM (antd/styled-components)
		if (first.includes('for a non-boolean attribute') || first.includes('Invalid attribute name')) {
			return;
		}
		if (first.includes('React does not recognize the') && first.includes('prop on a DOM element')) {
			return;
		}
		// antd compatibility and deprecation warnings
		if (first.includes('antd: compatible') || first.includes('antd v5 support React')) {
			return;
		}
		if (first.includes('antd: Table') && first.includes('rowKey')) {
			return;
		}
		// DOM nesting (e.g. div inside p from antd Upload.Dragger)
		if (first.includes('cannot be a descendant of')) {
			return;
		}
		if (first.includes('cannot contain a nested')) {
			return;
		}
	}
	// @ts-ignore
	originalConsoleError(...args);
};

console.log = (...args) => {
	const first = args[0];
	if (typeof first === 'string' && first.includes('Filtros processados:')) {
		return;
	}
	originalConsoleLog(...args);
};