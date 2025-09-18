import { lazy, Suspense } from 'react'
import FallbackLoading from '@/components/FallbackLoading'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'
import { getMenuItems } from '@/helpers/menu'
import HoverMenuToggle from './components/HoverMenuToggle'
import logo from '@/assets/images/logo-white.webp'
const AppMenu = lazy(() => import('./components/AppMenu'))
const VerticalNavigationBar = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const role = user?.data?.user?.role || 'Employee'

  // ✅ Get role-based menu items
  const menuItems = getMenuItems(role)
  return (
    <div className="main-nav" id="leftside-menu-container">
      <div>
        <div className="mx-auto  text-start auth-logo mb-3 mt-3 ">
          <img src={logo} alt="Logo" width={'100px'} className="img-fluid" style={{ marginLeft: '15px' }} />
        </div>
      </div>

      <HoverMenuToggle />

      <SimplebarReactClient className="scrollbar">
        <Suspense fallback={<FallbackLoading />}>
          <AppMenu menuItems={menuItems} />
        </Suspense>
      </SimplebarReactClient>
    </div>
  )
}
export default VerticalNavigationBar
