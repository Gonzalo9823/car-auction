import * as yup from 'yup';
import { Formik } from 'formik';
import { GetServerSideProps, NextPage } from 'next/types';
import Layout from '../../components/Layout';
import { getInitialData } from '../../util/auth';
import { User } from '../../interfaces/User';
import { useMemo } from 'react';
import { classNames } from '../../util/classNames';
import { useRouter } from 'next/router';
import { http } from '../../http';
import { createErrorToast, createSuccessToast } from '../../util/toaster';
import { Publication } from '../../interfaces/Publication';
import { usePublication } from '../../hooks/usePublication';

interface PublicationPageProps {
  isLogged: boolean;
  user?: User;
  query: {
    publicationId: string;
  };
}

const BidPublicationSchema = yup.object({
  publicationId: yup.string().uuid().required(),
  amount: yup.number().min(1).required(),
});

type BidPublicationValues = yup.InferType<typeof BidPublicationSchema>;

const Publication: NextPage<PublicationPageProps> = ({ isLogged, query: { publicationId }, user }) => {
  const router = useRouter();
  const { publication } = usePublication(publicationId);

  const canBid = useMemo(() => {
    if (publication && user) {
      if (publication.user.id !== user.id) {
        return true;
      }
    }

    return false;
  }, [publication, user]);

  const initialValues: BidPublicationValues = {
    publicationId,
    amount: undefined as unknown as number,
  };

  return (
    <Layout isLogged={isLogged}>
      <div className="bg-white">
        <div className="pt-6">
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="bg-gray-400 w-full h-80" />
          </div>

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
            <div className={classNames(canBid ? 'lg:border-r lg:border-gray-200' : '', 'lg:col-span-2 lg:pr-8')}>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {publication?.vehicle.brand} - {publication?.vehicle.model}
                </h1>
                <p className="text-3xl tracking-tight text-gray-900">
                  {publication && publication.bids?.length > 0 ? `$${publication?.bids[0].amount}` : '-'}
                </p>
              </div>
            </div>

            {canBid && (
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Ofertar</h2>
                <p className="text-3xl tracking-tight text-gray-900">Ofertar</p>

                <Formik
                  initialValues={initialValues}
                  validateOnChange={false}
                  validationSchema={BidPublicationSchema}
                  onSubmit={async (values: BidPublicationValues) => {
                    try {
                      await http.post<{ publication: Publication }>('/bids', values);
                      createSuccessToast('¡Oferta Creada!');

                      router.reload();
                    } catch (err: unknown) {
                      createErrorToast('Hubo un error creando oferta.');
                    }
                  }}
                >
                  {({ values, handleSubmit, isSubmitting, handleChange, errors }) => (
                    <form onSubmit={handleSubmit} className="mt-10">
                      <div>
                        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700">
                          Monto
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="amount"
                            id="bidAmount"
                            value={values.amount}
                            onChange={handleChange}
                            className={classNames(
                              errors.amount ? 'border-red-600' : 'border-gray-300',
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
                        Ofertar
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            )}

            <div
              className={classNames(canBid ? 'lg:border-r lg:border-gray-200' : '', 'py-10 lg:col-span-2 lg:col-start-1 lg:pt-6 lg:pb-16 lg:pr-8')}
            >
              {/* Description and details */}
              <div className="mt-10">
                <h3 className="text-sm font-medium text-gray-900">Información</h3>

                <div className="mt-4">
                  <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                    <li>Licencia: {publication?.vehicle.licensePlate}</li>
                    <li>Año: {publication?.vehicle.year}</li>
                    <li>Kilometros: {publication?.vehicle?.kilometers}</li>
                    <li>Licencia: {publication?.vehicle.licensePlate}</li>
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

export default Publication;
