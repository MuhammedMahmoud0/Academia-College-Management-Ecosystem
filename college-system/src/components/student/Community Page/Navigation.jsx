import { useNavigate } from 'react-router-dom';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import GroupIcon from '@mui/icons-material/Group';
import DateRangeIcon from '@mui/icons-material/DateRange';
import TurnedInIcon from '@mui/icons-material/TurnedIn';

export default function Navigation() {
  const navigate = useNavigate();

  const navItems = [
    { icon: <GroupIcon />, label: 'My Groups', path: '/dashboard/my-groups' },
    { icon: <DateRangeIcon />, label: 'Events', path: '/dashboard/events' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
      <h4 className="text-sm font-semibold mb-4 text-gray-900">
        Navigation
      </h4>
      <div className="flex flex-col gap-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 px-3 py-2.5 border-none bg-transparent rounded-lg cursor-pointer text-sm text-gray-700 text-left transition-colors hover:bg-gray-50 w-full"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}