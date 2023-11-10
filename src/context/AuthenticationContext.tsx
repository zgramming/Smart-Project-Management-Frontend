import { IJWTPayload } from '@/interface/jwt_payload.interface';
import { JWT_PAYLOAD_KEY, TOKEN_KEY } from '@/utils/constant';
import { instance } from '@/utils/http';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { createContext, useCallback, useEffect, useState } from 'react';

type ContextProps = {
  token?: string;
  jwtPayload?: IJWTPayload;

  // eslint-disable-next-line no-unused-vars
  setToken: (token: string) => void;
  removeToken: () => void;
};

const defaultValue: ContextProps = {
  token: undefined,
  setToken: () => {},
  removeToken: () => {},
};

export const AuthenticationContext = createContext<ContextProps>(defaultValue);

function AuthProvider({ children }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [token, setToken] = useState<string | undefined>();
  const [jwtPayload, setJWTPayload] = useState<IJWTPayload | undefined>();

  const onSetJWTPayload = (token?: string) => {
    if (!token) {
      return;
    }

    const decodeJWT: IJWTPayload = jwtDecode(token);
    Cookies.set(JWT_PAYLOAD_KEY, JSON.stringify(decodeJWT));
    setJWTPayload(decodeJWT);
  };

  const onSetToken = useCallback((token: string) => {
    Cookies.set(TOKEN_KEY, token);
    setToken(token);

    onSetJWTPayload(token);
    // Set Headers Authorization for Axios
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, []);

  const onRemoveToken = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(JWT_PAYLOAD_KEY);
    setToken(undefined);
    setJWTPayload(undefined);

    // Remove Headers Authorization for Axios
    delete instance.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const init = async () => {
      const token = Cookies.get(TOKEN_KEY);
      if (token) {
        onSetToken(token);
      }
      setIsLoading(false);
    };

    init();
    return () => {};
  }, [onSetToken]);

  if (isLoading) {
    return;
  }

  return (
    <AuthenticationContext.Provider
      value={{
        jwtPayload,
        token,
        setToken: onSetToken,
        removeToken: onRemoveToken,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export default AuthProvider;
