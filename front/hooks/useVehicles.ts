import { AxiosError } from 'axios';
import useSWR from 'swr';

import { Vehicle } from '../interfaces/Vehicle';
import { checkIfError } from '../util/http';

export const useVehicles = (shouldAskForData = true) => {
  const { data, error, mutate } = useSWR<{ vehicles: Vehicle[] }, AxiosError>(shouldAskForData ? '/vehicles' : null);

  return {
    vehicles: data?.vehicles || [],
    isLoading: shouldAskForData ? !data : false,
    isError: checkIfError(error),
    mutate,
  };
};
