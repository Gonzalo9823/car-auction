import { OpenSearchClient } from 'infrastructure/opensearch';

const createIndex = async () => {
  const response = await OpenSearchClient.indices.create({
    index: 'cars',
    body: {
      settings: {
        index: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          number_of_shards: 4,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          number_of_replicas: 3,
        },
      },
    },
  });

  console.log('Creating index:');
  console.log(response.body);
};

(async () => {
  try {
    await createIndex();
  } catch (err) {
    console.log(err);
  }
})();
