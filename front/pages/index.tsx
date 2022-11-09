import { GetServerSideProps, NextPage } from 'next/types';
import Layout from '../components/Layout';
import { usePublications } from '../hooks/usePublications';
import { getInitialData } from '../util/auth';
import { NumericFormat } from 'react-number-format';
import Link from 'next/link';

interface HomePageProps {
  isLogged: boolean;
}

const Home: NextPage<HomePageProps> = ({ isLogged }) => {
  const { publications } = usePublications();

  return (
    <Layout isLogged={isLogged}>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl pb-16 pt-8 px-4 sm:pb-24 sm:pt-10 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Publicaciones</h2>
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {publications.map((publication) => (
              <div key={publication.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full h-80 rounded-md bg-gray-200 group-hover:opacity-75 lg:w-full lg:aspect-none lg:h-80">
                  <div className="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/publications/${publication.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {publication.vehicle.brand} - {publication.vehicle.model}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {publication.vehicle.year} -{' '}
                      <NumericFormat
                        value={publication.vehicle.kilometers}
                        suffix=" Km"
                        displayType="text"
                        thousandSeparator="."
                        decimalSeparator=","
                      />
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{publication.bids.length > 0 ? `$${publication.bids[0].amount}` : '-'}</p>
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

export default Home;
