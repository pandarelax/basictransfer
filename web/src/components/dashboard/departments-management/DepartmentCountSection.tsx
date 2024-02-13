import { FaUserShield } from 'react-icons/fa';
import { IDepartment } from '../../../types/department.types';
import DepartmentCountCard from './DepartmentCountCard';

interface IProps {
  departmentsList: IDepartment[];
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
