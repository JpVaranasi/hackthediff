import Link from "next/link"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import {Home,Settings,Calendar,Search, HomeIcon} from "lucide-react"

const items = [
    {
        title:"Home",
        icon:Home,
        url: "#",
    },
    {
        title:"Settings",
        icon:Settings,
        url: "#",
    },
    {
        title:"Calendar",
        icon:Calendar,
        url: "#",
    },{
        title:"Search",
        icon:Search,
        url: "#",
    },
]
const AppSidebar = () => {
    const SIDEBAR_KEYBOARD_SHORTCUT = "b"
    return  <Sidebar collapsible="icon">
            <SidebarHeader className="py-4">

            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item=>(
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                        <item.icon/>
                                        <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>

            </SidebarFooter>
        </Sidebar>
    
}
export default AppSidebar