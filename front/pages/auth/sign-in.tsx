import * as yup from 'yup';
import { Formik } from 'formik';
import { setCookie } from 'cookies-next';

import { LockClosedIcon } from '@heroicons/react/20/solid';
import { classNames } from '../../util/classNames';
import { http } from '../../http';
import { createErrorToast, createSuccessToast } from '../../util/toaster';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { checkIfAlreadyAuth } from '../../util/auth';

const SignInSchema = yup.object({
  email: yup.string().email().required('Ingrese un mail valido.'),
  password: yup.string().required('Ingrese una contraseña valida.'),
});

type SignInValues = yup.InferType<typeof SignInSchema>;

export default function SignIn() {
  const router = useRouter();

  const initialValues: SignInValues = {
    email: '',
    password: '',
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Iniciar Sesión</h2>
          </div>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validationSchema={SignInSchema}
            onSubmit={async (values: SignInValues) => {
              try {
                const { data } = await http.post<{ accessToken: string }>('/auth/sign-in', values);
                setCookie('a_token', data.accessToken, { path: '/', secure: false });
                createSuccessToast('¡Sesión Iniciada!');

                await router.push('/');
              } catch (err: unknown) {
                createErrorToast('Hubo un error iniciando sesión.');
              }
            }}
          >
            {({ values, handleSubmit, isSubmitting, handleChange, errors }) => (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="email-address" className="sr-only">
                      Mail
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      className={classNames(
                        errors.email ? 'border-red-600' : 'border-gray-300',
                        'relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      )}
                      placeholder="Mail"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={values.password}
                      onChange={handleChange}
                      className={classNames(
                        errors.password ? 'border-red-600' : 'border-gray-300',
                        'relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      )}
                      placeholder="Contraseña"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={classNames(
                      isSubmitting ? 'spinner' : '',
                      'group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    )}
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                    </span>
                    Iniciar Sesión
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => checkIfAlreadyAuth(ctx);
