import { useEffect } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import Stats from './components/Stats'
import DepartmentRatingChart from './components/DepartmentRatingChart'
import UpcomingBirthdayCard from './components/UpcomingBirthdayCard'
import UpcomingAnniversaryCard from './components/UpcomingAnniversaryCard'
import { useDispatch, useSelector } from 'react-redux'
import {
  departmentRating,
  departmentStats,
  employeeMonthlyRating,
  employeeUpcomingBirthday,
  employeeWorkAnniversary,
  employeeYearlyRatings,
} from '../../../../redux/features/dashboard/dashboardSlice'
import EmployeeMonthlyRatingChart from './components/EmployeeMonthlyRatingChart'
import EmployeeYearlyRatingChart from './components/EmployeeYearlyRatingChart'
import { employeeDisciplinaryActions, upcomingReviews } from '../../../../redux/features/disciplinaryActions/disciplinaryActionsSlice'
import EmployeeDisciplinaryCard from './components/EmployeeDisciplinaryCard'
import UpcomingReviewsCard from './components/UpcomingReviewsCard'
import { getEmployees } from '../../../../redux/features/employee/employeeSlice'
import Stats1 from './components/Stats1'
import { getUsers } from '../../../../redux/features/user/userSlice'
import TeamYearlyRatingChart from './components/TeamYearlyRatingChart'
import WelcomeCard from './components/WelcomeCard'

export default function Home() {
  const dispatch = useDispatch()

  const { isLoading, departmentStatsData, departmentRatingData, upcomingBirthday, upcomingWorkAnniversary, empMonthlyRating, yearlyRatings } =
    useSelector((state) => state.dashboard)

  const { employeeDisciplinaryActionsData, upcomingReviewsData } = useSelector((state) => state.disciplinaryActions)
  const { allEmployee } = useSelector((state) => state.employee)
  const { allUsers } = useSelector((state) => state.user)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user?.data?.user?.role || 'Employee'

  useEffect(() => {
    if (role === 'Admin' || role === 'Hr') {
      dispatch(departmentStats())
      dispatch(departmentRating())
      dispatch(upcomingReviews())
      dispatch(getEmployees())
      dispatch(getUsers())
    }

    dispatch(employeeUpcomingBirthday())
    dispatch(employeeWorkAnniversary())
    dispatch(employeeMonthlyRating())
    dispatch(employeeYearlyRatings())
    dispatch(employeeDisciplinaryActions())
  }, [dispatch, role])

  return (
    <>
      <PageMetaData title="Analytics" />

      {role === 'Admin' || role === 'Hr' ? (
        <>
          <div className="mb-4">
            <h4 className="mb-3">Overview</h4>
            <Row className="g-3">
              <Col lg={3}>
                <Stats1 data={allUsers?.data} title="Total Users" />
              </Col>
              <Col lg={3}>
                <Stats1 data={allEmployee?.data} title="Total Employees" />
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h4 className="mb-3">Department Statistics</h4>
            <Stats data={departmentStatsData?.data} />
          </div>

          <Row>
            <Col>
              <DepartmentRatingChart data={departmentRatingData?.data} />
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <TeamYearlyRatingChart />
            </Col>
          </Row>

          <Row className="mt-4">
            <h4 className="mb-3">Work Milestone</h4>
            {upcomingBirthday?.data?.length > 0 && (
              <Col lg={4} md={6} className="mb-3">
                <UpcomingBirthdayCard birthdays={upcomingBirthday?.data} />
              </Col>
            )}
            {upcomingWorkAnniversary?.data?.length > 0 && (
              <Col lg={4} md={6} className="mb-3">
                <UpcomingAnniversaryCard anniversaries={upcomingWorkAnniversary?.data} />
              </Col>
            )}

            {upcomingReviewsData?.data?.length > 0 && (
              <Col lg={4} md={6} className="mb-3">
                <UpcomingReviewsCard reviews={upcomingReviewsData?.data} />
              </Col>
            )}
          </Row>
        </>
      ) : (
        <>
          {role === 'Employee' && (
            <div>
              {isLoading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                <>
                  <WelcomeCard employeeName={user?.data?.user?.name || 'Employee'} />
                  <Row>
                    {empMonthlyRating?.data && (
                      <Col lg={6} xs={12} className="mb-3">
                        <EmployeeMonthlyRatingChart
                          data={empMonthlyRating.data}
                          month={empMonthlyRating.data.month}
                          year={empMonthlyRating.data.year}
                        />
                      </Col>
                    )}

                    {yearlyRatings?.data && (
                      <Col lg={6} xs={12} className="mb-3">
                        <EmployeeYearlyRatingChart data={yearlyRatings.data} />
                      </Col>
                    )}
                  </Row>

                  <Row>
                    {employeeDisciplinaryActionsData?.data?.length > 0 && (
                      <Col lg={4} md={6} className="mb-3">
                        <EmployeeDisciplinaryCard actions={employeeDisciplinaryActionsData.data} />
                      </Col>
                    )}

                    {upcomingBirthday?.data?.length > 0 && (
                      <Col lg={4} md={6} className="mb-3">
                        <UpcomingBirthdayCard birthdays={upcomingBirthday.data} />
                      </Col>
                    )}

                    {upcomingWorkAnniversary?.data?.length > 0 && (
                      <Col lg={4} md={6} className="mb-3">
                        <UpcomingAnniversaryCard anniversaries={upcomingWorkAnniversary.data} />
                      </Col>
                    )}
                  </Row>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
