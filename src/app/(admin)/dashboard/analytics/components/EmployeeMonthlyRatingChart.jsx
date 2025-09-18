import React from 'react'
import Chart from 'react-apexcharts'

export default function EmployeeMonthlyRatingChart({ data, month, year }) {
  if (!data || !data.categories) return null

  const categories = ['Discipline', 'Work Ethics', 'Output', 'Team Play', 'Leadership', 'Extra Mile']

  // Use data.categories directly
  const values = [
    data.categories.discipline || 0,
    data.categories.workEthics || 0,
    data.categories.output || 0,
    data.categories.teamPlay || 0,
    data.categories.leadership || 0,
    data.categories.extraMile || 0,
  ]

  const options = {
    chart: { id: 'employee-rating', toolbar: { show: false }, zoom: { enabled: false } },
    xaxis: { categories },
    yaxis: { min: 0, max: 5, tickAmount: 5 },
    stroke: { curve: 'smooth', width: 2 },
    markers: { size: 5 },
    tooltip: { y: { formatter: (val) => `${val}` } },
    fill: { type: 'solid', opacity: 0.3 },
  }

  const series = [{ name: `${month} ${year}`, data: values }]

  return (
    <div className="p-3 border card">
      <h6 className="mb-3 text-center">
        {month} / {year}
      </h6>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  )
}
