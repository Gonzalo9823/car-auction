import { AxiosError } from 'axios';
import useSWR from 'swr';

import { Vehicle } from '../interfaces/Vehicle';
import { checkIfError } from '../util/http';

export const useMyVehicles = (shouldAskForData = true) => {
  const { data, error, mutate } = useSWR<{ vehicles: Omit<Vehicle, 'owner'>[] }, AxiosError>(shouldAskForData ? '/vehicles/mine' : null);

  return {
    vehicles: data?.vehicles || [],
    isLoading: shouldAskForData ? !data : false,
    isError: checkIfError(error),
    mutate,
  };
};
