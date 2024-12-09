// src/__mocks__/mockRouter.js

export const createMockRouter = (overrides = {}) => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    asPath: '/',
    query: {},
    pathname: '/',
    route: '/',
    ...overrides, // This allows you to override any values when needed
  });
  