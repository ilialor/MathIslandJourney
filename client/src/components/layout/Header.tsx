import React from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function Header() {
  const [, setLocation] = useLocation();
  const { user, logoutMutation, isLoading } = useAuth();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
        setLocation('/auth');
      }
    });
  };

  return (
    <header className="bg-white shadow-md py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <motion.div 
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white font-heading font-bold text-xl">A</span>
        </motion.div>
        <h1 className="font-heading font-bold text-xl text-primary">AnimaLearn</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <div className="hidden sm:flex items-center space-x-1 bg-background rounded-full px-3 py-1">
              <motion.div 
                className="w-8 h-8 rounded-full bg-[#82D8B9] flex items-center justify-center text-white"
                whileHover={{ rotate: 10 }}
              >
                <i className="fas fa-star"></i>
              </motion.div>
              <span className="font-heading font-bold text-lg">{user.stars || 0}</span>
            </div>
            
            <motion.div 
              className="w-9 h-9 rounded-full bg-[#FFD166] flex items-center justify-center text-white relative cursor-pointer"
              whileHover={{ y: -2 }}
              onClick={() => {
                toast({
                  title: "Notifications",
                  description: "You have 2 new achievements to unlock!",
                });
              }}
            >
              <Bell className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                2
              </div>
            </motion.div>
          </>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary cursor-pointer"
            >
              <Avatar>
                <AvatarImage 
                  src={user ? 
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&background=random` 
                    : "https://ui-avatars.com/api/?name=User&background=random"} 
                />
                <AvatarFallback>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'
                  )}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user ? (
              <>
                <DropdownMenuItem className="font-medium">
                  {user.displayName || user.username}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/parent-dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : 'Logout'}
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => setLocation('/auth')}>
                Login
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
