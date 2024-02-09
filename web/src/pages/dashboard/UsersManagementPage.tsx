import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import LatestUsersSection from '../../components/dashboard/users-management/LatestUsersSection';
import UserCountSection from '../../components/dashboard/users-management/UserCountSection';
import UsersTableSection from '../../components/dashboard/users-management/UsersTableSection';
import Spinner from '../../components/general/Spinner';
import { IAuthUser, IServiceResponse } from '../../types/auth.types';
import axiosInstance from '../../utils/axiosInstance';
import { USERS_LIST_URL } from '../../utils/globalConfig';

const UsersManagementPage = () => {
  const [users, setUsers] = useState<IAuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getUsersList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IServiceResponse>(USERS_LIST_URL);
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
      <h1 className='text-2xl font-bold'>Users Management</h1>
      <UserCountSection usersList={users} />
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-x-4'>
        <LatestUsersSection usersList={users} />
      </div>
      <UsersTableSection usersList={users} />
    </div>
  );
};

export default UsersManagementPage;
