import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API_BASE_PATH, API_CLIENT_DEFAULT_HEADERS } from './axios.constants';

const mockCreate = vi.fn(() => ({ defaults: {} }));

vi.mock('axios', () => ({
  default: {
    create: mockCreate,
  },
}));

describe('axios.client', () => {
  beforeEach(() => {
    vi.resetModules();
    mockCreate.mockClear();
  });

  it('creates a shared client with API base path and JSON headers', async () => {
    const { getApiClient } = await import('./axios.client');

    getApiClient();

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: API_BASE_PATH,
      headers: API_CLIENT_DEFAULT_HEADERS,
    });
  });

  it('returns the same client instance on repeated calls', async () => {
    const { getApiClient } = await import('./axios.client');

    expect(getApiClient()).toBe(getApiClient());
  });
});
