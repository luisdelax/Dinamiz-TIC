import { useAuth } from "../auth/AuthContext";
import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, UserCircleIcon, ArrowRightOnRectangleIcon, KeyIcon } from '@heroicons/react/24/solid';
import { Bars3Icon } from '@heroicons/react/24/outline'; // Import Bars3Icon
import ChangePasswordModal from './ChangePasswordModal';

const Header = ({ toggleSidebar }) => { // Accept toggleSidebar prop
  const { user, logout } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center">
        <button
          type="button"
          className="md:hidden p-2 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-4"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* Placeholder for breadcrumbs or page title */}
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <UserCircleIcon className="h-5 w-5 text-gray-500" />
              {user?.username || 'Usuario'}
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <p className="font-medium">Sesión iniciada como</p>
                  <p className="truncate">{user?.username}</p>
                  <p className="truncate text-gray-500 text-xs mt-1">Rol: {user?.role}</p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={openPasswordModal}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                    >
                      <KeyIcon className="mr-2 h-5 w-5 text-gray-400" />
                      Cambiar Contraseña
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                    >
                      <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5 text-gray-400" />
                      Cerrar Sesión
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={closePasswordModal} />
    </header>
  );
};

export default Header;