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
      <PageMetaData title="Users" />
      <PageHeader
        title={'Create Employee'}
        breadcrumbItems={[{ label: 'Dashboard', href: '/' }, { label: 'Employee List' }]}
        rightContent={
          <div>
            <Button size="sm" variant="outline-success" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        }
      />
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
