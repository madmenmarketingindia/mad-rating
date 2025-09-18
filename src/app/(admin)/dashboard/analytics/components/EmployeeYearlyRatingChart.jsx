import React from 'react'
import Chart from 'react-apexcharts'

export default function EmployeeYearlyRatingChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Convert "month-year" like "9-2025" to "Sep-2025"
  const categories = data.map((item) => {
    const [month, year] = item.month.split('-')
    const monthIndex = parseInt(month, 10) - 1
    return `${monthNames[monthIndex] || month}-${year}`
  })

  const values = data.map((item) => item.avgRating)

  const options = {
    chart: { id: 'employee-yearly-rating', toolbar: { show: false }, zoom: { enabled: false } },
    xaxis: { categories },
    yaxis: { min: 0, max: 5, tickAmount: 5 },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 5 },
    tooltip: { y: { formatter: (val) => `${val}` } },
    fill: { type: 'solid', opacity: 0.3 },
  }

  const series = [{ name: 'Avg Rating', data: values }]

  return (
    <div className="p-3 border rounded card ">
      <h6 className="mb-3 text-center">Yearly Ratings</h6>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  )
}
