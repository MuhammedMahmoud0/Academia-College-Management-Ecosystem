import GroupIcon from '@mui/icons-material/Group';
export default function Suggested() {
  const groups = [
    {
      id: 1,
      name: 'AI Enthusiasts',
      members: 128,
      icon: <GroupIcon />
    },
    {
      id: 2,
      name: 'Debate Club',
      members: 45,
      icon: <GroupIcon />
    },
    {
      id: 3,
      name: 'Mobile App Developers',
      members: 72,
      icon: <GroupIcon />
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
      <h4 className="text-base font-semibold mb-4 text-gray-900">
        Suggested Groups
      </h4>
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.id} className="flex justify-between items-center">
            <div className="flex gap-3 items-center flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg sm:text-xl shrink-0">
                {group.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 mb-0.5">
                  {group.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {group.members} members
                </div>
              </div>
            </div>
            <button className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-indigo-600 bg-white text-indigo-600 cursor-pointer flex items-center justify-center text-base sm:text-lg font-semibold shrink-0 hover:bg-indigo-600 hover:text-white transition-colors">
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}