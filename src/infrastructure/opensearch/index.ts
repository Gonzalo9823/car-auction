import { Client } from '@opensearch-project/opensearch';

export const OpenSearchClient = new Client({
  node: 'http://admin:admin@car-auction-open-search-node-1:9200',
  ssl: {
    rejectUnauthorized: false,
  },
});
