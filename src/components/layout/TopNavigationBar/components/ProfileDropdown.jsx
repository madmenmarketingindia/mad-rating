import { Link, useNavigate } from 'react-router-dom'
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import { useAuthContext } from '@/context/useAuthContext'

const ProfileDropdown = () => {
  const navigate = useNavigate()
  const { removeSession } = useAuthContext() || {}

  const handleLogout = () => {
    // ✅ Remove user key from localStorage
    localStorage.removeItem('user')

    // ✅ If you have session context cleanup
    if (removeSession) removeSession()

    // ✅ Redirect to login
    navigate('/auth/sign-in')
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const username = user?.data?.user?.username || 'Guest'

  const isEmployee = user?.data?.user?.employeeId || false

  return (
    <Dropdown className="topbar-item" align="end">
      <DropdownToggle
        as="button"
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <img className="rounded-circle" width={32} height={32} src={avatar1} alt="avatar" />
        </span>
      </DropdownToggle>

      <DropdownMenu>
        <DropdownHeader as="h6">
          Welcome <span className="text-capitalize">{username}</span>
        </DropdownHeader>

        {isEmployee && (
          <DropdownItem as={Link} to="/profile/me">
            <IconifyIcon icon="bx:message-dots" className="text-muted fs-18 align-middle me-1" />
            <span className="align-middle">Profile</span>
          </DropdownItem>
        )}

        <DropdownDivider className="dropdown-divider my-1" />

        {/* ✅ Logout button */}
        <DropdownItem onClick={handleLogout} className="text-danger">
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
