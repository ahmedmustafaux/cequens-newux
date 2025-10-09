import { PageHeader } from "@/components/page-header";
import { usePageTitle } from "@/hooks/use-dynamic-title";
import { useNotificationContext } from "@/contexts/notification-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Field, 
  FieldContent 
} from "@/components/ui/field";
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon 
} from "@/components/ui/input-group";
import { FilterSelect } from "@/components/ui/filter-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Item, 
  ItemContent, 
  ItemTitle, 
  ItemDescription, 
  ItemActions,
  ItemGroup,
} from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    notificationPosition: "top-right"
  });
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [categorySearchQuery, setCategorySearchQuery] = React.useState("");
  
  // Dynamic page title
  usePageTitle("Notifications");

  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, addNotification } = useNotificationContext();

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
  
  // Load saved notification position from localStorage
  React.useEffect(() => {
    const savedPosition = localStorage.getItem("toast-position");
    if (savedPosition) {
      setSettings(prev => ({ ...prev, notificationPosition: savedPosition }));
    }
  }, []);

  // Category filter options
  const categoryOptions = [
    { value: "system", label: "System" },
    { value: "campaign", label: "Campaign" },
    { value: "contact", label: "Contact" },
    { value: "message", label: "Message" },
    { value: "billing", label: "Billing" }
  ];

  // Filtered options based on search
  const filteredCategoryOptions = categoryOptions.filter(option =>
    option.label.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Filter notifications based on category and search
  const filteredNotifications = React.useMemo(() => {
    let filtered = [...notifications];

    // Tab category filter
    if (activeCategory === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (activeCategory !== 'all') {
      // Filter by notification category (system, campaign, contact, message, billing)
      filtered = filtered.filter(n => n.category === activeCategory);
    }

    // Category filter select
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(n => n.category && selectedCategories.includes(n.category));
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
  }, [notifications, activeCategory, searchQuery, selectedCategories]);

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
                <DialogContent className="p-0">
                  <DialogHeader className="border-b p-4">
                    <DialogTitle className="text-lg font-semibold">Notification Settings</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Configure your notification preferences and display options.
                    </DialogDescription>
                  </DialogHeader>
                  <div>
                    <ItemGroup className="py-4">
                      <Item 
                        size="default" 
                        className="cursor-pointer"
                        onClick={() => {
                          setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }));
                        }}
                      >
                        <ItemContent>
                          <div className="px-4 py-2 flex items-start gap-3">
                            <Checkbox
                              id="email-notifications"
                              checked={settings.emailNotifications}
                              onCheckedChange={(checked) => 
                                setSettings(prev => ({ ...prev, emailNotifications: !!checked }))
                              }
                              className="mt-0.5"
                            />
                            <div>
                              <ItemTitle>Email Notifications</ItemTitle>
                              <ItemDescription className="text-xs mt-1">Receive notifications via email</ItemDescription>
                            </div>
                          </div>
                        </ItemContent>
                      </Item>
                      
                      
                      <Item 
                        size="default" 
                        className="cursor-pointer"
                        onClick={() => {
                          setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }));
                        }}
                      >
                        <ItemContent>
                          <div className="px-4 py-2 flex items-start gap-3">
                            <Checkbox
                              id="push-notifications"
                              checked={settings.pushNotifications}
                              onCheckedChange={(checked) => 
                                setSettings(prev => ({ ...prev, pushNotifications: !!checked }))
                              }
                              className="mt-0.5"
                            />
                            <div>
                              <ItemTitle>Push Notifications</ItemTitle>
                              <ItemDescription className="text-xs mt-1">Show browser notifications</ItemDescription>
                            </div>
                          </div>
                        </ItemContent>
                      </Item>
                    
                      
                      <Item 
                        size="default" 
                        className="cursor-pointer"
                        onClick={() => {
                          setSettings(prev => ({ ...prev, autoArchive: !prev.autoArchive }));
                        }}
                      >
                        <ItemContent>
                          <div className="px-4 py-2 flex items-start gap-3">
                            <Checkbox
                              id="auto-archive"
                              checked={settings.autoArchive}
                              onCheckedChange={(checked) => 
                                setSettings(prev => ({ ...prev, autoArchive: !!checked }))
                              }
                              className="mt-0.5"
                            />
                            <div>
                              <ItemTitle>Auto Archive</ItemTitle>
                              <ItemDescription className="text-xs mt-1">Archive read notifications after 30 days</ItemDescription>
                            </div>
                          </div>
                        </ItemContent>
                      </Item>
                      
                      <Item 
                        size="default" 
                        className="cursor-pointer"
                        onClick={() => {
                          setSettings(prev => ({ ...prev, showPriority: !prev.showPriority }));
                        }}
                      >
                        <ItemContent>
                          <div className="px-4 py-2 flex items-start gap-3">
                            <Checkbox
                              id="show-priority"
                              checked={settings.showPriority}
                              onCheckedChange={(checked) => 
                                setSettings(prev => ({ ...prev, showPriority: !!checked }))
                              }
                              className="mt-0.5"
                            />
                            <div>
                              <ItemTitle>Show Priority Badges</ItemTitle>
                              <ItemDescription className="text-xs mt-1">Display priority indicators</ItemDescription>
                            </div>
                          </div>
                        </ItemContent>
                      </Item>
                    </ItemGroup>
                    
                    <div className="px-4 py-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Notification position</h3>
                      <RadioGroup 
                        value={settings.notificationPosition}
                        onValueChange={(value) => {
                          setSettings(prev => ({ ...prev, notificationPosition: value }));
                          
                          // Show a test notification with the new position
                          toast.info("Notification position preview", {
                            position: value as any,
                            description: "This is how notifications will appear"
                          });
                        }}
                        className="grid grid-cols-3 gap-3"
                      >
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-full cursor-pointer group"
                            onClick={() => {
                              setSettings(prev => ({ ...prev, notificationPosition: "top-right" }));
                              toast.info("Notification position preview", {
                                position: "top-right" as any,
                                description: "This is how notifications will appear"
                              });
                            }}
                          >
                            <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center transition-colors group-hover:bg-muted/60 group-hover:ring-1 group-hover:ring-primary">
                              <div className="w-full h-full p-2">
                                <div className="overflow-hidden w-full h-full bg-background/80 rounded-sm border border-border/50 relative">
                                  {/* Header */}
                                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200"></div>
                                  
                                  {/* Content rows */}
                                  <div className="absolute top-3 left-1 w-1/3 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  <div className="absolute top-4 left-1 w-1/4 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  <div className="absolute top-7 left-1 w-1/2 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  
                                  {/* Notification */}
                                  <div className="absolute top-0 right-0 m-0.5 w-1/3 h-3 bg-slate-500/40 rounded-sm border border-slate-400/30 flex items-center justify-center group-hover:bg-primary/70 group-hover:border-primary/80 transition-colors">
                                    <div className="w-2/3 h-0.5 bg-white/60 rounded-full mx-auto"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 justify-center mt-2">
                              <RadioGroupItem value="top-right" id="topRight" />
                              <label htmlFor="topRight" className="text-sm">Top Right</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-full cursor-pointer group"
                            onClick={() => {
                              setSettings(prev => ({ ...prev, notificationPosition: "bottom-right" }));
                              toast.info("Notification position preview", {
                                position: "bottom-right" as any,
                                description: "This is how notifications will appear"
                              });
                            }}
                          >
                            <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center transition-colors group-hover:bg-muted/60 group-hover:ring-1 group-hover:ring-primary">
                              <div className="w-full h-full p-2">
                                <div className="overflow-hidden w-full h-full bg-background/80 rounded-sm border border-border/50 relative">
                                  {/* Header */}
                                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200"></div>
                                  
                                  {/* Content rows */}
                                  <div className="absolute top-3 left-1 w-1/3 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  <div className="absolute top-4 left-1 w-1/4 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  <div className="absolute top-7 left-1 w-1/2 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  
                                  {/* Notification */}
                                  <div className="absolute bottom-0 right-0 m-0.5 w-1/3 h-3 bg-slate-500/40 rounded-sm border border-slate-400/30 flex items-center justify-center group-hover:bg-primary/70 group-hover:border-primary/80 transition-colors">
                                    <div className="w-2/3 h-0.5 bg-white/60 rounded-full mx-auto"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 justify-center mt-2">
                              <RadioGroupItem value="bottom-right" id="bottomRight" />
                              <label htmlFor="bottomRight" className="text-sm">Bottom Right</label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div 
                            className="w-full cursor-pointer group"
                            onClick={() => {
                              setSettings(prev => ({ ...prev, notificationPosition: "bottom-center" }));
                              toast.info("Notification position preview", {
                                position: "bottom-center" as any,
                                description: "This is how notifications will appear"
                              });
                            }}
                          >
                            <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden flex items-center justify-center transition-colors group-hover:bg-muted/60 group-hover:ring-1 group-hover:ring-primary">
                              <div className="w-full h-full p-2">
                                <div className="overflow-hidden w-full h-full bg-background/80 rounded-sm border border-border/50 relative">
                                  {/* Header */}
                                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-200"></div>
                                  
                                  {/* Content rows */}
                                  <div className="absolute top-3 left-1 w-1/3 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  <div className="absolute top-4 left-1 w-1/4 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  <div className="absolute top-7 left-1 w-1/2 h-0.5 bg-gray-200/50 rounded-full"></div>
                                  
                                  {/* Notification */}
                                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 m-0.5 w-1/3 h-3 bg-slate-500/40 rounded-sm border border-slate-400/30 flex items-center justify-center group-hover:bg-primary/70 group-hover:border-primary/80 transition-colors">
                                    <div className="w-2/3 h-0.5 bg-white/60 rounded-full mx-auto"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 justify-center mt-2">
                              <RadioGroupItem value="bottom-center" id="bottomCenter" />
                              <label htmlFor="bottomCenter" className="text-sm">Bottom center</label>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <DialogFooter className="border-t p-4">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        // Save notification position to localStorage
                        localStorage.setItem("toast-position", settings.notificationPosition);
                        
                        setSettingsOpen(false);
                        
                        // Use the selected position for this toast
                        toast.success("Notification preferences saved", {
                          position: settings.notificationPosition as any
                        });
                      }}
                    >
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
          {/* Two-column layout: Notifications and Pro Tips */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Notifications Column - 2/3 width */}
            <div className="lg:col-span-2">
              {/* Tabs for Categories */}
              <Tabs value={activeCategory} onValueChange={(value) => handleTabChange(value as NotificationCategory)} className="w-full">
            <motion.div 
              className="flex justify-between items-center flex-wrap gap-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={smoothTransition}
            >
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-auto min-w-[280px]">
                  <Field>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupAddon>
                          <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          placeholder="Search notifications..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </InputGroup>
                    </FieldContent>
                  </Field>
                </div>
                
                <FilterSelect
                  placeholder="Category"
                  options={categoryOptions}
                  selectedValues={selectedCategories}
                  onSelectionChange={setSelectedCategories}
                  onClear={() => setSelectedCategories([])}
                  searchable={true}
                  searchPlaceholder="Search categories..."
                  searchQuery={categorySearchQuery}
                  onSearchChange={setCategorySearchQuery}
                  filteredOptions={filteredCategoryOptions}
                />
              </div>
              
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
                <div className="flex items-center justify-between m-4">
                  <div className="flex items-center gap-4">
                    {filteredNotifications.length > 0 && (
                      <Checkbox
                        checked={selectedNotifications.length === filteredNotifications.length}
                        onCheckedChange={handleSelectAll}
                      />
                    )}
                    <h2 className="text-md font-semibold py-2">
                      {activeCategory === 'all' ? 'All Notifications' : 'Unread Notifications'}
                    </h2>
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
