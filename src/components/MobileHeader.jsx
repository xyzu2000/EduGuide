import clsx from 'clsx';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { TbMenu2, TbX } from 'react-icons/tb';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo.svg';
import { auth } from '../config/firebase';
import Button from './basics/Button';
import { downMenuItems, menuItems as sideNavMenuItems } from './SideNav';
import Toggle from './toggle/Toggle';

const MobileHeader = ({ className }) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const menuItems = [...sideNavMenuItems, ...downMenuItems];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success('User logout', { position: 'bottom-right' });
            navigate('/');
        } catch (error) {
            toast.error(`User logout failed, ${error}`, {
                position: 'bottom-right',
            });
        }
    };

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    return (
        <header
            className={clsx(
                'bg-background-sideLight dark:bg-background-sideDark shadow-sm lg:hidden px-6',
                className
            )}
        >
            <div className="space-y-4 py-4 h-full">
                <div className="flex justify-between gap-4">
                    <Link to="/dashboard" className=" flex items-center gap-4">
                        <img src={logo} className="w-8 mb-2" alt="" />
                        <h2 className="mb-2 text-xl font-bold tracking-tight">Edu Guide</h2>
                    </Link>
                    <Button className="min-w-4" onClick={() => setMobileMenuOpen(true)}>
                        <TbMenu2 size={36} />
                    </Button>
                </div>
            </div>
            <div
                className={clsx(
                    'fixed inset-0 text-primary  min-h-screen bg-background-sideLight dark:bg-background-sideDark   lg:hidden z-50 w-full h-full',
                    mobileMenuOpen ? 'block' : 'hidden'
                )}
            >
                <div className="flex w-full justify-end">
                    <Button
                        className="min-w-4 mt-4 mr-6"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <TbX size={36} />
                    </Button>
                </div>
                <nav className="mt-8">
                    <ul className="flex flex-col">
                        {menuItems.map((item, index) => (
                            <NavLink
                                to={item.path}
                                key={index}
                                className={clsx(
                                    'flex items-center px-6 py-3 gap-3 w-full transition-colors duration-300 ',
                                    location.pathname === item.path
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'hover:bg-zinc-200'
                                )}
                            >
                                <div className="text-lg">{item.icon}</div>
                                <p className="text-sm font-medium">{item.name}</p>
                            </NavLink>
                        ))}
                    </ul>

                    <button
                        className="flex items-center px-6 py-3 gap-3 w-full transition-colors duration-300 hover:bg-zinc-200 mt-auto"
                        onClick={handleLogout}
                    >
                        <div className="text-lg">
                            <FaSignOutAlt />
                        </div>
                        <p className="text-sm font-medium">Sign out</p>
                    </button>
                    <div className="mt-8">
                        <Toggle />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default MobileHeader;
