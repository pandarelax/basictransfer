import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { isAuthorizedForUpdateDepartment } from '../../auth/auth.utils';
import Button from '../../components/general/Button';
import Spinner from '../../components/general/Spinner';
import useAuth from '../../hooks/useAuth.hook';
import { IAuthUser, IUpdateDepartmentDto } from '../../types/auth.types';
import { IDepartment } from '../../types/department.types';
import axiosInstance from '../../utils/axiosInstance';
import { DEPARTMENTS_LIST_URL, USERS_LIST_URL } from '../../utils/globalConfig';

interface IGetUser {
  data: IAuthUser;
}

const TransferUserPage = () => {
  const { user: loggedInUser } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState<IAuthUser>();
  const [department, setDepartment] = useState<string>();
  const [departmentList, setDepartmentList] = useState<IDepartment[]>();
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
      setDepartment(data.department)
      if (!isAuthorizedForUpdateDepartment(loggedInUser!.roles)) {
        setLoading(false);
        toast.error('You are not allowed to transfer this user');
        navigate('/dashboard/users');
      } else {
        setUser(data);
        setDepartment(data?.department);
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

  const getDepartments = async () => {
    try {
      const response = await axiosInstance.get(DEPARTMENTS_LIST_URL);
      const data = response.data.data;
      setDepartmentList(data);
    } catch (error) {
      toast.error('An Error occured. Please contact admins');
    }
  }

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
    getDepartments();
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
        <h1 className='text-2xl font-bold'>Transfer User</h1>

        <div className='border border-dashed border-purple-300 rounded-md'>
          <h4 className='text-xl'>
            UserName:
            <span className='text-2xl font-bold ml-2 px-2 py-1 text-purple-600 rounded-md'>{userName}</span>
          </h4>
        </div>
        <div className='border border-dashed border-purple-300 rounded-md'>
          <h4 className='text-xl'>
            Department:
            <span className='text-2xl font-bold ml-2 px-2 py-1 text-purple-600 rounded-md'>{department}</span>
          </h4>
        </div>

        <h4 className='text-xl font-bold'>New Department:</h4>

        <select value={department} className='w-80' onChange={(e) => setDepartment(e.target.value)}>
          {departmentList?.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
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
