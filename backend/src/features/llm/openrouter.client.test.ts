import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpenRouterClient } from './openrouter.client';

describe('OpenRouterClient', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [{ message: { content: '{"processedText":"ok"}' } }],
        }),
    });
  });

  it('routes structured output requests only to providers supporting all parameters', async () => {
    const client = new OpenRouterClient({
      get: vi.fn((key: string) => {
        if (key === 'OPEN_ROUTER_API_KEY') {
          return 'test-api-key';
        }

        return 'openrouter/free';
      }),
    } as unknown as ConfigService);

    await client.createChatCompletion({
      messages: [{ role: 'user', content: 'Hello' }],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'chunk_map_response',
          strict: true,
          schema: {
            type: 'object',
            properties: { processedText: { type: 'string' } },
            required: ['processedText'],
            additionalProperties: false,
          },
        },
      },
      temperature: 0.2,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const requestBody =
      typeof requestInit.body === 'string'
        ? requestInit.body
        : JSON.stringify(requestInit.body);
    const body = JSON.parse(requestBody) as {
      model: string;
      provider: { require_parameters: boolean };
      response_format: { type: string; json_schema: { strict: boolean } };
    };

    expect(body.model).toBe('openrouter/free');
    expect(body.provider).toEqual({ require_parameters: true });
    expect(body.response_format.type).toBe('json_schema');
    expect(body.response_format.json_schema.strict).toBe(true);
  });
});
