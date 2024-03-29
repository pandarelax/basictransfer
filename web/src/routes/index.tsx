import { Navigate, Route, Routes } from 'react-router-dom';
import AuthGuard from '../auth/AuthGuard';
import { adminAccessRoles, allAccessRoles } from '../auth/auth.utils';
import Layout from '../components/layout';
import AdminPage from '../pages/dashboard/AdminPage';
import CreateDepartmentPage from '../pages/dashboard/CreateDepartmentPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import DepartmentsManagementPage from '../pages/dashboard/DepartmentsManagementPage';
import TransferUserPage from '../pages/dashboard/TransferUserPage';
import UpdateDepartmentPage from '../pages/dashboard/UpdateDepartmentPage';
import UpdateRolePage from '../pages/dashboard/UpdateRolePage';
import UserPage from '../pages/dashboard/UserPage';
import UsersManagementPage from '../pages/dashboard/UsersManagementPage';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import RegisterPage from '../pages/public/RegisterPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import { PATH_DASHBOARD, PATH_PUBLIC } from './paths';

const GlobalRouter = () => {
  return (
    <Routes>
      {/* <Route path='' element /> */}
      <Route element={<Layout />}>
        
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path={PATH_PUBLIC.register} element={<RegisterPage />} />
        <Route path={PATH_PUBLIC.login} element={<LoginPage />} />
        <Route path={PATH_PUBLIC.unauthorized} element={<UnauthorizedPage />} />

        {/* Protected routes -------------------------------------------------- */}
        <Route element={<AuthGuard roles={allAccessRoles} />}>
          <Route path={PATH_DASHBOARD.dashboard} element={<DashboardPage />} />
          <Route path={PATH_DASHBOARD.user} element={<UserPage />} />
        </Route>
        <Route element={<AuthGuard roles={adminAccessRoles} />}>
          <Route path={PATH_DASHBOARD.usersManagement} element={<UsersManagementPage />} />
          <Route path={PATH_DASHBOARD.departmentsManagement} element={<DepartmentsManagementPage />} />
          <Route path={PATH_DASHBOARD.updateRole} element={<UpdateRolePage />} />
          <Route path={PATH_DASHBOARD.transferUser} element={<TransferUserPage />} />
          <Route path={PATH_DASHBOARD.updateDepartment} element={<UpdateDepartmentPage />} />
          <Route path={PATH_DASHBOARD.createDepartment} element={<CreateDepartmentPage />} />
          <Route path={PATH_DASHBOARD.admin} element={<AdminPage />} />
        </Route>
        {/* Protected routes -------------------------------------------------- */}

        {/* Catch all (404) */}
        <Route path={PATH_PUBLIC.notFound} element={<NotFoundPage />} />
        <Route path='*' element={<Navigate to={PATH_PUBLIC.notFound} replace />} />
      </Route>
    </Routes>
  );
};

export default GlobalRouter;
