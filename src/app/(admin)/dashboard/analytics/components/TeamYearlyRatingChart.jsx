import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from 'react-bootstrap'
import { teamYearlyRatings } from '../../../../../redux/features/dashboard/dashboardSlice'

export default function TeamYearlyRatingChart() {
  const dispatch = useDispatch()
  const { teamYearlyRatingsData, isLoading } = useSelector((state) => state.dashboard)

  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    dispatch(teamYearlyRatings(year))
  }, [dispatch, year])

  const data = teamYearlyRatingsData?.data || []

  // ✅ Group by department
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.department]) acc[item.department] = Array(12).fill(0)
    acc[item.department][item.month - 1] = item.avgRating
    return acc
  }, {})

  // ✅ Build chart series
  const series = Object.entries(groupedData).map(([dept, ratings]) => ({
    name: dept,
    data: ratings,
  }))

  const options = {
    chart: { type: 'line', height: 350, toolbar: { show: false } },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: { min: 0, max: 5, title: { text: 'Average Rating' } },
    stroke: { curve: 'smooth', width: 3 },
    markers: { size: 4 },
    legend: { position: 'top' }, // show department names at top
  }

  return (
    <Card className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Team Yearly Ratings</h5>
        <select className="form-select w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {[2025, 2024, 2023].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? <div className="text-center my-4">Loading...</div> : <Chart options={options} series={series} type="line" height={350} />}
    </Card>
  )
}
