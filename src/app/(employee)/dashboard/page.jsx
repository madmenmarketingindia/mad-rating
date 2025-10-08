import { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'

export default function EmployeeHome() {
  const dispatch = useDispatch()

  //   const { isLoading, departmentStatsData, departmentRatingData, upcomingBirthday, upcomingWorkAnniversary } = useSelector((state) => state.dashboard)
  //   useEffect(() => {
  //     dispatch(departmentStats())
  //     dispatch(departmentRating())
  //     dispatch(employeeUpcomingBirthday())
  //     dispatch(employeeWorkAnniversary())
  //   }, [dispatch])

  return (
    <>
      <PageMetaData title="Analytics" />
    </>
  )
}
