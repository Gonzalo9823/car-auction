import { AxiosError } from 'axios';
import useSWR from 'swr';

import { Publication } from '../interfaces/Publication';
import { checkIfError } from '../util/http';

export const useBiddedPublications = (shouldAskForData = true) => {
  const { data, error, mutate } = useSWR<{ publications: Publication[] }, AxiosError>(shouldAskForData ? '/publications/bidded' : null);

  return {
    publications: data?.publications || [],
    isLoading: shouldAskForData ? !data : false,
    isError: checkIfError(error),
    mutate,
  };
};
