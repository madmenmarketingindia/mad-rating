import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Table, Button, Spinner, Form, Modal } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { fetchHolidays, deleteHoliday } from '../../../redux/features/holiday/holidaySlice'
import toast from 'react-hot-toast'

export default function HolidayList() {
  const dispatch = useDispatch()
  const { getAllHolidayData, isLoading, error } = useSelector((state) => state.holiday)

  const currentYear = new Date().getFullYear()
  const [search, setSearch] = useState('')
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Fetch holidays
  useEffect(() => {
    dispatch(fetchHolidays())
  }, [dispatch])

  // Open modal
  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await dispatch(deleteHoliday(deleteId)).unwrap()
      dispatch(fetchHolidays())
      toast.success('Holiday deleted successfully!')
    } catch (err) {
      toast.error(err?.message || 'Delete failed')
    } finally {
      setShowDeleteModal(false)
      setDeleteId(null)
    }
  }

  // Filter holidays by search text
  const filteredHolidays = getAllHolidayData?.data?.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <PageMetaData title="Holiday List" />
      <PageHeader
        title="Holiday List"
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Holiday List' }]}
        rightContent={
          <div className="d-flex gap-2">
            <Button as={Link} to="/holiday/list/create" size="sm" variant="primary" className="mb-2 sm-mb-0">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Create Holiday
            </Button>
          </div>
        }
      />

      <Row>
        <Row>
          <Col className="mb-2">
            <Form.Control
              size="sm"
              type="text"
              placeholder="Search holiday..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '200px' }}
            />
          </Col>
        </Row>
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
              ) : !filteredHolidays?.length ? (
                <p className="text-center text-muted">No holidays found for {selectedYear}</p>
              ) : (
                <div className="table-responsive">
                  <Table bordered hover>
                    <thead className="table-light text-center">
                      <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {filteredHolidays?.map((holiday, idx) => (
                        <tr key={idx}>
                          <td className="text-capitalize">{holiday.name}</td>
                          <td>{new Date(holiday?.date).toLocaleDateString()}</td>
                          <td>{holiday?.day}</td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Button size="sm" variant="primary" as={Link} to={`/holiday/list/create?holidayId=${holiday._id}`}>
                                Update
                              </Button>
                              <Button size="sm" variant="danger" onClick={() => handleDeleteClick(holiday?._id)}>
                                Delete
                              </Button>
                            </div>
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
          <Modal.Title>Delete Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this holiday?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
