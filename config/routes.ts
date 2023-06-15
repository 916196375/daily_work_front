import routers from '../src/utils/routers';
import { projectManagement } from './routers/projectManagement';

export const layoutsRoutes = [
    {
        path: '',
        redirect: routers.root,
    },
    {
        path: routers.root,
        name: 'Auto eCRF',
        icon: 'fire',
        routes: [
            // { path: routers.autoEcrf, component: '@/pages/AutoEcrf' },
            // { path: routers.autoEcrfChat, component: '@/pages/AutoEcrf/Chat' },
        ],
    },
    {
        path: '*',
        redirect: routers.root,
    },
    ...projectManagement
]
const voidRoutes = [
    {
        path: routers.login,
        component: '@/pages/Login',
    },
]

export default [
    {
        component: '@/layouts/VoidLayout',
        routes: voidRoutes,
    },
    {
        component: '@/layouts/BaseLayout',
        routes: layoutsRoutes,
    },
]
