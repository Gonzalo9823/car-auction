import { Client } from '@opensearch-project/opensearch';

export const OpenSearchClient = new Client({
  node: 'http://admin:admin@opensearch-node1:9200',
  ssl: {
    rejectUnauthorized: false,
  },
});
