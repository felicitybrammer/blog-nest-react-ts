import React, { Component, createContext, useContext } from 'react';
import { Auth0ClientOptions, createAuth0Client } from '@auth0/auth0-spa-js';
import { Auth0Client } from '@auth0/auth0-spa-js';

interface ContextValueType {
    isAuthenticated?: boolean,
    user?: any,
    isLoading?: boolean,
    handleRedirectCallback?: () => void,
    getIdTokenClaims?: (...p: any) => any,
    loginWithRedirect?: (...p: any) => any,
    getTokenSilently?: (...p: any) => any,
    logout?: (...p: any) => any
}

//create the context
export const Auth0Context: any = createContext<ContextValueType | null>(null);
export const useAuth0: any = () => useContext(Auth0Context);
interface IState {
    authOClient: any,
    isLoading: boolean,
    isAuthenticated: boolean,
    user?: any,
}

export class Auth0Provider extends Component<{children: any}, IState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isLoading: true,
            isAuthenticated: false,
            user: null,
            authOClient: Auth0Client,
        };
    }

    config: Auth0ClientOptions = {
        domain: `${process.env.REACT_APP_AUTH0_DOMAIN}`,
        clientId: `${process.env.REACT_APP_AUTH_CLIENT_ID}`,
        authorizationParams: {redirect_uri: window.location.origin}
    };

    componentDidMount() {
        this.initializeAuth0();
    }

    initializeAuth0 = async () => {
        const authOClient = await createAuth0Client(this.config);
        this.setState({ authOClient });

        if (window.location.search.includes('code=')) {
            return this.handleRedirectCallback();
        }
        const isAuthenticated = await authOClient.isAuthenticated();
        const user = isAuthenticated ? await authOClient.getUser() : null;
        this.setState({ isLoading: false, isAuthenticated, user });
    };

    handleRedirectCallback = async () => {
        this.setState({ isLoading: true });
        await this.state.authOClient.handleRedirectCallback();
        const user = await this.state.authOClient.getUser();
        this.setState({ user, isAuthenticated: true, isLoading: false });
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    render() {
        const { authOClient, isLoading, isAuthenticated, user } = this.state;
        const { children } = this.props;
        const configObject = {
            isLoading,
            isAuthenticated,
            user,
            loginWithRedirect: (...p: any) => authOClient.loginWithRedirect(...p),
            getTokensSilently: (...p: any) => authOClient.getTokensSilently(...p),
            getIdTokenClaims: (...p: any) => authOClient.getIdTokenClaims(...p),
            logout: (...p: any) => authOClient.logout(...p)
        };
        return <Auth0Context.Provider value={configObject}>{children}</Auth0Context.Provider>;
    }
}