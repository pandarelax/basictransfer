import { useNavigate } from 'react-router-dom';
import { isAuthorizedForUpdateRole } from '../../../auth/auth.utils';
import useAuth from '../../../hooks/useAuth.hook';
import { IAuthUser } from '../../../types/auth.types';
import Button from '../../general/Button';

interface IProps {
  departmentsList: IAuthUser[];
}

const DepartmentsTableSection = ({ departmentsList }: IProps) => {
    // TODO: Fetch departments from the server
  const department = departmentsList[0];
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className='bg-white p-2 rounded-md'>
      <h1 className='text-xl font-bold'>Users Table</h1>
      <div className='grid grid-cols-7 px-2 my-1 text-lg font-semibold border border-gray-300 rounded-md'>
        <div>No</div>
        <div>Department Name</div>
        <div>Users Count</div>
        <div>Operations</div>
      </div>
      {departmentsList.map((user, index) => (
        <div
          key={index}
          className='grid grid-cols-7 px-2 h-12 my-1 border border-gray-200 hover:bg-gray-200 rounded-md'
        >
          <div className='flex items-center'>{index + 1}</div>
          <div className='flex items-center font-semibold'>{user.userName}</div>
          <div className='flex items-center'>{user.lastName}</div>
          <div className='flex items-center'>
            <Button
              label='Update Role'
              onClick={() => navigate(`/dashboard/update-department/${department.id}`)}
              type='button'
              variant='primary'
              disabled={!isAuthorizedForUpdateRole(loggedInUser!.roles[0], user.roles[0])}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentsTableSection;
