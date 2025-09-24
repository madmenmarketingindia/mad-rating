import { useEffect, useState } from 'react'
import { CardBody, Col, Row, Button, Card, Spinner, Form, Modal } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '../../../../components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { calculateIncentive, singlePayrollEmployee, upsertPayroll } from '../../../../redux/features/attendancePayroll/attendancePayrollSlice'
import { singleMemberIncentive } from '../../../../redux/features/teamIncentive/teamIncentiveSlice'
import toast from 'react-hot-toast'

export default function UpsertEmployeePayroll() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId')

  const { isLoading, employeePayrollData, calculatedIncentive } = useSelector((state) => state.attendancePayroll)
  const { singleMemberIncentiveData } = useSelector((state) => state.teamIncentive)

  const now = new Date()
  const [filters, setFilters] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  })

  const [formData, setFormData] = useState({
    basicSalary: 0,
    conveyanceAllowance: 0,
    hra: 0,
    medicalAllowance: 0,
    salary: 0,
    totalDays: 30,
    leaves: 0,
    leaveAdjusted: 0,
    absent: 0,
    lateIn: 0,
    lateAdjusted: 0,
    deductions: 0,
    reimbursement: 0,
    incentive: 0,
    status: '',
    teamIncentive: 0,
    teamIncentiveEnabled: false,
  })

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ]

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i)
  const statusOptions = ['Pending', 'Not Processed', 'Processed', 'Paid']

  useEffect(() => {
    if (employeeId) {
      dispatch(singlePayrollEmployee({ employeeId, ...filters }))
      dispatch(singleMemberIncentive({ employeeId, ...filters }))
    }
  }, [dispatch, employeeId, filters.month, filters.year])

  useEffect(() => {
    if (employeeId) {
      dispatch(calculateIncentive({ employeeId, ...filters }))
    }
  }, [employeeId, filters.month, filters.year])

  useEffect(() => {
    if (employeePayrollData?.data) {
      setFormData({
        basicSalary: employeePayrollData.data.basicSalary || 0,
        hra: employeePayrollData.data.hra || 0,
        medicalAllowance: employeePayrollData.data.medicalAllowance || 0,
        conveyanceAllowance: employeePayrollData.data.conveyanceAllowance || 0,
        salary: employeePayrollData.data.salary || 0,
        totalDays: employeePayrollData.data.totalDays || 30,
        leaves: employeePayrollData.data.leaves || 0,
        leaveAdjusted: employeePayrollData.data.leaveAdjusted || 0,
        absent: employeePayrollData.data.absent || 0,
        lateIn: employeePayrollData.data.lateIn || 0,
        lateAdjusted: employeePayrollData.data.lateAdjusted || 0,
        deductions: employeePayrollData.data.deductions || 0,
        reimbursement: employeePayrollData.data.reimbursement || 0,
        incentive: employeePayrollData.data.incentive || 0,
        status: employeePayrollData.data.status || '',
        teamIncentive: singleMemberIncentiveData?.data?.amount,
      })
    }
  }, [employeePayrollData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) || value }))
  }

  const handleSubmit = () => {
    const payload = {
      employeeId,
      month: filters.month,
      year: filters.year,
      ...formData,
      teamIncentive: formData.teamIncentiveEnabled ? formData.teamIncentive : 0,
    }
    const response = dispatch(upsertPayroll(payload))
    toast.success('Payroll saved successfully!')
  }

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [incentiveCalc, setIncentiveCalc] = useState({
    totalSalary: 0,
    percentage: 0,
    incentiveValue: 0,
    averageRating: 0,
  })

  // 👉 Calculate incentive inside modal
  const handleCalculate = () => {
    const incentiveValue = (incentiveCalc.totalSalary * incentiveCalc.percentage) / 100
    setIncentiveCalc((prev) => ({ ...prev, incentiveValue }))
  }

  const handleSaveIncentive = () => {
    setFormData((prev) => ({ ...prev, incentive: incentiveCalc.incentiveValue }))
    setShowModal(false)
  }

  useEffect(() => {
    if (showModal && calculatedIncentive?.data) {
      setIncentiveCalc({
        totalSalary: calculatedIncentive.data.totalSalary || 0,
        percentage: calculatedIncentive.data.incentivePercent || 0,
        incentiveValue: calculatedIncentive.data.incentiveAmount || 0,
        averageRating: calculatedIncentive.data.averageRating || 0,
      })
    }
  }, [showModal, calculatedIncentive])

  useEffect(() => {
    if (singleMemberIncentiveData?.data) {
      const amount = singleMemberIncentiveData.data.amount || 0
      setFormData((prev) => ({
        ...prev,
        teamIncentive: amount,
        teamIncentiveEnabled: amount > 0, // true if amount > 0, else false
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        teamIncentive: 0,
        teamIncentiveEnabled: false,
      }))
    }
  }, [singleMemberIncentiveData])

  return (
    <>
      <PageMetaData title="Upsert Payroll" />
      <PageHeader
        title={employeeId ? 'Employee Payroll Edit' : 'Employee Payroll Create'}
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Employee Payroll', href: '/payroll/list' }, { label: 'Upsert' }]}
        rightContent={
          <div className="d-flex gap-2">
            <Form.Select
              size="sm"
              style={{ maxWidth: 150 }}
              value={filters.month}
              onChange={(e) => setFilters((prev) => ({ ...prev, month: Number(e.target.value) }))}>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              size="sm"
              style={{ maxWidth: 100 }}
              value={filters.year}
              onChange={(e) => setFilters((prev) => ({ ...prev, year: Number(e.target.value) }))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Select>

            <Button size="sm" variant="outline-secondary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />

      <Row className="mt-3">
        <Col>
          <Card>
            <CardBody>
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <p className="mt-2 mb-0">Loading payroll data...</p>
                </div>
              ) : (
                <Form>
                  <Row className="mb-2">
                    <h4 className="mb-3">Basic Information</h4>
                    <Col md={4}>
                      <Form.Label>Basic Salary</Form.Label>
                      <Form.Control type="number" name="salary" value={formData.basicSalary} onChange={handleChange} />
                    </Col>

                    <Col md={4} className="mb-2">
                      <Form.Label>HRA</Form.Label>
                      <Form.Control type="number" name="salary" value={formData.hra} onChange={handleChange} />
                    </Col>

                    <Col md={4} className="mb-2">
                      <Form.Label>Medical Allowance</Form.Label>
                      <Form.Control type="number" name="salary" value={formData.medicalAllowance} onChange={handleChange} />
                    </Col>

                    <Col md={4} className="mb-2">
                      <Form.Label>Conveyance Allowance</Form.Label>
                      <Form.Control type="number" name="salary" value={formData.conveyanceAllowance} onChange={handleChange} />
                    </Col>

                    <Col md={4}>
                      <Form.Label>Salary</Form.Label>
                      <Form.Control type="number" name="salary" value={formData.salary} onChange={handleChange} />
                    </Col>
                  </Row>

                  <Row>
                    <h4 className="mb-3 mt-3">Leave Information</h4>
                    <Col md={4}  className='mb-2'>
                      <Form.Label>Total Days</Form.Label>
                      <Form.Control type="number" name="totalDays" value={formData.totalDays} onChange={handleChange} />
                    </Col>
                    <Col md={4} className='mb-2'>
                      <Form.Label>Leaves</Form.Label>
                      <Form.Control type="number" name="leaves" value={formData.leaves} onChange={handleChange} />
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={4}>
                      <Form.Label>Leave Adjusted</Form.Label>
                      <Form.Control type="number" name="leaveAdjusted" value={formData.leaveAdjusted} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Absent</Form.Label>
                      <Form.Control type="number" name="absent" value={formData.absent} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Late In</Form.Label>
                      <Form.Control type="number" name="lateIn" value={formData.lateIn} onChange={handleChange} />
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={4}>
                      <Form.Label>Late Adjusted</Form.Label>
                      <Form.Control type="number" name="lateAdjusted" value={formData.lateAdjusted} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Deductions</Form.Label>
                      <Form.Control type="number" name="deductions" value={formData.deductions} onChange={handleChange} />
                    </Col>
                    <Col md={4}>
                      <Form.Label>Reimbursement</Form.Label>
                      <Form.Control type="number" name="reimbursement" value={formData.reimbursement} onChange={handleChange} />
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={2}>
                      <Form.Label>Incentive</Form.Label>
                      <Form.Control type="number" name="incentive" value={formData.incentive} onChange={handleChange} />
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button variant="primary" onClick={() => setShowModal(true)}>
                        Calculate Incentive
                      </Button>
                    </Col>

                    <Col md={4}>
                      <Form.Label>Status</Form.Label>
                      <Form.Select name="status" value={formData.status} onChange={handleChange}>
                        <option value="">Select Status</option>
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>

                  <Row className="mb-4">
                    <h4 className="mb-3 mt-3">Incentive</h4>
                    <Row>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          id="enableTeamIncentive"
                          label="Enable Team Incentive"
                          checked={formData.teamIncentiveEnabled || false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              teamIncentiveEnabled: e.target.checked,
                            }))
                          }
                          className="mb-2"
                        />

                        <Form.Control
                          type="number"
                          name="teamIncentive"
                          value={formData.teamIncentive}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              teamIncentive: Number(e.target.value) || 0,
                            }))
                          }
                        />
                      </Col>
                    </Row>
                  </Row>

                  <Button variant="success" onClick={handleSubmit}>
                    {employeePayrollData?.data ? 'Update Payroll' : 'Create Payroll'}
                  </Button>
                </Form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card>
            <CardBody>
              <h5 className="mb-3">Payroll Summary</h5>
              {employeePayrollData?.data ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>Month</th>
                        <th>Basic Salary</th>
                        <th>Hra</th>
                        <th>Medical Allowance</th>
                        <th>Conveyance Allowance</th>
                        <th>Total Days</th>
                        <th>Present Days</th>
                        <th>Absent Days</th>
                        <th>Leave Adjusted</th>
                        <th>Payable Days</th>
                        <th>Salary</th>
                        <th>Deductions</th>
                        <th>Reimbursement</th>
                        <th>Incentive</th>
                        <th>Total Payable</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {employeePayrollData.data.firstName} {employeePayrollData.data.lastName}
                        </td>
                        <td>{employeePayrollData.data.department}</td>
                        <td>{employeePayrollData.data.year}</td>
                        <td>{months?.find((m) => m?.value === employeePayrollData.data.month)?.label}</td>
                        <td>{employeePayrollData.data.basicSalary}</td>
                        <td>{employeePayrollData.data.hra}</td>
                        <td>{employeePayrollData.data.medicalAllowance}</td>
                        <td>{employeePayrollData.data.conveyanceAllowance}</td>
                        <td>{employeePayrollData.data.totalDays}</td>
                        <td>{employeePayrollData.data.totalDays - (employeePayrollData.data.absent + employeePayrollData.data.leaves)}</td>
                        <td>{employeePayrollData.data.absent}</td>
                        <td>{employeePayrollData.data.leaveAdjusted}</td>
                        <td>{employeePayrollData.data.payableDays}</td>
                        <td>{employeePayrollData.data.salary}</td>
                        <td>{employeePayrollData.data.deductions}</td>
                        <td>{employeePayrollData.data.reimbursement}</td>
                        <td>{employeePayrollData.data.incentive}</td>
                        <td>{employeePayrollData.data.total}</td>
                        <td>{employeePayrollData.data.status}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No payroll data found for this month.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* 👉 Modal for incentive calculation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Calculate Incentive</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Average Rating</Form.Label>
              <Form.Control type="number" value={incentiveCalc.averageRating} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total Salary</Form.Label>
              <Form.Control
                type="number"
                value={incentiveCalc.totalSalary}
                onChange={(e) => setIncentiveCalc((prev) => ({ ...prev, totalSalary: Number(e.target.value) }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Incentive Percent (%)</Form.Label>
              <Form.Control
                type="number"
                value={incentiveCalc.percentage}
                onChange={(e) => setIncentiveCalc((prev) => ({ ...prev, percentage: Number(e.target.value) }))}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Incentive Amount</Form.Label>
              <Form.Control type="number" value={incentiveCalc.incentiveValue} readOnly />
            </Form.Group>

            <Button variant="secondary" className="me-2" onClick={handleCalculate}>
              Recalculate
            </Button>
            <Button variant="primary" onClick={handleSaveIncentive}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
