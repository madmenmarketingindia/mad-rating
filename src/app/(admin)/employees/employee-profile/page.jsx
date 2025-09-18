import { useEffect } from 'react'
import { Col, Row, Card, Spinner, Badge, Table } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '../../../../components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { employeeProfile } from '../../../../redux/features/employee/employeeSlice'
import { useSearchParams, Link } from 'react-router-dom'

export default function EmployeesProfile() {
  const dispatch = useDispatch()
  const { getEmProfile, isLoading } = useSelector((state) => state.employee)
  const [searchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId')

  useEffect(() => {
    if (employeeId) {
      dispatch(employeeProfile(employeeId))
    }
  }, [dispatch, employeeId])

  const data = getEmProfile?.data

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    )
  }

  if (!data) return null

  // Avatar initials
  const initials = `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`.toUpperCase()

  return (
    <>
      <PageMetaData title="Employee Profile" />
      <PageHeader
        title={'Employee Profile'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Employee List', href: '/employees/employees-list' },
          { label: 'Employee Profile' },
        ]}
        rightContent={
          <Link to="/employees/employees-list" className="btn btn-primary btn-sm">
            Back
          </Link>
        }
      />

      <Row className="mt-3">
        <Col lg={12}>
          <Card className="shadow-sm p-3">
            {/* Avatar + Name */}
            <div className="d-flex align-items-center mb-4">
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: '#0d6efd',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginRight: 15,
                }}>
                {initials}
              </div>
              <div>
                <h4 className="mb-0">
                  {data.firstName} {data.lastName}
                </h4>
                <small className="text-muted">
                  {data.officialDetails?.designation} — {data.officialDetails?.department}
                </small>
              </div>
            </div>

            {/* Section: Personal */}
            <Card className="mb-3 border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="fw-bold text-primary mb-3">👤 Personal Details</h6>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Email:</strong> {data.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {data.phoneNumber}
                    </p>
                    <p>
                      <strong>DOB:</strong> {new Date(data.dateOfBirth).toLocaleDateString()}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Gender:</strong> {data.gender}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <Badge bg={data.employmentStatus === 'Active' ? 'success' : 'secondary'}>{data.employmentStatus}</Badge>
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Section: Official */}
            <Card className="mb-3 border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="fw-bold text-primary mb-3">🏢 Official Details</h6>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Employee Type:</strong> {data.officialDetails?.employeeType}
                    </p>
                    <p>
                      <strong>Joining Date:</strong> {new Date(data.officialDetails?.joiningDate).toLocaleDateString()}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Residential Address:</strong> {data.residentialAddress}
                    </p>
                    <p>
                      <strong>Permanent Address:</strong> {data.permanentAddress}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Section: Salary */}
            <Card className="mb-3 border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="fw-bold text-primary mb-3">💰 Salary Details</h6>
                <Table striped bordered size="sm" className="mb-0">
                  <tbody>
                    <tr>
                      <td>Basic</td>
                      <td>₹{data.salary?.basic}</td>
                    </tr>
                    <tr>
                      <td>HRA</td>
                      <td>₹{data.salary?.hra}</td>
                    </tr>
                    <tr>
                      <td>CTC</td>
                      <td>₹{data.salary?.ctc}</td>
                    </tr>
                    <tr>
                      <td>Other Allowances</td>
                      <td>₹{data.salary?.otherAllowances}</td>
                    </tr>
                    <tr>
                      <td>Deductions</td>
                      <td>₹{data.salary?.deductions}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* Section: Bank */}
            <Card className="mb-3 border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="fw-bold text-primary mb-3">🏦 Bank Details</h6>
                <Row>
                  <Col md={6}>
                    <p>
                      <strong>Bank Name:</strong> {data.bankDetails?.bankName || '-'}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Branch:</strong> {data.bankDetails?.branchName || '-'}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>Account No:</strong> {data.bankDetails?.accountNumber || '-'}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <strong>IFSC Code:</strong> {data.bankDetails?.ifscCode || '-'}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Section: Ratings */}
            <Card className="mb-3 border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="fw-bold text-primary mb-3">⭐ Latest Rating</h6>
                {data.latestRating?.averageScore ? (
                  <>
                    <p>
                      <strong>Month:</strong> {data.latestRating.month}-{data.latestRating.year}
                    </p>
                    <p>
                      <strong>Average Score:</strong> <Badge bg="info">{data.latestRating.averageScore}</Badge>
                    </p>
                    <Table striped bordered size="sm" className="mb-0">
                      <tbody>
                        {Object.entries(data.latestRating.categories || {}).map(([key, val]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <p>No ratings available</p>
                )}
              </Card.Body>
            </Card>
          </Card>
        </Col>
      </Row>
    </>
  )
}
