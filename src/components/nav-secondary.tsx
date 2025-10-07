import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigationContext } from "@/hooks/use-navigation-context"
export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isActive, navigateTo } = useNavigationContext()
  const handleNavigation = (e: React.MouseEvent, url: string) => {
    e.preventDefault()
    navigateTo(url)
  }
  
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const itemIsActive = isActive(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  isActive={itemIsActive}
                  onClick={(e) => handleNavigation(e, item.url)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
