import Head from 'next/head';
import Image from 'next/image';
import { useForm } from '@mantine/form';
import Logo from '@images/logo.png';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import BGLogin from '@images/bg-login.webp';
import { getErrorMessageAxios } from '@/utils/function';
import { notifications } from '@mantine/notifications';
import { AuthRepository } from '@/features/auth/auth.repository';
import { useContext } from 'react';
import { AuthenticationContext } from '@/context/AuthenticationContext';
import { useRouter } from 'next/router';

export default function Page() {
  const { replace } = useRouter();
  const context = useContext(AuthenticationContext);
  const onSubmit = async (values: any) => {
    try {
      const result = await AuthRepository.api.login(values);

      context.setToken(result.data.token);

      replace('/');
    } catch (e) {
      const message = getErrorMessageAxios(e);
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    }
  };

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value: string) => {
        if (!value) {
          return 'Username harus diisi';
        }
        return null;
      },
      password: (value: string) => {
        if (!value) {
          return 'Password harus diisi';
        }
        return null;
      },
    },
  });

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login" />
      </Head>
      <div className="flex flex-col items-stretch min-h-screen">
        <div
          className={`
        h-20 w-full shadow-md px-5
        lg:px-20
        `}
        >
          <div className="flex items-center justify-start w-full h-full ">
            <Image src={Logo} alt="Logo" width={200} />
          </div>
        </div>
        <div className="grow bg-white flex flex-row">
          <div
            className={`
          hidden
          lg:block lg:grow lg:basis-4/12
          `}
          >
            <div className="relative w-full h-full rounded-tr-[5%]">
              <Image
                src={BGLogin}
                alt="Logo"
                className="rounded-tr-[5%]"
                style={{
                  objectFit: 'cover',
                }}
                fill
              />
            </div>
          </div>
          <div
            className={`
            grow basis-8/12 flex flex-col justify-center px-5
            lg:basis-8/12 lg:px-40
          `}
          >
            <div
              className={`
            text-black-custom text-2xl text-center font-bold pb-3
              lg:pb-3 lg:text-left lg:text-4xl
            `}
            >
              Masuk SPM <i>(Smart Project Management)</i>
            </div>
            <form onSubmit={form.onSubmit(onSubmit)}>
              <Stack gap={'lg'}>
                <Stack gap={5}>
                  <div className="text-base font-medium lg:text-xl">Username</div>
                  <TextInput placeholder="Username" {...form.getInputProps('username')} />
                </Stack>
                <Stack gap={5}>
                  <div className="text-base font-medium lg:text-xl">Password</div>
                  <PasswordInput placeholder="Username" {...form.getInputProps('password')} />
                </Stack>
                <Button variant="filled" type="submit" size="lg" fullWidth>
                  Masuk
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
