import { GetServerSideProps, NextPage } from 'next/types';
import Layout from '../../components/Layout';
import { useMyVehicles } from '../../hooks/useMyVehicles';
import { getInitialData } from '../../util/auth';
import { NumericFormat } from 'react-number-format';
import Link from 'next/link';

interface VehiclesMinePageProps {
  isLogged: boolean;
}

const VehiclesMine: NextPage<VehiclesMinePageProps> = ({ isLogged }) => {
  const { vehicles } = useMyVehicles();

  return (
    <Layout isLogged={isLogged}>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl pb-16 pt-8 px-4 sm:pb-24 sm:pt-10 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Mis Vehiculos</h2>
            <Link
              href="/vehicles/new"
              className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Agregar Vehiculo
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full h-80 rounded-md bg-gray-200 group-hover:opacity-75 lg:w-full lg:aspect-none lg:h-80">
                  <div className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {vehicle.brand} - {vehicle.model}
                      </Link>
                    </h3>
                    <h3 className="text-sm mt-1 text-gray-700">
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {vehicle.licensePlate}
                      </Link>
                    </h3>
                    <h3 className="text-sm mt-1 text-gray-700">
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {vehicle.year}
                      </Link>
                    </h3>

                    <h3 className="text-sm mt-1 text-gray-700">
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        <NumericFormat value={vehicle.kilometers} suffix=" Km" displayType="text" thousandSeparator="." decimalSeparator="," />
                      </Link>
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => getInitialData(ctx);

export default VehiclesMine;
