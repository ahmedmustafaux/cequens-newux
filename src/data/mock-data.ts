// Unified mock data for the application
// This file contains all mock/example data used across the application

// ============================================================================
// TYPES
// ============================================================================

export type Campaign = {
  id: number;
  name: string;
  status: "Active" | "Draft" | "Completed";
  type: "Email" | "SMS";
  recipients: number;
  sentDate: string | null;
  openRate: number;
  clickRate: number;
};

export type Contact = {
  id: string;
  name: string;
  phone: string; // includes country code directly (e.g., "+966501234567")
  countryISO: string; // ISO 3166-1 alpha-2 country code for flags
  avatar: string;
  avatarColor: string;
  tags: string[];
  channel: string;
  conversationStatus: string;
  assignee: string | null;
  lastMessage: string;
  isSelected: boolean;
};

export type ChartDataPoint = {
  date: string;
  whatsapp: number;
  sms: number;
};

export type DashboardChartDataPoint = {
  date: string;      // ISO format date (YYYY-MM-DD)
  period: string;    // Formatted date (e.g., "Jan 15")
  messages: number;  // Number of messages sent
  senders: number;   // Number of active senders
};

export type DashboardMetrics = {
  messagesSent: { value: string; change: string; trend: "up" | "down" };
  deliveryRate: { value: string; change: string; trend: "up" | "down" };
  activeSenders: { value: string; change: string; trend: "up" | "down" };
  responseRate: { value: string; change: string; trend: "up" | "down" };
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  category?: 'system' | 'campaign' | 'contact' | 'message' | 'billing';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  archived?: boolean;
};

// ============================================================================
// CAMPAIGNS DATA
// ============================================================================

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Welcome Series",
    status: "Active",
    type: "Email",
    recipients: 1250,
    sentDate: "2024-01-15",
    openRate: 24.5,
    clickRate: 8.2,
  },
  {
    id: 2,
    name: "Product Launch",
    status: "Draft",
    type: "SMS",
    recipients: 0,
    sentDate: null,
    openRate: 0,
    clickRate: 0,
  },
  {
    id: 3,
    name: "Holiday Sale",
    status: "Completed",
    type: "Email",
    recipients: 2100,
    sentDate: "2023-12-20",
    openRate: 31.2,
    clickRate: 12.8,
  },
  {
    id: 4,
    name: "Newsletter",
    status: "Active",
    type: "Email",
    recipients: 3400,
    sentDate: "2024-01-01",
    openRate: 18.7,
    clickRate: 5.4,
  },
];

// ============================================================================
// CONTACTS DATA
// ============================================================================

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Muthaher Ahmed",
    phone: "+918056182308",
    countryISO: "IN",
    avatar: "MA",
    avatarColor: "bg-purple-500",
    tags: ["VIP"],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "5 minutes ago",
    isSelected: false
  },
  {
    id: "2",
    name: "N. bash",
    phone: "+966551246489",
    countryISO: "SA",
    avatar: "NB",
    avatarColor: "bg-green-500",
    tags: [],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "3 hours ago",
    isSelected: false
  },
  {
    id: "3",
    name: "Salma Salah",
    phone: "+201206098604",
    countryISO: "EG",
    avatar: "SS",
    avatarColor: "bg-emerald-500",
    tags: [],
    channel: "telegram",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "an hour ago",
    isSelected: false
  },
  {
    id: "4",
    name: "test zid",
    phone: "+966500000005",
    countryISO: "SA",
    avatar: "TZ",
    avatarColor: "bg-lime-500",
    tags: ["SILVER PACKAGE", "AREA"],
    channel: "instagram",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "3 months ago",
    isSelected: false
  },
  {
    id: "5",
    name: "ola",
    phone: "+966556280930",
    countryISO: "SA",
    avatar: "O",
    avatarColor: "bg-red-600",
    tags: ["AREA"],
    channel: "messenger",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "3 months ago",
    isSelected: false
  },
  {
    id: "6",
    name: "Omar Sattam",
    phone: "+966544351828",
    countryISO: "SA",
    avatar: "OS",
    avatarColor: "bg-red-600",
    tags: ["AHMED", "DND-LIST"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Salma",
    lastMessage: "9 minutes ago",
    isSelected: false
  },
  {
    id: "7",
    name: "لمياء القحطاني",
    phone: "+966534924155",
    countryISO: "SA",
    avatar: "لا",
    avatarColor: "bg-yellow-500",
    tags: ["AREA"],
    channel: "whatsapp",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "3 months ago",
    isSelected: false
  },
  {
    id: "8",
    name: "Ahmed Hassan",
    phone: "+966501234567",
    countryISO: "SA",
    avatar: "AH",
    avatarColor: "bg-blue-500",
    tags: ["VIP", "PREMIUM"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Salma",
    lastMessage: "2 hours ago",
    isSelected: false
  },
  {
    id: "9",
    name: "Fatima Al-Zahra",
    phone: "+966502345678",
    countryISO: "SA",
    avatar: "FA",
    avatarColor: "bg-pink-500",
    tags: ["NEW CUSTOMER"],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "1 day ago",
    isSelected: false
  },
  {
    id: "10",
    name: "Mohammed Ali",
    phone: "+966503456789",
    countryISO: "SA",
    avatar: "MA",
    avatarColor: "bg-indigo-500",
    tags: ["SILVER PACKAGE", "AREA", "VIP"],
    channel: "whatsapp",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "1 week ago",
    isSelected: false
  },
  {
    id: "11",
    name: "Sarah Johnson",
    phone: "+1504567890",
    countryISO: "US",
    avatar: "SJ",
    avatarColor: "bg-teal-500",
    tags: ["INTERNATIONAL"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Omar",
    lastMessage: "30 minutes ago",
    isSelected: false
  },
  {
    id: "12",
    name: "Ali Al-Rashid",
    phone: "+966505678901",
    countryISO: "SA",
    avatar: "AR",
    avatarColor: "bg-orange-500",
    tags: ["AREA", "DND-LIST"],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "4 hours ago",
    isSelected: false
  },
  {
    id: "13",
    name: "Nour Al-Din",
    phone: "+966506789012",
    countryISO: "SA",
    avatar: "NA",
    avatarColor: "bg-cyan-500",
    tags: ["PREMIUM", "VIP"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Salma",
    lastMessage: "15 minutes ago",
    isSelected: false
  },
  {
    id: "14",
    name: "Layla Ahmed",
    phone: "+966507890123",
    countryISO: "SA",
    avatar: "LA",
    avatarColor: "bg-rose-500",
    tags: ["NEW CUSTOMER", "AREA"],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "6 hours ago",
    isSelected: false
  },
  {
    id: "15",
    name: "Khalid Al-Mansouri",
    phone: "+966508901234",
    countryISO: "SA",
    avatar: "KM",
    avatarColor: "bg-violet-500",
    tags: ["SILVER PACKAGE"],
    channel: "whatsapp",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "2 days ago",
    isSelected: false
  },
  {
    id: "16",
    name: "Aisha Al-Zahra",
    phone: "+966509012345",
    countryISO: "SA",
    avatar: "AZ",
    avatarColor: "bg-emerald-600",
    tags: ["VIP", "PREMIUM"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Omar",
    lastMessage: "45 minutes ago",
    isSelected: false
  },
  {
    id: "17",
    name: "Youssef Hassan",
    phone: "+966510123456",
    countryISO: "SA",
    avatar: "YH",
    avatarColor: "bg-amber-500",
    tags: ["NEW CUSTOMER"],
    channel: "telegram",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "1 hour ago",
    isSelected: false
  },
  {
    id: "18",
    name: "Mariam Al-Sayed",
    phone: "+966511234567",
    countryISO: "SA",
    avatar: "MS",
    avatarColor: "bg-purple-600",
    tags: ["AREA", "SILVER PACKAGE"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Salma",
    lastMessage: "20 minutes ago",
    isSelected: false
  },
  {
    id: "19",
    name: "Tariq Al-Rashid",
    phone: "+966512345678",
    countryISO: "SA",
    avatar: "TR",
    avatarColor: "bg-slate-500",
    tags: ["DND-LIST"],
    channel: "whatsapp",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "1 week ago",
    isSelected: false
  },
  {
    id: "20",
    name: "Hala Al-Mahmoud",
    phone: "+966513456789",
    countryISO: "SA",
    avatar: "HM",
    avatarColor: "bg-fuchsia-500",
    tags: ["INTERNATIONAL", "VIP"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Omar",
    lastMessage: "10 minutes ago",
    isSelected: false
  },
  {
    id: "21",
    name: "Omar Al-Din",
    phone: "+966514567890",
    countryISO: "SA",
    avatar: "OD",
    avatarColor: "bg-sky-500",
    tags: ["PREMIUM"],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "3 hours ago",
    isSelected: false
  },
  {
    id: "22",
    name: "Nadia Al-Khalil",
    phone: "+966515678901",
    countryISO: "SA",
    avatar: "NK",
    avatarColor: "bg-lime-600",
    tags: ["AREA", "NEW CUSTOMER"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Salma",
    lastMessage: "25 minutes ago",
    isSelected: false
  },
  {
    id: "23",
    name: "Faisal Al-Mutairi",
    phone: "+966516789012",
    countryISO: "SA",
    avatar: "FM",
    avatarColor: "bg-red-500",
    tags: ["SILVER PACKAGE", "AREA"],
    channel: "whatsapp",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "4 days ago",
    isSelected: false
  },
  {
    id: "24",
    name: "Rania Al-Sabah",
    phone: "+966517890123",
    countryISO: "SA",
    avatar: "RS",
    avatarColor: "bg-green-600",
    tags: ["VIP"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Omar",
    lastMessage: "5 minutes ago",
    isSelected: false
  },
  {
    id: "25",
    name: "Saeed Al-Ghamdi",
    phone: "+966518901234",
    countryISO: "SA",
    avatar: "SG",
    avatarColor: "bg-indigo-600",
    tags: ["PREMIUM", "INTERNATIONAL"],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "2 hours ago",
    isSelected: false
  },
  {
    id: "26",
    name: "Lina Al-Fahad",
    phone: "+966519012345",
    countryISO: "SA",
    avatar: "LF",
    avatarColor: "bg-pink-600",
    tags: ["NEW CUSTOMER", "AREA"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Salma",
    lastMessage: "35 minutes ago",
    isSelected: false
  },
  {
    id: "27",
    name: "Majed Al-Otaibi",
    phone: "+966520123456",
    countryISO: "SA",
    avatar: "MO",
    avatarColor: "bg-teal-600",
    tags: ["SILVER PACKAGE"],
    channel: "whatsapp",
    conversationStatus: "closed",
    assignee: null,
    lastMessage: "1 week ago",
    isSelected: false
  },
  {
    id: "28",
    name: "Dina Al-Shammari",
    phone: "+966521234567",
    countryISO: "SA",
    avatar: "DS",
    avatarColor: "bg-orange-600",
    tags: ["VIP", "AREA"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Omar",
    lastMessage: "15 minutes ago",
    isSelected: false
  },
  {
    id: "29",
    name: "Waleed Al-Harbi",
    phone: "+966522345678",
    countryISO: "SA",
    avatar: "WH",
    avatarColor: "bg-cyan-600",
    tags: ["PREMIUM", "DND-LIST"],
    channel: "whatsapp",
    conversationStatus: "unassigned",
    assignee: null,
    lastMessage: "6 hours ago",
    isSelected: false
  },
  {
    id: "30",
    name: "Zainab Al-Qahtani",
    phone: "+966523456789",
    countryISO: "SA",
    avatar: "ZQ",
    avatarColor: "bg-violet-600",
    tags: ["NEW CUSTOMER", "SILVER PACKAGE"],
    channel: "whatsapp",
    conversationStatus: "assigned",
    assignee: "Salma",
    lastMessage: "40 minutes ago",
    isSelected: false
  }
];

// ============================================================================
// CHART DATA
// ============================================================================

export const getChartData = (timeRange: string): ChartDataPoint[] => {
  const baseData: ChartDataPoint[] = [
    { date: "2024-04-01", whatsapp: 222, sms: 150 },
    { date: "2024-04-02", whatsapp: 97, sms: 180 },
    { date: "2024-04-03", whatsapp: 167, sms: 120 },
    { date: "2024-04-04", whatsapp: 242, sms: 260 },
    { date: "2024-04-05", whatsapp: 373, sms: 290 },
    { date: "2024-04-06", whatsapp: 301, sms: 340 },
    { date: "2024-04-07", whatsapp: 245, sms: 180 },
    { date: "2024-04-08", whatsapp: 409, sms: 320 },
    { date: "2024-04-09", whatsapp: 59, sms: 110 },
    { date: "2024-04-10", whatsapp: 261, sms: 190 },
    { date: "2024-04-11", whatsapp: 327, sms: 350 },
    { date: "2024-04-12", whatsapp: 292, sms: 210 },
    { date: "2024-04-13", whatsapp: 342, sms: 380 },
    { date: "2024-04-14", whatsapp: 137, sms: 220 },
    { date: "2024-04-15", whatsapp: 120, sms: 170 },
    { date: "2024-04-16", whatsapp: 138, sms: 190 },
    { date: "2024-04-17", whatsapp: 446, sms: 360 },
    { date: "2024-04-18", whatsapp: 364, sms: 410 },
    { date: "2024-04-19", whatsapp: 243, sms: 180 },
    { date: "2024-04-20", whatsapp: 89, sms: 150 },
    { date: "2024-04-21", whatsapp: 137, sms: 200 },
    { date: "2024-04-22", whatsapp: 224, sms: 170 },
    { date: "2024-04-23", whatsapp: 138, sms: 230 },
    { date: "2024-04-24", whatsapp: 387, sms: 290 },
    { date: "2024-04-25", whatsapp: 215, sms: 250 },
    { date: "2024-04-26", whatsapp: 75, sms: 130 },
    { date: "2024-04-27", whatsapp: 383, sms: 420 },
    { date: "2024-04-28", whatsapp: 122, sms: 180 },
    { date: "2024-04-29", whatsapp: 315, sms: 240 },
    { date: "2024-04-30", whatsapp: 454, sms: 380 },
    { date: "2024-05-01", whatsapp: 165, sms: 220 },
    { date: "2024-05-02", whatsapp: 293, sms: 310 },
    { date: "2024-05-03", whatsapp: 247, sms: 190 },
    { date: "2024-05-04", whatsapp: 385, sms: 420 },
    { date: "2024-05-05", whatsapp: 481, sms: 390 },
    { date: "2024-05-06", whatsapp: 498, sms: 520 },
    { date: "2024-05-07", whatsapp: 388, sms: 300 },
    { date: "2024-05-08", whatsapp: 149, sms: 210 },
    { date: "2024-05-09", whatsapp: 227, sms: 180 },
    { date: "2024-05-10", whatsapp: 293, sms: 330 },
    { date: "2024-05-11", whatsapp: 335, sms: 270 },
    { date: "2024-05-12", whatsapp: 197, sms: 240 },
    { date: "2024-05-13", whatsapp: 197, sms: 160 },
    { date: "2024-05-14", whatsapp: 448, sms: 490 },
    { date: "2024-05-15", whatsapp: 473, sms: 380 },
    { date: "2024-05-16", whatsapp: 338, sms: 400 },
    { date: "2024-05-17", whatsapp: 499, sms: 420 },
    { date: "2024-05-18", whatsapp: 315, sms: 350 },
    { date: "2024-05-19", whatsapp: 235, sms: 180 },
    { date: "2024-05-20", whatsapp: 177, sms: 230 },
    { date: "2024-05-21", whatsapp: 82, sms: 140 },
    { date: "2024-05-22", whatsapp: 81, sms: 120 },
    { date: "2024-05-23", whatsapp: 252, sms: 290 },
    { date: "2024-05-24", whatsapp: 294, sms: 220 },
    { date: "2024-05-25", whatsapp: 201, sms: 250 },
    { date: "2024-05-26", whatsapp: 213, sms: 170 },
    { date: "2024-05-27", whatsapp: 420, sms: 460 },
    { date: "2024-05-28", whatsapp: 233, sms: 190 },
    { date: "2024-05-29", whatsapp: 78, sms: 130 },
    { date: "2024-05-30", whatsapp: 340, sms: 280 },
    { date: "2024-05-31", whatsapp: 178, sms: 230 },
    { date: "2024-06-01", whatsapp: 178, sms: 200 },
    { date: "2024-06-02", whatsapp: 470, sms: 410 },
    { date: "2024-06-03", whatsapp: 103, sms: 160 },
    { date: "2024-06-04", whatsapp: 439, sms: 380 },
    { date: "2024-06-05", whatsapp: 88, sms: 140 },
    { date: "2024-06-06", whatsapp: 294, sms: 250 },
    { date: "2024-06-07", whatsapp: 323, sms: 370 },
    { date: "2024-06-08", whatsapp: 385, sms: 320 },
    { date: "2024-06-09", whatsapp: 438, sms: 480 },
    { date: "2024-06-10", whatsapp: 155, sms: 200 },
    { date: "2024-06-11", whatsapp: 92, sms: 150 },
    { date: "2024-06-12", whatsapp: 492, sms: 420 },
    { date: "2024-06-13", whatsapp: 81, sms: 130 },
    { date: "2024-06-14", whatsapp: 426, sms: 380 },
    { date: "2024-06-15", whatsapp: 307, sms: 350 },
    { date: "2024-06-16", whatsapp: 371, sms: 310 },
    { date: "2024-06-17", whatsapp: 475, sms: 520 },
    { date: "2024-06-18", whatsapp: 107, sms: 170 },
    { date: "2024-06-19", whatsapp: 341, sms: 290 },
    { date: "2024-06-20", whatsapp: 408, sms: 450 },
    { date: "2024-06-21", whatsapp: 169, sms: 210 },
    { date: "2024-06-22", whatsapp: 317, sms: 270 },
    { date: "2024-06-23", whatsapp: 480, sms: 530 },
    { date: "2024-06-24", whatsapp: 132, sms: 180 },
    { date: "2024-06-25", whatsapp: 141, sms: 190 },
    { date: "2024-06-26", whatsapp: 434, sms: 380 },
    { date: "2024-06-27", whatsapp: 448, sms: 490 },
    { date: "2024-06-28", whatsapp: 149, sms: 200 },
    { date: "2024-06-29", whatsapp: 103, sms: 160 },
    { date: "2024-06-30", whatsapp: 446, sms: 400 },
  ];

  // Return different datasets based on time range
  switch (timeRange) {
    case "7d":
      return baseData.slice(-7).map((item, index) => ({
        ...item,
        whatsapp: Math.floor(item.whatsapp * (1.1 + (index / 6) * 0.2)),
        sms: Math.floor(item.sms * (1.2 + (index / 6) * 0.2))
      }));
    case "30d":
      return baseData.slice(-30).map((item, index) => ({
        ...item,
        whatsapp: Math.floor(item.whatsapp * (0.95 + (index / 29) * 0.1)),
        sms: Math.floor(item.sms * (0.9 + (index / 29) * 0.2))
      }));
    case "90d":
      return baseData.map((item, index) => ({
        ...item,
        whatsapp: Math.floor(item.whatsapp * (0.8 + (index / baseData.length) * 0.4)),
        sms: Math.floor(item.sms * (0.7 + (index / baseData.length) * 0.6))
      }));
    default:
      return baseData.slice(-30);
  }
};

// ============================================================================
// NAVIGATION DATA
// ============================================================================

export const navigationData = {
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: "IconDashboard",
    },
    {
      title: "Messages",
      url: "/messages",
      icon: "IconMessage",
    },
    {
      title: "Campaigns",
      url: "/campaigns",
      icon: "IconPhoneCall",
      items: [
        {
          title: "All Campaigns",
          url: "/campaigns",
        },
        {
          title: "Templates",
          url: "/campaigns/templates",
        },
        {
          title: "AI Bots",
          url: "/campaigns/ai-bots",
        },
        {
          title: "Settings",
          url: "/campaigns/settings",
        },
      ],
    },
    {
      title: "Contacts",
      url: "/contacts",
      icon: "IconUsers",
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: "IconChartBar",
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: "IconSearch",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: "IconSettings",
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: "IconHelp",
    },
  ],
};

// ============================================================================
// NOTIFICATION DATA
// ============================================================================

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Message Received",
    message: "You have a new message from Ahmed Ali",
    type: "info",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    category: "message",
    priority: "medium",
  },
  {
    id: "2",
    title: "Campaign Completed",
    message: "Your 'Welcome Series' campaign has been completed successfully",
    type: "success",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    category: "campaign",
    priority: "low",
  },
  {
    id: "3",
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM",
    type: "warning",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    category: "system",
    priority: "medium",
  },
  {
    id: "4",
    title: "New Contact Added",
    message: "Sarah Johnson has been added to your contacts",
    type: "info",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    category: "contact",
    priority: "low",
  },
  {
    id: "5",
    title: "Billing Alert",
    message: "Your subscription will renew in 3 days",
    type: "warning",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    category: "billing",
    priority: "high",
  },
];

// ============================================================================
// DASHBOARD DATA
// ============================================================================

/**
 * Generates random dashboard chart data based on the specified time range
 * 
 * This function creates an array of data points with random values for messages and senders
 * that can be used for dashboard visualizations. The data is completely randomized
 * to avoid sequential patterns.
 * 
 * @param range - Time range string ("7d", "30d", or "90d")
 * @returns Array of data points with date, period, messages, and senders properties
 */
export const getDashboardChartData = (range: string): DashboardChartDataPoint[] => {
  const today = new Date()
  let numDays: number
  
  switch (range) {
    case "7d":
      numDays = 7
      break
    case "30d":
      numDays = 30
      break
    case "90d":
      numDays = 90
      break
    default:
      numDays = 30
  }
  
  // Generate data for each day in the range
  const dataPoints = Array.from({ length: numDays }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (numDays - 1 - i))
    
    // Format the day as "MMM DD" (e.g., "Jan 15")
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
    
    return { 
      date,
      period: formattedDate
    }
  })

  // Generate completely random data for each time period
  return dataPoints.map((point) => {
    // Random values within reasonable ranges
    const randomMessagesSent = Math.floor(Math.random() * 80000) + 10000 // Random between 10,000 and 90,000
    const randomActiveSenders = Math.floor(Math.random() * 800) + 200 // Random between 200 and 1,000

    return {
      date: point.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      period: point.period,
      messages: randomMessagesSent,
      senders: randomActiveSenders,
    }
  })
}

/**
 * Generates random dashboard metrics data
 * 
 * This function creates random metrics for the dashboard cards including
 * message counts, delivery rates, active senders, and response rates.
 * Values are completely randomized to avoid sequential patterns.
 * 
 * @returns Dashboard metrics object with random values
 */
export const getDashboardMetrics = (): DashboardMetrics => {
  // Generate random metrics data
  
  // Random message count between 20,000 and 500,000
  const randomMessages = Math.floor(Math.random() * 480000) + 20000
  const formattedMessages = randomMessages.toLocaleString()
  
  // Random delivery rate between 95% and 99.9%
  const randomDelivery = (95 + Math.random() * 4.9).toFixed(1)
  
  // Random active senders between 300 and 5,000
  const randomSenders = Math.floor(Math.random() * 4700) + 300
  const formattedSenders = randomSenders.toLocaleString()
  
  // Random response rate between 25% and 40%
  const randomResponse = (25 + Math.random() * 15).toFixed(1)
  
  // Random change percentages between -5% and +25%
  const getRandomChange = () => {
    const changeValue = Math.random() * 30 - 5
    const changeFormatted = changeValue.toFixed(1)
    return (changeValue > 0 ? "+" : "") + changeFormatted + "%"
  }
  
  // Determine trend based on change value
  const getTrend = (change: string): "up" | "down" => 
    change.startsWith("+") ? "up" : "down"
  
  const messagesChange = getRandomChange()
  const deliveryChange = getRandomChange()
  const sendersChange = getRandomChange()
  const responseChange = getRandomChange()
  
  return {
    messagesSent: { value: formattedMessages, change: messagesChange, trend: getTrend(messagesChange) },
    deliveryRate: { value: randomDelivery + "%", change: deliveryChange, trend: getTrend(deliveryChange) },
    activeSenders: { value: formattedSenders, change: sendersChange, trend: getTrend(sendersChange) },
    responseRate: { value: randomResponse + "%", change: responseChange, trend: getTrend(responseChange) }
  }
}

// ============================================================================
// CONFIGURATION DATA
// ============================================================================

export const conversationStatusConfig = {
  unassigned: { 
    label: "Unassigned", 
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: "AlertCircle"
  },
  assigned: { 
    label: "Assigned", 
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "CheckCircle"
  },
  closed: { 
    label: "Closed", 
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "XCircle"
  }
};

export const assigneeConfig = {
  available: { 
    label: "Available", 
    color: "bg-green-100 text-green-800 border-green-200"
  },
  unavailable: { 
    label: "Unavailable", 
    color: "bg-gray-100 text-gray-800 border-gray-200"
  }
};
