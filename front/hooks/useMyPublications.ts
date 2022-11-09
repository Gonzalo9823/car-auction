import { AxiosError } from 'axios';
import useSWR from 'swr';

import { Publication } from '../interfaces/Publication';
import { checkIfError } from '../util/http';

export const useMyPublications = (shouldAskForData = true) => {
  const { data, error, mutate } = useSWR<{ publications: Omit<Publication, 'user'>[] }, AxiosError>(shouldAskForData ? '/publications/mine' : null);

  return {
    publications: data?.publications || [],
    isLoading: shouldAskForData ? !data : false,
    isError: checkIfError(error),
    mutate,
  };
};
