import * as yup from 'yup';
import { Formik } from 'formik';
import { GetServerSideProps, NextPage } from 'next/types';
import Layout from '../../components/Layout';
import { getInitialData } from '../../util/auth';
import { useVehicle } from '../../hooks/useVehicle';
import { User } from '../../interfaces/User';
import { useMemo } from 'react';
import { classNames } from '../../util/classNames';
import { useRouter } from 'next/router';
import { http } from '../../http';
import { createErrorToast, createSuccessToast } from '../../util/toaster';
import { Publication } from '../../interfaces/Publication';
import Link from 'next/link';
import { usePublications } from '../../hooks/usePublications';

interface VehiclePageProps {
  isLogged: boolean;
  user?: User;
  query: {
    vehicleId: string;
  };
}

const PublishVehicleSchema = yup.object({
  vehicleId: yup.string().uuid().required(),
  endDate: yup.date().required(),
});

type PublishVehicleValues = yup.InferType<typeof PublishVehicleSchema>;

const Vehicle: NextPage<VehiclePageProps> = ({ isLogged, query: { vehicleId }, user }) => {
  const router = useRouter();
  const { vehicle } = useVehicle(vehicleId);
  const { publications } = usePublications();

  const hasPublication = useMemo(() => {
    if (vehicle && publications.length > 0) {
      return publications.find((publication) => publication.vehicle.id === vehicle.id);
    }
  }, [vehicle, publications]);

  const canPublish = useMemo(() => {
    if (vehicle && user) {
      if (vehicle.owner.id === user.id && hasPublication === undefined) {
        return true;
      }
    }

    return false;
  }, [vehicle, user, hasPublication]);

  const initialValues: PublishVehicleValues = {
    vehicleId,
    endDate: undefined as unknown as Date,
  };

  return (
    <Layout isLogged={isLogged}>
      <div className="bg-white">
        <div className="pt-6">
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="bg-gray-200 rounded-md w-full h-80" />
          </div>

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
            <div className={classNames(canPublish ? 'lg:border-r lg:border-gray-200' : '', 'lg:col-span-2 lg:pr-8')}>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {vehicle?.brand} - {vehicle?.model}
                </h1>
                {hasPublication && (
                  <Link
                    href={`/publications/${hasPublication.id}`}
                    className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Ver Publicación
                  </Link>
                )}
              </div>
            </div>

            {canPublish && (
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Publicar</h2>
                <p className="text-3xl tracking-tight text-gray-900">Publicar</p>

                <Formik
                  initialValues={initialValues}
                  validateOnChange={false}
                  validationSchema={PublishVehicleSchema}
                  onSubmit={async (values: PublishVehicleValues) => {
                    try {
                      await http.post<{ publication: Publication }>('/publications', values);
                      createSuccessToast('¡Publicación Creada!');

                      await router.push('/publications/mine');
                    } catch (err: unknown) {
                      createErrorToast('Hubo un error creando la publicación.');
                    }
                  }}
                >
                  {({ values, handleSubmit, isSubmitting, handleChange, errors }) => (
                    <form onSubmit={handleSubmit} className="mt-10">
                      <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                          Fecha de Termino
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={values.endDate?.toString() || ''}
                            onChange={handleChange}
                            className={classNames(
                              errors.endDate ? 'border-red-600' : 'border-gray-300',
                              'block w-full rounded-md py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                            )}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={classNames(
                          isSubmitting ? 'spinner' : '',
                          'mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        )}
                      >
                        Publicar
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            )}

            <div
              className={classNames(
                canPublish ? 'lg:border-r lg:border-gray-200' : '',
                'py-10 lg:col-span-2 lg:col-start-1 lg:pt-6 lg:pb-16 lg:pr-8'
              )}
            >
              {/* Description and details */}
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Información</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    <li>Licencia: {vehicle?.licensePlate}</li>
                    <li>Año: {vehicle?.year}</li>
                    <li>Kilometros: {vehicle?.kilometers}</li>
                    <li>Licencia: {vehicle?.licensePlate}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => getInitialData(ctx);

export default Vehicle;
