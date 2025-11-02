import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { CircleFlag } from "react-circle-flags"
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
  Users, 
  Edit, 
  Archive,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Download,
  Upload,
  Search,
} from "lucide-react"
import { PageWrapper } from "@/components/page-wrapper"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchProvider } from "@/contexts/search-context"
import { Highlight } from "@/components/ui/highlight"
import { PageHeader } from "@/components/page-header"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  DataTable,
  DataTableHeader,
  DataTableSelectionHeader,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableRow,
} from "@/components/ui/data-table"
import { usePageTitle } from "@/hooks/use-dynamic-title"
import { mockContacts, type Contact } from "@/data/mock-data"


const ContactsPageContent = (): React.JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isDataLoading, setIsDataLoading] = React.useState(true)
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  })
  
  // Filter states
  const [selectedChannels, setSelectedChannels] = React.useState<string[]>([])
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [channelSearchQuery, setChannelSearchQuery] = React.useState("")
  const [tagSearchQuery, setTagSearchQuery] = React.useState("")
  
  // Dynamic page title
  usePageTitle("Audience")
  
  // Column definitions for the contacts table
  const columns: ColumnDef<Contact>[] = [
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
        const contact = row.original;
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
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-4 h-4 flex-shrink-0 overflow-hidden rounded-full">
              <CircleFlag countryCode={contact.countryISO.toLowerCase()} className="w-full h-full" />
            </div>
            <div className="flex flex-col min-w-0">
              <Highlight 
                text={contact.phone} 
                columnId="phone"
                className="font-normal text-sm text-muted-foreground whitespace-nowrap truncate"
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "channel",
      header: "Channels",
      cell: ({ row }) => {
        const channel = row.getValue("channel") as string;
        const getChannelIconPath = (channel: string) => {
          switch (channel) {
            case 'whatsapp':
              return '/icons/WhatsApp.svg'
            case 'instagram':
              return '/icons/Instagram.svg'
            case 'messenger':
              return '/icons/Messenger.png'
            default:
              return '/icons/Messenger.png'
          }
        }

        return (
          <div className="flex items-center justify-start whitespace-nowrap">
            <img 
              src={getChannelIconPath(channel)} 
              alt={`${channel} icon`}
              className="w-4 h-4 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "lastMessage",
      header: "Last Update",
      meta: {
        displayName: "Last Update"
      },
      cell: ({ row }) => {
        const lastUpdate = row.original.lastMessage;
        return (
          <div className="max-w-[200px] truncate">
            <Highlight 
              text={lastUpdate} 
              columnId="lastMessage"
              className="text-sm text-muted-foreground"
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableHiding: false,
      cell: () => {
        return (
          <div className="flex items-center justify-end">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p>Edit contact</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true)
    const timer = setTimeout(() => {
      setIsDataLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  // Apply global search from query param (?query=...)
  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('query') || ""
    if (q) {
      setGlobalFilter(q)
    }
  }, [location.search])

  // Apply filters to table
  React.useEffect(() => {
    const newFilters: ColumnFiltersState = []
    
    if (selectedChannels.length > 0) {
      newFilters.push({ id: 'channel', value: selectedChannels })
    }
    
    if (selectedTags.length > 0) {
      newFilters.push({ id: 'tags', value: selectedTags })
    }
    
    setColumnFilters(newFilters)
  }, [selectedChannels, selectedTags])

  const table = useReactTable({
    data: mockContacts,
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
    onGlobalFilterChange: setGlobalFilter,
    // Custom global filter that only searches within specified columns
    globalFilterFn: (row, columnId, value) => {
      const searchColumns = ['name', 'phone', 'lastMessage']
      const searchValue = value.toLowerCase()
      
      return searchColumns.some(columnId => {
        const cellValue = row.getValue(columnId)
        return cellValue && cellValue.toString().toLowerCase().includes(searchValue)
      })
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  })

  // Filter options
  const channelOptions = [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "instagram", label: "Instagram" },
    { value: "messenger", label: "Messenger" }
  ]

  const tagOptions = [
    { value: "VIP", label: "VIP" },
    { value: "Enterprise", label: "Enterprise" },
    { value: "Active User", label: "Active User" },
    { value: "New Customer", label: "New Customer" }
  ]

  // Filtered options based on search
  const filteredChannelOptions = channelOptions.filter(option =>
    option.label.toLowerCase().includes(channelSearchQuery.toLowerCase())
  )

  const filteredTagOptions = tagOptions.filter(option =>
    option.label.toLowerCase().includes(tagSearchQuery.toLowerCase())
  )

  const handleImport = () => {
    // TODO: Implement import functionality
  }

  const handleExport = () => {
    // TODO: Implement export functionality
  }

  const handleCreateContact = () => {
    navigate("/contacts/create")
  }

  return (
    <>
      <PageHeader
        title="Audience"
        description="Create and manage your audience."
        showBreadcrumbs={false}
        isLoading={isDataLoading}
        customActions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleImport}>
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={handleCreateContact}
            >
              <UserPlus className="w-4 h-4" />
              Create Contact
            </Button>
          </div>
        }
      />

      <div className="flex flex-col">
        <DataTable
          isLoading={isDataLoading}
          searchConfig={{
            placeholder: "Search contacts by name or phone",
            searchColumns: ['name', 'phone', 'lastUpdate'],
            table: table
          }}
          filters={[
            {
              key: "channels",
              label: "Channel",
              options: channelOptions,
              selectedValues: selectedChannels,
              onSelectionChange: setSelectedChannels,
              onClear: () => setSelectedChannels([]),
              searchable: true,
              searchPlaceholder: "Search channels...",
              searchQuery: channelSearchQuery,
              onSearchChange: setChannelSearchQuery,
              filteredOptions: filteredChannelOptions
            },
            {
              key: "tags",
              label: "Tags",
              options: tagOptions,
              selectedValues: selectedTags,
              onSelectionChange: setSelectedTags,
              onClear: () => setSelectedTags([]),
              searchable: true,
              searchPlaceholder: "Search tags...",
              searchQuery: tagSearchQuery,
              onSearchChange: setTagSearchQuery,
              filteredOptions: filteredTagOptions
            }
          ]}
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
            pageSizeOptions: [15, 20, 30]
          }}
          footerLabel={`Showing ${table.getRowModel().rows.length} contacts${table.getSelectedRowModel().rows.length > 0 ? ` • ${table.getSelectedRowModel().rows.length} selected` : ''}`}
        >
          {table.getSelectedRowModel().rows.length > 0 ? (
            <DataTableSelectionHeader
              selectedCount={table.getSelectedRowModel().rows.length}
              onClearSelection={() => table.resetRowSelection()}
              onSelectAll={() => table.toggleAllRowsSelected()}
              totalCount={table.getFilteredRowModel().rows.length}
              rightActions={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      // TODO: Implement archive functionality
                    }}
                  >
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                    onClick={() => {
                      // TODO: Implement delete functionality
                    }}
                  >
                    Delete
                  </Button>
                </>
              }
            />
          ) : (
            <DataTableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
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
              ))}
            </DataTableHeader>
          )}
          <DataTableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <DataTableRow
                  key={row.id}
                  selected={row.getIsSelected()}
                  className="group cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/contacts/${row.original.id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <DataTableCell 
                      key={cell.id}
                      columnId={cell.column.id}
                      clickable={cell.column.id === "select"}
                      onClick={cell.column.id === "select" ? () => row.toggleSelected(!row.getIsSelected()) : undefined}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  No results.
                </DataTableCell>
              </DataTableRow>
            )}
          </DataTableBody>
        </DataTable>
      </div>
    </>
  )
}

export default function ContactsPage(): React.JSX.Element {
  return (
    <SearchProvider>
      <PageWrapper>
        <ContactsPageContent />
      </PageWrapper>
    </SearchProvider>
  )
}
