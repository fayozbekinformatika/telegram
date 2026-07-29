import { User } from '../types/telegram';

export const isUserOnline = (user?: User | null): boolean => {
  if (!user) return false;
  if ((user.status as string) === 'service notification') return false;
  
  if (user.lastSeen) {
    const lastSeenTime = Number(user.lastSeen);
    // Consider online if seen within last 2 minutes
    return (Date.now() - lastSeenTime) < 2 * 60 * 1000;
  }
  
  return user.status === 'online';
};
