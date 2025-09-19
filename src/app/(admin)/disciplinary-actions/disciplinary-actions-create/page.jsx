import { useEffect, useState } from 'react'
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import PageHeader from '@/components/PageHeader'
import { useDispatch, useSelector } from 'react-redux'
import {
  createDisciplinaryAction,
  singleDisciplinaryAction,
  updateDisciplinaryActionStatus,
} from '../../../../redux/features/disciplinaryActions/disciplinaryActionsSlice'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getUsers } from '../../../../redux/features/user/userSlice'
import Select from 'react-select'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import toast from 'react-hot-toast'

export default function DisciplinaryActionsForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const actionId = searchParams.get('actionId')

  const { isLoading, singleDisciplinaryActionData } = useSelector((state) => state.disciplinaryActions)
  const { allUsers, isLoading: usersLoading } = useSelector((state) => state.user)

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    type: 'Warning',
    reason: '',
    reviewPeriodDays: 0,
  })

  // ✅ Form validation state
  const [formErrors, setFormErrors] = useState({})

  // Load users + single data if update mode
  useEffect(() => {
    dispatch(getUsers())

    if (actionId) {
      dispatch(singleDisciplinaryAction(actionId))
    }
  }, [dispatch, actionId])

  // Prefill when single data is fetched
  useEffect(() => {
    if (actionId && singleDisciplinaryActionData?.data) {
      const a = singleDisciplinaryActionData.data
      setFormData({
        employeeId: a.employeeId?._id || '',
        type: a.type || 'Warning',
        reason: a.reason || '',
        reviewPeriodDays: a.reviewPeriodDays || 0,
      })
    }
  }, [actionId, singleDisciplinaryActionData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // ✅ Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // ✅ Form validation function
  const validateForm = () => {
    const errors = {}

    if (!formData.employeeId) {
      errors.employeeId = 'Employee is required'
    }

    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required'
    }

    if (formData.reviewPeriodDays < 0) {
      errors.reviewPeriodDays = 'Review period cannot be negative'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    // ✅ Show loading toast
    const loadingToast = toast.loading(actionId ? 'Updating disciplinary action...' : 'Creating disciplinary action...')

    try {
      if (actionId) {
        // ✅ Update
        await dispatch(
          updateDisciplinaryActionStatus({
            actionId,
            data: formData,
          }),
        ).unwrap()

        // ✅ Success toast
        toast.success('Disciplinary action updated successfully!', {
          id: loadingToast,
        })

        // Navigate after short delay
        setTimeout(() => {
          navigate('/disciplinary-actions/list')
        }, 1000)
      } else {
        // ✅ Create
        await dispatch(createDisciplinaryAction(formData)).unwrap()

        // ✅ Success toast
        toast.success('Disciplinary action created successfully!', {
          id: loadingToast,
        })

        // Navigate after short delay
        setTimeout(() => {
          navigate('/disciplinary-actions/list')
        }, )
      }
    } catch (error) {
      console.error('Save failed:', error)

      // ✅ Error toast
      toast.error(error.message || 'Failed to save disciplinary action', {
        id: loadingToast,
      })
    }
  }

  // ✅ Better user options mapping
  const userOptions =
    allUsers?.data?.map((user) => ({
      value: user?.employeeId,
      label: `${user?.firstName || user?.username} ${user?.lastName || ''} (${user?.email})`.trim(),
      employee: user,
    })) || []

  return (
    <>
      <PageMetaData title={actionId ? 'Update Disciplinary Action' : 'Create Disciplinary Action'} />
      <PageHeader
        title={actionId ? 'Update Disciplinary Action' : 'Create Disciplinary Action'}
        breadcrumbItems={[
          { label: 'Dashboard', href: '/' },
          { label: 'Disciplinary Actions', href: '/disciplinary-actions/list' },
          { label: actionId ? 'Update' : 'Create' },
        ]}
        rightContent={
          <div className="d-flex gap-2">
            <Button as={Link} to="/disciplinary-actions/list" size="sm" variant="secondary">
              Back
            </Button>
          </div>
        }
      />

      <Card className="p-4 shadow-sm">
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            {/* Employee Selection */}
            <Col md={6} className="mb-1">
              <Form.Label>
                Employee <span className="text-danger">*</span>
              </Form.Label>
              <Select
                options={userOptions}
                isLoading={usersLoading}
                placeholder="Select Employee"
                value={userOptions.find((opt) => opt.value === formData.employeeId) || null}
                onChange={(selected) => {
                  setFormData((prev) => ({
                    ...prev,
                    employeeId: selected?.value || '',
                  }))
                  // Clear error
                  if (formErrors.employeeId) {
                    setFormErrors((prev) => ({ ...prev, employeeId: '' }))
                  }
                }}
                isClearable
                isDisabled={!!actionId} // prevent changing employee in update mode
                className={formErrors.employeeId ? 'is-invalid' : ''}
              />
              {formErrors.employeeId && <div className="invalid-feedback d-block">{formErrors.employeeId}</div>}
            </Col>

            {/* Type */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Type <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select name="type" value={formData.type} onChange={handleChange} required className={formErrors.type ? 'is-invalid' : ''}>
                  <option value="Warning">Warning</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Termination Notice">Termination Notice</option>
                </Form.Select>
                {formErrors.type && <div className="invalid-feedback">{formErrors.type}</div>}
              </Form.Group>
            </Col>

            {/* Reason */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>
                  Reason <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Enter detailed reason for disciplinary action"
                  required
                  className={formErrors.reason ? 'is-invalid' : ''}
                />
                <Form.Text className="text-muted">Provide clear and specific details about the incident or behavior.</Form.Text>
                {formErrors.reason && <div className="invalid-feedback">{formErrors.reason}</div>}
              </Form.Group>
            </Col>

            {/* Review Period */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Review Period (Days)</Form.Label>
                <Form.Control
                  type="number"
                  name="reviewPeriodDays"
                  value={formData.reviewPeriodDays}
                  onChange={handleChange}
                  min="0"
                  max="365"
                  className={formErrors.reviewPeriodDays ? 'is-invalid' : ''}
                />
                <Form.Text className="text-muted">Number of days for review period (0 = no review period)</Form.Text>
                {formErrors.reviewPeriodDays && <div className="invalid-feedback">{formErrors.reviewPeriodDays}</div>}
              </Form.Group>
            </Col>

            {/* Submit Buttons */}
            <Col xs={12}>
              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <Button as={Link} to="/disciplinary-actions/list" variant="secondary" size="sm">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      {actionId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{actionId ? 'Update Action' : 'Create Action'}</>
                  )}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  )
}
