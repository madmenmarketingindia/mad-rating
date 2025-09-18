import { CardBody, Col, Row, Button, Card, Spinner, Modal } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Link, useNavigate } from 'react-router-dom'
import EmployeeStepperForm from './EmployeeStepperForm'
import PageHeader from '../../../../components/PageHeader'

export default function EmployeesList() {
  const navigate = useNavigate()
  return (
    <>
      <PageMetaData title="Create Employee" />
     
      <Row>
        <Col>
          <Row>
            <Col>
              <EmployeeStepperForm />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}
