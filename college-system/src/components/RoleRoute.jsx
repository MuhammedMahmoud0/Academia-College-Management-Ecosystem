import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Error404Page from '../pages/Erorr404Page';

/**
 * RoleRoute wraps a route so only the specified roles can access it.
 * Everyone else sees the 404/Access Denied page.
 * Shows a spinner while user data is still being fetched to prevent
 * premature 404 flashes right after login.
 */
export default function RoleRoute({ roles, children }) {
  const { user, isLoading } = useAuth();

  // While auth is initialising, show a spinner — never flash the 404 prematurely
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!roles.includes(user.role)) {
    return <Error404Page />;
  }

  return children;
}
