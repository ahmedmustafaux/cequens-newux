import * as React from "react"
import { 
  Cloud, 
  CheckCircle2,
  Loader2,
  ArrowLeft,
  RefreshCw,
  Users,
  Calendar,
  Clock,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface SyncHistory {
  id: string
  date: string
  contactsImported: number
  status: "success" | "failed" | "partial"
}

interface ThirdPartyIntegration {
  id: string
  name: string
  description: string
  logo: string
  connected: boolean
  lastSync?: string
  totalContacts?: number
  syncHistory?: SyncHistory[]
}

const integrations: ThirdPartyIntegration[] = [
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync contacts from your HubSpot CRM",
    logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
    connected: false,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5,000+ apps via Zapier",
    logo: "https://cdn.zapier.com/zapier/images/logos/zapier-logomark.png",
    connected: false,
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Import contacts from Salesforce CRM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    connected: false,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync customers from your Shopify store",
    logo: "https://cdn.shopify.com/shopifycloud/brochure/assets/brand-assets/shopify-logo-primary-logo-456baa801ee66a0a435671082365958316831c9960c480451dd0330bcdae304f.svg",
    connected: false,
  },
]

interface ContactsImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactsImportDialog({ 
  open, 
  onOpenChange 
}: ContactsImportDialogProps) {
  const [selectedIntegration, setSelectedIntegration] = React.useState<ThirdPartyIntegration | null>(null)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [connectedIntegrations, setConnectedIntegrations] = React.useState<Record<string, ThirdPartyIntegration>>({})

  const handleIntegrationClick = (integration: ThirdPartyIntegration) => {
    const connectedData = connectedIntegrations[integration.id]
    if (connectedData) {
      setSelectedIntegration(connectedData)
    } else {
      setSelectedIntegration(integration)
    }
  }

  const handleConnect = async (integrationId: string) => {
    setIsConnecting(true)

    // Simulate OAuth connection process
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock connected integration data
    const mockConnectedData: ThirdPartyIntegration = {
      ...integrations.find(i => i.id === integrationId)!,
      connected: true,
      lastSync: new Date().toISOString(),
      totalContacts: 1247,
      syncHistory: [
        {
          id: "1",
          date: new Date().toISOString(),
          contactsImported: 1247,
          status: "success"
        },
        {
          id: "2",
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          contactsImported: 1180,
          status: "success"
        },
        {
          id: "3",
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          contactsImported: 1050,
          status: "partial"
        }
      ]
    }

    setConnectedIntegrations(prev => ({
      ...prev,
      [integrationId]: mockConnectedData
    }))

    setSelectedIntegration(mockConnectedData)
    setIsConnecting(false)
  }

  const handleSync = async () => {
    if (!selectedIntegration) return
    
    setIsSyncing(true)
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update sync history
    const newHistory: SyncHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      contactsImported: Math.floor(Math.random() * 100) + (selectedIntegration.totalContacts || 0),
      status: "success"
    }

    const updatedIntegration = {
      ...selectedIntegration,
      lastSync: new Date().toISOString(),
      totalContacts: newHistory.contactsImported,
      syncHistory: [newHistory, ...(selectedIntegration.syncHistory || [])]
    }

    setConnectedIntegrations(prev => ({
      ...prev,
      [selectedIntegration.id]: updatedIntegration
    }))

    setSelectedIntegration(updatedIntegration)
    setIsSyncing(false)
  }

  const handleBack = () => {
    setSelectedIntegration(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const getStatusColor = (status: SyncHistory["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400"
      case "partial":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col" 
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          {selectedIntegration ? (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-background border flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img 
                    src={selectedIntegration.logo} 
                    alt={selectedIntegration.name}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="flex items-center gap-2">
                    {selectedIntegration.name}
                    {selectedIntegration.connected && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription className="truncate">
                    {selectedIntegration.description}
                  </DialogDescription>
                </div>
              </div>
            </div>
          ) : (
            <>
              <DialogTitle>Import from 3rd Party</DialogTitle>
              <DialogDescription>
                Connect your favorite tools to sync contacts automatically
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {selectedIntegration ? (
            // Integration Detail View
            <div className="space-y-6">
              {selectedIntegration.connected ? (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Users className="w-4 h-4" />
                        Total Contacts
                      </div>
                      <div className="text-2xl font-semibold">
                        {selectedIntegration.totalContacts?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Clock className="w-4 h-4" />
                        Last Sync
                      </div>
                      <div className="text-2xl font-semibold">
                        {selectedIntegration.lastSync ? formatDate(selectedIntegration.lastSync) : "Never"}
                      </div>
                    </div>
                  </div>

                  {/* Sync Button */}
                  <Button 
                    className="w-full gap-2" 
                    onClick={handleSync}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Sync Now
                      </>
                    )}
                  </Button>

                  <Separator />

                  {/* Sync History */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Sync History</h3>
                    <div className="space-y-2">
                      {selectedIntegration.syncHistory && selectedIntegration.syncHistory.length > 0 ? (
                        selectedIntegration.syncHistory.map((history) => (
                          <div
                            key={history.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">
                                  {history.contactsImported.toLocaleString()} contacts imported
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(history.date)}
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn("capitalize", getStatusColor(history.status))}
                            >
                              {history.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No sync history yet
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // Not Connected View
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Cloud className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Connect {selectedIntegration.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    Authorize Cequens to access your {selectedIntegration.name} contacts and keep them in sync automatically.
                  </p>
                  <Button 
                    onClick={() => handleConnect(selectedIntegration.id)}
                    disabled={isConnecting}
                    className="gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Connect {selectedIntegration.name}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Integration List View
            <div className="space-y-3">
              {integrations.map((integration) => {
                const isConnected = !!connectedIntegrations[integration.id]
                return (
                  <button
                    key={integration.id}
                    onClick={() => handleIntegrationClick(integration)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border text-left cursor-pointer",
                      "hover:border-primary hover:bg-accent/50 transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    )}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-background border flex items-center justify-center overflow-hidden">
                      <img 
                        src={integration.logo} 
                        alt={integration.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            const fallback = document.createElement('div')
                            fallback.className = 'w-8 h-8 rounded bg-primary/10 flex items-center justify-center'
                            fallback.innerHTML = '<div class="w-5 h-5 text-primary">?</div>'
                            parent.appendChild(fallback)
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex items-center gap-2">
                        {integration.name}
                        {isConnected && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {integration.description}
                      </div>
                    </div>
                    <Badge variant={isConnected ? "default" : "outline"}>
                      {isConnected ? "Connected" : "Connect"}
                    </Badge>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}