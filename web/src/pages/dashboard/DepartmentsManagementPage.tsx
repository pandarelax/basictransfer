import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import DepartmentCountSection from '../../components/dashboard/departments-management/DepartmentCountSection';
import DepartmentsTableSection from '../../components/dashboard/departments-management/DepartmentsTableSection';
import Spinner from '../../components/general/Spinner';
import { IAuthUser, IServiceResponse } from '../../types/auth.types';
import axiosInstance from '../../utils/axiosInstance';
import { DEPARTMENTS_LIST_URL } from '../../utils/globalConfig';

const DepartmentsManagementPage = () => {
  const [users, setUsers] = useState<IAuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsersList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IServiceResponse>(DEPARTMENTS_LIST_URL);
      const { data } = response.data;
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error('An Error happened. Please Contact admins');
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersList();
  }, []);

  if (loading) {
    return (
      <div className='w-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='pageTemplate2'>
      <h1 className='text-2xl font-bold'>Departments Management</h1>
      <DepartmentCountSection departmentsList={users} />
      <DepartmentsTableSection departmentsList={users} />
    </div>
  );
};

export default DepartmentsManagementPage;
