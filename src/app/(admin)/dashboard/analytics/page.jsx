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

export default function Home() {
  const dispatch = useDispatch()

  const {
    isLoading,
    departmentStatsData,
    departmentRatingData,
    upcomingBirthday,
    upcomingWorkAnniversary,
    empMonthlyRating,
    yearlyRatings,
  
  } = useSelector((state) => state.dashboard)

  const { employeeDisciplinaryActionsData, upcomingReviewsData } = useSelector((state) => state.disciplinaryActions)

  // ✅ Get user role
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user?.data?.user?.role || 'Employee'

  useEffect(() => {
    if (role === 'Admin' || role === 'Hr') {
      dispatch(departmentStats())
      dispatch(departmentRating())
      dispatch(upcomingReviews())
    }

    dispatch(employeeUpcomingBirthday())
    dispatch(employeeWorkAnniversary())
    dispatch(employeeMonthlyRating())
    dispatch(employeeYearlyRatings())
    dispatch(employeeDisciplinaryActions())
  }, [dispatch, role])

  console.log('upcomingReviewsData', upcomingReviewsData)

  return (
    <>
      <PageMetaData title="Analytics" />

      {role === 'Admin' || role === 'Hr' ? (
        <>
          <Stats data={departmentStatsData?.data} />

          <Row>
            <Col>
              <DepartmentRatingChart data={departmentRatingData?.data} />
            </Col>
          </Row>

          <Row>
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

            {upcomingReviewsData?.data?.length > 0 && (
              <Col lg={4} md={6} className="mb-3">
                <UpcomingReviewsCard reviews={upcomingReviewsData.data} />
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
