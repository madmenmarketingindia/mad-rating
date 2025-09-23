import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Form, Spinner, Table, Button, Collapse, Modal } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { allTeamIncentive, deleteTeamIncentive } from '../../../redux/features/teamIncentive/teamIncentiveSlice'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function TeamIncentive() {
  const dispatch = useDispatch()
  const { getAllTeamIncentiveData, isLoading, error } = useSelector((state) => state.teamIncentive)
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [expandedRows, setExpandedRows] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDeleteId, setSelectedDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    dispatch(allTeamIncentive({ month: selectedMonth, year: selectedYear }))
  }, [dispatch, selectedMonth, selectedYear, deleting])

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleEdit = (id) => {
    navigate(`/teams-incentive/list/create?incentiveId=${id}`)
  }

  const confirmDelete = (id) => {
    setSelectedDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!selectedDeleteId) return
    setDeleting(true)
    try {
      await dispatch(deleteTeamIncentive(selectedDeleteId)).unwrap()
      toast.success('Incentive deleted successfully')
      setShowDeleteModal(false)
      setSelectedDeleteId(null)
    } catch (err) {
      toast.error(err || 'Failed to delete incentive')
    } finally {
      setDeleting(false)
    }
  }

  const renderMonthOptions = () =>
    Array.from({ length: 12 }, (_, i) => (
      <option key={i + 1} value={i + 1}>
        {new Date(0, i).toLocaleString('default', { month: 'long' })}
      </option>
    ))

  const renderYearOptions = () =>
    Array.from({ length: 6 }, (_, i) => {
      const year = currentYear - 5 + i
      return (
        <option key={year} value={year}>
          {year}
        </option>
      )
    })

  return (
    <>
      <PageMetaData title="Team Incentive" />
      <PageHeader
        title="Team Incentive"
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Team Incentive' }]}
        rightContent={
          <div className="d-flex gap-2 flex-wrap">
            <Form.Select size="sm" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} style={{ width: '140px' }}>
              {renderMonthOptions()}
            </Form.Select>

            <Form.Select size="sm" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ width: '120px' }}>
              {renderYearOptions()}
            </Form.Select>

            <Button as={Link} to="/teams-incentive/list/create" size="sm" variant="primary">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Incentive
            </Button>
          </div>
        }
      />

      <Row>
        <Col>
          <Card>
            <CardBody>
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <p className="mt-2 mb-0">Loading...</p>
                </div>
              ) : error ? (
                <p className="text-danger text-center">{error}</p>
              ) : !getAllTeamIncentiveData?.data?.length ? (
                <p className="text-center text-muted">
                  No incentives found for {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                </p>
              ) : (
                <div className="table-responsive">
                  <Table bordered hover className="mb-0 text-center">
                    <thead className="table-light">
                      <tr>
                        <th>Team</th>
                        <th>Total Incentive</th>
                        <th>Members</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getAllTeamIncentiveData.data.map((teamIncentive) => (
                        <tr key={teamIncentive._id}>
                          <td>{teamIncentive.team}</td>
                          <td>{teamIncentive.totalAmount}</td>
                          <td>
                            <Button variant="link" className="p-0" onClick={() => toggleRow(teamIncentive._id)}>
                              {teamIncentive.members.length} Members
                            </Button>
                            <Collapse in={expandedRows[teamIncentive._id]}>
                              <div className="mt-2">
                                <Table size="sm" bordered className="mb-0 text-center">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Name</th>
                                      <th>Email</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {teamIncentive.members.map((member) => (
                                      <tr key={member._id}>
                                        <td>{`${member.employeeId.firstName} ${member.employeeId.lastName}`}</td>
                                        <td>{member.employeeId.email}</td>
                                        <td>{member.amount}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            </Collapse>
                          </td>
                          <td>{teamIncentive.month}</td>
                          <td>{teamIncentive.year}</td>
                          <td>
                            <Button variant="outline-none" size="lg" className="me-0 p-2" onClick={() => handleEdit(teamIncentive._id)}>
                              <IconifyIcon icon="bx:edit" />
                            </Button>
                            <Button variant="outline-none" size="lg" className="p-2" onClick={() => confirmDelete(teamIncentive._id)}>
                              <IconifyIcon icon="bx:trash" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
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
        <Modal.Body>Are you sure you want to delete this incentive? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
