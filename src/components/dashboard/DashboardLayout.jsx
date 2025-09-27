import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../AppIcon';
import { useAuth } from '../auth/AuthProvider';
import { signOut } from '../../lib/auth';
import UserMenu from './UserMenu';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from './ThemeToggle';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, getPermissions } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const permissions = getPermissions();

  const navigationItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      roles: ['super_admin', 'org_admin', 'manager', 'user']
    },
    {
      name: 'Workflows',
      path: '/dashboard/workflows',
      icon: 'Workflow',
      roles: ['super_admin', 'org_admin', 'manager', 'user']
    },
    {
      name: 'Analytics',
      path: '/dashboard/analytics',
      icon: 'BarChart3',
      roles: ['super_admin', 'org_admin', 'manager']
    },
    {
      name: 'CMS Builder',
      path: '/dashboard/cms',
      icon: 'Layout',
      roles: ['super_admin']
    },
    {
      name: 'Users',
      path: '/dashboard/users',
      icon: 'Users',
      roles: ['super_admin', 'org_admin']
    },
    {
      name: 'Organizations',
      path: '/dashboard/organizations',
      icon: 'Building2',
      roles: ['super_admin']
    },
    {
      name: 'Settings',
      path: '/dashboard/settings',
      icon: 'Settings',
      roles: ['super_admin', 'org_admin', 'manager', 'user']
    }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.roles.includes(profile?.role)
  );

  const isActivePath = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/homepage');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link to="/homepage" className="flex items-center space-x-3">
              <img src="/assets/logos/WorkflowGene Logo.png" alt="WorkflowGene Cloud" className="h-8" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-genetic-md hover:bg-muted"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-genetic-md transition-all duration-genetic-normal ${
                  isActivePath(item.path)
                    ? 'bg-primary text-white shadow-organic-sm'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {profile?.role?.replace('_', ' ')?.replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleSignOut}
              iconName="LogOut"
              iconPosition="left"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-genetic-md hover:bg-muted"
              >
                <Icon name="Menu" size={20} />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-text-primary">
                  {profile?.organization?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-text-secondary">
                  Welcome back, {profile?.first_name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <NotificationCenter />
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;