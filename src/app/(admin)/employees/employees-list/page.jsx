import { Col, Row } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
export default function EmployeesList() {
  return (
    <>
      <PageMetaData title="Users" />
      <Row>
        <Col lg={12}>employees</Col>
      </Row>
    </>
  )
}
