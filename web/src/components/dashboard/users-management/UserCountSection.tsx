import { FaUser, FaUserShield } from 'react-icons/fa';
import { IAuthUser, RolesEnum } from '../../../types/auth.types';
import UserCountCard from './UserCountCard';

interface IProps {
  usersList: IAuthUser[];
}

const UserCountSection = ({ usersList }: IProps) => {
  let admins = 0;
  let users = 0;

  usersList.forEach((item) => {
    if (item.roles.includes(RolesEnum.ADMIN)) {
      admins++;
    }  else if (item.roles.includes(RolesEnum.USER)) {
      users++;
    }
  });

  const userCountData = [
    { count: admins, role: RolesEnum.ADMIN, icon: FaUserShield, color: '#9333EA' },
    { count: users, role: RolesEnum.USER, icon: FaUser, color: '#FEC223' },
  ];

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-x-4'>
      {userCountData.map((item, index) => (
        <UserCountCard key={index} count={item.count} role={item.role} icon={item.icon} color={item.color} />
      ))}
    </div>
  );
};

export default UserCountSection;
