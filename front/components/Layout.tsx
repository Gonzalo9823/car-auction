import Link from 'next/link';
import { FunctionComponent, ReactNode, useState } from 'react';
import { http } from '../http';
import { classNames } from '../util/classNames';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';

interface LayoutProps {
  isLogged: boolean;
  children?: ReactNode;
}

const Layout: FunctionComponent<LayoutProps> = ({ isLogged, children }) => {
  const [isLoggingOut, setIsLogginOut] = useState(false);
  const router = useRouter();

  const logOut = async () => {
    setIsLogginOut(true);
    try {
      await http.post<{ accessToken: string }>('/auth/sign-out');
    } finally {
      deleteCookie('a_token');
      deleteCookie('a_token');

      router.reload();
    }
  };

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl px-4 md:px-6 py-2.5">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Car Auction</span>
          </Link>
          {!isLogged ? (
            <div className="flex items-center">
              <Link href="/auth/sign-up" className="text-sm mr-6 font-medium text-blue-600 dark:text-blue-500 hover:underline">
                Registrarse
              </Link>
              <Link href="/auth/sign-in" className="text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">
                Iniciar Sesión
              </Link>
            </div>
          ) : (
            <button
              className={classNames(isLoggingOut ? 'spinner' : '', 'text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline')}
              onClick={logOut}
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </nav>
      {isLogged && (
        <nav className="bg-gray-50 dark:bg-gray-700">
          <div className="py-3 px-4 mx-auto max-w-screen-xl md:px-6">
            <div className="flex items-center">
              <ul className="flex flex-row mt-0 mr-6 text-center space-x-8 text-sm font-medium">
                <li>
                  <Link href="/" className="text-gray-900 dark:text-white hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/vehicles/mine" className="text-gray-900 dark:text-white hover:underline">
                    Mis Vehiculos
                  </Link>
                </li>
                <li>
                  <Link href="/publications/mine" className="text-gray-900 dark:text-white hover:underline">
                    Mis Publicaciones
                  </Link>
                </li>
                <li>
                  <Link href="/publications/bidded" className="text-gray-900 dark:text-white hover:underline">
                    Mis Ofertas
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
      <main>{children}</main>
    </>
  );
};

export default Layout;
