import { BsGlobeAmericas } from 'react-icons/bs';
import PageAccessTemplate from '../../components/dashboard/page-access/PageAccessTemplate';

const DashboardPage = () => {
  return (
    <div className='pageTemplate2'>
      <PageAccessTemplate color='#000' icon={BsGlobeAmericas} role='Dashboard'>
        <div className='text-3xl space-y-2'>
          <h1>Dashboard Access belongs to:</h1>
          <h1>Admin</h1>
        </div>
      </PageAccessTemplate>
    </div>
  );
};

export default DashboardPage;
