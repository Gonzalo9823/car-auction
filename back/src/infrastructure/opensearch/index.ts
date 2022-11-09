import { Client } from '@opensearch-project/opensearch';

import config from '@/config';

export const OpenSearchClient = new Client({
  node: config.OPENSEARCH_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
