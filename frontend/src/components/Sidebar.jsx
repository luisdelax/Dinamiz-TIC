import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  ChartBarIcon,
  Cog6ToothIcon,
  TicketIcon,
  BuildingOffice2Icon,
  ComputerDesktopIcon,
  ServerIcon,
  UsersIcon,
  BuildingOfficeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const navLinkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200";
  const activeLinkClasses = "bg-gray-300";

  const getNavLinkClass = ({ isActive }) => 
    isActive ? `${navLinkClasses} ${activeLinkClasses}` : navLinkClasses;

  return (
    <>
      <Transition appear show={isSidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={toggleSidebar}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={toggleSidebar}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-shrink-0 flex items-center justify-center h-16 border-b">
                    <h1 className="text-2xl font-bold text-indigo-600">IT-MS</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="flex flex-col gap-2">
                    <NavLink to="/dashboard" className={getNavLinkClass} onClick={toggleSidebar}>
                      <ChartBarIcon className="h-6 w-6 mr-3" />
                      Dashboard
                    </NavLink>
                    
                    <p className="px-4 pt-4 pb-2 text-xs text-gray-500 uppercase">Inventario</p>
                    <NavLink to="/inventory/computers" className={getNavLinkClass} onClick={toggleSidebar}>
                      <ComputerDesktopIcon className="h-6 w-6 mr-3" />
                      Computadoras
                    </NavLink>
                    <NavLink to="/inventory/network" className={getNavLinkClass} onClick={toggleSidebar}>
                      <ServerIcon className="h-6 w-6 mr-3" />
                      Equipos de Red
                    </NavLink>
                    <NavLink to="/inventory/peripherals" className={getNavLinkClass} onClick={toggleSidebar}>
                      <ComputerDesktopIcon className="h-6 w-6 mr-3" />
                      Periféricos
                    </NavLink>

                    <p className="px-4 pt-4 pb-2 text-xs text-gray-500 uppercase">Soporte</p>
                    <NavLink to="/tickets" className={getNavLinkClass} onClick={toggleSidebar}>
                      <TicketIcon className="h-6 w-6 mr-3" />
                      Tickets
                    </NavLink>

                    {user && user.role === 'admin' && (
                      <>
                        <p className="px-4 pt-4 pb-2 text-xs text-gray-500 uppercase">Administración</p>
                        <NavLink to="/admin/sites" className={getNavLinkClass} onClick={toggleSidebar}>
                          <BuildingOffice2Icon className="h-6 w-6 mr-3" />
                          Sedes
                        </NavLink>
                        <NavLink to="/admin/classrooms" className={getNavLinkClass} onClick={toggleSidebar}>
                          <BuildingOfficeIcon className="h-6 w-6 mr-3" />
                          Aulas
                        </NavLink>
                        <NavLink to="/admin/persons" className={getNavLinkClass} onClick={toggleSidebar}>
                          <UsersIcon className="h-6 w-6 mr-3" />
                          Personas
                        </NavLink>
                        <NavLink to="/admin/users" className={getNavLinkClass} onClick={toggleSidebar}>
                          <UsersIcon className="h-6 w-6 mr-3" />
                          Usuarios
                        </NavLink>
                        <NavLink to="/admin" className={getNavLinkClass} onClick={toggleSidebar}>
                          <Cog6ToothIcon className="h-6 w-6 mr-3" />
                          Admin Panel
                        </NavLink>
                      </>
                    )}
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Sidebar */}
      <div className={`hidden md:flex md:flex-shrink-0 w-64 bg-white border-r ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center h-16 border-b">
            <h1 className="text-2xl font-bold text-indigo-600">IT-MS</h1>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="flex flex-col gap-2">
              <NavLink to="/dashboard" className={getNavLinkClass}>
                <ChartBarIcon className="h-6 w-6 mr-3" />
                Dashboard
              </NavLink>
              
              <p className="px-4 pt-4 pb-2 text-xs text-gray-500 uppercase">Inventario</p>
              <NavLink to="/inventory/computers" className={getNavLinkClass}>
                <ComputerDesktopIcon className="h-6 w-6 mr-3" />
                Computadoras
              </NavLink>
              <NavLink to="/inventory/network" className={getNavLinkClass}>
                <ServerIcon className="h-6 w-6 mr-3" />
                Equipos de Red
              </NavLink>
              <NavLink to="/inventory/peripherals" className={getNavLinkClass}>
                <ComputerDesktopIcon className="h-6 w-6 mr-3" />
                Periféricos
              </NavLink>

              <p className="px-4 pt-4 pb-2 text-xs text-gray-500 uppercase">Soporte</p>
              <NavLink to="/tickets" className={getNavLinkClass}>
                <TicketIcon className="h-6 w-6 mr-3" />
                Tickets
              </NavLink>

              {user && user.role === 'admin' && (
                <>
                  <p className="px-4 pt-4 pb-2 text-xs text-gray-500 uppercase">Administración</p>
                  <NavLink to="/admin/sites" className={getNavLinkClass}>
                    <BuildingOffice2Icon className="h-6 w-6 mr-3" />
                    Sedes
                  </NavLink>
                  <NavLink to="/admin/classrooms" className={getNavLinkClass}>
                    <BuildingOfficeIcon className="h-6 w-6 mr-3" />
                    Aulas
                  </NavLink>
                  <NavLink to="/admin/persons" className={getNavLinkClass}>
                    <UsersIcon className="h-6 w-6 mr-3" />
                    Personas
                  </NavLink>
                  <NavLink to="/admin/users" className={getNavLinkClass}>
                    <UsersIcon className="h-6 w-6 mr-3" />
                    Usuarios
                  </NavLink>
                  <NavLink to="/admin" className={getNavLinkClass}>
                    <Cog6ToothIcon className="h-6 w-6 mr-3" />
                    Admin Panel
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;