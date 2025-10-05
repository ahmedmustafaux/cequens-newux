import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-dynamic-title"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardSkeleton } from "@/components/ui/card"
import { PageHeaderProfile } from "@/components/page-header"
import { motion, AnimatePresence } from "framer-motion"
import { directionalTabVariants, smoothTransition, initialTabContentVariants } from "@/lib/transitions"
import { CircleFlag } from "react-circle-flags"
import { 
  User, 
  Phone, 
  MessageSquare,
  Globe,
  Edit,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus
} from "lucide-react"
import { toast } from "sonner"
import { mockContacts, conversationStatusConfig } from "@/data/mock-data"

export default function ContactDetailPage() {
  const params = useParams()
  const navigate = useNavigate()
  const contactId = params.id as string
  
  // All state declarations must be at the top before any early returns
  const [newTag, setNewTag] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("overview")
  const [direction, setDirection] = React.useState(0)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)
  
  // Function to add a new tag
  const addTag = () => {
    if (newTag.trim() && contact && !contact.tags.includes(newTag.trim())) {
      // In a real app, you would update the contact via API
      toast.success(`Tag "${newTag.trim()}" added successfully`)
      setNewTag("")
    } else if (contact && contact.tags.includes(newTag.trim())) {
      toast.error("Tag already exists")
    }
  }
  
  // Find the contact by ID
  const contact = mockContacts.find(c => c.id === contactId)
  
  // Dynamic page title - must be called before any early returns
  usePageTitle(contact ? `${contact.name}` : "Contact")
  
  // If contact not found, redirect to contacts page
  React.useEffect(() => {
    if (!contact) {
      toast.error("Contact not found")
      navigate("/contacts")
    }
  }, [contact, navigate])
  
  // Show loading state while checking for contact
  if (!contact) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <PageHeaderProfile
            title="Contact Not Found"
            description="The requested contact could not be found"
            avatar={{
              src: "",
              fallback: "??",
              alt: "Loading"
            }}
            onBack={() => navigate("/contacts")}
            actions={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Edit
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            }
            isLoading={true}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <div className="lg:col-span-2 grid grid-cols-1 gap-4 items-start">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid grid-cols-1 gap-4 items-start">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Tab order for direction calculation
  const tabOrder = ["overview", "contact", "attributes"]

  const handleEdit = () => {
    // TODO: Navigate to edit page
    toast.info("Edit functionality coming soon")
  }

  const handleTabChange = (newTab: string) => {
    const currentIndex = tabOrder.indexOf(activeTab)
    const newIndex = tabOrder.indexOf(newTab)
    setDirection(newIndex > currentIndex ? 1 : -1)
    setActiveTab(newTab)
    setIsInitialLoad(false)
  }

  const handleBack = () => {
    navigate("/contacts")
  }

  const getConversationStatusConfig = (status: string) => {
    const config = conversationStatusConfig[status as keyof typeof conversationStatusConfig];
    return config || conversationStatusConfig.unassigned;
  }

  const getStatusIcon = (iconName: string) => {
    switch (iconName) {
      case "AlertCircle":
        return <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />;
      case "CheckCircle":
        return <CheckCircle className="w-3 h-3 mr-1 flex-shrink-0" />;
      case "XCircle":
        return <XCircle className="w-3 h-3 mr-1 flex-shrink-0" />;
      default:
        return <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />;
    }
  };

  const getChannelStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "Inactive":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <PageHeaderProfile
          title={contact.name}
          description={`Contact from ${contact.countryISO}`}
          avatar={{
            src: "", // No image source available
            fallback: contact.avatar,
            alt: contact.name
          }}
          onBack={handleBack}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          }
        />

        {/* Profile Content */}
        <div className="flex flex-col gap-4 pb-4">
          <div className="px-4 md:px-6">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
            isLoading={!contact}
            loadingTabCount={3}
            showContentSkeleton={true}
            skeletonComponent={
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div className="lg:col-span-2 grid grid-cols-1 gap-4 items-start">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
                <div className="grid grid-cols-1 gap-4 items-start">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              </div>
            }
          >
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={smoothTransition}
            >
              <TabsList className="inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground">
                <motion.div transition={smoothTransition}>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                </motion.div>
                <motion.div transition={smoothTransition}>
                  <TabsTrigger value="contact">Contact Information</TabsTrigger>
                </motion.div>
                <motion.div transition={smoothTransition}>
                  <TabsTrigger value="attributes">Attributes, Tags & Events</TabsTrigger>
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
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    variants={isInitialLoad ? initialTabContentVariants : directionalTabVariants(direction)}
                    initial={isInitialLoad ? "initial" : "hidden"}
                    animate={isInitialLoad ? "animate" : "visible"}
                    exit="exit"
                    transition={smoothTransition}
                    className="w-full"
                  >
                    <TabsContent value="overview" className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                        {/* Main Content */}
                        <div className="lg:col-span-2 grid grid-cols-1 gap-4 items-start">
                          {/* Basic Information */}
                          <Card className="py-5 gap-5">
                            <CardHeader>
                              <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                  <p className="text-sm">{contact.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Last Conversation</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className={`text-xs whitespace-nowrap flex-shrink-0 ${getConversationStatusConfig(contact.conversationStatus).color}`}>
                                      {getStatusIcon(getConversationStatusConfig(contact.conversationStatus).icon)}
                                      {getConversationStatusConfig(contact.conversationStatus).label}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                  <p className="text-sm">{contact.phone}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Channel</label>
                                  <p className="text-sm">{contact.channel}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* System Fields */}
                          <Card className="py-5 gap-5">
                            <CardHeader>
                              <CardTitle>System Fields</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Contact ID</label>
                                  <p className="text-sm font-mono">{contact.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Country</label>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="w-4 h-4 flex-shrink-0 overflow-hidden rounded-full">
                                      <CircleFlag countryCode={contact.countryISO.toLowerCase()} className="w-full h-full" />
                                    </div>
                                    <p className="text-sm">{contact.countryISO}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Assignee</label>
                                  <p className="text-sm">{contact.assignee || 'Unassigned'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Last Message</label>
                                  <p className="text-sm">{contact.lastMessage}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Activity Feed */}
                          <Card className="py-5 gap-5">
                            <CardHeader>
                              <CardTitle>Activity Feed</CardTitle>
                              <CardDescription>Recent profile changes and activity updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Contact Created</p>
                                    <p className="text-sm text-muted-foreground">Contact profile was created</p>
                                    <p className="text-xs text-muted-foreground mt-1">Recently</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">Last Message</p>
                                    <p className="text-sm text-muted-foreground">{contact.lastMessage}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Recently</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="grid grid-cols-1 gap-4 items-start">
                          {/* Tags */}
                          <Card className="py-5 gap-5">
                            <CardHeader>
                              <CardTitle>Tags</CardTitle>
                              <CardDescription>Add tags to categorize this contact</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex gap-2">
                                <Input
                                  value={newTag}
                                  onChange={(e) => setNewTag(e.target.value)}
                                  placeholder="Add a tag"
                                  onKeyPress={(e: React.KeyboardEvent) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      addTag()
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={addTag}
                                  disabled={!newTag.trim()}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {contact.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Segments */}
                          <Card className="py-5 gap-5">
                            <CardHeader>
                              <CardTitle>Audience Segments</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-sm">{contact.channel} Users</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm">{contact.conversationStatus}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Notes */}
                          <Card className="py-5 gap-5">
                            <CardHeader>
                              <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">
                                Contact information and communication preferences. Last message: {contact.lastMessage}
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </TabsContent>
                  </motion.div>
                )}

                {activeTab === "contact" && (
                  <motion.div
                    key="contact"
                    variants={isInitialLoad ? initialTabContentVariants : directionalTabVariants(direction)}
                    initial={isInitialLoad ? "initial" : "hidden"}
                    animate={isInitialLoad ? "animate" : "visible"}
                    exit="exit"
                    transition={smoothTransition}
                    className="w-full"
                  >
                    <TabsContent value="contact" className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        {/* Contact Details */}
                        <Card className="py-5 gap-5">
                          <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>Contact information and communication details</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Phone</p>
                                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Country</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="w-4 h-4 flex-shrink-0 overflow-hidden rounded-full">
                                    <CircleFlag countryCode={contact.countryISO.toLowerCase()} className="w-full h-full" />
                                  </div>
                                  <p className="text-sm text-muted-foreground">{contact.countryISO}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Channel</p>
                                <p className="text-sm text-muted-foreground">{contact.channel}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-sm font-medium">Last Conversation</p>
                                <div className="mt-1">
                                  <Badge variant="outline" className={`text-xs whitespace-nowrap flex-shrink-0 ${getConversationStatusConfig(contact.conversationStatus).color}`}>
                                    {getStatusIcon(getConversationStatusConfig(contact.conversationStatus).icon)}
                                    {getConversationStatusConfig(contact.conversationStatus).label}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Channel Information */}
                        <Card className="py-5 gap-5">
                          <CardHeader>
                            <CardTitle>Channel Information</CardTitle>
                            <CardDescription>Communication channels and their status</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getChannelStatusIcon("Active")}
                                <div>
                                  <p className="text-sm font-medium">{contact.channel}</p>
                                  <p className="text-xs text-muted-foreground">Primary communication channel</p>
                                </div>
                              </div>
                              <Badge variant="default">Active</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </motion.div>
                )}

                {activeTab === "attributes" && (
                  <motion.div
                    key="attributes"
                    variants={isInitialLoad ? initialTabContentVariants : directionalTabVariants(direction)}
                    initial={isInitialLoad ? "initial" : "hidden"}
                    animate={isInitialLoad ? "animate" : "visible"}
                    exit="exit"
                    transition={smoothTransition}
                    className="w-full"
                  >
                    <TabsContent value="attributes" className="mt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        {/* Custom Attributes */}
                        <Card className="py-5 gap-5">
                          <CardHeader>
                            <CardTitle>Custom Attributes</CardTitle>
                            <CardDescription>Additional profile information</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-sm font-medium">Contact ID</span>
                              <span className="text-sm text-muted-foreground">{contact.id}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-sm font-medium">Country</span>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 flex-shrink-0 overflow-hidden rounded-full">
                                  <CircleFlag countryCode={contact.countryISO.toLowerCase()} className="w-full h-full" />
                                </div>
                                <span className="text-sm text-muted-foreground">{contact.countryISO}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b last:border-b-0">
                              <span className="text-sm font-medium">Assignee</span>
                              <span className="text-sm text-muted-foreground">{contact.assignee || 'Unassigned'}</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* All Events */}
                        <Card className="py-5 gap-5">
                          <CardHeader>
                            <CardTitle>All Events</CardTitle>
                            <CardDescription>Complete activity history</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">Contact Created</p>
                                  <p className="text-sm text-muted-foreground">Contact profile was created</p>
                                  <p className="text-xs text-muted-foreground mt-1">Recently</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">Message Received</p>
                                  <p className="text-sm text-muted-foreground">{contact.lastMessage}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Recently</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}