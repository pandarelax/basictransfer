import { IconType } from 'react-icons';

interface IProps {
  count: number;
  icon: IconType;
  color: string;
}

const DepartmentCountCard = ({ count, icon: Icon, color }: IProps) => {
  return (
    <div
      className='px-4 py-6 rounded-lg flex justify-between items-center text-white'
      style={{ backgroundColor: color }}
    >
      <div>
        <h2 className='text-xl'>{count} Departments</h2>
      </div>
      <div>{<Icon className='text-white fill-white text-6xl' />}</div>
    </div>
  );
};

export default DepartmentCountCard;
