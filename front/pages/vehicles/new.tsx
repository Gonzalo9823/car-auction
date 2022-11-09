import * as yup from 'yup';
import { Formik } from 'formik';
import { GetServerSideProps, NextPage } from 'next/types';
import Layout from '../../components/Layout';
import { getInitialData } from '../../util/auth';
import { classNames } from '../../util/classNames';
import { http } from '../../http';
import { createErrorToast, createSuccessToast } from '../../util/toaster';
import { useRouter } from 'next/router';

interface VehiclesNewPageProps {
  isLogged: boolean;
}

const NewVehicleSchema = yup.object({
  licensePlate: yup.string().required(),
  brand: yup.string().required(),
  model: yup.string().required(),
  year: yup.number().min(1).integer().required(),
  kilometers: yup.number().min(1).integer().required(),
});

type NewVehicleValues = yup.InferType<typeof NewVehicleSchema>;

const VehiclesNew: NextPage<VehiclesNewPageProps> = ({ isLogged }) => {
  const router = useRouter();

  const initialValues: NewVehicleValues = {
    licensePlate: '',
    brand: '',
    model: '',
    year: undefined as unknown as number,
    kilometers: undefined as unknown as number,
  };

  return (
    <Layout isLogged={isLogged}>
      <div className="overflow-hidden bg-white py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Agregar Nuevo Vehiculo</h2>
          </div>
          <div className="mt-12">
            <Formik
              initialValues={initialValues}
              validateOnChange={false}
              validationSchema={NewVehicleSchema}
              onSubmit={async (values: NewVehicleValues) => {
                try {
                  await http.post('/vehicles', values);
                  createSuccessToast('¡Vehiculo Agregado!');

                  await router.push('/vehicles/mine');
                } catch (err: unknown) {
                  createErrorToast('Hubo un error agregando el vehiculo.');
                }
              }}
            >
              {({ values, handleSubmit, isSubmitting, handleChange, errors }) => (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div className="sm:col-span-2">
                    <label htmlFor="license-plate" className="block text-sm font-medium text-gray-700">
                      Patente
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="licensePlate"
                        id="license-plate"
                        value={values.licensePlate}
                        onChange={handleChange}
                        className={classNames(
                          errors.licensePlate ? 'border-red-600' : 'border-gray-300',
                          'block w-full rounded-md py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                      Marca
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="brand"
                        id="brand"
                        value={values.brand}
                        onChange={handleChange}
                        className={classNames(
                          errors.brand ? 'border-red-600' : 'border-gray-300',
                          'block w-full rounded-md py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                      Modelo
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="model"
                        id="model"
                        value={values.model}
                        onChange={handleChange}
                        className={classNames(
                          errors.model ? 'border-red-600' : 'border-gray-300',
                          'block w-full rounded-md py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Año
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="year"
                        id="year"
                        value={values.year}
                        onChange={handleChange}
                        className={classNames(
                          errors.year ? 'border-red-600' : 'border-gray-300',
                          'block w-full rounded-md py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="kilometers" className="block text-sm font-medium text-gray-700">
                      Kilometros
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="kilometers"
                        id="kilometers"
                        value={values.kilometers}
                        onChange={handleChange}
                        className={classNames(
                          errors.kilometers ? 'border-red-600' : 'border-gray-300',
                          'block w-full rounded-md py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                        )}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className={classNames(
                        isSubmitting ? 'spinner' : '',
                        'inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      )}
                    >
                      Agregar Nuevo Vehiculo
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => getInitialData(ctx);

export default VehiclesNew;
