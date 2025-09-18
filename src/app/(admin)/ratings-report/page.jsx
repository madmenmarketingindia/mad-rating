import { CardBody, Col, Row, Button, Card, Spinner, Form } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { employeeWiseRatingReport, singleMonthRating } from '../../../redux/features/ratingReport/ratingReportSlice'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'

export default function RatingsReports() {
  const dispatch = useDispatch()
  const { allEmployeeRating, isLoading } = useSelector((state) => state.ratingReport)

  const [filters, setFilters] = useState({
    name: '',
    month: '',
    year: '',
  })

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  useEffect(() => {
    dispatch(employeeWiseRatingReport(filters))
  }, [dispatch, filters])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Apply sorting
  const sortedData = allEmployeeRating?.data
    ? [...allEmployeeRating.data].sort((a, b) => {
        if (!sortConfig.key) return 0
        const valA = a[sortConfig.key] ?? ''
        const valB = b[sortConfig.key] ?? ''
        if (typeof valA === 'string') {
          return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
        }
        if (typeof valA === 'number') {
          return sortConfig.direction === 'asc' ? valA - valB : valB - valA
        }
        return 0
      })
    : []

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return '⬍'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  return (
    <>
      <PageMetaData title="Employee Ratings" />
      <PageHeader
        title="Employee Ratings"
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Employee Ratings' }]}
        rightContent={
          <div className="d-flex gap-2">
            <Form.Select size="sm" name="month" value={filters.month} onChange={handleFilterChange}>
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'short' })}
                </option>
              ))}
            </Form.Select>

            {/* Year dropdown (dynamic) */}
            <Form.Select size="sm" name="year" value={filters.year} onChange={handleFilterChange}>
              <option value="">Year</option>
              {Array.from({ length: 6 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i // from currentYear-5
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </Form.Select>
          </div>
        }
      />
      <Row>
        <Col>
          <Card>
            <CardBody>
              {/* --- Filters --- */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
                {/* Smaller search field */}
                <Form.Control
                  type="search"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search by employee..."
                  style={{ width: '200px' }}
                />

                <Button as={Link} to={`/ratings-report/add-rating?employeeId`} size="sm" variant="primary">
                  <IconifyIcon icon="bx:plus" className="me-1" />
                  Add Rating
                </Button>
              </div>

              {/* --- Table --- */}
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th onClick={() => handleSort('employeeId')}>Employee {renderSortIcon('employeeId')}</th>
                      <th onClick={() => handleSort('categories.ethics')}>Ethics {renderSortIcon('categories.ethics')}</th>
                      <th onClick={() => handleSort('categories.discipline')}>Discipline {renderSortIcon('categories.discipline')}</th>
                      <th onClick={() => handleSort('categories.workEthics')}>Work Ethics {renderSortIcon('categories.workEthics')}</th>
                      <th onClick={() => handleSort('categories.output')}>Output {renderSortIcon('categories.output')}</th>
                      <th onClick={() => handleSort('categories.teamPlay')}>Team Play {renderSortIcon('categories.teamPlay')}</th>
                      <th onClick={() => handleSort('categories.leadership')}>Leadership {renderSortIcon('categories.leadership')}</th>
                      <th onClick={() => handleSort('categories.extraMile')}>Extra Mile {renderSortIcon('categories.extraMile')}</th>
                      <th onClick={() => handleSort('averageScore')}>Average Score {renderSortIcon('averageScore')}</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="10" className="text-center">
                          <Spinner animation="border" size="sm" /> Loading...
                        </td>
                      </tr>
                    ) : sortedData?.length > 0 ? (
                      sortedData.map((rating) => (
                        <tr key={rating._id}>
                          <td>
                            {rating.employeeId?.firstName} {rating.employeeId?.lastName}
                          </td>
                          <td>{rating.categories.ethics}</td>
                          <td>{rating.categories.discipline}</td>
                          <td>{rating.categories.workEthics}</td>
                          <td>{rating.categories.output}</td>
                          <td>{rating.categories.teamPlay}</td>
                          <td>{rating.categories.leadership}</td>
                          <td>{rating.categories.extraMile}</td>
                          <td>
                            <strong>{rating.averageScore}</strong>
                          </td>
                          <td>
                            <Button
                              as={Link}
                              to={`/ratings-report/add-rating?employeeId=${rating?.employeeId?._id}`}
                              variant="outline-primary"
                              size="sm">
                              <IconifyIcon icon="bx:edit" className="me-1" /> Edit
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="text-center text-muted">
                          No ratings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
