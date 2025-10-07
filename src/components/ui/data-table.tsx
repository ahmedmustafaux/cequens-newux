import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Field, 
  FieldContent 
} from "@/components/ui/field"
import { 
  InputGroup, 
  InputGroupInput, 
  InputGroupAddon 
} from "@/components/ui/input-group"
import { ChevronLeft, ChevronRight, Search, ArrowUpDownIcon, Columns3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AutoHighlight } from "@/components/ui/highlight"
import { TableHeader, TableHead, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { FilterSelect } from "@/components/ui/filter-select"
import { useTableSearch } from "@/hooks/use-table-search"
import { TableSkeleton } from "@/components/ui/table"
interface FilterOption {
  value: string
  label: string
}
interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  onClear: () => void
  searchable?: boolean
  searchPlaceholder?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  filteredOptions?: FilterOption[]
}
interface DataTableProps {
  children: React.ReactNode
  className?: string
  showFooter?: boolean
  footerContent?: React.ReactNode
  isLoading?: boolean
  loadingRows?: number
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPrevious: () => void
    onNext: () => void
    hasPrevious: boolean
    hasNext: boolean
    onPageSizeChange?: (pageSize: number) => void
    pageSizeOptions?: number[]
  }
  footerLabel?: string
  // Search and filter props
  searchConfig?: {
    placeholder?: string
    searchColumns?: string[]
    table: any // TanStack Table instance - TODO: Add proper typing
  }
  filters?: FilterConfig[]
  showControls?: boolean
}
interface DataTableHeaderProps {
  children: React.ReactNode
  className?: string
}
interface DataTableBodyProps {
  children: React.ReactNode
  className?: string
}
interface DataTableRowProps {
  children: React.ReactNode
  className?: string
  selected?: boolean
  onClick?: () => void
}
interface DataTableHeadProps {
  children: React.ReactNode
  className?: string
  width?: string
}
interface DataTableCellProps {
  children: React.ReactNode
  className?: string
  colSpan?: number
  columnId?: string
  autoHighlight?: boolean
  highlightClassName?: string
  onClick?: () => void
  clickable?: boolean
}
// Main DataTable component
function DataTable({ 
  children, 
  className,
  showFooter = true,
  footerContent,
  isLoading = false,
  loadingRows = 4,
  pagination,
  footerLabel,
  searchConfig,
  filters,
  showControls = true,
}: DataTableProps) {
  const tableRef = React.useRef<HTMLDivElement>(null)
  // Integrate table search if searchConfig is provided
  useTableSearch({ 
    table: searchConfig?.table, 
    searchColumns: searchConfig?.searchColumns || ['name'],
    columnFilters: searchConfig?.table?.getState().columnFilters || [],
    globalFilter: searchConfig?.table?.getState().globalFilter || ""
  })
  return (
    <div className="w-full flex flex-col gap-4 mb-4">
      {/* Search and Filters Section */}
      {(searchConfig || filters || showControls) && !isLoading && (
        <div className="flex flex-col">
          <div className="w-full space-y-4 flex flex-col">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Left Side - Search Bar and Filters */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap w-full">
                {/* Search Bar with Controls on Small Screens */}
                {searchConfig && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:w-auto sm:min-w-[320px]">
                      <Field>
                        <FieldContent>
                      <InputGroup>
                        <InputGroupAddon>
                          <Search className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          placeholder={searchConfig.placeholder || "Search..."}
                          value={searchConfig.table.getState().globalFilter ?? ""}
                          onChange={(event) => {
                            const searchValue = event.target.value
                            // Use global filter for OR logic across multiple columns
                            searchConfig.table.setGlobalFilter(searchValue)
                          }}
                        />
                      </InputGroup>
                        </FieldContent>
                      </Field>
                    </div>
                    
                    {/* Toggle Column and Sorting Controls - Only on Small Screens */}
                    {showControls && searchConfig?.table && (
                      <div className="flex items-center gap-1 sm:hidden">
                        {/* Toggle Columns */}
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                  <Columns3 className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Toggle columns</p>
                            </TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {searchConfig.table
                              .getAllColumns()
                              .filter((column: any) => column.getCanHide()) // eslint-disable-line @typescript-eslint/no-explicit-any
                              .map((column: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                                return (
                                  <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) =>
                                      column.toggleVisibility(!!value)
                                    }
                                  >
                                    {column.id}
                                  </DropdownMenuCheckboxItem>
                                )
                              })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {/* Sorting */}
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                  <ArrowUpDownIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Sort</p>
                            </TooltipContent>
                          </Tooltip>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {searchConfig.table
                              .getAllColumns()
                              .filter((column: any) => column.getCanSort()) // eslint-disable-line @typescript-eslint/no-explicit-any
                              .map((column: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                                return (
                                  <DropdownMenuItem
                                    key={column.id}
                                    onClick={() => column.toggleSorting()}
                                    className="capitalize"
                                  >
                                    {column.id}
                                  </DropdownMenuItem>
                                )
                              })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                )}
                {/* Filters */}
                {filters && filters.length > 0 && (
                  <div className="flex flex-row gap-3 items-center flex-wrap">
                    {/* Dynamic Filters */}
                    {filters.map((filter) => (
                      <FilterSelect
                        key={filter.key}
                        placeholder={filter.label}
                        options={filter.options}
                        selectedValues={filter.selectedValues}
                        onSelectionChange={filter.onSelectionChange}
                        onClear={filter.onClear}
                        searchable={filter.searchable}
                        searchPlaceholder={filter.searchPlaceholder}
                        searchQuery={filter.searchQuery}
                        onSearchChange={filter.onSearchChange}
                        filteredOptions={filter.filteredOptions}
                      />
                    ))}
                    {/* Reset All Button - only show when filters are active */}
                    {filters.some(filter => filter.selectedValues.length > 0) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          filters.forEach(filter => filter.onClear())
                        }}
                        className="h-9 px-3 text-sm"
                      >
                        Reset All
                      </Button>
                    )}
                  </div>
                )}
              </div>
              {/* Right Side - Table Controls */}
              {showControls && searchConfig?.table && (
                <div className="hidden sm:flex items-center gap-2">
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <ArrowUpDownIcon className="h-4 w-4" />
                              <span className="sr-only">Sort</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          <p>Sort table</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {searchConfig.table
                          .getAllColumns()
                          .filter((column: any) => column.getCanSort()) // eslint-disable-line @typescript-eslint/no-explicit-any
                          .map((column: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                            const isSorted = column.getIsSorted()
                            return (
                              <DropdownMenuItem
                                key={column.id}
                                onClick={() => {
                                  if (isSorted === false) {
                                    column.toggleSorting(false)
                                  } else if (isSorted === "asc") {
                                    column.toggleSorting(true)
                                  } else {
                                    column.clearSorting()
                                  }
                                }}
                                className="capitalize"
                              >
                                {column.id}
                                {isSorted === "asc" && " ↑"}
                                {isSorted === "desc" && " ↓"}
                              </DropdownMenuItem>
                            )
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Columns3 className="h-4 w-4" />
                              <span className="sr-only">Edit columns</span>
                            </Button>
                          </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          <p>Toggle columns</p>
                        </TooltipContent>
                      </Tooltip>
                      <DropdownMenuContent align="end">
                        {searchConfig.table
                          .getAllColumns()
                          .filter((column: any) => column.getCanHide()) // eslint-disable-line @typescript-eslint/no-explicit-any
                          .map((column: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                            return (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                  column.toggleVisibility(!!value)
                                }
                              >
                                {column.id}
                              </DropdownMenuCheckboxItem>
                            )
                          })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
      {/* Table container with content-fitted height */}
      <div className="w-full flex flex-col mb-2 relative" data-table-container>
        {isLoading ? (
          <TableSkeleton 
            rows={loadingRows} 
            columns={4}
          />
        ) : (
          <div className="flex flex-col gap-0" ref={tableRef}>
            <div className="w-full overflow-x-auto rounded-md border bg-white">
              <table className={cn("w-full caption-bottom text-sm", className)}>
                {children}
              </table>
            </div>
            
            {/* Footer - Outside table container with 0 gap */}
            {showFooter && (pagination || footerLabel || footerContent) && (
              <DataTableFooter
                pagination={pagination}
                footerLabel={footerLabel}
                footerContent={footerContent}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
// Fixed Footer Component
function DataTableFooter({ 
  pagination, 
  footerLabel, 
  footerContent 
}: {
  pagination?: DataTableProps['pagination']
  footerLabel?: string
  footerContent?: React.ReactNode
}) {
  if (!pagination && !footerLabel && !footerContent) return null
  return (
    <div className="px-2 lg:px-4 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
        {/* First line - Entry count info */}
        <div className="flex items-center">
          {pagination && (
            <div className="text-sm">
              <span className="text-muted-foreground">Showing </span>
              <span className="text-foreground">
                {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
              </span>
              <span className="text-muted-foreground"> of </span>
              <span className="text-foreground">
                {pagination.totalItems}
              </span>
              <span className="text-muted-foreground"> entries</span>
            </div>
          )}
          {footerLabel && !pagination && (
            <div className="text-muted-foreground text-sm">
              {footerLabel}
            </div>
          )}
        </div>
        
        {/* Second line - Pagination controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {pagination ? (
            <>
              {/* Page size selector */}
              {pagination.onPageSizeChange && pagination.pageSizeOptions && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="text-muted-foreground text-sm">Show:</span>
                  <Select
                    value={pagination.itemsPerPage.toString()}
                    onValueChange={(value) => pagination.onPageSizeChange?.(parseInt(value))}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pagination.pageSizeOptions.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Page info */}
              <div className="text-muted-foreground text-sm">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              
              {/* Pagination buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.onPrevious}
                  disabled={!pagination.hasPrevious}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={pagination.onNext}
                  disabled={!pagination.hasNext}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            footerContent
          )}
        </div>
      </div>
    </div>
  )
}
// DataTable Selection Header component
const DataTableSelectionHeader = React.forwardRef<HTMLTableSectionElement, {
  selectedCount: number
  onClearSelection: () => void
  onSelectAll: () => void
  totalCount: number
  rightActions?: React.ReactNode
  className?: string
}>(({ 
  selectedCount, 
  onClearSelection, 
  onSelectAll,
  totalCount,
  rightActions,
  className 
}, ref) => {
  return (
    <TableHeader ref={ref} className={className}>
      <TableRow className="transition-colors">
        <TableHead className="w-12">
          <Checkbox
            checked={
              selectedCount === 0 
                ? false 
                : selectedCount === totalCount 
                  ? true 
                  : "indeterminate"
            }
            onCheckedChange={(checked) => {
              if (checked === true) {
                onSelectAll()
              } else {
                onClearSelection()
              }
            }}
          />
        </TableHead>
        <TableHead colSpan={99}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {selectedCount} selected
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSelectAll}
                  className="h-7 px-2 text-xs"
                >
                  Select All ({totalCount})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearSelection}
                  className="h-7 px-2 text-xs"
                >
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {rightActions || (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
})
DataTableSelectionHeader.displayName = "DataTableSelectionHeader"
// DataTable Header component
const DataTableHeader = React.forwardRef<HTMLTableSectionElement, DataTableHeaderProps>(
  ({ children, className }, ref) => {
    return (
      <TableHeader ref={ref} className={className}>
        <TableRow className="">
          {children}
        </TableRow>
      </TableHeader>
    )
  }
)
DataTableHeader.displayName = "DataTableHeader"
// DataTable Body component
function DataTableBody({ children, className }: DataTableBodyProps) {
  return (
    <tbody className={cn("[&_tr:last-child]:border-0", className)}>
      {children}
    </tbody>
  )
}
// DataTable Row component
function DataTableRow({ children, className, selected, onClick }: DataTableRowProps) {
  return (
    <tr 
      className={cn(
        "border-b transition-colors hover:bg-gray-100 data-[state=selected]:bg-gray-100", // Use same background as body
        selected && "bg-gray-100", // Apply selected state styling
        className
      )}
      data-state={selected ? "selected" : undefined}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}
// DataTable Head component
function DataTableHead({ children, className, width }: DataTableHeadProps) {
  return (
    <th className={cn(
      "text-foreground px-4 py-2.5 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      width && `w-${width}`,
      className
    )}>
      {children}
    </th>
  )
}
// DataTable Cell component
function DataTableCell({ 
  children, 
  className, 
  colSpan, 
  columnId, 
  autoHighlight = false,
  highlightClassName,
  onClick,
  clickable = false
}: DataTableCellProps) {
  // Memoize the processed children to prevent unnecessary re-processing
  const processedChildren = React.useMemo(() => {
    if (!autoHighlight || !columnId) {
      return children
    }
    // Helper function to recursively process children and highlight text content
    const processChildren = (children: React.ReactNode): React.ReactNode => {
      return React.Children.map(children, (child) => {
        if (typeof child === 'string') {
          return (
            <AutoHighlight 
              text={child} 
              columnId={columnId}
              highlightClassName={highlightClassName}
            />
          )
        }
        
        if (React.isValidElement(child)) {
          // If the child is a React element, recursively process its children
          const childProps = child.props as any // eslint-disable-line @typescript-eslint/no-explicit-any
          if (childProps.children) {
            return React.cloneElement(child as any, { // eslint-disable-line @typescript-eslint/no-explicit-any
              ...childProps,
              children: processChildren(childProps.children)
            })
          }
          return child
        }
        
        return child
      })
    }
    return processChildren(children)
  }, [children, autoHighlight, columnId, highlightClassName])
  const handleClick = (event: React.MouseEvent) => {
    // Only handle click if the cell is clickable and onClick is provided
    if (clickable && onClick) {
      // Check if the click target is the checkbox itself
      const target = event.target as HTMLElement
      const isCheckbox = target.closest('[data-slot="checkbox"]')
      
      // If it's not the checkbox, handle the click and stop propagation
      if (!isCheckbox) {
        event.stopPropagation() // Prevent row click handler from being triggered
        onClick()
      }
    }
  }
  return (
    <td 
      className={cn(
        "px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        clickable && "cursor-pointer hover:bg-gray-100 transition-colors",
        className
      )} 
      colSpan={colSpan}
      onClick={handleClick}
    >
      {processedChildren}
    </td>
  )
}
export {
  DataTable,
  DataTableHeader,
  DataTableSelectionHeader,
  DataTableBody,
  DataTableRow,
  DataTableHead,
  DataTableCell,
  DataTableFooter
}
