import ProfileCard from '../components/student/Community Page/ProfileCard';
import Navigation from '../components/student/Community Page/Navigation';
import PostCard from '../components/student/Community Page/PostCard';
import UpcomingEvents from '../components/student/Community Page/UpcomingEvents';
import Suggested from '../components/student/Community Page/Suggested';
import { useState } from 'react';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';

export default function CommunityPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const posts=[
    {
      id: 1,
      author: 'Admin Office',
      avatar: 'AO',
      time: 'Pinned',
      content: 'Mid-term exam schedules have been posted. Please check the "Exams" page for your detailed timetable.',
      likes: 152,
      comments: 12,
      isPinned: true,
      bgColor: '#a78bfa'
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      avatar: 'SJ',
      time: '2h ago',
      content: 'Just finished the final project for CS350! It was tough but learned so much about operating systems. Huge thanks to everyone in our study group!',
      likes: 45,
      comments: 8,
      image: true,
      bgColor: '#8b5cf6'
    }
  ]

  return (
  <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl" >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Community Hub
        </h1>
        
        {/* Mobile Menu Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="xl:hidden p-2 rounded-lg bg-white shadow-sm hover:bg-gray-100 transition-colors"
            aria-label="Toggle events and groups"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
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

      {/* Right Sidebar Overlay - Mobile/Tablet */}
      {rightSidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-10"
            onClick={() => setRightSidebarOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-full bg-white shadow-xl overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Events & Groups</h2>
              <button
                onClick={() => setRightSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <UpcomingEvents />
              <Suggested />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px] gap-4 lg:gap-5">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:flex flex-col gap-4 lg:gap-5">
          <ProfileCard />
          <Navigation />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-4 lg:gap-5">
          {/* Create Post */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                JD
              </div>
              <input
                type="text"
                placeholder="What's on your mind, John?"
                className="flex-1 border-none outline-none text-sm sm:text-base bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4 pt-4 border-t border-gray-200 sm:justify-between sm:items-center">
              <div className="flex gap-4 sm:gap-5 justify-center sm:justify-start">
                <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-lg sm:text-xl hover:text-gray-800 transition-colors">
                  <span><ImageIcon /></span>
                </button>
                <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-lg sm:text-xl hover:text-gray-800 transition-colors">
                  <span><AttachFileIcon /></span>
                </button>
                <button className="border-none bg-transparent cursor-pointer text-gray-600 flex items-center gap-1.5 text-lg sm:text-xl hover:text-gray-800 transition-colors">
                  <span><SignalCellularAltIcon /></span>
                </button>
              </div>
              <button className="bg-indigo-600 text-white border-none rounded-lg px-6 py-2.5 cursor-pointer font-medium text-sm hover:bg-indigo-700 transition-colors w-full sm:w-auto">
                Post
              </button>
            </div>
          </div>

          {/* Posts */}
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Right Sidebar - Desktop */}
        <div className="hidden xl:flex flex-col gap-4 lg:gap-5">
          <UpcomingEvents />
          <Suggested />
        </div>
      </div>
    </div>
  );
}