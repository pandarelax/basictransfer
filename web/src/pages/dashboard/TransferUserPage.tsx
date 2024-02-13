import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { allowedRolesForUpdateArray, isAuthorizedForUpdateDepartment } from '../../auth/auth.utils';
import Button from '../../components/general/Button';
import Spinner from '../../components/general/Spinner';
import useAuth from '../../hooks/useAuth.hook';
import { IAuthUser, IUpdateDepartmentDto } from '../../types/auth.types';
import axiosInstance from '../../utils/axiosInstance';
import { USERS_LIST_URL } from '../../utils/globalConfig';

interface IGetUser {
  data: IAuthUser;
}

const TransferUserPage = () => {
  const { user: loggedInUser } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState<IAuthUser>();
  const [department, setDepartment] = useState<string>();
  const [userName, setUserName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const getUserById = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IGetUser>(`${USERS_LIST_URL}/${id}`);
      const data = response.data.data;
      setUserName(data.userName);
      if (!isAuthorizedForUpdateDepartment(loggedInUser!.roles)) {
        setLoading(false);
        toast.error('You are not allowed to transfer this user');
        navigate('/dashboard/users');
      } else {
        setUser(data);
        setDepartment(data?.roles[0]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 404) {
        toast.error('UserName not Found!!!!!!!!!!!!!!!!!');
      } else {
        toast.error('An Error occured. Please contact admins');
      }
      navigate('/dashboard/users');
    }
  };


  const Update = async () => {
    try {
      if (!department || !userName) return;
      setPostLoading(true);
      const updateData: IUpdateDepartmentDto = {
        userId: id,
        departmentName: department,
      };
      await axiosInstance.put(USERS_LIST_URL, updateData);
      setPostLoading(false);
      toast.success('Role updated Successfully.');
      navigate('/dashboard/users');
    } catch (error) {
      setPostLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 403) {
        toast.error('You are not allowed to change role of this user');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
      navigate('/dashboard/users');
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  if (loading) {
    return (
      <div className='w-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='p-4 w-2/4 mx-auto flex flex-col gap-4'>
      <div className='bg-white p-2 rounded-md flex flex-col gap-4'>
        <h1 className='text-2xl font-bold'>Update Role</h1>

        <div className='border border-dashed border-purple-300 rounded-md'>
          <h4 className='text-xl'>
            UserName:
            <span className='text-2xl font-bold ml-2 px-2 py-1 text-purple-600 rounded-md'>{userName}</span>
          </h4>
        </div>

        <h4 className='text-xl font-bold'>New Department:</h4>

        <select value={department} className='w-80' onChange={(e) => setDepartment(e.target.value)}>
          {allowedRolesForUpdateArray(loggedInUser).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className='grid grid-cols-2 gap-4 mt-12'>
          <Button
            label='Cancel'
            onClick={() => navigate('/dashboard/users')}
            type='button'
            variant='secondary'
          />
          <Button label='Transfer' onClick={() => Update()} type='button' variant='primary' loading={postLoading} />
        </div>
      </div>
    </div>
  );
};

export default TransferUserPage;
