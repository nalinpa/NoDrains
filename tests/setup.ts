import { vi } from 'vitest'

// Mock chrome.storage API
global.chrome = {
  storage: {
    local: {
      get: vi.fn((keys) => {
        return Promise.resolve({})
      }),
      set: vi.fn((items) => {
        return Promise.resolve()
      }),
    },
  },
  runtime: {
    onMessage: {
      addListener: vi.fn(),
    },
    sendMessage: vi.fn(),
  },
  tabs: {
    query: vi.fn(),
    sendMessage: vi.fn(),
  },
} as any