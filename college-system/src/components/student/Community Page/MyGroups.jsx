import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import ProfileCard from './ProfileCard';
import Navigation from './Navigation';
import GroupModal from './GroupModal';
import { deleteGroup, getMyGroups, updateGroup, createGroup } from '../../../services/communityService';
import { useAuth } from '../../../hooks/useAuth';

export default function MyGroups() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [groupModalError, setGroupModalError] = useState('');
  const [modalMode, setModalMode] = useState('create');
  const [deletingGroupId, setDeletingGroupId] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getMyGroups();
      setGroups(data.groups || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      // Fallback to mock data on error

    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditGroupModal = (group) => {
    setOpenActionMenuId(null);
    setSelectedGroup(group);
    setGroupModalError('');
    setModalMode('edit');
    setShowGroupModal(true);
  };

  const handleOpenCreateGroupModal = () => {
    setOpenActionMenuId(null);
    setSelectedGroup(null);
    setGroupModalError('');
    setModalMode('create');
    setShowGroupModal(true);
  };

  const toggleActionMenu = (groupId) => {
    setOpenActionMenuId((prev) => (prev === groupId ? null : groupId));
  };

  const handleCloseGroupModal = () => {
    if (!isSavingGroup) {
      setShowGroupModal(false);
      setGroupModalError('');
      setSelectedGroup(null);
    }
  };

  const handleGroupSubmit = async (payload) => {
    try {
      setIsSavingGroup(true);
      setGroupModalError('');

      if (modalMode === 'edit') {
        if (!selectedGroup?.id) {
          setGroupModalError('Please select a group to edit.');
          return;
        }
        await updateGroup(selectedGroup.id, payload);
      } else {
        await createGroup(payload);
      }

      setShowGroupModal(false);
      setSelectedGroup(null);
      await fetchGroups();
    } catch (err) {
      console.error('Error saving group:', err);

      if (err?.response?.status === 401) {
        setGroupModalError('Your session expired. Please login again.');
      } else if (err?.response?.status === 403) {
        setGroupModalError('Only admin or super admin can edit groups.');
      } else if (err?.response?.status >= 500) {
        setGroupModalError('Server error while saving group. Please try again shortly.');
      } else {
        const apiMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.details;
        setGroupModalError(apiMessage || 'Failed to save group. Please try again.');
      }
    } finally {
      setIsSavingGroup(false);
    }
  };

  const handleLeaveGroup = async (group) => {
    setOpenActionMenuId(null);

    const confirmed = window.confirm(`Are you sure you want to exit the group "${group?.name || 'this group'}"?`);
    if (!confirmed || !group?.id) {
      return;
    }

    // UI-only behavior for now
    console.log(`User initiated exit from group: ${group?.name || group?.id}`);
    window.alert('Leave group UI behavior triggered (no actual API call made).');
  };

  const handleDeleteGroup = async (group) => {
    setOpenActionMenuId(null);

    if (!isAdminUser) {
      window.alert('Only admin or super admin can delete groups.');
      return;
    }

    const confirmed = window.confirm(`Delete group "${group?.name || 'this group'}"? This action cannot be undone.`);
    if (!confirmed || !group?.id) {
      return;
    }

    try {
      setDeletingGroupId(group.id);
      await deleteGroup(group.id);
      await fetchGroups();
    } catch (err) {
      console.error('Error deleting group:', err);

      if (err?.response?.status === 401) {
        window.alert('Your session expired. Please login again.');
      } else if (err?.response?.status === 403) {
        window.alert('Only admin or super admin can delete groups.');
      } else if (err?.response?.status === 404) {
        window.alert('Group not found. It may already be deleted.');
      } else if (err?.response?.status >= 500) {
        window.alert('Server error while deleting group. Please try again shortly.');
      } else {
        const apiMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.response?.data?.details;
        window.alert(apiMessage || 'Failed to delete group. Please try again.');
      }
    } finally {
      setDeletingGroupId(null);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';

    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffHours < 1) return 'Active just now';
      if (diffHours < 24) return `Active ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `Active ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return 'Active recently';
    } catch {
      return 'Recently';
    }
  };

  const getGroupIcon = (name) => {
    const firstWord = name?.toLowerCase() || '';
    if (firstWord.includes('web') || firstWord.includes('dev')) return '🌐';
    if (firstWord.includes('ai') || firstWord.includes('machine')) return '🤖';
    if (firstWord.includes('design')) return '🎨';
    if (firstWord.includes('data')) return '📊';
    return '👥';
  };

  const getGroupColor = (index) => {
    const colors = ['#DBEAFE', '#E9D5FF', '#FEF3C7', '#D1FAE5', '#FED7AA'];
    return colors[index % colors.length];
  };

  const filteredGroups = groups.filter((group) =>
    (group.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const normalizedRole = String(
    authUser?.role || authUser?.user_role || authUser?.userType || authUser?.type || ''
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
  const isAdminUser = normalizedRole === 'admin' || normalizedRole === 'super_admin' || normalizedRole === 'doctor' || normalizedRole === 'teaching_assistant';

  return (
    <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/community')}
            className="p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Back to community"
          >
            <ArrowBackIcon className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Groups</h1>
        </div>

        {isAdminUser && (
          <button
            onClick={handleOpenCreateGroupModal}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95 max-lg:mr-3 ml-auto lg:mr-0"
          >
            <AddIcon fontSize="small" />
            <span className="max-sm:hidden">Create Group</span>
          </button>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="lg:hidden p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Left Sidebar Overlay - Mobile/Tablet */}
      {leftSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setLeftSidebarOpen(false)}
          ></div>
          <div className="absolute left-0 top-0 bottom-0 w-full bg-white shadow-xl overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setLeftSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <ProfileCard />
              <Navigation />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 lg:gap-5">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:flex flex-col gap-4 lg:gap-5">
          <ProfileCard />
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-gray-600">Manage and access the communities you belong to.</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button className="bg-white border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
              <FilterListIcon fontSize="small" />
              Filter
            </button>
          </div>

          {/* Groups Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGroups.map((group, index) => (
                <div
                  key={group.id}
                  onClick={() => navigate(`/dashboard/my-groups/${group.id}/posts`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/dashboard/my-groups/${group.id}/posts`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="relative w-full text-left bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  {isAdminUser ? (
                    <div className="absolute right-4 top-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActionMenu(group.id);
                        }}
                        className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Group actions"
                      >
                        <MoreVertIcon fontSize="small" />
                      </button>

                      {openActionMenuId === group.id ? (
                        <div className="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditGroupModal(group);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group);
                            }}
                            disabled={deletingGroupId === group.id}
                            className="block w-full px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingGroupId === group.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  {/* Group Icon */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: getGroupColor(index) }}
                    >
                      {group.avatar_url ? (
                        <img src={group.avatar_url} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        getGroupIcon(group.name)
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {group.name}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {group.description || 'No description available'}
                  </p>

                  {/* Members and Role */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <PeopleIcon fontSize="small" />
                      <span className="text-sm">{(group.members_count || group.group_members || 0).toLocaleString()}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Member
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{formatTimeAgo(group.joined_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No groups found</p>
            </div>
          )}
        </div>
      </div>

      <GroupModal
        isOpen={showGroupModal}
        onClose={handleCloseGroupModal}
        onSubmit={handleGroupSubmit}
        mode={modalMode}
        initialValues={selectedGroup}
        isSubmitting={isSavingGroup}
        submitError={groupModalError}
      />
    </div>
  );
}
