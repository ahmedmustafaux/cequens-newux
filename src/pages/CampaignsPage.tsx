import * as React from "react"
import { useNavigate } from "react-router-dom"
import { usePageTitle } from "@/hooks/use-dynamic-title"
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
import { MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SearchProvider } from "@/contexts/search-context"
import { Highlight } from "@/components/ui/highlight"
import { PageHeader } from "@/components/page-header"
import {
  DataTable,
  DataTableHeader,
  DataTableSelectionHeader,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableRow,
} from "@/components/ui/data-table"
import { mockCampaigns, type Campaign } from "@/data/mock-data"

// Column definitions for the campaigns table
const columns: ColumnDef<Campaign>[] = [
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
    header: "Campaign",
    cell: ({ row }) => (
      <div className="text-left group-hover:underline">
        <Highlight 
          text={row.getValue("name") as string}
          columnId="name"
          className="font-medium text-sm whitespace-nowrap truncate"
        />
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal whitespace-nowrap">
        {row.getValue("type")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Campaign["status"];
      return (
        <Badge 
          variant={
            status === "Active" ? "default" :
            status === "Draft" ? "outline" :
            "outline"
          }
          className="font-normal whitespace-nowrap"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "recipients",
    header: () => <div className="text-right">Recipients</div>,
    cell: ({ row }) => (
      <div className="text-right whitespace-nowrap text-sm text-muted-foreground">
        {row.getValue<number>("recipients").toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "openRate",
    header: () => <div className="text-right">Open Rate</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const openRate = row.getValue<number>("openRate");
      return (
        <div className="text-right whitespace-nowrap text-sm text-muted-foreground">
          {status !== "Draft" ? `${openRate}%` : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "clickRate",
    header: () => <div className="text-right">Click Rate</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const clickRate = row.getValue<number>("clickRate");
      return (
        <div className="text-right whitespace-nowrap text-sm text-muted-foreground">
          {status !== "Draft" ? `${clickRate}%` : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "sentDate",
    header: "Sent Date",
    cell: ({ row }) => {
      const sentDate = row.getValue<string | null>("sentDate");
      return (
        <div className="whitespace-nowrap">
          {sentDate ? new Date(sentDate).toLocaleDateString() : "Not sent"}
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
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" align="center">
                <p>Campaign actions</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View campaign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit campaign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
];

function CampaignsPageContent() {
  const navigate = useNavigate()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 15,
  })
  const [isDataLoading, setIsDataLoading] = React.useState(true)

  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [typeFilter, setTypeFilter] = React.useState<string[]>([])
  const [statusSearchQuery, setStatusSearchQuery] = React.useState("")
  const [typeSearchQuery, setTypeSearchQuery] = React.useState("")

  // Filter options
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Draft", label: "Draft" },
    { value: "Completed", label: "Completed" }
  ]

  const typeOptions = [
    { value: "Email", label: "Email" },
    { value: "SMS", label: "SMS" }
  ]

  // Filtered options based on search
  const filteredStatusOptions = statusOptions.filter(option =>
    option.label.toLowerCase().includes(statusSearchQuery.toLowerCase())
  )

  const filteredTypeOptions = typeOptions.filter(option =>
    option.label.toLowerCase().includes(typeSearchQuery.toLowerCase())
  )

  // Dynamic page title
  usePageTitle("Campaigns")

  // Simulate initial data loading from server
  React.useEffect(() => {
    setIsDataLoading(true)
    const timer = setTimeout(() => {
      setIsDataLoading(false)
    }, 400) // Simulate 400ms loading time for server data

    return () => clearTimeout(timer)
  }, [])

  // Apply filters to table
  React.useEffect(() => {
    const newFilters: ColumnFiltersState = []
    
    if (statusFilter.length > 0) {
      newFilters.push({ id: 'status', value: statusFilter })
    }
    
    if (typeFilter.length > 0) {
      newFilters.push({ id: 'type', value: typeFilter })
    }
    
    setColumnFilters(newFilters)
  }, [statusFilter, typeFilter])

  const table = useReactTable({
    data: mockCampaigns,
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
    // Custom global filter that only searches within specified columns
    globalFilterFn: (row, columnId, value) => {
      const searchColumns = ['name'] // Only search in campaign name column
      const searchValue = value.toLowerCase()
      
      // Check if any of the specified columns contain the search value
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
    },
  })

  const handleNewCampaign = () => {
    // TODO: Implement new campaign creation
  };

  return (
    <div className="flex flex-col">
      <div className="@container/main flex flex-col gap-2">
        <PageHeader
          title="Campaigns"
          description="Manage your marketing campaigns"
          showBreadcrumbs={false}
          isLoading={isDataLoading}
          customActions={
            <div className="flex items-center gap-2">
              <Button onClick={handleNewCampaign}>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>
          }
        />

        <div className="px-4 lg:px-6 flex flex-col">
          <DataTable
            isLoading={isDataLoading}
            searchConfig={{
              placeholder: "Search campaigns...",
              searchColumns: ['name'],
              table: table
            }}
                filters={[
                  {
                    key: "type",
                    label: "Type",
                    options: typeOptions,
                    selectedValues: typeFilter,
                    onSelectionChange: setTypeFilter,
                    onClear: () => setTypeFilter([]),
                    searchable: true,
                    searchPlaceholder: "Search types...",
                    searchQuery: typeSearchQuery,
                    onSearchChange: setTypeSearchQuery,
                    filteredOptions: filteredTypeOptions
                  },
                  {
                    key: "status",
                    label: "Status",
                    options: statusOptions,
                    selectedValues: statusFilter,
                    onSelectionChange: setStatusFilter,
                    onClear: () => setStatusFilter([]),
                    searchable: true,
                    searchPlaceholder: "Search status...",
                    searchQuery: statusSearchQuery,
                    onSearchChange: setStatusSearchQuery,
                    filteredOptions: filteredStatusOptions
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
                footerLabel={`Showing ${table.getRowModel().rows.length} campaigns${table.getSelectedRowModel().rows.length > 0 ? ` • ${table.getSelectedRowModel().rows.length} selected` : ''}`}
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
                              // TODO: Implement duplicate functionality
                            }}
                          >
                            Duplicate
                          </Button>
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
                          onClick={() => navigate(`/campaigns/${row.original.id}`)}
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
        
      </div>
      
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <SearchProvider>
      <CampaignsPageContent />
    </SearchProvider>
  )
}
