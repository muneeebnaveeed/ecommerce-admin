import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import * as FeatherIcon from 'react-feather';

import { isUserAuthenticated, getLoggedInUser } from '../helpers/authUtils';

// auth
const Login = React.lazy(() => import('../pages/Sample/auth/Login'));
const Logout = React.lazy(() => import('../pages/Sample/auth/Logout'));
const Register = React.lazy(() => import('../pages/Sample/auth/Register'));
const ForgetPassword = React.lazy(() => import('../pages/Sample/auth/ForgetPassword'));
const Confirm = React.lazy(() => import('../pages/Sample/auth/Confirm'));
// dashboard
const Dashboard = React.lazy(() => import('../pages/Sample/dashboard'));
const Collections = React.lazy(() => import('../pages/collections'));
const TagsTypes = React.lazy(() => import('../pages/tags'));

// pages
// const Starter = React.lazy(() => import('../pages/Sample/other/Starter'));
// const Profile = React.lazy(() => import('../pages/Sample/other/Profile/'));
// const Activity = React.lazy(() => import('../pages/Sample/other/Activity'));
// const Invoice = React.lazy(() => import('../pages/Sample/other/Invoice'));
// const Pricing = React.lazy(() => import('../pages/Sample/other/Pricing'));
// const Error404 = React.lazy(() => import('../pages/Sample/other/Error404'));
// const Error500 = React.lazy(() => import('../pages/Sample/other/Error500'));

// charts
// const Charts = React.lazy(() => import('../pages/Sample/charts/'));

// forms
// const BasicForms = React.lazy(() => import('../pages/Sample/forms/Basic'));
// const FormAdvanced = React.lazy(() => import('../pages/Sample/forms/Advanced'));
// const FormValidation = React.lazy(() => import('../pages/Sample/forms/Validation'));
// const FormWizard = React.lazy(() => import('../pages/Sample/forms/Wizard'));
// const FileUpload = React.lazy(() => import('../pages/Sample/forms/FileUpload'));
// const Editor = React.lazy(() => import('../pages/Sample/forms/Editor'));

// tables
// const BasicTables = React.lazy(() => import('../pages/tables/Basic'));
// const AdvancedTables = React.lazy(() => import('../pages/tables/Advanced'));

// handle auth and authorization
const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
            if (!isUserAuthenticated()) {
                // not logged in so redirect to login page with the return url
                return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
            }

            const loggedInUser = getLoggedInUser();

            // check if route is restricted by role
            if (roles && roles.indexOf(loggedInUser.role) === -1) {
                // role not authorised so redirect to home page
                return <Redirect to={{ pathname: '/' }} />;
            }

            // authorised so return component
            return <Component {...props} />;
        }}
    />
);

// root routes
const rootRoute = {
    path: '/',
    exact: true,
    component: () => <Redirect to="/dashboard" />,
    route: PrivateRoute,
};

// dashboards
const dashboardRoute = {
    path: '/dashboard',
    name: 'Dashboard',
    icon: FeatherIcon.Home,
    // header: 'Navigation',
    // badge: {
    //     variant: 'pink',
    //     text: '1',
    // },
    component: Dashboard,
    roles: ['Admin'],
    route: PrivateRoute,
};

// collections
const collectionsRoute = {
    path: '/collections',
    name: 'Collections',
    icon: FeatherIcon.Activity,
    component: Collections,
    roles: ['Admin'],
    route: PrivateRoute,
};

const tagsTypesRoute = {
    path: '/tagstypes',
    name: 'Tags and Types',
    icon: FeatherIcon.Activity,
    component: TagsTypes,
    roles: ['Admin'],
    route: PrivateRoute,
};

// pages
// const pagesRoutes = {
//     path: '/pages',
//     name: 'Pages',
//     header: 'Custom',
//     icon: FeatherIcon.FileText,
//     children: [
//         {
//             path: '/pages/starter',
//             name: 'Starter',
//             component: Starter,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/profile',
//             name: 'Profile',
//             component: Profile,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/activity',
//             name: 'Activity',
//             component: Activity,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/invoice',
//             name: 'Invoice',
//             component: Invoice,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/pricing',
//             name: 'Pricing',
//             component: Pricing,
//             route: PrivateRoute,
//             roles: ['Admin'],
//         },
//         {
//             path: '/pages/error-404',
//             name: 'Error 404',
//             component: Error404,
//             route: Route,
//         },
//         {
//             path: '/pages/error-500',
//             name: 'Error 500',
//             component: Error500,
//             route: Route,
//         },
//     ],
// };

// charts
// const chartRoutes = {
//     path: '/charts',
//     name: 'Charts',
//     component: Charts,
//     icon: FeatherIcon.PieChart,
//     roles: ['Admin'],
//     route: PrivateRoute,
// };

// // forms
// const formsRoutes = {
//     path: '/forms',
//     name: 'Forms',
//     icon: FeatherIcon.FileText,
//     children: [
//         {
//             path: '/forms/basic',
//             name: 'Basic Elements',
//             component: BasicForms,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/advanced',
//             name: 'Advanced',
//             component: FormAdvanced,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/validation',
//             name: 'Validation',
//             component: FormValidation,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/wizard',
//             name: 'Wizard',
//             component: FormWizard,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/editor',
//             name: 'Editor',
//             component: Editor,
//             route: PrivateRoute,
//         },
//         {
//             path: '/forms/upload',
//             name: 'File Upload',
//             component: FileUpload,
//             route: PrivateRoute,
//         },
//     ],
// };

// const tableRoutes = {
//     path: '/tables',
//     name: 'Tables',
//     icon: FeatherIcon.Grid,
//     children: [
//         {
//             path: '/tables/basic',
//             name: 'Basic',
//             component: BasicTables,
//             route: PrivateRoute,
//         },
//         {
//             path: '/tables/advanced',
//             name: 'Advanced',
//             component: AdvancedTables,
//             route: PrivateRoute,
//         },
//     ],
// };

// auth
const authRoutes = {
    path: '/account',
    name: 'Auth',
    children: [
        {
            path: '/account/login',
            name: 'Login',
            component: Login,
            route: Route,
        },
        {
            path: '/account/logout',
            name: 'Logout',
            component: Logout,
            route: Route,
        },
        {
            path: '/account/register',
            name: 'Register',
            component: Register,
            route: Route,
        },
        {
            path: '/account/confirm',
            name: 'Confirm',
            component: Confirm,
            route: Route,
        },
        {
            path: '/account/forget-password',
            name: 'Forget Password',
            component: ForgetPassword,
            route: Route,
        },
    ],
};

// flatten the list of all nested routes
const flattenRoutes = (routes) => {
    let flatRoutes = [];

    routes = routes || [];
    routes.forEach((item) => {
        flatRoutes.push(item);

        if (typeof item.children !== 'undefined') {
            flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
        }
    });
    return flatRoutes;
};

// All routes
const allRoutes = [
    rootRoute,
    dashboardRoute,
    collectionsRoute,
    tagsTypesRoute,
    // pagesRoutes,
    // chartRoutes,
    // formsRoutes,
    // tableRoutes,
    authRoutes,
];

const authProtectedRoutes = [
    dashboardRoute,
    collectionsRoute,
    tagsTypesRoute,
    // pagesRoutes,
    // chartRoutes,
    // formsRoutes,
    // tableRoutes,
];
const allFlattenRoutes = flattenRoutes(allRoutes);
export { allRoutes, authProtectedRoutes, allFlattenRoutes };
