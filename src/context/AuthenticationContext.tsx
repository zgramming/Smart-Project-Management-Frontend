import { TOKEN_KEY } from "@/utils/constant";
import { instance } from "@/utils/http";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

type ContextProps = {
    token?: string;
    // eslint-disable-next-line no-unused-vars
    setToken: (token: string) => void;
    removeToken: () => void;
}

const defaultValue: ContextProps = {
    token: undefined,
    setToken: () => { },
    removeToken: () => { },
}

export const AuthenticationContext = createContext<ContextProps>(defaultValue);

function AuthProvider({ children }: any) {
    const [token, setToken] = useState<string | undefined>();

    const onSetToken = (token: string) => {
        Cookies.set(TOKEN_KEY, token);
        setToken(token);

        // Set Headers Authorization for Axios
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const onRemoveToken = () => {
        Cookies.remove(TOKEN_KEY);
        setToken(undefined);

        // Remove Headers Authorization for Axios
        delete instance.defaults.headers.common['Authorization'];
    }

    useEffect(() => {
        const token = Cookies.get(TOKEN_KEY);
        if (token) {
            onSetToken(token);
        }

        return () => {
        }
    }, [])


    return <AuthenticationContext.Provider value={{
        token,
        setToken: onSetToken,
        removeToken: onRemoveToken,
    }}>
        {children}
    </AuthenticationContext.Provider>;
}

export default AuthProvider;