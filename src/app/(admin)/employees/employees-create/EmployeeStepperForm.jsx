import { useEffect, useState } from 'react'
import { Row, Col, Button, Card, CardBody, Form, Spinner } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import { getUsers } from '../../../../redux/features/user/userSlice'
import Select from 'react-select'
import { getEmployeeById, registerEmployee, updateEmployee } from '../../../../redux/features/employee/employeeSlice'
import { toast } from 'react-hot-toast'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function EmployeeStepperForm({ employeeId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { allUsers, isLoading } = useSelector((state) => state.user)
  const { getEmployeeData } = useSelector((state) => state.employee)
  const { message } = useSelector((state) => state.employee)
  const [loading, setLoading] = useState(false)
  const [isFormReady, setIsFormReady] = useState(false)

  const editEmployee = getEmployeeData.data
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    residentialAddress: '',
    permanentAddress: '',

    officialDetails: {
      employeeType: '',
      department: '',
      designation: '',
      joiningDate: '',
      lastWorkingDay: '',
    },

    bankDetails: {
      bankName: '',
      branchName: '',
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'Savings',
    },

    salary: {
      basic: 0,
      hra: 0,
      medicalAllowance: 0,
      conveyanceAllowance: 0,
      otherAllowances: 0,
      deductions: 0,
      ctc: 0,
    },

    employmentStatus: 'Active',
  })

  // --- Handle Change for Nested Keys ---
  // const handleChange = (e, section) => {
  //   const { name, value } = e.target

  //   if (section) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [section]: {
  //         ...prev[section],
  //         [name]: value,
  //       },
  //     }))
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }))
  //   }
  // }

  const handleChange = (e, section) => {
    const { name, value } = e.target

    if (section) {
      setFormData((prev) => {
        const updatedSection = { ...prev[section], [name]: value }

        // If salary section, calculate total CTC
        if (section === 'salary') {
          const basic = Number(updatedSection.basic) || 0
          const hra = Number(updatedSection.hra) || 0
          const medicalAllowance = Number(updatedSection.medicalAllowance) || 0
          const conveyanceAllowance = Number(updatedSection.conveyanceAllowance) || 0
          const otherAllowances = Number(updatedSection.otherAllowances) || 0
          const deductions = Number(updatedSection.deductions) || 0

          updatedSection.ctc = basic + hra + medicalAllowance + conveyanceAllowance + otherAllowances - deductions
        }

        return {
          ...prev,
          [section]: updatedSection,
        }
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // --- Steps ---
  const steps = [{ title: 'Personal Details' }, { title: 'Official Details' }, { title: 'Bank Information' }, { title: 'Salary Information' }]

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1)
  }

  // --- Validation per Step ---
  const validateStep = () => {
    switch (activeStep) {
      case 0:
        return formData.firstName && formData.lastName && formData.email && formData.phoneNumber && formData.gender
      case 1:
        return (
          formData.officialDetails.employeeType &&
          formData.officialDetails.department &&
          formData.officialDetails.designation &&
          formData.officialDetails.joiningDate
        )
      case 2:
        return true
      case 3:
        return formData.salary.basic > 0 && formData.salary.ctc > 0
      default:
        return true
    }
  }

  // --- Prevent Form Auto Submit ---
  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('Form submit prevented - this should only log, not actually submit')
    // This prevents the form from auto-submitting
    // Actual submission happens through handleActualSubmit
  }

  // --- Actual Submit Handler ---
  const handleActualSubmit = async () => {
    console.log('Actual submit triggered', { activeStep, isEditMode: !!employeeId })

    // Only allow submission on the last step
    if (activeStep !== steps.length - 1) {
      console.log('Not on last step, preventing submission')
      return
    }

    // Prevent submission if form isn't ready
    if (!isFormReady) {
      console.log('Form not ready, preventing submission')
      return
    }

    try {
      setLoading(true)

      if (employeeId) {
        const response = await dispatch(updateEmployee({ id: employeeId, ...formData })).unwrap()
        if (response?.success) {
          toast.success('Employee updated successfully!')
          navigate(-1)
        }
      } else {
        const response = await dispatch(registerEmployee(formData)).unwrap()
        if (response?.success) {
          toast.success('Employee registered successfully!')
          navigate(-1)
        }
      }

      // Reset form after creation (optional, for updates you may not reset)
      if (!employeeId) {
        setFormData({
          userId: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          dateOfBirth: '',
          gender: '',
          residentialAddress: '',
          permanentAddress: '',
          officialDetails: {
            employeeType: '',
            department: '',
            designation: '',
            joiningDate: '',
            lastWorkingDay: '',
          },
          bankDetails: {
            bankName: '',
            branchName: '',
            accountHolderName: '',
            accountNumber: '',
            ifscCode: '',
            accountType: 'Savings',
          },
          salary: {
            basic: 0,
            hra: 0,
            medicalAllowance: 0,
            conveyanceAllowance: 0,
            otherAllowances: 0,
            deductions: 0,
            ctc: 0,
          },
          employmentStatus: 'Active',
        })
        setActiveStep(0)
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save employee')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const emailOptions = allUsers?.data?.map((user) => ({
    value: user?._id,
    label: `${user?.email} (${user?.username})`,
    ...user,
  }))

  useEffect(() => {
    if (employeeId) {
      dispatch(getEmployeeById(employeeId))
    } else {
      // For create mode, mark form as ready immediately
      setIsFormReady(true)
    }
  }, [dispatch, employeeId])

  const designationsByDepartment = {
    Hr: ['HR Manager', 'Recruiter', 'HR Executive', 'HR Intern'],
    Sales: ['Sales Manager', 'Sales Executive', 'Business Development Associate'],
    Marketing: ['Marketing Manager', 'SEO Specialist', 'Content Writer', 'Digital Marketer'],
    Finance: ['Finance Manager', 'Accountant', 'Auditor', 'Finance Executive'],
    Tech: ['Manager', 'Team Lead', 'Senior Developer', 'Junior Developer', 'Intern'],
    Operations: ['Operations Manager', 'Coordinator', 'Logistics Executive'],
    Madly: ['Madly Manager', 'Madly Associate'],
    Design: ['UI/UX Designer', 'Graphic Designer', 'Creative Lead'],
    Servicing: ['Service Manager', 'Service Engineer', 'Support Executive'],
    Production: ['Production Manager', 'Supervisor', 'Worker', 'Technician'],
  }

  const capitalizeDepartment = (dept) => {
    switch (dept.toLowerCase()) {
      case 'hr':
        return 'Hr'
      case 'sales':
        return 'Sales'
      case 'marketing':
        return 'Marketing'
      case 'finance':
        return 'Finance'
      case 'tech':
      case 'it':
        return 'Tech'
      case 'operations':
        return 'Operations'
      case 'madly':
        return 'Madly'
      case 'design':
        return 'Design'
      case 'servicing':
        return 'Servicing'
      case 'production':
        return 'Production'
      default:
        return dept
    }
  }

  useEffect(() => {
    console.log('Edit employee effect triggered:', { editEmployee: !!editEmployee, employeeId })
    if (editEmployee && employeeId) {
      setFormData({
        userId: editEmployee?.userId || '',
        firstName: editEmployee?.firstName || '',
        lastName: editEmployee?.lastName || '',
        email: editEmployee?.email || '',
        phoneNumber: editEmployee?.phoneNumber || '',
        dateOfBirth: editEmployee?.dateOfBirth?.split('T')[0] || '',
        gender: editEmployee?.gender || '',
        residentialAddress: editEmployee?.residentialAddress || '',
        permanentAddress: editEmployee?.permanentAddress || '',

        officialDetails: {
          employeeType: editEmployee?.officialDetails?.employeeType || '',
          department: editEmployee?.officialDetails?.department ? capitalizeDepartment(editEmployee.officialDetails.department.trim()) : '',
          designation: editEmployee?.officialDetails?.designation || '',
          joiningDate: editEmployee?.officialDetails?.joiningDate
            ? editEmployee.officialDetails.joiningDate.split('T')[0] // format for <input type="date" />
            : '',
          lastWorkingDay: editEmployee?.officialDetails.lastWorkingDay?.split('T')[0] || '',
        },

        bankDetails: {
          bankName: editEmployee?.bankDetails?.bankName || '',
          branchName: editEmployee?.bankDetails?.branchName || '',
          accountHolderName: editEmployee?.bankDetails?.accountHolderName || '',
          accountNumber: editEmployee?.bankDetails?.accountNumber || '',
          ifscCode: editEmployee?.bankDetails?.ifscCode || '',
          accountType: editEmployee?.bankDetails?.accountType || 'Savings',
        },

        salary: {
          basic: editEmployee?.salary?.basic || 0,
          hra: editEmployee?.salary?.hra || 0,
          medicalAllowance: editEmployee?.salary?.medicalAllowance || 0,
          conveyanceAllowance: editEmployee?.salary?.conveyanceAllowance || 0,
          otherAllowances: editEmployee?.salary?.otherAllowances || 0,
          deductions: editEmployee?.salary?.deductions || 0,
          ctc: editEmployee?.salary?.ctc || 0,
        },

        employmentStatus: editEmployee?.employmentStatus || 'Active',
      })

      // Mark form as ready AFTER setting the data
      setTimeout(() => {
        setIsFormReady(true)
        console.log('Form marked as ready')
      }, 100)
    }
  }, [editEmployee, employeeId])

  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              {/* Stepper Header */}
              <div className="d-flex justify-content-between align-items-center flex-nowrap overflow-auto position-relative w-100">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className="text-center flex-fill position-relative step-item"
                    style={{ minWidth: '120px', cursor: 'pointer' }}>
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 position-relative"
                      style={{
                        width: 40,
                        height: 40,
                        zIndex: 2,
                        backgroundColor: activeStep >= index ? '#0d6efd' : '#dee2e6',
                        color: activeStep >= index ? '#fff' : '#6c757d',
                        fontWeight: 600,
                      }}>
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 20,
                          left: '50%',
                          width: '100%',
                          height: 2,
                          backgroundColor: activeStep > index ? '#0d6efd' : '#dee2e6',
                          zIndex: 1,
                        }}
                      />
                    )}
                    <small className={`d-block ${activeStep === index ? 'fw-bold text-primary' : 'text-muted'}`}>{step.title}</small>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <CardBody>
              <Form onSubmit={handleFormSubmit}>
                {/* Step 1: Personal */}
                {activeStep === 0 && (
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control name="firstName" className="text-capitalize" value={formData.firstName} onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control name="lastName" className="text-capitalize" value={formData.lastName} onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Select
                        options={emailOptions}
                        isLoading={isLoading}
                        placeholder="Select Email"
                        value={
                          emailOptions?.find((opt) => opt.value === formData.userId) ||
                          (editEmployee ? { value: editEmployee.userId, label: `${editEmployee.email} (${editEmployee.username})` } : null)
                        }
                        onChange={(selected) => {
                          setFormData((prev) => ({
                            ...prev,
                            userId: selected?.value || '',
                            email: selected ? selected.label.split(' ')[0] : '',
                          }))
                        }}
                        isClearable
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Phone *</Form.Label>
                      <Form.Control type="tel" name="phoneNumber" value={formData.phoneNumber} maxLength={10} onChange={handleChange} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Gender *</Form.Label>
                      <Form.Select name="gender" value={formData.gender} onChange={(e) => handleChange(e)}>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </Form.Select>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Residential Address</Form.Label>
                      <Form.Control name="residentialAddress" value={formData.residentialAddress} onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Permanent Address</Form.Label>
                      <Form.Control name="permanentAddress" value={formData.permanentAddress} onChange={(e) => handleChange(e)} />
                    </Col>
                  </Row>
                )}

                {/* Step 2: Official */}
                {activeStep === 1 && (
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Employee Type *</Form.Label>
                      <Form.Select
                        name="employeeType"
                        value={formData.officialDetails.employeeType}
                        onChange={(e) => handleChange(e, 'officialDetails')}>
                        <option value="">-- Select Employee Type --</option>
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="intern">Intern</option>
                      </Form.Select>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Department *</Form.Label>
                      <Form.Select name="department" value={formData.officialDetails.department} onChange={(e) => handleChange(e, 'officialDetails')}>
                        <option value="">-- Select Department --</option>
                        <option value="Hr">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Tech">IT</option>
                        <option value="Operations">Operations</option>
                        <option value="Madly">Madly</option>
                        <option value="Design">Design</option>
                        <option value="Servicing">Servicing</option>
                        <option value="Production">Production</option>
                      </Form.Select>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Designation *</Form.Label>
                      <Form.Select
                        name="designation"
                        value={formData.officialDetails.designation}
                        onChange={(e) => handleChange(e, 'officialDetails')}>
                        <option value="">-- Select Designation --</option>

                        {/* HR */}
                        <option value="hr-manager">HR Manager</option>
                        <option value="hr-executive">HR Executive</option>
                        <option value="recruiter">Recruiter</option>

                        {/* Sales & Marketing */}
                        <option value="sales-executive">Sales Executive</option>
                        <option value="sales-manager">Sales Manager</option>
                        <option value="business-development-executive">Business Development Executive</option>
                        <option value="business-development-manager">Business Development Manager</option>
                        <option value="marketing-executive">Marketing Executive</option>
                        <option value="marketing-manager">Marketing Manager</option>

                        {/* Finance */}
                        <option value="accountant">Accountant</option>
                        <option value="finance-executive">Finance Executive</option>
                        <option value="finance-manager">Finance Manager</option>

                        {/* Tech / IT */}
                        <option value="senior-developer">Senior Developer</option>
                        <option value="junior-developer">Junior Developer</option>
                        <option value="software-engineer">Software Engineer</option>
                        <option value="frontend-developer">Frontend Developer</option>
                        <option value="backend-developer">Backend Developer</option>
                        <option value="fullstack-developer">Fullstack Developer</option>
                        <option value="qa-engineer">QA Engineer</option>
                        <option value="devops-engineer">DevOps Engineer</option>

                        {/* Design */}
                        <option value="ui-ux-designer">UI/UX Designer</option>
                        <option value="graphic-designer">Graphic Designer</option>
                        <option value="creative-lead">Creative Lead</option>

                        {/* Operations / Production */}
                        <option value="video-manager">Video Manager</option>
                        <option value="video-editor">Video Editor</option>
                        <option value="senior-video-editor">Senior Video Editor</option>
                        <option value="motion-graphics-designer">Motion Graphics Designer</option>
                        <option value="video-animator">Video Animator</option>

                        {/* Service / Support */}
                        <option value="service-manager">Service Manager</option>
                        <option value="service-engineer">Service Engineer</option>
                      </Form.Select>
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Joining Date *</Form.Label>
                      <Form.Control
                        type="date"
                        name="joiningDate"
                        value={formData.officialDetails.joiningDate}
                        onChange={(e) => handleChange(e, 'officialDetails')}
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Last Working Day </Form.Label>
                      <Form.Control
                        type="date"
                        name="lastWorkingDay"
                        value={formData.officialDetails.lastWorkingDay}
                        onChange={(e) => handleChange(e, 'officialDetails')}
                      />
                    </Col>
                  </Row>
                )}

                {/* Step 3: Bank */}
                {activeStep === 2 && (
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Bank Name</Form.Label>
                      <Form.Control
                        className="text-capitalize"
                        name="bankName"
                        value={formData.bankDetails.bankName}
                        onChange={(e) => handleChange(e, 'bankDetails')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Branch Name</Form.Label>
                      <Form.Control
                        name="branchName"
                        className="text-capitalize"
                        value={formData.bankDetails.branchName}
                        onChange={(e) => handleChange(e, 'bankDetails')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Account Holder Name</Form.Label>
                      <Form.Control
                        className="text-capitalize"
                        name="accountHolderName"
                        value={formData.bankDetails.accountHolderName}
                        onChange={(e) => handleChange(e, 'bankDetails')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Account Number</Form.Label>
                      <Form.Control
                        name="accountNumber"
                        value={formData.bankDetails.accountNumber}
                        onChange={(e) => handleChange(e, 'bankDetails')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>IFSC Code</Form.Label>
                      <Form.Control
                        name="ifscCode"
                        style={{ textTransform: 'uppercase' }}
                        value={formData.bankDetails.ifscCode}
                        onChange={(e) => handleChange(e, 'bankDetails')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Account Type</Form.Label>
                      <Form.Select name="accountType" value={formData.bankDetails.accountType} onChange={(e) => handleChange(e, 'bankDetails')}>
                        <option>Savings</option>
                        <option>Current</option>
                      </Form.Select>
                    </Col>
                  </Row>
                )}

                {/* Step 4: Salary */}
                {activeStep === 3 && (
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Basic Salary *</Form.Label>
                      <Form.Control type="number" name="basic" value={formData.salary.basic} onChange={(e) => handleChange(e, 'salary')} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>HRA</Form.Label>
                      <Form.Control type="number" name="hra" value={formData.salary.hra} onChange={(e) => handleChange(e, 'salary')} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Medical Allowance</Form.Label>
                      <Form.Control
                        type="number"
                        name="medicalAllowance"
                        value={formData.salary.medicalAllowance}
                        onChange={(e) => handleChange(e, 'salary')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Conveyance Allowance</Form.Label>
                      <Form.Control
                        type="number"
                        name="conveyanceAllowance"
                        value={formData.salary.conveyanceAllowance}
                        onChange={(e) => handleChange(e, 'salary')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Other Allowances</Form.Label>
                      <Form.Control
                        type="number"
                        name="otherAllowances"
                        value={formData.salary.otherAllowances}
                        onChange={(e) => handleChange(e, 'salary')}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Deductions</Form.Label>
                      <Form.Control type="number" name="deductions" value={formData.salary.deductions} onChange={(e) => handleChange(e, 'salary')} />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Total Salary *</Form.Label>
                      <Form.Control type="number" name="ctc" value={formData.salary.ctc} onChange={(e) => handleChange(e, 'salary')} />
                    </Col>
                  </Row>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-3">
                  {activeStep > 0 && (
                    <Button variant="secondary" type="button" onClick={handlePrev}>
                      Previous
                    </Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                    <Button variant="primary" type="button" onClick={handleNext} disabled={!validateStep()}>
                      Next
                    </Button>
                  ) : (
                    <Button variant="success" type="button" onClick={handleActualSubmit} disabled={loading || !validateStep() || !isFormReady}>
                      {loading ? <Spinner size="sm" animation="border" /> : 'Submit'}
                    </Button>
                  )}
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  )
}
