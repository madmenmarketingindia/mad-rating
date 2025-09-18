import { useEffect, useState } from 'react'
import { Col, Row, Button, Card, CardBody, Spinner, Modal, Pagination } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers, deleteUser } from '../../../../redux/features/user/userSlice'
import toast from 'react-hot-toast'
import PageHeader from '../../../../components/PageHeader'
import Loader from '../../../../components/Loader'

export default function UsersList() {
  const dispatch = useDispatch()
  const { allUsers, isLoading } = useSelector((state) => state.user)

  const [userData, setUserData] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // 🔍 Search + Pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  // Fetch users on mount
  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  useEffect(() => {
    setUserData(allUsers?.data || [])
  }, [allUsers])

  // Handle delete confirm
  const handleDelete = async () => {
    if (!selectedUser) return
    setDeleting(true)
    try {
      await dispatch(deleteUser(selectedUser._id)).unwrap()
      toast.success(` ${selectedUser.username} deleted successfully`)
      setShowDeleteModal(false)
      dispatch(getUsers()) // refresh list
    } catch (error) {
      toast.error(error || 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  // ✅ Apply search
  const filteredUsers = userData.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // ✅ Pagination logic
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // ✅ Handlers for next/prev
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1))
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages))

  return (
    <>
      <PageMetaData title="Users List" />
      <PageHeader
        title={'Users List'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Users List', href: '/users/users-list' },
        ]}
        rightContent={
          <Button as={Link} to="/users/create-user" size="sm" variant="primary">
            <IconifyIcon icon="bx:plus" className="me-1" />
            Create User
          </Button>
        }
      />
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                <div className="search-bar d-flex align-items-center gap-2">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search user..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1) // reset to page 1 when searching
                    }}
                  />
                </div>
              </div>

              {/* Loading state */}
              {isLoading ? (
                <div className="text-center py-5" id="Loading">
                  <Spinner animation="border" role="status" />
                  <div>Loading...</div>
                </div>
              ) : (
                <div className="table-responsive table-centered">
                  <table className="table text-nowrap mb-0">
                    <thead className="bg-light bg-opacity-50">
                      <tr>
                        <th className="border-0 py-2">Username</th>
                        <th className="border-0 py-2">Email</th>
                        <th className="border-0 py-2">Role</th>
                        <th className="border-0 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers?.map((user, idx) => (
                        <tr key={user._id || idx}>
                          <td className="d-flex align-items-center">
                            {/* Avatar */}
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                              style={{ width: 35, height: 35, fontSize: 14 }}>
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <Link to={'/'} className="fw-medium">
                              {user.username}
                            </Link>
                          </td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            <Button as={Link} to={`/users/create-user?userId=${user._id}`} variant="soft-secondary" size="sm" className="me-2">
                              <IconifyIcon icon="bx:edit" className="fs-16" />
                            </Button>
                            <Button
                              variant="soft-danger"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowDeleteModal(true)
                              }}>
                              <IconifyIcon icon="bx:trash" className="fs-16" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {!currentUsers?.length && !isLoading && (
                        <tr>
                          <td colSpan={4} className="text-center py-3">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* ✅ Pagination controls */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center justify-content-md-end mt-3">
                      <Pagination>
                        <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                          Prev
                        </Pagination.Prev>

                        {[...Array(totalPages).keys()].map((num) => (
                          <Pagination.Item key={num + 1} active={num + 1 === currentPage} onClick={() => setCurrentPage(num + 1)}>
                            {num + 1}
                          </Pagination.Item>
                        ))}

                        <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                          Next
                        </Pagination.Next>
                      </Pagination>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedUser?.username}</strong>? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
