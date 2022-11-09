import * as yup from 'yup';
import { Formik } from 'formik';
import { PatternFormat } from 'react-number-format';

import { LockClosedIcon } from '@heroicons/react/20/solid';
import { classNames } from '../../util/classNames';
import { http } from '../../http';
import { createErrorToast, createSuccessToast } from '../../util/toaster';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next/types';
import { checkIfAlreadyAuth } from '../../util/auth';

const SignUpSchema = yup.object({
  name: yup.string().required('Ingrese un nombre valido.'),
  phone: yup.number().min(11111111).required('Ingrese un celular valido'),
  email: yup.string().email().required('Ingrese un mail valido.'),
  password: yup.string().required('Ingrese una contraseña valida.'),
});

type SignUpValues = yup.InferType<typeof SignUpSchema>;

export default function SignIn() {
  const router = useRouter();

  const initialValues: SignUpValues = {
    name: '',
    phone: undefined as unknown as number,
    email: '',
    password: '',
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Crear Cuenta</h2>
          </div>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validationSchema={SignUpSchema}
            onSubmit={async (values: SignUpValues) => {
              try {
                await http.post<{ accessToken: string }>('/auth/sign-up', { ...values, phone: `+569${values.phone}` });
                createSuccessToast('¡Cuenta Creada!');

                await router.push('/auth/sign-in');
              } catch (err: unknown) {
                createErrorToast('Hubo un error creando la cuenta.');
              }
            }}
          >
            {({ values, handleSubmit, isSubmitting, handleChange, setFieldValue, errors }) => (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="-space-y-px rounded-md shadow-sm">
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Nombre
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange}
                      className={classNames(
                        errors.name ? 'border-red-600' : 'border-gray-300',
                        'relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      )}
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="sr-only">
                      Celular
                    </label>
                    <PatternFormat
                      format="+56 9 #### ####"
                      allowEmptyFormatting
                      mask=""
                      className={classNames(
                        errors.phone ? 'border-red-600' : 'border-gray-300',
                        'relative block w-full appearance-none rounded-none border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      )}
                      onValueChange={(value) => setFieldValue('phone', value.floatValue)}
                      value={values.phone}
                      id="phone"
                      autoComplete="phone"
                      placeholder="Celular"
                    />
                  </div>
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
                        'relative block w-full appearance-none rounded-none border px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
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
                    Registrarse
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
