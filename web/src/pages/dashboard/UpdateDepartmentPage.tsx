import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { isAuthorizedForUpdateDepartment } from '../../auth/auth.utils';
import Button from '../../components/general/Button';
import Spinner from '../../components/general/Spinner';
import useAuth from '../../hooks/useAuth.hook';
import { IUpdateDepartmentDto } from '../../types/auth.types';
import { IGetDepartment } from '../../types/department.types';
import axiosInstance from '../../utils/axiosInstance';
import { DEPARTMENTS_LIST_URL, UPDATE_DEPARTMENT_URL } from '../../utils/globalConfig';

interface IUpdateDepartmentForm {
  departmentName: string
}

// TODO: Update as it handles department update and delete user parts
const UpdateDepartmentPage = () => {
  const { user: loggedInUser } = useAuth();
  const { id } = useParams();
  const [departmentName, setDepartmentName] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<IUpdateDepartmentForm>({
    departmentName: '',
  });
  const navigate = useNavigate();

  const getDepartmentById = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get<IGetDepartment>(DEPARTMENTS_LIST_URL);
      const data = response.data.data;

      if (!isAuthorizedForUpdateDepartment(loggedInUser!.roles)) {
        setLoading(false);
        toast.error('You are not allowed to update department. Please contact admins.');
        navigate('/dashboard/departments');
      } else {
        setDepartmentName(data.name);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      const err = error as { data: string; status: number };
      const { status } = err;

      if (status === 404) {
        toast.error('Department not Found!!!!!!!!!!!!!!!!!');
      } else {
        toast.error('An Error occured. Please contact admins');
      }
      navigate('/dashboard/departments');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log('formData', formData)
  };

  const handleUpdateDepartment = async (event) => {
    event.preventDefault();
    console.log('formData', formData)
  };

  const UpdateDepartment = async () => {
    try {
      if (!departmentName) return;
      setPostLoading(true);
      const updateData: IUpdateDepartmentDto = {
        name: formData.departmentName,
      };
      await axiosInstance.put(`${UPDATE_DEPARTMENT_URL}/${id}`, updateData);
      setPostLoading(false);
      toast.success('Department updated Successfully.');
      navigate('/dashboard/departments');
    } catch (error) {
      setPostLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 403) {
        toast.error('You are not allowed to update department. Please contact admins.');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
      navigate('/dashboard/departments');
    }
  };

  useEffect(() => {
    getDepartmentById();
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
            Department Name:
            <span className='text-2xl font-bold ml-2 px-2 py-1 text-purple-600 rounded-md'>{departmentName}</span>
          </h4>
        </div>

        <h4 className='text-xl font-bold'>New Department Name:</h4>

         {/* Update department form */}
        <form onSubmit={handleUpdateDepartment} className='flex flex-col gap-4'>
          <label className='text-xl font-bold'>
            Name:
            <input onChange={handleChange} value={formData.departmentName} type="text" name="departmentName" />
          </label>

          <div className='grid grid-cols-2 gap-4 mt-12'>
            <Button
              label='Cancel'
              onClick={() => navigate('/dashboard/departments')}
              type='button'
              variant='secondary'
              />
            <Button label='Update' onClick={() => UpdateDepartment()} type='submit' variant='primary' loading={postLoading} />
          </div>
        </form>
         {/* Update department form */}
      </div>
    </div>
  );
};

export default UpdateDepartmentPage;
