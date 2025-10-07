import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Form, Spinner, Table, Badge } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import { teamsWiseRatings } from '../../../redux/features/ratingReport/ratingReportSlice'

export default function ClosureList() {
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

  return (
    <>
      <PageMetaData title="Closure" />

      <Row>
        <Col>
          <Card>
            <CardBody>We are working on Closure</CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
