import * as React from "react"
import { useNavigate } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-dynamic-title"
import { PageWrapper } from "@/components/page-wrapper"
import { PageHeader } from "@/components/page-header"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyAction,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Plus, Users2, X, Download, Trash2 as TrashIcon, Send, Save, RotateCcw, ArrowLeft, ChevronDown, Smartphone, Mail, Phone, Bell } from "lucide-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import {
  DataTable,
  DataTableHeader,
  DataTableSelectionHeader,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableRow,
} from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  type Segment,
  type SegmentFilter,
  type Contact,
  mockContacts,
  mockSegments,
  updateSegmentContacts,
  getContactsForSegment,
} from "@/data/mock-data"
import { CreateSegmentDialog, type CreateSegmentDialogProps } from "@/components/create-segment-dialog"
import { SearchProvider } from "@/contexts/search-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Highlight } from "@/components/ui/highlight"
import { CircleFlag } from "react-circle-flags"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FilterSearchInput } from "@/components/ui/filter-search-input"
import { FILTER_CATEGORIES, OPERATOR_LABELS, type FilterCategory } from "@/data/filter-config"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { Label } from "@/components/ui/label"

// Helper functions to get filter options
const getAllTags = (): string[] => {
  const tags = new Set<string>()
  mockContacts.forEach((contact) => {
    contact.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

const getAllChannels = (): string[] => {
  // Return all possible channels available in the system
  // Meta channels first: WhatsApp, Messenger, Instagram, then others
  return ["whatsapp", "messenger", "instagram", "sms", "email", "phone", "rcs", "push"]
}

// Helper function to get channel icon
const getChannelIcon = (channel: string): React.ReactNode => {
  switch (channel) {
    case "whatsapp":
      return <img src="/icons/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 flex-shrink-0" onError={(e) => { e.currentTarget.style.display = "none" }} />
    case "instagram":
      return <img src="/icons/Instagram.svg" alt="Instagram" className="w-4 h-4 flex-shrink-0" onError={(e) => { e.currentTarget.style.display = "none" }} />
    case "messenger":
      return <img src="/icons/Messenger.png" alt="Messenger" className="w-4 h-4 flex-shrink-0" onError={(e) => { e.currentTarget.style.display = "none" }} />
    case "sms":
      return <Smartphone className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
    case "email":
      return <Mail className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
    case "phone":
      return <Phone className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
    case "rcs":
      return <Send className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
    case "push":
      return <Bell className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
    default:
      return null
  }
}

const getAllCountries = (): Array<{ code: string; name: string }> => {
  const countries = new Map<string, string>()
  mockContacts.forEach((contact) => {
    if (!countries.has(contact.countryISO)) {
      const countryNames: Record<string, string> = {
        SA: "Saudi Arabia",
        US: "United States",
        EG: "Egypt",
        IN: "India",
        GB: "United Kingdom",
        AE: "United Arab Emirates",
      }
      countries.set(contact.countryISO, countryNames[contact.countryISO] || contact.countryISO)
    }
  })
  return Array.from(countries.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

const getAllConversationStatuses = (): string[] => {
  const statuses = new Set<string>()
  mockContacts.forEach((contact) => {
    statuses.add(contact.conversationStatus)
  })
  return Array.from(statuses).sort()
}

// Helper to get field info from FILTER_CATEGORIES
const getFieldInfo = (field: SegmentFilter["field"]): { category: FilterCategory; field: FilterCategory["fields"][0] } | null => {
  for (const category of FILTER_CATEGORIES) {
    const fieldDef = category.fields.find(f => f.value === field)
    if (fieldDef) {
      return { category, field: fieldDef }
    }
  }
  return null
}

// Helper function to format filter for display as badge
const formatFilterBadge = (filter: SegmentFilter): { label: string; value: string } => {
  const fieldInfo = getFieldInfo(filter.field)
  const fieldLabel = fieldInfo?.field.label || filter.field
  const operatorLabel = OPERATOR_LABELS[filter.operator] || filter.operator

  // Format value based on field type
  let valueLabel = ""
  const needsValue = !['exists', 'doesNotExist', 'isEmpty', 'isNotEmpty'].includes(filter.operator)
  
  if (!needsValue) {
    valueLabel = ""
  } else if (fieldInfo?.field.valueType === 'date') {
    // Handle date values
    if (filter.operator === 'isGreaterThanTime' || filter.operator === 'isLessThanTime') {
      const numValue = typeof filter.value === 'number' ? filter.value : 0
      if (numValue > 0) {
        valueLabel = `${numValue} seconds ago` // Default to seconds, could be enhanced
      }
    } else if (filter.operator === 'isBetweenTime') {
      const values = Array.isArray(filter.value) && filter.value.length === 2 
        ? filter.value.filter((v): v is number => typeof v === 'number')
        : [0, 0]
      if (values[0] > 0 || values[1] > 0) {
        valueLabel = `${values[0]} - ${values[1]} seconds ago`
      }
    } else if (typeof filter.value === 'object' && filter.value && 'from' in filter.value) {
      const dateValue = filter.value as { from: Date; to: Date }
      if (filter.operator === 'isTimestampBetween') {
        valueLabel = `${format(dateValue.from, 'MMM dd, yyyy')} - ${format(dateValue.to, 'MMM dd, yyyy')}`
      } else {
        valueLabel = format(dateValue.from, 'MMM dd, yyyy')
      }
    }
  } else if (fieldInfo?.field.valueType === 'string' && typeof filter.value === 'string') {
    valueLabel = filter.value
  } else if (fieldInfo?.field.valueType === 'number') {
    if (Array.isArray(filter.value) && filter.value.length === 2) {
      const numValues = filter.value.filter((v): v is number => typeof v === 'number')
      valueLabel = `${numValues[0]} - ${numValues[1]}`
    } else {
      const numValue = typeof filter.value === 'number' ? filter.value : 0
      valueLabel = String(numValue)
    }
  } else {
    // Handle array values
    if (Array.isArray(filter.value)) {
      const values = filter.value.filter((v): v is string => typeof v === 'string')
      if (filter.field === "countryISO") {
        const countryNames: Record<string, string> = {
          SA: "Saudi Arabia",
          US: "United States",
          EG: "Egypt",
          IN: "India",
          GB: "United Kingdom",
          AE: "United Arab Emirates",
        }
        valueLabel = values.map((code) => countryNames[code] || code).join(", ")
      } else {
        valueLabel = values.join(", ")
      }
    } else if (typeof filter.value === 'string') {
      if (filter.field === "countryISO") {
        const countryNames: Record<string, string> = {
          SA: "Saudi Arabia",
          US: "United States",
          EG: "Egypt",
          IN: "India",
          GB: "United Kingdom",
          AE: "United Arab Emirates",
        }
        valueLabel = countryNames[filter.value] || filter.value
      } else {
        valueLabel = filter.value
      }
    }
  }

  return {
    label: fieldLabel,
    value: valueLabel ? `${operatorLabel} ${valueLabel}` : operatorLabel,
  }
}

// Column definitions for contacts table
const createContactColumns = (): ColumnDef<Contact>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        containerClickable={true}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Users",
    cell: ({ row }) => {
      const contact = row.original
      return (
        <div className="flex items-center gap-2 min-w-0">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="font-medium text-xs">
              {contact.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <div className="text-left group-hover:underline">
              <Highlight
                text={contact.name}
                columnId="name"
                className="font-medium text-sm whitespace-nowrap truncate"
              />
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const contact = row.original
      return (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-4 h-4 flex-shrink-0 overflow-hidden rounded-full">
            <CircleFlag
              countryCode={contact.countryISO.toLowerCase()}
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <Highlight
              text={contact.phone}
              columnId="phone"
              className="font-normal text-sm text-muted-foreground whitespace-nowrap truncate"
            />
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "channel",
    header: "Channels",
    cell: ({ row }) => {
      const channel = row.getValue("channel") as string
      const getChannelIconPath = (channel: string) => {
        switch (channel) {
          case "whatsapp":
            return "/icons/WhatsApp.svg"
          case "instagram":
            return "/icons/Instagram.svg"
          case "messenger":
            return "/icons/Messenger.png"
          default:
            return "/icons/Messenger.png"
        }
      }

      return (
        <div className="flex items-center justify-start whitespace-nowrap">
          <img
            src={getChannelIconPath(channel)}
            alt={`${channel} icon`}
            className="w-4 h-4 flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      )
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags
      if (!tags || tags.length === 0) {
        return <span className="text-sm text-muted-foreground">—</span>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "lastMessage",
    header: "Last Update",
    cell: ({ row }) => {
      const lastUpdate = row.original.lastMessage
      return (
        <div className="max-w-[200px] truncate">
          <Highlight
            text={lastUpdate}
            columnId="lastMessage"
            className="text-sm text-muted-foreground"
          />
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const contact = row.original
      return (
        <div className="flex items-center justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => {
                  // Navigate to contact detail
                }}
              >
                <span className="sr-only">Open menu</span>
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              <p>Edit contact</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },
]

const SEGMENTS_STORAGE_KEY = "cequens-segments"

// Helper to load segments from localStorage
const loadSegmentsFromStorage = (): Segment[] => {
  try {
    const stored = localStorage.getItem(SEGMENTS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects and ensure default segments exist
      const loadedSegments = parsed.map((seg: any) => ({
        ...seg,
        createdAt: new Date(seg.createdAt),
        updatedAt: new Date(seg.updatedAt),
      }))
      
      // Check if default segments exist, if not add them
      const defaultSegmentIds = mockSegments.map((s: Segment) => s.id)
      const existingDefaultIds = loadedSegments.filter((s: Segment) => defaultSegmentIds.includes(s.id)).map((s: Segment) => s.id)
      const missingDefaultIds = defaultSegmentIds.filter((id: string) => !existingDefaultIds.includes(id))
      
      if (missingDefaultIds.length > 0) {
        // Add missing default segments
        const missingSegments = mockSegments
          .filter(s => missingDefaultIds.includes(s.id))
          .map(segment => updateSegmentContacts(segment, mockContacts))
        return [...loadedSegments, ...missingSegments]
      }
      
      return loadedSegments
    }
    // If no segments in storage, return default segments with updated contactIds
    if (mockSegments.length > 0) {
      return mockSegments.map(segment => updateSegmentContacts(segment, mockContacts))
    }
  } catch (error) {
    console.error("Error loading segments from storage:", error)
  }
  // Fallback: return default segments with updated contactIds
  if (mockSegments.length > 0) {
    return mockSegments.map(segment => updateSegmentContacts(segment, mockContacts))
  }
  return []
}

// Helper to save segments to localStorage
const saveSegmentsToStorage = (segments: Segment[]) => {
  try {
    localStorage.setItem(SEGMENTS_STORAGE_KEY, JSON.stringify(segments))
  } catch (error) {
    console.error("Error saving segments to storage:", error)
  }
}

function ContactsSegmentsPageContent() {
  const navigate = useNavigate()
  const [segments, setSegments] = React.useState<Segment[]>([])
  const [selectedSegmentId, setSelectedSegmentId] = React.useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingSegment, setEditingSegment] = React.useState<Segment | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  })
  const [isDataLoading, setIsDataLoading] = React.useState(true)
  // Track pending filter changes for the selected segment
  const [pendingFilters, setPendingFilters] = React.useState<SegmentFilter[] | null>(null)
  const [originalFilters, setOriginalFilters] = React.useState<SegmentFilter[] | null>(null)
  // Inline filter form state
  const [isAddingFilter, setIsAddingFilter] = React.useState(false)
  const [editingFilterIndex, setEditingFilterIndex] = React.useState<number | null>(null)
  const [fieldSearchQuery, setFieldSearchQuery] = React.useState("")
  const [valueSearchQuery, setValueSearchQuery] = React.useState("")
  const [selectedFieldForValueSelection, setSelectedFieldForValueSelection] = React.useState<SegmentFilter["field"] | null>(null)
  const [selectedFieldElement, setSelectedFieldElement] = React.useState<HTMLElement | null>(null)
  const [isSegmentMenuOpen, setIsSegmentMenuOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const [timeUnits, setTimeUnits] = React.useState<Record<string, string>>({})

  usePageTitle("Segments")

  // Load segments from localStorage on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const loadedSegments = loadSegmentsFromStorage()
      setSegments(loadedSegments)
      setIsDataLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // Save segments to localStorage whenever they change
  React.useEffect(() => {
    if (!isDataLoading && segments.length >= 0) {
      saveSegmentsToStorage(segments)
    }
  }, [segments, isDataLoading])

  // Auto-select first segment when segments are loaded
  React.useEffect(() => {
    if (segments.length > 0 && !selectedSegmentId) {
      setSelectedSegmentId(segments[0].id)
    }
  }, [segments, selectedSegmentId])


  const handleCreateSegment = (
    segmentData: Omit<Segment, "id" | "contactIds" | "createdAt" | "updatedAt">
  ) => {
    const newSegment: Segment = {
      id: `segment-${Date.now()}`,
      ...segmentData,
      contactIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Update contacts for the new segment
    const updatedSegment = updateSegmentContacts(newSegment, mockContacts)

    setSegments((prev) => [...prev, updatedSegment])
    setSelectedSegmentId(updatedSegment.id)
    setIsCreateDialogOpen(false)
  }

  const handleEditSegment = React.useCallback((segment: Segment) => {
    setEditingSegment(segment)
    setIsCreateDialogOpen(true)
  }, [])

  const handleUpdateSegment = React.useCallback(
    (
      segmentId: string,
      segmentData: Omit<Segment, "id" | "contactIds" | "createdAt" | "updatedAt">
    ) => {
      setSegments((prev) =>
        prev.map((segment) => {
          if (segment.id === segmentId) {
            const updated = {
              ...segment,
              ...segmentData,
              updatedAt: new Date(),
            }
            // Recalculate contacts based on filters
            return updateSegmentContacts(updated, mockContacts)
          }
          return segment
        })
      )
      setEditingSegment(null)
      setIsCreateDialogOpen(false)
    },
    []
  )

  const handleDeleteSegment = React.useCallback((segmentToDelete: Segment) => {
    setSegments((prev) => {
      const updated = prev.filter((s) => s.id !== segmentToDelete.id)
      // If deleted segment was selected, select first remaining segment or null
      if (selectedSegmentId === segmentToDelete.id) {
        setSelectedSegmentId(updated.length > 0 ? updated[0].id : null)
      }
      return updated
    })
  }, [selectedSegmentId])

  const handleRemoveFromSegment = React.useCallback(() => {
    if (!selectedSegmentId) return
    
    const selectedContactIds = Object.keys(rowSelection)
    if (selectedContactIds.length === 0) return
    
    // Remove selected contacts from the segment
    setSegments((prev) =>
      prev.map((segment) => {
        if (segment.id === selectedSegmentId) {
          const updatedContactIds = segment.contactIds.filter(
            (id) => !selectedContactIds.includes(id)
          )
          return {
            ...segment,
            contactIds: updatedContactIds,
            updatedAt: new Date(),
          }
        }
        return segment
      })
    )
    
    // Clear selection after removal
    setRowSelection({})
  }, [rowSelection, selectedSegmentId])

  const handleSendCampaign = React.useCallback(() => {
    const selectedContactIds = Object.keys(rowSelection)
    if (selectedContactIds.length === 0) return
    
    // Navigate to create campaign page with selected contacts
    // In a real app, you might pass the contact IDs as query params or state
    navigate("/campaigns/create", {
      state: { selectedContactIds },
    })
  }, [rowSelection, navigate])


  const handleDialogClose = React.useCallback(() => {
    setIsCreateDialogOpen(false)
    setEditingSegment(null)
  }, [])

  // Get selected segment
  const selectedSegment = React.useMemo(() => {
    return segments.find((s) => s.id === selectedSegmentId) || null
  }, [segments, selectedSegmentId])

  // Reset pending filters when selected segment changes
  React.useEffect(() => {
    if (selectedSegment) {
      setPendingFilters(null)
      setOriginalFilters([...selectedSegment.filters])
      setEditingFilterIndex(null)
    } else {
      setPendingFilters(null)
      setOriginalFilters(null)
      setEditingFilterIndex(null)
    }
  }, [selectedSegment])


  const handleRemoveFilter = React.useCallback((filterIndex: number) => {
    if (!selectedSegment) return
    
    const currentFilters = pendingFilters !== null ? pendingFilters : selectedSegment.filters
    const updatedFilters = currentFilters.filter((_, i) => i !== filterIndex)
    
    setPendingFilters(updatedFilters)
    
    // Set original filters if not set yet
    if (originalFilters === null) {
      setOriginalFilters([...selectedSegment.filters])
    }
  }, [selectedSegment, pendingFilters, originalFilters])

  // Get filter value options based on field
  const getFilterValueOptions = React.useCallback((field: SegmentFilter["field"]) => {
    switch (field) {
      case "countryISO":
        return getAllCountries().map((c) => ({ value: c.code, label: c.name }))
      case "tags":
        return getAllTags().map((tag) => ({ value: tag, label: tag }))
      case "channel":
        return getAllChannels().map((channel) => {
          // Format channel names for display
          const channelLabels: Record<string, string> = {
            whatsapp: "WhatsApp",
            instagram: "Instagram",
            messenger: "Messenger",
            sms: "SMS",
            email: "Email",
            phone: "Phone",
            rcs: "RCS",
            push: "Push Notifications",
          }
          return { 
            value: channel, 
            label: channelLabels[channel] || channel,
            icon: channel // Pass channel ID for icon rendering
          }
        })
      case "conversationStatus":
        return getAllConversationStatuses().map((status) => ({ value: status, label: status }))
      case "language":
        return getAllConversationStatuses().map((status) => ({ value: status, label: status })) // TODO: Get actual languages
      case "botStatus":
        return getAllConversationStatuses().map((status) => ({ value: status, label: status })) // TODO: Get actual bot statuses
      case "assignee":
        return getAllConversationStatuses().map((status) => ({ value: status, label: status })) // TODO: Get actual assignees
      default:
        return []
    }
  }, [])


  const handleCategorySelected = React.useCallback((categoryId: string) => {
    const category = FILTER_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return

    // If it's a 2-level category (Category -> Value), automatically select the field
    if (!category.hasThreeLevels && category.fields.length > 0) {
      const field = category.fields[0].value
      handleFieldSelected(field)
    } else {
      // 3-level category (Contact Field), show fields selection
      setSelectedCategory(categoryId)
    }
  }, [])

  const handleFieldSelected = React.useCallback((field: SegmentFilter["field"], event?: React.MouseEvent<HTMLElement>) => {
    if (!selectedSegment) return
    
    try {
      const fieldInfo = getFieldInfo(field)
      if (!fieldInfo) return

      const currentFilters = pendingFilters !== null ? pendingFilters : selectedSegment.filters
      
      // Get default operator from field definition
      const defaultOperator = fieldInfo.field.operators[0] || "equals"
      
      // Get default value based on valueType
      let defaultValue: SegmentFilter["value"]
      if (fieldInfo.field.valueType === 'date') {
        defaultValue = { from: new Date(), to: new Date() }
      } else if (fieldInfo.field.valueType === 'number') {
        defaultValue = 0
      } else if (fieldInfo.field.valueType === 'array') {
        defaultValue = []
      } else {
        defaultValue = ""
      }
      
      const filterToAdd: SegmentFilter = {
        field,
        operator: defaultOperator,
        value: defaultValue,
      }
      
      const updatedFilters = [...currentFilters, filterToAdd]
      
      // Set original filters if not set yet
      if (originalFilters === null) {
        setOriginalFilters([...selectedSegment.filters])
      }
      
      // Update pending filters
      setPendingFilters(updatedFilters)
      
      // Store the clicked element for positioning
      if (event?.currentTarget) {
        setSelectedFieldElement(event.currentTarget)
      }
      
      // Keep the popover open and show value selection for the selected field
      setSelectedFieldForValueSelection(field)
      setSelectedCategory(null)
      // Don't close isAddingFilter - we'll show value selection in the same popover
    } catch (error) {
      console.error("Error adding filter:", error)
    }
  }, [selectedSegment, pendingFilters, originalFilters])

  const handleFilterValueChange = React.useCallback((filterIndex: number, newValues: string | string[] | number | number[] | Date | { from: Date; to: Date }) => {
    if (!selectedSegment) return
    
    const currentFilters = pendingFilters !== null ? pendingFilters : selectedSegment.filters
    const updatedFilters = [...currentFilters]
    
    updatedFilters[filterIndex] = {
      ...updatedFilters[filterIndex],
      value: newValues,
    }
    
    setPendingFilters(updatedFilters)
    
    // Set original filters if not set yet
    if (originalFilters === null) {
      setOriginalFilters([...selectedSegment.filters])
    }
    
    // If this is a new filter being created, close the "Add Filter" popover after value is selected
    if (selectedFieldForValueSelection && filterIndex === updatedFilters.length - 1) {
      setSelectedFieldForValueSelection(null)
      setSelectedFieldElement(null)
      setValueSearchQuery("")
      setIsAddingFilter(false)
    }
  }, [selectedSegment, pendingFilters, originalFilters, selectedFieldForValueSelection])

  const handleFilterOperatorChange = React.useCallback((filterIndex: number, operator: SegmentFilter["operator"]) => {
    if (!selectedSegment) return
    
    const currentFilters = pendingFilters !== null ? pendingFilters : selectedSegment.filters
    const updatedFilters = [...currentFilters]
    const currentFilter = updatedFilters[filterIndex]
    
    // Get field info to determine default value type
    const fieldInfo = getFieldInfo(currentFilter.field)
    
    // Reset value based on field type and operator
    let resetValue: SegmentFilter["value"]
    if (fieldInfo?.field.valueType === 'date') {
      resetValue = { from: new Date(), to: new Date() }
    } else if (fieldInfo?.field.valueType === 'number') {
      resetValue = 0
    } else if (fieldInfo?.field.valueType === 'array') {
      resetValue = []
    } else {
      resetValue = ""
    }
    
    updatedFilters[filterIndex] = {
      ...updatedFilters[filterIndex],
      operator,
      value: resetValue,
    }
    
    setPendingFilters(updatedFilters)
    
    // Set original filters if not set yet
    if (originalFilters === null) {
      setOriginalFilters([...selectedSegment.filters])
    }
  }, [selectedSegment, pendingFilters, originalFilters])

  // Render value input based on field type and operator
  const renderValueInput = React.useCallback((filter: SegmentFilter, filterIndex: number) => {
    if (!filter || !filter.field) {
      return <div className="text-sm text-muted-foreground p-2">Loading...</div>
    }

    const fieldInfo = getFieldInfo(filter.field)
    if (!fieldInfo) {
      return <div className="px-2 py-2 text-sm text-muted-foreground text-center">Field not found</div>
    }

    const { field: fieldDef, category } = fieldInfo
    const operator = filter.operator

    // Operators that don't need value input
    if (operator === 'exists' || operator === 'doesNotExist' || operator === 'isEmpty' || operator === 'isNotEmpty') {
      return (
        <div className="px-3 py-3 text-sm text-muted-foreground text-center">
          No value needed for this operator
        </div>
      )
    }

    // Date fields - use date picker or time input
    if (fieldDef.valueType === 'date') {
      // Time-based operators (isGreaterThanTime, isLessThanTime, isBetweenTime) use number input with time unit
      if (operator === 'isGreaterThanTime' || operator === 'isLessThanTime') {
        const currentValue = typeof filter.value === 'number' ? filter.value : 0
        const currentTimeUnit = timeUnits[String(filterIndex)] || 'seconds'
        
        return (
          <div className="p-3 space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Value</Label>
              <Input
                type="number"
                placeholder="Enter value"
                value={currentValue || ''}
                onChange={(e) => {
                  const numValue = parseFloat(e.target.value)
                  if (!isNaN(numValue)) {
                    handleFilterValueChange(filterIndex, numValue)
                  } else if (e.target.value === '') {
                    handleFilterValueChange(filterIndex, 0)
                  }
                }}
                className="w-full"
                autoFocus
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Time Unit</Label>
              <Select
                value={currentTimeUnit}
                onValueChange={(value) => {
                  setTimeUnits(prev => ({ ...prev, [String(filterIndex)]: value }))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds ago</SelectItem>
                  <SelectItem value="minutes">Minutes ago</SelectItem>
                  <SelectItem value="hours">Hours ago</SelectItem>
                  <SelectItem value="days">Days ago</SelectItem>
                  <SelectItem value="weeks">Weeks ago</SelectItem>
                  <SelectItem value="months">Months ago</SelectItem>
                  <SelectItem value="years">Years ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      }
      
      if (operator === 'isBetweenTime') {
        const values = Array.isArray(filter.value) && filter.value.length === 2 
          ? filter.value.filter((v): v is number => typeof v === 'number')
          : [0, 0]
        const currentTimeUnit = timeUnits[String(filterIndex)] || 'seconds'
        
        return (
          <div className="p-3 space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
              <Input
                type="number"
                placeholder="From"
                value={values[0] || ''}
                onChange={(e) => {
                  const from = parseFloat(e.target.value) || 0
                  handleFilterValueChange(filterIndex, [from, values[1] || 0])
                }}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
              <Input
                type="number"
                placeholder="To"
                value={values[1] || ''}
                onChange={(e) => {
                  const to = parseFloat(e.target.value) || 0
                  handleFilterValueChange(filterIndex, [values[0] || 0, to])
                }}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Time Unit</Label>
              <Select
                value={currentTimeUnit}
                onValueChange={(value) => {
                  setTimeUnits(prev => ({ ...prev, [String(filterIndex)]: value }))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds ago</SelectItem>
                  <SelectItem value="minutes">Minutes ago</SelectItem>
                  <SelectItem value="hours">Hours ago</SelectItem>
                  <SelectItem value="days">Days ago</SelectItem>
                  <SelectItem value="weeks">Weeks ago</SelectItem>
                  <SelectItem value="months">Months ago</SelectItem>
                  <SelectItem value="years">Years ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      }
      
      // Timestamp operators (isTimestampAfter, isTimestampBefore, isTimestampBetween) use calendar picker
      const getDateRange = (): DateRange | undefined => {
        if (typeof filter.value === 'object' && filter.value && 'from' in filter.value) {
          const dateValue = filter.value as { from: Date; to: Date }
          return { from: dateValue.from, to: dateValue.to }
        }
        return undefined
      }

      const currentDateRange = getDateRange()

      return (
        <div className="p-3">
          {operator === 'isTimestampBetween' ? (
            <Calendar
              mode="range"
              selected={currentDateRange}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  handleFilterValueChange(filterIndex, { from: range.from, to: range.to })
                }
              }}
              numberOfMonths={2}
              className="rounded-md"
            />
          ) : operator === 'isTimestampAfter' ? (
            <Calendar
              mode="single"
              selected={currentDateRange?.from}
              onSelect={(date) => {
                if (date) {
                  handleFilterValueChange(filterIndex, { from: date, to: date })
                }
              }}
              className="rounded-md"
            />
          ) : operator === 'isTimestampBefore' ? (
            <Calendar
              mode="single"
              selected={currentDateRange?.to}
              onSelect={(date) => {
                if (date) {
                  const existingFrom = currentDateRange?.from || date
                  handleFilterValueChange(filterIndex, { from: existingFrom, to: date })
                }
              }}
              className="rounded-md"
            />
          ) : null}
        </div>
      )
    }

    // String fields (phone, email, names) - use text input
    if (fieldDef.valueType === 'string' && (operator === 'equals' || operator === 'notEquals' || operator === 'contains' || operator === 'notContains' || operator === 'startsWith' || operator === 'endsWith')) {
      const currentValue = typeof filter.value === 'string' ? filter.value : ''
      return (
        <div className="p-3">
          <Input
            type="text"
            placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
            value={currentValue}
            onChange={(e) => handleFilterValueChange(filterIndex, e.target.value)}
            autoFocus
            className="w-full"
          />
        </div>
      )
    }

    // Number fields - use number input
    if (fieldDef.valueType === 'number') {
      const currentValue = typeof filter.value === 'number' ? filter.value : (Array.isArray(filter.value) && typeof filter.value[0] === 'number' ? filter.value[0] : '')
      
      if (operator === 'between') {
        const values = Array.isArray(filter.value) && filter.value.length === 2 
          ? filter.value.filter((v): v is number => typeof v === 'number')
          : [0, 0]
        return (
          <div className="p-3 space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
              <Input
                type="number"
                placeholder="From"
                value={values[0] || ''}
                onChange={(e) => {
                  const from = parseFloat(e.target.value) || 0
                  handleFilterValueChange(filterIndex, [from, values[1] || 0])
                }}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
              <Input
                type="number"
                placeholder="To"
                value={values[1] || ''}
                onChange={(e) => {
                  const to = parseFloat(e.target.value) || 0
                  handleFilterValueChange(filterIndex, [values[0] || 0, to])
                }}
                className="w-full"
              />
            </div>
          </div>
        )
      }
      
      return (
        <div className="p-3">
          <Input
            type="number"
            placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
            value={currentValue}
            onChange={(e) => {
              const numValue = parseFloat(e.target.value)
              if (!isNaN(numValue)) {
                handleFilterValueChange(filterIndex, numValue)
              } else if (e.target.value === '') {
                handleFilterValueChange(filterIndex, 0)
              }
            }}
            autoFocus
            className="w-full"
          />
        </div>
      )
    }

    // Array fields (channels, tags, etc.) - use multi-select
    if (fieldDef.valueType === 'array') {
      const options = getFilterValueOptions(filter.field)
      if (!options || options.length === 0) {
        return <div className="px-2 py-2 text-sm text-muted-foreground text-center">No options available</div>
      }
      
      const displayValues: string[] = Array.isArray(filter.value) 
        ? filter.value.filter((v): v is string => typeof v === 'string')
        : typeof filter.value === 'string' ? [filter.value] : []
      
      const filteredOptions = valueSearchQuery
        ? options.filter(option => 
            option.label.toLowerCase().includes(valueSearchQuery.toLowerCase())
          )
        : options
      
      return (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0">
            <FilterSearchInput
              placeholder="Search..."
              value={valueSearchQuery}
              onChange={setValueSearchQuery}
              autoFocus={false}
            />
          </div>
          
          {filteredOptions.length > 0 ? (
            <div className="overflow-y-auto p-1 flex-1 min-h-0 max-h-64">
              {filteredOptions.map((option) => {
                const isSelected = displayValues.includes(option.value)
                return (
                  <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm">
                    <Checkbox
                      id={`filter-${filterIndex}-${option.value}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        const newValues = checked
                          ? [...displayValues, option.value]
                          : displayValues.filter((v) => v !== option.value)
                        handleFilterValueChange(filterIndex, newValues)
                      }}
                    />
                    <label
                      htmlFor={`filter-${filterIndex}-${option.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 flex items-center justify-between"
                    >
                      <span>{option.label}</span>
                      {filter.field === "channel" && (
                        <span className="ml-2">
                          {getChannelIcon(option.value)}
                        </span>
                      )}
                    </label>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-2 py-1 text-sm text-muted-foreground text-center">
              No results found
            </div>
          )}
        </div>
      )
    }

    return <div className="px-2 py-2 text-sm text-muted-foreground text-center">Unsupported field type</div>
  }, [getFilterValueOptions, handleFilterValueChange, valueSearchQuery, timeUnits])

  const handleSaveFilters = React.useCallback(() => {
    if (!selectedSegment || pendingFilters === null) return
    
    handleUpdateSegment(selectedSegment.id, {
      name: selectedSegment.name,
      description: selectedSegment.description,
      filters: pendingFilters,
    })
    
    setPendingFilters(null)
    setOriginalFilters(null)
  }, [selectedSegment, pendingFilters, handleUpdateSegment])

  const handleDiscardFilters = React.useCallback(() => {
    if (!selectedSegment || originalFilters === null) return
    
    setPendingFilters(null)
    setOriginalFilters(null)
  }, [selectedSegment, originalFilters])

  // Check if filters have been modified
  const hasFilterChanges = React.useMemo(() => {
    if (!selectedSegment || pendingFilters === null || originalFilters === null) return false
    
    // Compare filters arrays
    if (pendingFilters.length !== originalFilters.length) return true
    
    return JSON.stringify(pendingFilters) !== JSON.stringify(originalFilters)
  }, [selectedSegment, pendingFilters, originalFilters])

  // Get contacts for selected segment
  const segmentContacts = React.useMemo(() => {
    if (!selectedSegment) return []
    return getContactsForSegment(mockContacts, selectedSegment)
  }, [selectedSegment])


  const columns = React.useMemo(() => createContactColumns(), [])

  const table = useReactTable({
    data: segmentContacts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  return (
    <PageWrapper isLoading={isDataLoading}>
      <PageHeader
        title="Segments"
        description="Manage your audience segments"
        customActions={
          !isDataLoading && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Segment
            </Button>
          )
        }
      />

      {!isDataLoading && segments.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users2 />
            </EmptyMedia>
            <EmptyTitle>No segments yet</EmptyTitle>
            <EmptyDescription>
              Create segments to dynamically organize your contacts based on filters. When a contact matches a segment's criteria, they'll be automatically added to that segment.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <EmptyAction onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Segment
            </EmptyAction>
          </EmptyContent>
        </Empty>
      ) : !isDataLoading && segments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Segment View Selector */}
          <DataTable
            isLoading={false}
            views={{
              options: segments.map((segment) => ({
                label: segment.name,
                value: segment.id,
                count: segment.contactIds.length,
              })),
              selectedView: selectedSegmentId || "",
              onViewChange: (viewId) => setSelectedSegmentId(viewId),
              renderSelectedView: (view, onClick) => {
                const segment = segments.find(s => s.id === view.value)
                if (!segment) return null
                
                return (
                  <DropdownMenu open={isSegmentMenuOpen} onOpenChange={setIsSegmentMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8"
                        onClick={onClick}
                      >
                        {view.label}
                        {view.count !== undefined && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            ({view.count})
                          </span>
                        )}
                        <ChevronDown className={`ml-1.5 h-3.5 w-3.5 transition-transform duration-200 ${isSegmentMenuOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleEditSegment(segment)}>
                        Edit Segment
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleDeleteSegment(segment)
                        }}
                      >
                        Delete Segment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              },
            }}
            searchConfig={{
              placeholder: "Search contacts by name or phone",
              searchColumns: ["name", "phone", "lastMessage"],
              table: table,
            }}
            pagination={{
              currentPage: table.getState().pagination.pageIndex + 1,
              totalPages: table.getPageCount(),
              totalItems: table.getFilteredRowModel().rows.length,
              itemsPerPage: table.getState().pagination.pageSize,
              onPrevious: () => table.previousPage(),
              onNext: () => table.nextPage(),
              hasPrevious: table.getCanPreviousPage(),
              hasNext: table.getCanNextPage(),
              onPageSizeChange: (pageSize: number) => table.setPageSize(pageSize),
              pageSizeOptions: [15, 20, 30],
            }}
            footerLabel={`Showing ${table.getRowModel().rows.length} contact${table.getRowModel().rows.length !== 1 ? "s" : ""}${table.getSelectedRowModel().rows.length > 0 ? ` • ${table.getSelectedRowModel().rows.length} selected` : ""}`}
          >

            {table.getSelectedRowModel().rows.length > 0 ? (
              <DataTableSelectionHeader
                selectedCount={table.getSelectedRowModel().rows.length}
                onClearSelection={() => table.resetRowSelection()}
                onSelectAll={() => table.toggleAllRowsSelected()}
                onSelectAllOnPage={() => {
                  table.getRowModel().rows.forEach((row) => row.toggleSelected(true))
                }}
                totalCount={table.getFilteredRowModel().rows.length}
                showCount={table.getRowModel().rows.length}
                selectedCountOnCurrentPage={table.getRowModel().rows.filter((row) => row.getIsSelected()).length}
                audience="contacts"
                columnCount={table.getVisibleFlatColumns().length}
                rightActions={
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={handleSendCampaign}
                    >
                      Send campaign
                    </Button>
                  </>
                }
              />
            ) : (
              <DataTableHeader>
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => {
                    return (
                      <DataTableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </DataTableHead>
                    )
                  })
                )}
              </DataTableHeader>
            )}
            <DataTableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <DataTableRow
                    key={row.id}
                    selected={row.getIsSelected()}
                    onClick={() => {
                      navigate(`/contacts/${row.original.id}`)
                    }}
                    className="group cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <DataTableCell
                        key={cell.id}
                        columnId={cell.column.id}
                        clickable={cell.column.id === "select"}
                        onClick={
                          cell.column.id === "select"
                            ? () => row.toggleSelected(!row.getIsSelected())
                            : undefined
                        }
                      >
                        {cell.column.id === "actions" ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </DataTableCell>
                    ))}
                  </DataTableRow>
                ))
              ) : (
                <DataTableRow>
                  <DataTableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No contacts found in this segment.
                  </DataTableCell>
                </DataTableRow>
              )}
            </DataTableBody>
          </DataTable>
        </div>
      ) : null}

      <CreateSegmentDialog
        open={isCreateDialogOpen}
        onOpenChange={handleDialogClose}
        onSave={handleCreateSegment}
        editingSegment={editingSegment}
        onUpdate={editingSegment ? handleUpdateSegment : undefined}
      />

    </PageWrapper>
  )
}

export default function ContactsSegmentsPage() {
  return (
    <SearchProvider>
      <ContactsSegmentsPageContent />
    </SearchProvider>
  )
}
