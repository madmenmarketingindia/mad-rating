import { useState, useEffect } from 'react'
import { Card, CardBody, Row, Col, Form, Button, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { allDepartments, employeesByDepartment } from '../../../../redux/features/employee/employeeSlice'
import { createTeamIncentive, singleTeamWiseIncentive, updateTeamWiseIncentive } from '../../../../redux/features/teamIncentive/teamIncentiveSlice'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'

export default function AddTeamIncentive() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { employeesByDepartmentData, allDepartmentsData, isLoading: empLoading } = useSelector((state) => state.employee)
  const { isLoading: incentiveLoading, singleIncentiveData } = useSelector((state) => state.teamIncentive)

  const [searchParams] = useSearchParams()
  const incentiveId = searchParams.get('incentiveId')

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1

  const [team, setTeam] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])
  const [totalAmount, setTotalAmount] = useState('')
  const [month, setMonth] = useState(currentMonth)
  const [year, setYear] = useState(currentYear)

  // 🔹 Fetch initial data
  useEffect(() => {
    dispatch(allDepartments())
  }, [dispatch])

  // 🔹 Fetch employees when team changes
  useEffect(() => {
    if (team) dispatch(employeesByDepartment(team))
  }, [team, dispatch])

  // 🔹 Prefill if Edit
  useEffect(() => {
    if (incentiveId) {
      dispatch(singleTeamWiseIncentive(incentiveId))
    }
  }, [dispatch, incentiveId])

  // 🔹 Prefill form when singleIncentiveData arrives
  useEffect(() => {
    if (incentiveId && singleIncentiveData?.data) {
      const data = singleIncentiveData.data
      setTeam(data.team || '')
      setSelectedMembers(data.members.map((m) => m.employeeId._id))
      setTotalAmount(data.totalAmount || '')
      setMonth(data.month || currentMonth)
      setYear(data.year || currentYear)
    }
  }, [singleIncentiveData, incentiveId])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!team || selectedMembers.length === 0 || !totalAmount) {
      toast.error('Please fill all required fields')
      return
    }

    const payload = {
      team,
      memberIds: selectedMembers,
      totalAmount: Number(totalAmount),
      month: Number(month),
      year: Number(year),
    }

    const action = incentiveId ? updateTeamWiseIncentive({ incentiveId, incentiveData: payload }) : createTeamIncentive(payload)

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Incentive ${incentiveId ? 'updated' : 'added'} successfully`)
        navigate('/teams-incentive/list')
      })
      .catch((err) => toast.error(err || 'Something went wrong'))
  }

  return (
    <>
      <PageMetaData title={incentiveId ? 'Edit Team Incentive' : 'Add Team Incentive'} />
      <PageHeader
        title={incentiveId ? 'Edit Team Incentive' : 'Add Team Incentive'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Team Incentive List', href: '/teams-incentive/list' },
          { label: incentiveId ? 'Edit Team Incentive' : 'Add Team Incentive' },
        ]}
        rightContent={
          <div className="d-flex gap-2">
            <Button as={Link} to="/teams-incentive/list" size="sm" variant="secondary">
              Back
            </Button>
          </div>
        }
      />

      <Row className="justify-content-center">
        <Col xs={12} md={12}>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Team / Department */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Team / Department *</Form.Label>
                      <Form.Select value={team} onChange={(e) => setTeam(e.target.value)}>
                        <option value="">Select Team</option>
                        {allDepartmentsData?.data?.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Members */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Members *</Form.Label>
                      {empLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <Form.Select
                          multiple
                          value={selectedMembers}
                          onChange={(e) => setSelectedMembers(Array.from(e.target.selectedOptions, (option) => option.value))}>
                          {employeesByDepartmentData?.data?.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                              {emp.firstName} {emp.lastName}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Total Amount */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Incentive Amount *</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter total amount"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                      />
                    </Form.Group>
                  </Col>

                  {/* Month */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Month</Form.Label>
                      <Form.Select value={month} onChange={(e) => setMonth(e.target.value)}>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Year */}
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year</Form.Label>
                      <Form.Select value={year} onChange={(e) => setYear(e.target.value)}>
                        {Array.from({ length: 6 }, (_, i) => {
                          const yr = currentYear - 5 + i
                          return (
                            <option key={yr} value={yr}>
                              {yr}
                            </option>
                          )
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Button type="submit" disabled={incentiveLoading} className="w-20">
                  {incentiveLoading ? 'Saving...' : incentiveId ? 'Update Incentive' : 'Add Incentive'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
