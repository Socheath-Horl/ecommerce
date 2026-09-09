import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import Home from '@/pages/Home'
import Products from '@/pages/Products'
import Cart from '@/pages/Cart'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import NotFound from '@/pages/NotFound'
import AdminLayout from '@/pages/admin/AdminLayout'
import UserList from '@/pages/admin/users/UserList'
import { ThemeToaster } from '@/components/theme-toaster'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/products', element: <Products /> },
  { path: '/cart', element: <Cart /> },
  {
    path: '/auth',
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/users" replace /> },
      { path: 'users', element: <UserList /> },
    ],
  },
  { path: '*', element: <NotFound /> },
])

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ThemeToaster />
    </>
  )
}