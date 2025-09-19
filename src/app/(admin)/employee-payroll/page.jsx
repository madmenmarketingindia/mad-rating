import { useEffect, useState } from 'react'
import { CardBody, Col, Row, Button, Card, Spinner, Table, Form } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import PageHeader from '../../../components/PageHeader'
import { listPayrollByEmployees, upsertPayroll } from '../../../redux/features/attendancePayroll/attendancePayrollSlice'
import { Link } from 'react-router-dom'

export default function EmployeePayrollList() {
  const dispatch = useDispatch()
  const { isLoading, payrollByEmployees } = useSelector((state) => state.attendancePayroll)

  const now = new Date()
  const [filters, setFilters] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
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
    dispatch(listPayrollByEmployees(filters))
  }, [dispatch, filters.month, filters.year])

  const handleStatusChange = async (empId, newStatus, emp) => {
    const payload = {
      ...emp,
      employeeId: empId,
      status: newStatus,
    }
    const response = dispatch(upsertPayroll(payload))
    dispatch(listPayrollByEmployees(filters))
  }

  return (
    <>
      <PageMetaData title="Employees" />
      <PageHeader
        title="Employee Payroll"
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Employee Payroll List' }]}
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

            <Button size="sm" variant="outline-success" onClick={() => dispatch(listPayrollByEmployees(filters))}>
              Refresh
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
              ) : (
                <Table striped bordered hover responsive className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Employee</th>
                      <th className="text-end">Salary</th>
                      <th className="text-center">Payable Days</th>
                      <th className="text-end">Payable</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollByEmployees?.data?.length > 0 ? (
                      payrollByEmployees.data.map((emp) => (
                        <tr key={emp._id}>
                          <td>
                            <div className="fw-bold text-capitalize">
                              {emp.firstName} {emp.lastName}
                            </div>
                            <small className="text-muted fst-italic">{emp.designation}</small>
                          </td>
                          <td className="text-end">{emp?.salary}</td>
                          <td className="text-center">{emp?.payableDays}</td>
                          <td className="text-end">{emp?.payable}</td>
                          <td className="text-center">
                            <Form.Select size="sm" value={emp?.status} onChange={(e) => handleStatusChange(emp._id, e.target.value, emp)}>
                              {statusOptions?.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </Form.Select>
                          </td>
                          <td className="text-center d-flex gap-2 justify-content-start">
                            {emp.payable && emp.payable > 0 ? (
                              <Link to={`/employee-payroll/create-payroll?employeeId=${emp._id}`}>
                                <Button size="sm" variant="outline-primary">
                                  Edit Salary
                                </Button>
                              </Link>
                            ) : (
                              <Link to={`/employee-payroll/create-payroll?employeeId=${emp._id}`}>
                                <Button size="sm" variant="success">
                                  Add Salary
                                </Button>
                              </Link>
                            )}

                            {emp.status === 'Paid' && (
                              <Link to={`/employee-payroll/salary-list?employeeId=${emp._id}`}>
                                <Button size="sm" variant="info">
                                  View Salary
                                </Button>
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <p className="mb-2">🚫 No payroll records found</p>
                          <Button size="sm" variant="outline-primary" onClick={() => dispatch(listPayrollByEmployees(filters))}>
                            Retry
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
