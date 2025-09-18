import React from 'react'
import ReactApexChart from 'react-apexcharts'
import ComponentContainerCard from '@/components/ComponentContainerCard'

const DepartmentRatingAreaChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { width: 3, curve: 'smooth' }, // smooth line
    colors: ['#4ecac2'], // custom color
    title: { text: 'Department-wise Average Rating', align: 'center' },
    xaxis: {
      categories: data?.map((item) => item.department) || [],
      title: { text: 'Department' },
    },
    yaxis: {
      min: 0,
      max: 5,
      title: { text: 'Average Rating' },
    },
    legend: { horizontalAlign: 'left' },
    grid: { borderColor: '#4ecac2' },
    markers: { size: 5 },
    tooltip: { enabled: true },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: ['#42A5F5'],
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: { toolbar: { show: false } },
          legend: { show: false },
        },
      },
    ],
  }

  const chartSeries = [
    {
      name: 'Avg Rating',
      data: data?.map((item) => item.avgRating) || [],
    },
  ]

  return (
    <ComponentContainerCard id="department-rating" title="Department Ratings">
      <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} />
    </ComponentContainerCard>
  )
}

export default DepartmentRatingAreaChart
