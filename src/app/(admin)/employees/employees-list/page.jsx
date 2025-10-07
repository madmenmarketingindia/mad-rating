import { useEffect, useState } from 'react'
import { CardBody, Col, Row, Button, Card, Spinner, Table, Badge, Dropdown, Modal, Form } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteEmployee, exportEmployees, getEmployees, updateEmployee } from '../../../../redux/features/employee/employeeSlice'
import PageHeader from '../../../../components/PageHeader'

export default function EmployeesList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { allEmployee, isLoading } = useSelector((state) => state.employee)

  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('firstName')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    dispatch(getEmployees())
  }, [dispatch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) {
        setDropdownOpen(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [dropdownOpen])

  // --- Sorting handler ---
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  // --- Helper to get nested fields ---
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  // --- Sort icon helper ---
  const getSortIcon = (field) => {
    if (sortField !== field) return 'mdi:sort'
    return sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'
  }

  // --- Filter + Sort + Paginate ---
  const filteredEmployees = allEmployee?.data
    ?.filter((emp) =>
      `${emp.firstName} ${emp.lastName} ${emp.email} ${emp.phoneNumber} ${emp.officialDetails?.designation} ${emp.officialDetails?.department} ${emp.officialDetails?.employeeType}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    ?.sort((a, b) => {
      const valA = getNestedValue(a, sortField) || ''
      const valB = getNestedValue(b, sortField) || ''

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }

      // Handle dates
      if (sortField.includes('Date')) {
        const dateA = new Date(valA || '1970-01-01').getTime()
        const dateB = new Date(valB || '1970-01-01').getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA
    })

  const totalPages = Math.ceil((filteredEmployees?.length || 0) / itemsPerPage)
  const paginatedEmployees = filteredEmployees?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Toggle dropdown
  const toggleDropdown = (empId, e) => {
    e.stopPropagation()
    setDropdownOpen((prev) => (prev === empId ? null : empId))
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Pagination component
  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button key={i} size="sm" variant={currentPage === i ? 'primary' : 'outline-primary'} onClick={() => setCurrentPage(i)} className="mx-1">
          {i}
        </Button>,
      )
    }

    return (
      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
        <span className="text-muted">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees?.length || 0)} of{' '}
          {filteredEmployees?.length || 0} employees
        </span>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Button size="sm" variant="outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
            First
          </Button>
          <Button size="sm" variant="outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
            Previous
          </Button>
          <div className="d-none d-md-flex">{pages}</div>
          <Button
            size="sm"
            variant="outline-primary"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}>
            Next
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(totalPages)}>
            Last
          </Button>
        </div>
      </div>
    )
  }

  const handleDelete = async (selectedEmployee) => {
    if (!selectedEmployee) return
    setDeleting(true)
    try {
      await dispatch(deleteEmployee(selectedEmployee._id)).unwrap()
      toast.success('✅ Employee deleted successfully!')
      dispatch(getEmployees())
      setShowDeleteModal(false)
      dispatch(getEmployees())
    } catch (error) {
      toast.error('❌ Failed to delete employee.')
      console.error(error)
      setShowDeleteModal(false)
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
      dispatch(getEmployees())
    }
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <>
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-warning">
            ★
          </span>
        ))}

        {/* Half Star (optional, you can also use a different symbol) */}
        {halfStar && (
          <span className="text-warning" style={{ opacity: 1 }}>
            ★
          </span>
        )}

        {/* Empty Stars but Yellow */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-warning" style={{ opacity: 0.4 }}>
            ★
          </span>
        ))}
      </>
    )
  }

  const handleToggle = async (emp) => {
    const newStatus = emp?.employmentStatus === 'Active' ? 'Inactive' : 'Active'

    try {
      await dispatch(
        updateEmployee({
          id: emp?._id,
          employmentStatus: newStatus,
        }),
      ).unwrap()
      dispatch(getEmployees())
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleExportEmployee = async () => {
    const response = await dispatch(exportEmployees())
  }

  const handleInitiateClosure = () => setShowModal(true)

  const handleClose = () => setShowModal(false)

  const handleNavigateSalary = (employeeId) => {
    navigate(`/employee-payroll/list?employeeId=${employeeId}`)
  }

  return (
    <>
      <PageMetaData title="Employees" />
      <PageHeader
        title={'Employee List'}
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Employee List' }]}
        rightContent={
          <div className="d-flex gap-2 mb-2 md:mb-0">
            <Button onClick={() => handleExportEmployee()} size="sm" variant="primary">
              <IconifyIcon icon="bx:download" className="me-1" />
              Export Employees
            </Button>

            <Button as={Link} to="/employees/employees-create" size="sm" variant="primary">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Create Employee
            </Button>
          </div>
        }
      />
      <Row>
        <Col>
          <Card>
            <CardBody>
              {/* Top Bar */}
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div className="d-flex flex-column flex-sm-column gap-2 align-items-start align-sm-start">
                  <div className="search-bar position-relative">
                    <input
                      type="search"
                      className="form-control pe-5"
                      placeholder="Search employees..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                      }}
                      style={{ minWidth: '250px' }}
                    />
                    <IconifyIcon icon="mdi:magnify" className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                  </div>
                  <div className="text-muted small">Total: {filteredEmployees?.length || 0} employees</div>
                </div>
              </div>

              {/* Loading */}
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <p className="mt-2 mb-0">Loading...</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="d-none d-lg-block">
                    <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                      <Table hover className="align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="cursor-pointer user-select-none" onClick={() => handleSort('firstName')}>
                              <div className="d-flex align-items-center gap-1">
                                Name & Type
                                <IconifyIcon icon={getSortIcon('firstName')} className="text-muted" />
                              </div>
                            </th>
                            <th className="cursor-pointer user-select-none" onClick={() => handleSort('email')}>
                              <div className="d-flex align-items-center gap-1">
                                Closure
                                <IconifyIcon icon={getSortIcon('email')} className="text-muted" />
                              </div>
                            </th>
                            <th className="cursor-pointer user-select-none" onClick={() => handleSort('officialDetails.joiningDate')}>
                              <div className="d-flex align-items-center gap-1">
                                Disciplinary
                                <IconifyIcon icon={getSortIcon('officialDetails.joiningDate')} className="text-muted" />
                              </div>
                            </th>

                            <th className="cursor-pointer user-select-none" onClick={() => handleSort('employmentStatus')}>
                              <div className="d-flex align-items-center gap-1">
                                Rating
                                <IconifyIcon icon={getSortIcon('employmentStatus')} className="text-muted" />
                              </div>
                            </th>

                            <th className="cursor-pointer user-select-none" onClick={() => handleSort('employmentStatus')}>
                              <div className="d-flex align-items-center gap-1">
                                Salary
                                <IconifyIcon icon={getSortIcon('employmentStatus')} className="text-muted" />
                              </div>
                            </th>

                            <th className="cursor-pointer user-select-none" onClick={() => handleSort('employmentStatus')}>
                              <div className="d-flex align-items-center gap-1">
                                Status
                                <IconifyIcon icon={getSortIcon('employmentStatus')} className="text-muted" />
                              </div>
                            </th>
                            <th width="80">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedEmployees?.length > 0 ? (
                            paginatedEmployees.map((emp) => (
                              <tr key={emp._id}>
                                {/* Name & Type */}
                                <td>
                                  <div className="d-flex align-items-start gap-3">
                                    {/* Avatar Circle */}
                                    <div
                                      className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                                      style={{ width: '48px', height: '48px', fontSize: '14px', fontWeight: '400' }}>
                                      {emp.firstName?.charAt(0)?.toUpperCase()}
                                      {emp.lastName?.charAt(0)?.toUpperCase()}
                                    </div>

                                    {/* Employee Details */}
                                    <div className="d-flex flex-column">
                                      <div className="fw-medium text-capitalize " style={{ fontSize: '14px' }}>
                                        <Link to={`/employees/employees-profile?employeeId=${emp._id}`}>
                                          {emp.firstName} {emp.lastName}
                                        </Link>
                                      </div>

                                      <div className="text-muted small text-capitalize">
                                        {emp.officialDetails?.employeeType || '-'} • {emp.officialDetails?.designation || '-'}
                                      </div>

                                      <div className="d-flex align-items-center text-muted small mt-1">
                                        <IconifyIcon icon="mdi:email-outline" className="me-1" />
                                        {emp?.email}
                                      </div>

                                      <div className="d-flex align-items-center text-muted small">
                                        <IconifyIcon icon="mdi:phone-outline" className="me-1" />
                                        {emp?.phoneNumber || '-'}
                                      </div>

                                      {/* <div className="mt-1 text-muted small">
                                        <span className="fw-semibold">DOB:</span> {formatDate(emp?.dateOfBirth)}
                                      </div> */}

                                      <div className="text-muted small">
                                        <span className="fw-semibold">Joined:</span> {formatDate(emp?.officialDetails?.joiningDate)}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Contact Info */}
                                <td>
                                  <div className="small">
                                    <td>
                                      <Badge
                                        bg="danger"
                                        className="cursor-pointer"
                                        style={{ fontSize: '12px', padding: '5px' }}
                                        onClick={(emp) => handleInitiateClosure(emp)}>
                                        Initiate Closure
                                      </Badge>
                                    </td>
                                  </div>
                                </td>

                                {/* disciplinary Action  */}
                                <td>
                                  <Link
                                    to="/disciplinary-actions/list"
                                    className={`small fw-semibold text-decoration-none ${
                                      emp?.disciplinaryAction?.type ? 'text-danger' : 'text-muted'
                                    }`}
                                    style={{
                                      display: 'inline-block',
                                      padding: '4px 6px',
                                      borderRadius: '4px',
                                      backgroundColor: emp?.disciplinaryAction?.type ? '#ffe5e5' : 'transparent',
                                    }}>
                                    {emp.disciplinaryAction?.type
                                      ? `${emp.disciplinaryAction.type} ${
                                          emp.disciplinaryAction.status === 'Review' && emp.disciplinaryAction.reviewPeriodLeft !== null
                                            ? `(${emp?.disciplinaryAction.reviewPeriodLeft} days left)`
                                            : ''
                                        }`
                                      : 'No Action'}
                                  </Link>
                                </td>

                                <td>
                                  <div className="d-flex align-items-center">
                                    <Badge
                                      bg={emp?.currentMonthAvg >= 4 ? 'success' : emp?.currentMonthAvg >= 3 ? 'warning' : 'danger'}
                                      className="me-2">
                                      {emp?.currentMonthAvg ?? 'N/A'}
                                    </Badge>
                                    <Link to="/ratings-reports/list">{renderStars(emp?.currentMonthAvg || 0)}</Link>
                                  </div>
                                </td>

                                <td>
                                  <div className="small">
                                    <td>
                                      <Badge
                                        bg="primary"
                                        className="cursor-pointer"
                                        style={{ fontSize: '12px', padding: '5px' }}
                                        onClick={() => handleNavigateSalary(emp._id)}>
                                        Pending
                                      </Badge>
                                    </td>
                                  </div>
                                </td>

                                {/* Status */}
                                <td>
                                  <Badge
                                    bg={emp?.employmentStatus === 'Active' ? 'success' : 'secondary'}
                                    className="cursor-pointer"
                                    onClick={() => handleToggle(emp)}>
                                    {emp?.employmentStatus}
                                  </Badge>
                                </td>

                                {/* Actions */}
                                <td>
                                  <div className="position-relative">
                                    <Button variant="light" size="sm" onClick={(e) => toggleDropdown(emp._id, e)} className="border-0">
                                      <IconifyIcon icon="mdi:dots-vertical" />
                                    </Button>

                                    {dropdownOpen === emp._id && (
                                      <div
                                        className="dropdown-menu show position-absolute bg-white border rounded shadow-sm py-1"
                                        style={{
                                          right: 0,
                                          top: '100%',
                                          zIndex: 1050,
                                          minWidth: '150px',
                                        }}>
                                        <Link
                                          to={`/employees/employees-profile?employeeId=${emp._id}`}
                                          className="dropdown-item text-decoration-none d-flex align-items-center gap-2 px-3 py-2"
                                          onClick={() => setDropdownOpen(null)}>
                                          <IconifyIcon icon="bx:show" />
                                          View Profile
                                        </Link>
                                        <Link
                                          to={`/employees/employees-create?employeeId=${emp._id}`}
                                          className="dropdown-item text-decoration-none d-flex align-items-center gap-2 px-3 py-2"
                                          onClick={() => setDropdownOpen(null)}>
                                          <IconifyIcon icon="bx:edit" />
                                          Edit
                                        </Link>
                                        <button
                                          className="dropdown-item text-danger d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent w-100 text-start"
                                          onClick={() => {
                                            setDropdownOpen(null)
                                            setSelectedEmployee(emp)
                                            setShowDeleteModal(true)
                                          }}>
                                          <IconifyIcon icon="bx:trash" />
                                          Delete
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                <div className="text-muted">
                                  <IconifyIcon icon="mdi:account-off-outline" className="fs-1 mb-2 d-block" />
                                  No employees found
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>

                  {/* Mobile Cards */}
                  <div className="d-lg-none">
                    {paginatedEmployees?.length > 0 ? (
                      paginatedEmployees?.map((emp) => (
                        <Card key={emp._id} className="mb-3 border-0 shadow-sm">
                          <CardBody className="p-3">
                            {/* Header: Avatar + Name + Status + Menu */}
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="d-flex align-items-center gap-2">
                                {/* Initials Avatar */}
                                <div
                                  className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white text-capitalize"
                                  style={{ width: '35px', height: '35px', fontSize: '12px', fontWeight: 'bold' }}>
                                  {emp?.firstName?.charAt(0)?.toUpperCase()}
                                  {emp?.lastName?.charAt(0)?.toUpperCase()}
                                </div>

                                <div>
                                  <div className="fw-semibold">
                                    {emp?.firstName} {emp?.lastName}
                                  </div>
                                  <Badge
                                    bg={emp?.employmentStatus === 'Active' ? 'success' : 'secondary'}
                                    className="cursor-pointer"
                                    onClick={() => handleToggle(emp)}>
                                    {emp?.employmentStatus}
                                  </Badge>
                                </div>
                              </div>

                              {/* Dropdown Menu */}
                              <div className="position-relative d-inline-block">
                                <Button variant="light" size="sm" onClick={(e) => toggleDropdown(emp._id, e)} className="border-0">
                                  <IconifyIcon icon="mdi:dots-vertical" />
                                </Button>

                                {dropdownOpen === emp._id && (
                                  <div
                                    className="dropdown-menu show bg-white border rounded shadow-sm py-1"
                                    style={{ right: 0, zIndex: 9999, minWidth: '150px' }}>
                                    <Link
                                      to={`/employees/employees-profile?employeeId=${emp._id}`}
                                      className="dropdown-item text-decoration-none d-flex align-items-center gap-2 px-3 py-2"
                                      onClick={() => setDropdownOpen(null)}>
                                      <IconifyIcon icon="bx:show" />
                                      View Profile
                                    </Link>
                                    <Link
                                      to={`/employees/edit/${emp._id}`}
                                      className="dropdown-item text-decoration-none d-flex align-items-center gap-2 px-3 py-2"
                                      onClick={() => setDropdownOpen(null)}>
                                      <IconifyIcon icon="bx:edit" />
                                      Edit
                                    </Link>
                                    <button
                                      className="dropdown-item text-danger d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent w-100 text-start"
                                      onClick={() => {
                                        setDropdownOpen(null)
                                        // Add delete handler here
                                      }}>
                                      <IconifyIcon icon="bx:trash" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Rating Section */}
                            <div className="d-flex align-items-center mb-3">
                              <Badge bg={emp?.currentMonthAvg >= 4 ? 'success' : emp?.currentMonthAvg >= 3 ? 'warning' : 'danger'} className="me-2">
                                {emp?.currentMonthAvg ?? 'N/A'}
                              </Badge>
                              {renderStars(emp?.currentMonthAvg || 0)}
                            </div>

                            {/* Employee Details */}
                            <div className="row g-2 small">
                              <div className="col-12">
                                <div className="text-muted text-capitalize">
                                  {emp.officialDetails?.employeeType || '-'} • {emp.officialDetails?.designation || '-'}
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="text-muted">Email:</div>
                                <div className="small">{emp?.email}</div>
                              </div>
                              <div className="col-6">
                                <div className="text-muted">Phone:</div>
                                <div className="small">{emp?.phoneNumber || '-'}</div>
                              </div>
                              <div className="col-6">
                                <div className="text-muted">DOB:</div>
                                <div className="small">{formatDate(emp?.dateOfBirth)}</div>
                              </div>
                              <div className="col-6">
                                <div className="text-muted">Joined:</div>
                                <div className="small">{formatDate(emp?.officialDetails?.joiningDate)}</div>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-5">
                        <IconifyIcon icon="mdi:account-off-outline" className="fs-1 mb-2 text-muted" />
                        <div className="text-muted">No employees found</div>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {filteredEmployees?.length > 0 && renderPagination()}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Initiate Closure</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Resignation Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Working Day</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notice Period Days</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason for Separation</Form.Label>
              <Form.Select>
                <option value="">Select Reason</option>
                <option value="Resignation">Resignation</option>
                <option value="Termination">Termination</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          <strong>
            {selectedEmployee?.firstName} {selectedEmployee?.lastName}
          </strong>
          ? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedEmployee)} disabled={deleting}>
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

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .dropdown-menu {
          animation: fadeIn 0.15s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .table thead th {
          border-bottom: 2px solid #dee2e6;
          font-weight: 600;
        }
        .table tbody tr:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </>
  )
}
