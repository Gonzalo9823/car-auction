import { AxiosError } from 'axios';
import useSWR from 'swr';

import { Publication } from '../interfaces/Publication';
import { checkIfError } from '../util/http';

export const usePublications = (shouldAskForData = true) => {
  const { data, error, mutate } = useSWR<{ publications: Publication[] }, AxiosError>(shouldAskForData ? '/publications' : null);

  return {
    publications: data?.publications || [],
    isLoading: shouldAskForData ? !data : false,
    isError: checkIfError(error),
    mutate,
  };
};
