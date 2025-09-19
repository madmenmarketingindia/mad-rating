import { useEffect, useState } from 'react'
import { Row, Col, Card, Spinner, Table, Form, Button, Dropdown } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getDisciplinaryActions, updateDisciplinaryActionStatus } from '../../../redux/features/disciplinaryActions/disciplinaryActionsSlice'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Link } from 'react-router-dom'

export default function DisciplinaryActions() {
  const dispatch = useDispatch()
  const { disciplinaryActionsData, isLoading } = useSelector((state) => state.disciplinaryActions)

  const [filters, setFilters] = useState({ status: '', type: '' })
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' })

  useEffect(() => {
    dispatch(getDisciplinaryActions(filters))
  }, [dispatch, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ Fix: Safely extract array from different possible structures
  const getActionsArray = () => {
    if (!disciplinaryActionsData) return []

    // If it's already an array
    if (Array.isArray(disciplinaryActionsData)) {
      return disciplinaryActionsData
    }

    // If it has a data property that's an array
    if (disciplinaryActionsData.data && Array.isArray(disciplinaryActionsData.data)) {
      return disciplinaryActionsData.data
    }

    // If it has nested data.data structure
    if (disciplinaryActionsData.data?.data && Array.isArray(disciplinaryActionsData.data.data)) {
      return disciplinaryActionsData.data.data
    }

    // Default to empty array
    return []
  }

  const sortedActions = [...getActionsArray()].sort((a, b) => {
    if (!sortConfig.key) return 0
    let aValue = a[sortConfig.key]
    let bValue = b[sortConfig.key]

    if (sortConfig.key === 'employeeName') {
      aValue = a.employeeId ? a.employeeId.firstName + ' ' + a.employeeId.lastName : ''
      bValue = b.employeeId ? b.employeeId.firstName + ' ' + b.employeeId.lastName : ''
    }
    if (sortConfig.key === 'department') {
      aValue = a.employeeId?.officialDetails?.department || ''
      bValue = b.employeeId?.officialDetails?.department || ''
    }

    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const handleStatusChange = (actionId, newStatus) => {
    dispatch(updateDisciplinaryActionStatus({ actionId, status: newStatus }))
      .unwrap()
      .then(() => {
        // ✅ Refresh the list after successful update
        dispatch(getDisciplinaryActions(filters))
      })
      .catch((err) => {
        console.error('Failed to update:', err)
        // Optionally show error toast/notification here
      })
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <IconifyIcon icon="mdi:arrow-up-down" className="ms-1 text-muted" />
    return sortConfig.direction === 'asc' ? (
      <IconifyIcon icon="mdi:arrow-up" className="ms-1" />
    ) : (
      <IconifyIcon icon="mdi:arrow-down" className="ms-1" />
    )
  }

  return (
    <>
      <PageMetaData title="Disciplinary Actions" />
      <PageHeader
        title="Disciplinary Actions List"
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Disciplinary Actions' }]}
        rightContent={
          <div className="d-flex gap-2">
            <Button as={Link} to="/disciplinary-actions/list/create" size="sm" variant="primary">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Create
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <Card className="mb-3 p-3 shadow-sm">
        <Row className="g-2">
          <Col lg={2} md={6}>
            <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Review">In Review</option>
              <option value="Resolved">Resolved</option>
            </Form.Select>
          </Col>
          <Col lg={2} md={6}>
            <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Warning">Warning</option>
              <option value="Suspension">Suspension</option>
              <option value="Termination Notice">Termination Notice</option>
            </Form.Select>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-2 mb-0">Loading...</p>
          </div>
        ) : sortedActions.length > 0 ? (
          <Table responsive bordered hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th onClick={() => requestSort('employeeName')} style={{ cursor: 'pointer' }}>
                  Employee {getSortIcon('employeeName')}
                </th>
                <th onClick={() => requestSort('department')} style={{ cursor: 'pointer' }}>
                  Department {getSortIcon('department')}
                </th>
                <th onClick={() => requestSort('type')} style={{ cursor: 'pointer' }}>
                  Type {getSortIcon('type')}
                </th>
                <th>Reason</th>
                <th>Status</th>
                <th>Review Period (Days)</th>
                <th onClick={() => requestSort('date')} style={{ cursor: 'pointer' }}>
                  Date {getSortIcon('date')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedActions.map((action) => (
                <tr key={action._id}>
                  <td>{action.employeeId ? `${action.employeeId.firstName} ${action.employeeId.lastName}` : '-'}</td>
                  <td>{action.employeeId?.officialDetails?.department || '-'}</td>
                  <td>
                    <span className={`badge ${action.type === 'Warning' ? 'bg-warning' : action.type === 'Suspension' ? 'bg-danger' : 'bg-dark'}`}>
                      {action.type}
                    </span>
                  </td>
                  <td>
                    <span title={action.reason}>{action.reason?.length > 50 ? action.reason.substring(0, 50) + '...' : action.reason}</span>
                  </td>
                  <td>
                    <Form.Select
                      value={action.status}
                      onChange={(e) => handleStatusChange(action._id, e.target.value)}
                      size="sm"
                      style={{ minWidth: '120px' }}>
                      <option value="Active">Active</option>
                      <option value="Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                    </Form.Select>
                  </td>
                  <td className="text-center">{action.reviewPeriodDays || '-'}</td>
                  <td>{new Date(action.date).toLocaleDateString()}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm" className="border-0">
                        <IconifyIcon icon="mdi:dots-vertical" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`/disciplinary-actions/list/create?actionId=${action._id}`}>
                          <IconifyIcon icon="mdi:pencil" className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this action?')) {
                              console.log('Delete:', action._id) // TODO: Implement delete API
                            }
                          }}
                          className="text-danger">
                          <IconifyIcon icon="mdi:delete" className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-5">
            <IconifyIcon icon="mdi:clipboard-text-off-outline" className="fs-1 text-muted mb-2" />
            <p className="text-muted mb-0">No disciplinary actions found.</p>
            {(filters.status || filters.type) && (
              <Button variant="outline-primary" size="sm" className="mt-2" onClick={() => setFilters({ status: '', type: '' })}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Card>
    </>
  )
}
