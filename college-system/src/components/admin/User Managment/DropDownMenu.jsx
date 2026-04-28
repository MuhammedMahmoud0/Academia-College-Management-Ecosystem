import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function DropDownMenu({
    user,
    onEdit,
    onResetPassword,
    onDelete,
    onChangeRole,
    profileLink,
    profileState,
    showProfileLink = true,
}) {
    const menuRef = useRef(null);
    const [shouldOpenUpward, setShouldOpenUpward] = useState(false);

    useEffect(() => {
        if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const menuHeight = 200; // Approximate height of the dropdown menu
            
            // Open upward if there's not enough space below
            setShouldOpenUpward(spaceBelow < menuHeight);
        }
    }, []);

    return (
        <div 
            ref={menuRef}
            className={`absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 ${
                shouldOpenUpward ? 'bottom-full mb-2' : 'mt-2'
            }`}
        >
            <div className="py-1">
                {showProfileLink && profileLink && (
                    <Link
                        to={profileLink}
                        state={profileState}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        View Profile
                    </Link>
                )}
                <button
                    onClick={() => onEdit(user)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={() => onResetPassword(user)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    Reset Password
                </button>
                {typeof onChangeRole === 'function' && (
                    <button
                        onClick={() => onChangeRole(user)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Change Role
                    </button>
                )}
                <button
                    onClick={() => onDelete(user.id)}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}
