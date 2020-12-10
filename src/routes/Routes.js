import React, { useEffect } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

import { isUserAuthenticated } from '../helpers/authUtils';
import { allFlattenRoutes as routes } from './index';

import { useSelector } from 'react-redux';

// Lazy loading and code splitting -
// Derieved idea from https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const loading = () => <div></div>;

// All layouts/containers
const AuthLayout = Loadable({
    loader: () => import('../layouts/Auth'),
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    },
    loading,
});

const VerticalLayout = Loadable({
    loader: () => import('../layouts/Vertical'),
    render(loaded, props) {
        let Component = loaded.default;
        return <Component {...props} />;
    },
    loading,
});

// returns the layout
const getLayout = () => {
    if (!isUserAuthenticated()) return AuthLayout;

    return VerticalLayout;
};

const Routes = () => {
    const state = useSelector((state) => state);
    const Layout = getLayout();

    // rendering the router with layout
    return (
        <BrowserRouter>
            <Layout layout={state.Layout} user={state.Auth.user}>
                <Switch>
                    {routes.map((route, index) => {
                        return !route.children ? (
                            <route.route
                                key={index}
                                path={route.path}
                                roles={route.roles}
                                exact={route.exact}
                                component={route.component}></route.route>
                        ) : null;
                    })}
                </Switch>
            </Layout>
        </BrowserRouter>
    );
};

export default Routes;
