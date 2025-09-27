import { useEffect, useState } from 'react'
import { Card, CardBody, Row, Col, Button, Form, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { createHoliday, editHoliday, singleHoliday } from '../../../../redux/features/holiday/holidaySlice'

export default function CreateHoliday() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, getSingleHolidayData } = useSelector((state) => state.holiday)
  const [searchParams] = useSearchParams()
  const holidayId = searchParams.get('holidayId')

  const [formData, setFormData] = useState({
    name: '',
    date: '',
  })

  // Pre-fill data in edit mode
  useEffect(() => {
    if (holidayId) {
      dispatch(singleHoliday(holidayId))
    }
  }, [dispatch, holidayId])

  // when holiday details fetched → set form data
  useEffect(() => {
    if (holidayId && getSingleHolidayData?.data) {
      const { name, date } = getSingleHolidayData.data
      setFormData({
        name,
        date: date.split('T')[0], // keep only YYYY-MM-DD
      })
    }
  }, [holidayId, getSingleHolidayData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let res
      if (holidayId) {
        // Update holiday
        res = await dispatch(editHoliday({ holidayId, holidayData: formData })).unwrap()
        if (res.success) {
          toast.success('Holiday updated successfully!')
          navigate('/holiday/list')
        }
      } else {
        // Create holiday
        res = await dispatch(createHoliday(formData)).unwrap()
        if (res.success) {
          toast.success('Holiday created successfully!')
          navigate('/holiday/list')
        }
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
      console.error('Error in submit:', err)
    }
  }

  return (
    <>
      <PageMetaData title={holidayId ? 'Edit Holiday' : 'Create Holiday'} />
      <PageHeader
        title={holidayId ? 'Edit Holiday' : 'Create Holiday'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Holiday List', href: '/holiday/list' },
          { label: holidayId ? 'Edit Holiday' : 'Create Holiday' },
        ]}
        rightContent={
          <Button size="sm" variant="secondary" onClick={() => navigate('/holiday/list')}>
            <IconifyIcon icon="mdi:arrow-left" className="me-1" />
            Back
          </Button>
        }
      />

      <Row>
        <Col md={{ span: 12 }}>
          <Card>
            <CardBody>
              {holidayId && isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                  <p className="mt-2 mb-0">Loading holiday details...</p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="holidayName">
                    <Form.Label>Holiday Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="text-capitalize"
                      placeholder="Enter holiday name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="holidayDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                  </Form.Group>

                  {error && <p className="text-danger">{error}</p>}

                  <div className="d-flex justify-content-end gap-2">
                    <Button type="submit" variant="primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : holidayId ? (
                        'Update Holiday'
                      ) : (
                        'Save Holiday'
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
