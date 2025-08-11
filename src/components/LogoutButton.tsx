import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContextV2';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LogOut, Loader2, Shield, User, ChevronDown } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'button' | 'dropdown';
  showUser?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'button',
  showUser = false 
}) => {
  const { user, logout, logoutAll } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [logoutType, setLogoutType] = useState<'single' | 'all'>('single');

  const handleLogout = async (type: 'single' | 'all') => {
    setIsLoggingOut(true);
    
    try {
      if (type === 'all') {
        await logoutAll();
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const openLogoutDialog = (type: 'single' | 'all') => {
    setLogoutType(type);
    setShowLogoutDialog(true);
  };

  if (variant === 'dropdown' && user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {showUser && (
                <>
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => openLogoutDialog('single')}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => openLogoutDialog('all')}>
              <Shield className="w-4 h-4 mr-2" />
              Sign Out All Devices
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {logoutType === 'all' ? 'Sign Out From All Devices?' : 'Sign Out?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {logoutType === 'all' 
                  ? 'This will sign you out from all devices and browsers. You will need to sign in again on all your devices.'
                  : 'Are you sure you want to sign out? You will need to sign in again to access your account.'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoggingOut}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleLogout(logoutType)}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-700"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    {logoutType === 'all' ? 'Sign Out All' : 'Sign Out'}
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Simple button variant
  return (
    <>
      <Button
        variant="outline"
        onClick={() => openLogoutDialog('single')}
        disabled={isLoggingOut}
        className="flex items-center gap-2"
      >
        {isLoggingOut ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing Out...
          </>
        ) : (
          <>
            <LogOut className="w-4 h-4" />
            Sign Out
          </>
        )}
      </Button>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleLogout('single')}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing Out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoutButton;
