import { PageHeader } from "@/components/page-header";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import { useNotificationContext } from "@/contexts/notification-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { directionalTabVariants, smoothTransition, initialTabContentVariants } from "@/lib/transitions";
import * as React from "react";
import {
  Bell,
  Search,
  Check,
  CheckCircle2,
  Trash2,
  Settings,
  Archive,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  MoreHorizontal,
  Calendar,
  Tag,
  Inbox,
  AlertOctagon,
  Server,
  Megaphone,
  Users,
  MessageSquare,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

type NotificationCategory = 'all' | 'unread';

export default function NotificationsPage() {
  const [isDataLoading, setIsDataLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState<NotificationCategory>('all');
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedNotifications, setSelectedNotifications] = React.useState<string[]>([]);
  const [direction, setDirection] = React.useState(0);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    autoArchive: false,
    showPriority: true,
    groupByCategory: false
  });
  
  // Dynamic page title
  usePageTitle("Notifications");

  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationContext();

  // Tab order for direction calculation
  const tabOrder: NotificationCategory[] = ['all', 'unread'];

  const handleTabChange = (newTab: NotificationCategory) => {
    const currentIndex = tabOrder.indexOf(activeCategory);
    const newIndex = tabOrder.indexOf(newTab);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveCategory(newTab);
    setIsInitialLoad(false);
  };

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true);
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Filter notifications based on category and search
  const filteredNotifications = React.useMemo(() => {
    let filtered = [...notifications];

    // Category filter
    if (activeCategory === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeCategory !== 'all') {
      // Filter by notification category (system, campaign, contact, message, billing)
      filtered = filtered.filter(n => n.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [notifications, activeCategory, searchQuery]);

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    } else {
      setSelectedNotifications([]);
    }
  };

  const handleSelectNotification = (notificationId: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, notificationId]);
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach(id => markAsRead(id));
    setSelectedNotifications([]);
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach(id => removeNotification(id));
    setSelectedNotifications([]);
  };

  if (isDataLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <PageHeader
            title="Notifications"
            description="View and manage your notifications"
            showBreadcrumbs={false}
            isLoading={true}
          />
          <div className="px-4 md:px-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <PageHeader
          title="Notifications"
          description={`View and manage your notifications • ${unreadCount} unread`}
          showBreadcrumbs={false}
          isLoading={false}
          customActions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Notification Settings</DialogTitle>
                    <DialogDescription>
                      Configure your notification preferences and display options.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                        <span>Email Notifications</span>
                        <span className="text-sm text-muted-foreground">Receive notifications via email</span>
                      </Label>
                      <Checkbox
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, emailNotifications: !!checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications" className="flex flex-col gap-1">
                        <span>Push Notifications</span>
                        <span className="text-sm text-muted-foreground">Show browser notifications</span>
                      </Label>
                      <Checkbox
                        id="push-notifications"
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, pushNotifications: !!checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-archive" className="flex flex-col gap-1">
                        <span>Auto Archive</span>
                        <span className="text-sm text-muted-foreground">Archive read notifications after 30 days</span>
                      </Label>
                      <Checkbox
                        id="auto-archive"
                        checked={settings.autoArchive}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, autoArchive: !!checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-priority" className="flex flex-col gap-1">
                        <span>Show Priority Badges</span>
                        <span className="text-sm text-muted-foreground">Display priority indicators</span>
                      </Label>
                      <Checkbox
                        id="show-priority"
                        checked={settings.showPriority}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, showPriority: !!checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="group-category" className="flex flex-col gap-1">
                        <span>Group by Category</span>
                        <span className="text-sm text-muted-foreground">Group notifications by category</span>
                      </Label>
                      <Checkbox
                        id="group-category"
                        checked={settings.groupByCategory}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ ...prev, groupByCategory: !!checked }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => {
                      setSettingsOpen(false);
                      toast.success("Notification preferences saved");
                    }}>
                      Save preferences
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          }
        />
        
        <motion.div
          className="px-4 md:px-6 flex flex-col gap-4 pb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
        >
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            
            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedNotifications.length} selected
                </span>
                <Button size="sm" variant="outline" onClick={handleBulkMarkAsRead}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Two-column layout: Notifications and Pro Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Notifications Column - 2/3 width */}
            <div className="lg:col-span-2">
              {/* Tabs for Categories */}
              <Tabs value={activeCategory} onValueChange={(value) => handleTabChange(value as NotificationCategory)} className="w-full">
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={smoothTransition}
            >
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground">
                <motion.div transition={smoothTransition}>
                  <TabsTrigger value="all">All</TabsTrigger>
                </motion.div>
                <motion.div transition={smoothTransition}>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                </motion.div>
              </TabsList>
            </motion.div>

            <motion.div 
              className="relative pb-4 w-full"
              variants={isInitialLoad ? initialTabContentVariants : {}}
              initial={isInitialLoad ? "initial" : false}
              animate={isInitialLoad ? "animate" : false}
              transition={smoothTransition}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  variants={isInitialLoad ? initialTabContentVariants : directionalTabVariants(direction)}
                  initial={isInitialLoad ? "initial" : "hidden"}
                  animate={isInitialLoad ? "animate" : "visible"}
                  exit="exit"
                  transition={smoothTransition}
                  className="w-full"
                >
                  <TabsContent value={activeCategory} className="mt-4">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    {activeCategory === 'all' ? 'All Notifications' : 'Unread Notifications'}
                  </h2>
                  {filteredNotifications.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedNotifications.length === filteredNotifications.length}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm text-muted-foreground">Select All</span>
                    </div>
                  )}
                </div>

                {/* Notifications Content */}
                <div>
                  {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        No notifications found
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        {searchQuery ? 
                          `No notifications match "${searchQuery}"` : 
                          activeCategory === 'unread' ? 
                          "You're all caught up! No unread notifications." :
                          "No notifications in this category yet."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                        {filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex items-start gap-3 p-4 rounded-lg border transition-colors hover:bg-muted/50 border-border"
                          >
                            <Checkbox
                              checked={selectedNotifications.includes(notification.id)}
                              onCheckedChange={(checked) => 
                                handleSelectNotification(notification.id, checked as boolean)
                              }
                            />
                            
                            <div className="mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h4 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <Badge variant="secondary" className="text-xs">New</Badge>
                                    )}
                                    {settings.showPriority && notification.priority === 'urgent' && (
                                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                    )}
                                    {settings.showPriority && notification.priority === 'high' && (
                                      <Badge variant="default" className="text-xs bg-orange-500">High</Badge>
                                    )}
                                  </div>
                                  <p className={`text-sm mt-1 ${!notification.read ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                                    {notification.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatTimeAgo(notification.timestamp)}
                                      {!notification.read && (
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 ml-1" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Tag className="h-3 w-3" />
                                      {notification.category || notification.type}
                                    </div>
                                    {notification.priority && (
                                      <div className="flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {notification.priority}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {!notification.read && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => markAsRead(notification.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeNotification(notification.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </motion.div>
              </Tabs>
            </div>

            {/* Pro Tips Column - 1/3 width - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-10 self-start">
              {/* Pro Tips */}
              <Card className="bg-gray-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">Pro Tips</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    <div className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Use Keyboard Shortcuts</h4>
                          <p className="text-xs text-muted-foreground">Press <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">⌘A</kbd> to select all</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Filter by Category</h4>
                          <p className="text-xs text-muted-foreground">Use tabs to focus on specific notification types</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Priority Badges</h4>
                          <p className="text-xs text-muted-foreground">Enable in settings for urgent notifications</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Bulk Actions</h4>
                          <p className="text-xs text-muted-foreground">Select multiple items for faster management</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Auto Archive</h4>
                          <p className="text-xs text-muted-foreground">Keep your inbox clean automatically</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
