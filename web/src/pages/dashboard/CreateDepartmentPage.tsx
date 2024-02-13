import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/general/Button';
import Spinner from '../../components/general/Spinner';
import { PATH_DASHBOARD } from '../../routes/paths';
import { IUpdateDepartmentDto } from '../../types/auth.types';
import axiosInstance from '../../utils/axiosInstance';
import { UPDATE_DEPARTMENT_URL } from '../../utils/globalConfig';

interface ICreateDepartmentForm {
  departmentName: string
}

// TODO: Update as it handles department update and delete user parts
const CreateDepartmentPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ICreateDepartmentForm>({
    departmentName: '',
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log('formData', formData)
  };

  const handleCreateDepartment = async (event) => {
    event.preventDefault();
    console.log('formData', formData)
  };

  const CreateDepartment = async () => {
    try {
      if (!formData.departmentName) return toast.error('Department Name is required');
      setLoading(true);
      const createData: IUpdateDepartmentDto = {
        name: formData.departmentName,
      };
      await axiosInstance.post(`${UPDATE_DEPARTMENT_URL}`, createData);
      toast.success('Department Created Successfully.');
      navigate(`${PATH_DASHBOARD.departmentsManagement}`);
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status } = err;
      if (status === 403) {
        toast.error('You are not allowed to create department. Please contact admins.');
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
      navigate(`${PATH_DASHBOARD.departmentsManagement}`);
    }
  };

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
        <h1 className='text-2xl font-bold'>Create Department</h1>

        <h4 className='text-xl font-bold'>New Department Name:</h4>

         {/* Create department form */}
        <form onSubmit={handleCreateDepartment} className='flex flex-col gap-4'>
          <label className='text-xl font-bold'>
            Name:
            <input onChange={handleChange} value={formData.departmentName} type="text" name="departmentName" />
          </label>

          <div className='grid grid-cols-2 gap-4 mt-12'>
            <Button
              label='Cancel'
              onClick={() => navigate(`${PATH_DASHBOARD.departmentsManagement}`)}
              type='button'
              variant='secondary'
              />
            <Button label='Create' onClick={() => CreateDepartment()} type='submit' variant='primary' loading={loading} />
          </div>
        </form>
         {/* Create department form */}
      </div>
    </div>
  );
};

export default CreateDepartmentPage;
