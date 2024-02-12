import { FaUserShield } from 'react-icons/fa';
import { IAuthUser } from '../../../types/auth.types';
import DepartmentCountCard from './DepartmentCountCard';

interface IProps {
  departmentsList: IAuthUser[];
}

const DepartmentCountSection = ({ departmentsList }: IProps) => {
  let departments = 0;

  departments = departmentsList.length;

  const departmentCountData = [
    { count: departments, icon: FaUserShield, color: '#29744c' }
  ];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-x-4'>
      {departmentCountData.map((item, index) => (
        <DepartmentCountCard key={index} count={item.count} icon={item.icon} color={item.color} />
      ))}
    </div>
  );
};

export default DepartmentCountSection;
