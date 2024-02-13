import { useNavigate } from 'react-router-dom';
import { isAuthorizedForUpdateDepartment } from '../../../auth/auth.utils';
import useAuth from '../../../hooks/useAuth.hook';
import { IDepartment } from '../../../types/department.types';
import Button from '../../general/Button';
import Spinner from '../../general/Spinner';

interface IProps {
  departmentsList: IDepartment[];
  deleteDepartment: (id: string) => void;
  loading: boolean;
}

const DepartmentsTableSection = ({ departmentsList, deleteDepartment, loading }: IProps) => {
    // TODO: Fetch departments from the server
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className='w-full'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='bg-white p-2 rounded-md'>
      <h1 className='text-xl font-bold'>Users Table</h1>
      <div className='grid grid-cols-7 px-2 my-1 text-lg font-semibold border border-gray-300 rounded-md'>
        <div>No</div>
        <div>Department Name</div>
        <div>Users Count</div>
        <div>Operations</div>
      </div>
      {departmentsList.map((department, index) => (
        <div
          key={index}
          className='grid grid-cols-7 px-2 h-12 my-1 border border-gray-200 hover:bg-gray-200 rounded-md'
        >
          <div className='flex items-center'>{index + 1}</div>
          <div className='flex items-center font-semibold'>{department.name}</div>
          <div className='flex items-center'>-</div>
          <div className='flex items-center'>
            <Button
              label='Update'
              onClick={() => navigate(`/dashboard/update-department/${department.id}`)}
              type='button'
              variant='primary'
              disabled={!isAuthorizedForUpdateDepartment(loggedInUser?.roles)}
            />
            <Button
              label='Delete'
              onClick={() => deleteDepartment(department.id)}
              type='button'
              variant='danger'
              disabled={!isAuthorizedForUpdateDepartment(loggedInUser?.roles)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentsTableSection;
