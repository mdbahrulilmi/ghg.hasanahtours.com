import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Plane,
  ChevronDown,
  ChevronRight,
  Menu,
  User,
  Calendar,
  Repeat,
  Globe,
  MapPin,
  Package,
  Hotel,
  Map,
  BookOpenCheck,
  Layers,
} from "lucide-react"


function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState({
    masterGHG: true,
  })

  const toggleMenu = (key) =>
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }))

  const menuStructure = [
    {
      key: "masterGHG",
      label: "Master GHG",
      items: [
        { to: "/paket-tersedia", label: "Paket Tersedia", icon: LayoutDashboard },
        { to: "/paket-aktif", label: "Paket Aktif", icon: Plane },
        { to: "/seats", label: "Seats", icon: User },
        { to: "/upload-itinerary", label: "Upload Itinerary", icon: Calendar },
        { to: "/callback-ghg", label: "Callback GHG", icon: Repeat },
      ],
    },
    {
      key: "masterHasanahtours",
      label: "Master Hasanahtours",
      items: [
        { to: "/airlines", label: "Airlines", icon: Plane },
        { to: "/country", label: "Negara", icon: Globe },
        { to: "/city", label: "Kota", icon: MapPin },
        { to: "/departure", label: "Keberangkatan", icon: Map },
        { to: "/landing", label: "Tujuan", icon: Map },
        { to: "/hotel", label: "Hotel", icon: Hotel },
        { to: "/package-type", label: "Tipe Paket", icon: Package },
        { to: "/package", label: "Paket", icon: Layers },
      ],
    },
    {
      key: "transaksi",
      label: "Transaksi",
      items: [
        { to: "/booking", label: "Booking", icon: BookOpenCheck },
      ],
    },
  ]


  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } bg-white border-r flex flex-col transition-all duration-300`}
      >
        {/* LOGO */}
        <div className="h-14 px-3 border-b flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
          {sidebarOpen && <span className="font-bold text-gray-800">Admin Panel</span>}
        </div>

        {/* MENU */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {menuStructure.map((group) => (
            <div key={group.key} className="mb-2">
              {/* GROUP HEADER */}
              {sidebarOpen && (
                <button
                  onClick={() => toggleMenu(group.key)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase"
                >
                  {group.label}
                  {expandedMenus[group.key] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}

              {/* ITEMS */}
              {expandedMenus[group.key] &&
                group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                          isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </NavLink>
                  )
                })}
            </div>
          ))}
        </nav>

        {/* USER */}
        <div className="p-3 border-t">
        <button
          onClick={() => {
            localStorage.removeItem("tokenAuth"); // hapus token
            window.location.href = "/login"; // redirect ke login
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm"
        >
          Keluar
        </button>
      </div>


      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet /> {/* <-- ini harus ada supaya sub-routes muncul */}
      </main>
    </div>
  )
}

export default DashboardLayout
