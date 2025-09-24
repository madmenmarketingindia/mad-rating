import { useEffect, useState } from 'react'
import { CardBody, Col, Row, Card, Form, Button, Spinner, Table, Pagination } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { createRating, employeeRatingHistory, singleMonthRating } from '../../../../redux/features/ratingReport/ratingReportSlice'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../../../../components/PageHeader'
import { getEmployees } from '../../../../redux/features/employee/employeeSlice'
import toast from 'react-hot-toast'

export default function RatingsReports() {
  const dispatch = useDispatch()
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()
  const [searchParams] = useSearchParams()
  const queryEmployeeId = searchParams.get('employeeId')
  const emName = searchParams.get('employeeName')

  const { monthRating, ratingHistory, isLoading, isHistoryLoading } = useSelector((state) => state.ratingReport)
  const { allEmployee } = useSelector((state) => state.employee)

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(queryEmployeeId || '')
  const [formFilters, setFormFilters] = useState({
    month: currentMonth,
    year: currentYear,
  })

  const [categories, setCategories] = useState({
    ethics: '',
    discipline: '',
    workEthics: '',
    output: '',
    teamPlay: '',
    leadership: '',
    extraMile: '',
  })

  // fetch employees if not loaded
  useEffect(() => {
    if (!allEmployee?.data?.length) {
      dispatch(getEmployees())
    }
  }, [dispatch, allEmployee])

  // fetch single month rating when employee changes
  // useEffect(() => {
  //   if (selectedEmployeeId) {
  //     dispatch(
  //       singleMonthRating({
  //         employeeId: selectedEmployeeId,
  //         month: formFilters.month,
  //         year: formFilters.year,
  //       }),
  //     )
  //   }
  // }, [dispatch, selectedEmployeeId, formFilters.month, formFilters.year])

  useEffect(() => {
    if (selectedEmployeeId) {
      dispatch(
        singleMonthRating({
          employeeId: selectedEmployeeId,
          month: formFilters.month,
          year: formFilters.year,
        }),
      )
    } else {
      // reset categories when no employee is selected
      setCategories({
        ethics: '',
        discipline: '',
        workEthics: '',
        output: '',
        teamPlay: '',
        leadership: '',
        extraMile: '',
      })
    }
  }, [dispatch, selectedEmployeeId, formFilters.month, formFilters.year])

  // when monthRating changes, fill categories or reset
  useEffect(() => {
    if (monthRating?.data?.categories) {
      setCategories(monthRating.data.categories)
    } else {
      setCategories({
        ethics: '',
        discipline: '',
        workEthics: '',
        output: '',
        teamPlay: '',
        leadership: '',
        extraMile: '',
      })
    }
  }, [monthRating])

  const handleFormFilterChange = (e) => {
    const { name, value } = e.target
    setFormFilters((prev) => ({ ...prev, [name]: value }))
  }

  // const handleRatingChange = (e) => {
  //   const { name, value } = e.target
  //   setCategories((prev) => ({
  //     ...prev,
  //     [name]: value ? parseFloat(value) : '',
  //   }))
  // }

  const handleRatingChange = (e) => {
    const { name, value } = e.target
    let num = value ? parseFloat(value) : ''

    // ✅ clamp between 0 and 5
    if (num !== '' && !isNaN(num)) {
      if (num < 0) num = 0
      if (num > 5) num = 5
    }

    setCategories((prev) => ({
      ...prev,
      [name]: num,
    }))
  }

  const handleSubmit = () => {
    if (!selectedEmployeeId) return
    const payload = {
      employeeId: selectedEmployeeId,
      month: Number(formFilters.month),
      year: Number(formFilters.year),
      categories,
    }
    const response = dispatch(createRating(payload))
    if (queryEmployeeId) {
      toast.success('Rating updated successfully!')
    } else {
      toast.success('Rating created successfully!')
    }
    if (response.success) {
      dispatch(employeeRatingHistory(selectedEmployeeId))
    }
  }

  const employeeName = monthRating?.data?.employeeId ? `${monthRating.data.employeeId.firstName} ${monthRating.data.employeeId.lastName}` : 'Employee'

  // fetch rating history when employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      dispatch(employeeRatingHistory(selectedEmployeeId))
    }
  }, [dispatch, selectedEmployeeId])

  const [historyFilters, setHistoryFilters] = useState({
    month: '',
    year: '',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleHistoryFilterChange = (e) => {
    setHistoryFilters({ ...historyFilters, [e.target.name]: e.target.value })
    setCurrentPage(1)
  }

  const filteredData = ratingHistory?.data?.filter((item) => {
    return (
      (historyFilters.month === '' || item.month === Number(historyFilters.month)) &&
      (historyFilters.year === '' || item.year === Number(historyFilters.year))
    )
  })

  const totalItems = filteredData?.length || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredData?.slice(startIndex, endIndex)

  // --------------------------
  // Render
  // --------------------------
  return (
    <>
      <PageMetaData title="Employee Ratings" />
      <PageHeader
        title={queryEmployeeId ? 'Edit Employee Rating' : 'Create Employee Rating'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Employee Rating List', href: '/ratings-reports/list' },
          { label: queryEmployeeId ? 'Edit Rating' : 'Create Rating' },
        ]}
        rightContent={
          <div className="d-flex gap-2">
            {/* Employee Dropdown if not from query */}
            {!queryEmployeeId && (
              <Form.Select size="sm" value={selectedEmployeeId} onChange={(e) => setSelectedEmployeeId(e.target.value)} style={{ minWidth: '200px' }}>
                <option value="">Select Employee</option>
                {allEmployee?.data?.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName} ({emp.officialDetails?.designation})
                  </option>
                ))}
              </Form.Select>
            )}

            {/* Month */}
            <Form.Select size="sm" name="month" value={formFilters.month} onChange={handleFormFilterChange} style={{ maxWidth: '150px' }}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', {
                    month: 'long',
                  })}
                </option>
              ))}
            </Form.Select>

            {/* Year */}
            <Form.Select size="sm" name="year" value={formFilters.year} onChange={handleFormFilterChange} style={{ maxWidth: '120px' }}>
              {Array.from({ length: 10 }, (_, i) => {
                const year = currentYear - 5 + i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </Form.Select>

            <Button as={Link} to="/ratings-reports/list" size="sm" variant="secondary">
              Back
            </Button>
          </div>
        }
      />

      <>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row className="align-items-center mb-3">
                  <h5 className="text-capitalize">
                    {employeeName?.firstName || employeeName?.lastName
                      ? `${employeeName?.firstName || ''} ${employeeName?.lastName || ''}`
                      : emName
                        ? emName
                        : 'No data is available for this employee'}
                  </h5>
                </Row>

                {isLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  <>
                    <Row>
                      {Object.keys(categories).map((cat) => (
                        <Col md={6} key={cat} className="mb-2">
                          <Form.Group>
                            <Form.Label className="text-capitalize">{cat}</Form.Label>
                            <Form.Control type="number" step="0.1" min="0" max="5" name={cat} value={categories[cat]} onChange={handleRatingChange} />
                          </Form.Group>
                        </Col>
                      ))}
                    </Row>

                    <div className="mt-3 d-flex justify-content-end">
                      <Button onClick={handleSubmit}>{queryEmployeeId ? 'Update Rating' : 'Save Rating'}</Button>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Rating History */}
        <Row className="align-items-center mb-3 mt-4">
          <Col>
            <h5 className="mb-0">Rating History</h5>
          </Col>
          <Col className="text-end">
            <Form className="d-flex gap-2 justify-content-end">
              <Form.Select size="sm" name="month" value={historyFilters?.month} onChange={handleHistoryFilterChange}>
                <option value="">All Months</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', {
                      month: 'long',
                    })}
                  </option>
                ))}
              </Form.Select>
              <Form.Select size="sm" name="year" value={historyFilters?.year} onChange={handleHistoryFilterChange}>
                <option value="">All Years</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = currentYear - 5 + i
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                })}
              </Form.Select>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                {isHistoryLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" />
                  </div>
                ) : currentItems?.length > 0 ? (
                  <>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Year</th>
                          <th>Ethics</th>
                          <th>Discipline</th>
                          <th>Work Ethics</th>
                          <th>Output</th>
                          <th>Team Play</th>
                          <th>Leadership</th>
                          <th>Extra Mile</th>
                          <th>Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((rating) => (
                          <tr key={rating._id}>
                            <td>{new Date(0, rating.month - 1).toLocaleString('default', { month: 'long' })}</td>
                            <td>{rating?.year}</td>
                            <td>{rating?.categories?.ethics}</td>
                            <td>{rating?.categories?.discipline}</td>
                            <td>{rating?.categories?.workEthics}</td>
                            <td>{rating?.categories?.output}</td>
                            <td>{rating?.categories?.teamPlay}</td>
                            <td>{rating?.categories?.leadership}</td>
                            <td>{rating?.categories?.extraMile}</td>
                            <td>
                              <strong>{rating?.averageScore}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {totalPages > 1 && (
                      <Pagination className="justify-content-end">
                        <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
                        {Array.from({ length: totalPages }, (_, i) => (
                          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
                      </Pagination>
                    )}
                  </>
                ) : (
                  <p className="text-muted">No rating history available.</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    </>
  )
}
