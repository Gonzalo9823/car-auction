import { AxiosError } from 'axios';
import useSWR from 'swr';

import { Vehicle } from '../interfaces/Vehicle';
import { checkIfError } from '../util/http';

export const useVehicle = (id: string, shouldAskForData = true) => {
  const { data, error, mutate } = useSWR<{ vehicle: Vehicle }, AxiosError>(shouldAskForData ? `/vehicles/${id}` : null);

  return {
    vehicle: data?.vehicle,
    isLoading: shouldAskForData ? !data : false,
    isError: checkIfError(error),
    mutate,
  };
};
