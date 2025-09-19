import { useEffect, useState } from 'react'
import { Card, CardBody, Form, Spinner } from 'react-bootstrap'
import Chart from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'
import { employeeYearlyRatings } from '@/redux/features/ratingReport/ratingReportSlice'

const EmployeeYearlyRatingChart = ({ employeeId }) => {
  const dispatch = useDispatch()
  const { yearlyRatings, isLoading } = useSelector((state) => state.ratingReport)

  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // 🔹 Fetch data when employee or year changes
  useEffect(() => {
    if (employeeId) {
      dispatch(employeeYearlyRatings({ employeeId, year: selectedYear }))
    }
  }, [dispatch, employeeId, selectedYear])

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value))
  }

  // 🔹 Transform API data to chart data
  const chartData = yearlyRatings?.data?.ratings?.map((r) => r.avgRating) || []

  const chartCategories =
    yearlyRatings?.data?.ratings?.map((r) =>
      new Date(0, r.month - 1).toLocaleString('default', {
        month: 'short',
      }),
    ) || []

  const options = {
    chart: {
      id: 'employee-rating-chart',
      toolbar: { show: false },
    },
    xaxis: {
      categories: chartCategories,
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        formatter: (val) => val.toFixed(0),
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: ['#007bff'],
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(1),
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(1)} / 5`,
      },
    },
  }

  const series = [
    {
      name: 'Avg Rating',
      data: chartData,
    },
  ]

  return (
    <Card className="mt-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Yearly Rating Trend</h5>
          <Form.Select size="sm" style={{ width: '120px' }} value={selectedYear} onChange={handleYearChange}>
            {Array.from({ length: 5 }, (_, i) => {
              const year = currentYear - i
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            })}
          </Form.Select>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Chart options={options} series={series} type="line" height={350} />
        )}
      </CardBody>
    </Card>
  )
}

export default EmployeeYearlyRatingChart
