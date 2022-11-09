import { AxiosError } from 'axios';
import useSWR from 'swr';

import { Publication } from '../interfaces/Publication';
import { checkIfError } from '../util/http';

export const usePublication = (id: string, shouldAskForData = true) => {
  const { data, error, mutate } = useSWR<{ publication: Publication }, AxiosError>(shouldAskForData ? `/publications/${id}` : null);

  return {
    publication: data?.publication,
    isLoading: shouldAskForData ? !data : false,
    isError: checkIfError(error),
    mutate,
  };
};
