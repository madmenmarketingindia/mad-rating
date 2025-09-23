import { CardBody, Col, Row, Button, Card, Spinner, Modal } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import EmployeeStepperForm from './EmployeeStepperForm'
import PageHeader from '../../../../components/PageHeader'

export default function EmployeesList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const employeeId = searchParams.get('employeeId')
  return (
    <>
      <PageMetaData title="Create Employee" />

      <Row>
        <Col>
          <Row>
            <Col>
              <EmployeeStepperForm employeeId={employeeId} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
