import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DepartmentCountSection from '../../components/dashboard/departments-management/DepartmentCountSection';
import DepartmentsTableSection from '../../components/dashboard/departments-management/DepartmentsTableSection';
import Button from '../../components/general/Button';
import Spinner from '../../components/general/Spinner';
import { PATH_DASHBOARD } from '../../routes/paths';
import { IServiceResponse } from '../../types/auth.types';
import { IDepartment } from '../../types/department.types';
import axiosInstance from '../../utils/axiosInstance';
import { DEPARTMENTS_LIST_URL } from '../../utils/globalConfig';

const DepartmentsManagementPage = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const getDepartmentsList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<IServiceResponse>(DEPARTMENTS_LIST_URL);
      const { data } = response.data;
      setDepartments(data);
      setLoading(false);
    } catch (error) {
      toast.error('An Error happened. Please Contact admins');
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete<IServiceResponse>(`${DEPARTMENTS_LIST_URL}/${id}`);
      const { success, message } = response.data;

      if (!success) {
        return toast.error(message);
      }

      toast.success(message);
      setDepartments(departments.filter((department) => department.id !== id));
    } catch (error) {
      toast.error('An Error happened. Please Contact admins');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepartmentsList();
  }, [departments.length]);

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
      <Button type='button' label='Add Department' onClick={() => navigate(`${PATH_DASHBOARD.createDepartment}`)} variant='primary' />
      <DepartmentCountSection departmentsList={departments} />
      <DepartmentsTableSection deleteDepartment={deleteDepartment} departmentsList={departments} loading={loading} />
    </div>
  );
};

export default DepartmentsManagementPage;
