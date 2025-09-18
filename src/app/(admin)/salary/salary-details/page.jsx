import { useEffect } from 'react'
import { CardBody, Col, Row, Card, Spinner, Table, Button } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import PageHeader from '../../../../components/PageHeader'
import { downloadSalarySlip, employeeSalaryDetail } from '../../../../redux/features/salary/salarySlice'

export default function EmployeeSalaryDetailPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, salaryDetailed } = useSelector((state) => state.salary)
  const [searchParams] = useSearchParams()

  const employeeId = searchParams.get('employeeId')
  const month = searchParams.get('month')
  const year = searchParams.get('year')

  useEffect(() => {
    if (employeeId && month && year) {
      dispatch(employeeSalaryDetail({ employeeId, month, year }))
    }
  }, [dispatch, employeeId, month, year])

  const data = salaryDetailed?.data

  const handleDownload = async () => {
    try {
      const resultAction = await dispatch(downloadSalarySlip({ employeeId, month, year }))

      if (downloadSalarySlip.fulfilled.match(resultAction)) {
        const blob = resultAction.payload
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `SalarySlip-${data?.name}-${month}-${year}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        alert('Failed to download salary slip')
      }
    } catch (err) {
      console.error('Download error:', err)
    }
  }

  return (
    <>
      <PageMetaData title="Salary Slip download" />
      <PageHeader
        title="Salary Slip download"
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Employee Payroll list', href: '/employee-payroll/list' },
          { label: 'Salary Details', href: '/employee-payroll/salary-list' },
          { label: 'Salary Slip download' },
        ]}
        rightContent={
          <div className="d-flex gap-2">
            <Button size="sm" variant="success" onClick={() => handleDownload()}>
              Download Salary Slip
            </Button>
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
      ) : data ? (
        <Row>
          <Col md={12} className="mb-3">
            <Card>
              <CardBody>
                {/* Employee + Company Info */}
                <Row className="mb-3">
                  <Col md={8}>
                    <h5 className="mb-1">{data.name}</h5>
                    <p className="mb-1">
                      <strong>Department:</strong> {data.department} | <strong>Designation:</strong> {data.designation}
                    </p>
                    <p className="mb-1">
                      <strong>Joining Date:</strong> {new Date(data.joiningDate).toLocaleDateString()}
                    </p>
                    <p className="mb-1">
                      <strong>Month / Year:</strong>{' '}
                      {new Date(data?.salaryDetails?.year, data?.salaryDetails?.month - 1).toLocaleString('default', {
                        month: 'long',
                      })}{' '}
                      {data?.salaryDetails?.year}
                    </p>
                  </Col>
                  <Col md={4} className="text-end">
                    {/* Company Logo Placeholder */}
                    <h4 className="fw-bold text-primary">Your Company</h4>
                    <p className="mb-0">123 Business Street</p>
                    <p className="mb-0">City, State, PIN</p>
                    <p className="mb-0">Phone: +91-1234567890</p>
                  </Col>
                </Row>

                <hr />

                {/* Salary Payable & Deductions */}
                <Row>
                  <Col md={6}>
                    <h5>Salary Payable</h5>
                    <Table bordered size="sm" responsive>
                      <tbody>
                        <tr>
                          <td>Basic Salary</td>
                          <td>{data.salaryDetails?.baseSalary?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>HRA</td>
                          <td>{data.salaryDetails?.hra?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>Medical Allowance</td>
                          <td>{data.salaryDetails?.medicalAllowance?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>Conveyance</td>
                          <td>{data.salaryDetails?.conveyance?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>Special Allowance</td>
                          <td>{data.salaryDetails?.specialAllowance?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>Others</td>
                          <td>{data.salaryDetails?.others?.toFixed(2) || 0}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>

                  <Col md={6}>
                    <h5>Deductions</h5>
                    <Table bordered size="sm" responsive>
                      <tbody>
                        <tr>
                          <td>Tax Deduction</td>
                          <td>{data.salaryDetails?.taxDeduction?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>PF</td>
                          <td>{data.salaryDetails?.pf?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>ESI</td>
                          <td>{data.salaryDetails?.esi?.toFixed(2) || 0}</td>
                        </tr>
                        <tr>
                          <td>Loan Deduction</td>
                          <td>{data.salaryDetails?.loanDeduction?.toFixed(2) || 0}</td>
                        </tr>
                        <tr className="fw-bold">
                          <td>Total Deductions</td>
                          <td>{data.salaryDetails?.deductions?.toFixed(2) || 0}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                {/* Net Salary */}
                <Row className="mt-3">
                  <Col md={12} className="text-end fw-bold fs-5">
                    Net Salary Payable: ₹{data.salaryDetails?.netPay?.toFixed(2) || 0}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <div className="text-center">No salary details found</div>
      )}
    </>
  )
}
