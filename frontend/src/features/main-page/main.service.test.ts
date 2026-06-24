import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Language } from '../../common/enums/language.enum';
import { MaterialCategory } from '../../common/enums/material-category.enum';
import { MaterialFormat } from '../../common/enums/material-format.enum';
import type {
  ProcessRequest,
  ProcessResponse,
} from '../../common/types/app.types';

const mockPost = vi.fn();
const accessToken = 'test-access-token';

const processRequest: ProcessRequest = {
  videoUrl: 'https://www.youtube.com/watch?v=abc123xyz',
  settings: {
    format: MaterialFormat.NARRATIVE,
    summaryLength: null,
    language: Language.RU,
    hasQuiz: true,
    quizQuestionsCount: 5,
    quizOptionsCount: 4,
  },
};

const processResponse: ProcessResponse = {
  id: null,
  pendingId: 'pending-id',
  videoId: 'abc123xyz',
  title: 'Sample lecture',
  content: '# Content',
  category: MaterialCategory.SCIENCE,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  quiz: [],
  isPersisted: false,
};

vi.mock('../axios/axios.client', () => ({
  getApiClient: () => ({
    post: (...args: unknown[]) => mockPost(...args),
  }),
}));

describe('main.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('posts process request without auth header for guests', async () => {
    mockPost.mockResolvedValue({ data: processResponse });

    const { processVideo } = await import('./main.service');
    const result = await processVideo(processRequest);

    expect(mockPost).toHaveBeenCalledWith('/process', processRequest, {
      headers: undefined,
    });
    expect(result).toEqual(processResponse);
  });

  it('posts process request with auth header when access token is provided', async () => {
    mockPost.mockResolvedValue({ data: processResponse });

    const { processVideo } = await import('./main.service');
    await processVideo(processRequest, accessToken);

    expect(mockPost).toHaveBeenCalledWith('/process', processRequest, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  });
});
