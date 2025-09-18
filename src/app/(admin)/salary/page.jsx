import { useEffect, useState } from 'react'
import { CardBody, Col, Row, Card, Spinner, Table, Form, Button, CardHeader } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../../../components/PageHeader'
import { salaryByEmployeeAndYear } from '../../../redux/features/salary/salarySlice'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'

export default function EmployeeSalaryList() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, salaryByEmployee } = useSelector((state) => state.salary)
  const [searchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId')

  const now = new Date()
  const [filters, setFilters] = useState({
    year: now.getFullYear(),
  })

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - 2 + i)

  useEffect(() => {
    if (employeeId) {
      dispatch(salaryByEmployeeAndYear({ employeeId, year: filters.year }))
    }
  }, [dispatch, filters.year, employeeId])

  const employee = salaryByEmployee?.data

  return (
    <>
      <PageMetaData title="Employee Salary" />
      <PageHeader
        title="Employee Salary Details"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Employee Payroll List', href: '/employee-payroll/list' },
          { label: 'Employee Salary Details' },
        ]}
        rightContent={
          <div className="d-flex gap-2">
            <Form.Select
              size="sm"
              style={{ maxWidth: 120 }}
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

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : employee ? (
        <>
          {/* Employee Header */}
          <Row className="mb-3">
            <Col>
              <h5>
                {employee.name} &nbsp;
                <small className="text-muted">
                  ({employee.department} / {employee.designation})
                </small>
              </h5>
            </Col>
          </Row>

          <Row>
            {/* Left side Salary Summary */}
            <Col md={4}>
              <Card className="mb-3">
                <CardHeader>
                  <h5>Salary Summary</h5>
                </CardHeader>
                <CardBody>
                  <Table borderless size="sm">
                    <tbody>
                      <tr>
                        <td>Total salary:</td>
                        <td className="fw-bold">{employee.totalCTC.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Total Incentive:</td>
                        <td className="fw-bold">{employee.totalIncentive.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Total Net Pay:</td>
                        <td className="fw-bold">{employee.totalNetPay.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>

            {/* Right side Month-wise list */}
            <Col md={8}>
              <Card>
                <CardHeader>
                  <h5>Monthly Breakdown</h5>
                </CardHeader>
                <CardBody>
                  <Table hover responsive>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Salary</th>
                        <th>Net Pay</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {employee.months?.length > 0 ? (
                        employee.months.map((m, idx) => (
                          <tr key={idx}>
                            <td>{new Date(m.year, m.month - 1).toLocaleString('default', { month: 'long' })}</td>
                            <td>{m.baseSalary.toFixed(2)}</td>
                            <td>{m.netPay.toFixed(2)}</td>
                            <td>{m.status}</td>
                            <td>
                              <Link to={`/employee-payroll/salary-list/detail?employeeId=${employee.employeeId}&month=${m.month}&year=${m.year}`}>
                                <Button size="sm" variant="outline-primary">
                                  →
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center">
                            No months found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div className="text-center">No data found</div>
      )}
    </>
  )
}
