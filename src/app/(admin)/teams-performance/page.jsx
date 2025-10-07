import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Form, Spinner, Table, Badge } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { teamsWiseRatings } from '../../../redux/features/ratingReport/ratingReportSlice'

export default function TeamPerformance() {
  const dispatch = useDispatch()
  const { teamsWiseRatingsData, isLoading, error } = useSelector((state) => state.ratingReport)

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  // 🔹 Fetch data when year or month changes
  useEffect(() => {
    dispatch(teamsWiseRatings({ month: selectedMonth, year: selectedYear }))
  }, [dispatch, selectedYear, selectedMonth])

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
          <span className="text-warning" style={{ opacity: 0.7 }}>
            ★
          </span>
        )}

        {/* Empty Stars but Yellow */}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-warning" style={{ opacity: 0.3 }}>
            ★
          </span>
        ))}
      </>
    )
  }

  return (
    <>
      <PageMetaData title="Team Performance" />
      <PageHeader
        title="Team Performance"
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Team Performance' }]}
        rightContent={<div></div>}
      />

      <Row  className='mb-3'>
        <Col>
          <div className="d-flex gap-2">
            {/* Month selector */}
            <Form.Select size="sm" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} style={{ width: '140px' }}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Form.Select>

            {/* Year selector */}
            <Form.Select size="sm" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ width: '120px' }}>
              {Array.from({ length: 6 }, (_, i) => {
                const year = currentYear - 5 + i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </Form.Select>
          </div>
        </Col>
      </Row>

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
              ) : !teamsWiseRatingsData.data?.departments?.length ? (
                <p className="text-center text-muted">
                  No team ratings found for {new Date(0, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                </p>
              ) : (
                <div className="table-responsive">
                  <Table bordered hover>
                    <thead className="table-light text-center">
                      <tr>
                        <th>Department</th>
                        <th>Ethics</th>
                        <th>Discipline</th>
                        <th>Work Ethics</th>
                        <th>Output</th>
                        <th>Team Play</th>
                        <th>Leadership</th>
                        <th>Extra Mile</th>
                        <th>Overall</th>
                        {/* <th>Employees</th> */}
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {teamsWiseRatingsData?.data?.departments.map((dept, idx) => (
                        <tr key={idx}>
                          <td className="text-capitalize">{dept.department}</td>
                          <td>{dept.avgEthics}</td>
                          <td>{dept.avgDiscipline}</td>
                          <td>{dept.avgWorkEthics}</td>
                          <td>{dept.avgOutput}</td>
                          <td>{dept.avgTeamPlay}</td>
                          <td>{dept.avgLeadership}</td>
                          <td>{dept.avgExtraMile}</td>
                          {/* <td>{dept.avgOverall.toFixed(2)}</td> */}
                          <td>
                            <div className="d-flex align-items-center">
                              <Badge
                                bg={dept.avgOverall.toFixed(2) >= 4 ? 'success' : dept.avgOverall.toFixed(2) >= 3 ? 'warning' : 'danger'}
                                className="me-2">
                                {dept.avgOverall.toFixed(2) ?? 'N/A'}
                              </Badge>
                              {renderStars(dept.avgOverall.toFixed(2) || 0)}
                            </div>
                          </td>
                          {/* <td>{dept.totalEmployees}</td> */}
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
    </>
  )
}
