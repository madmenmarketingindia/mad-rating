import { Col, Row } from 'react-bootstrap'
import PageMetaData from '@/components/PageTitle'
export default function UsersList() {
  return (
    <>
      <PageMetaData title="Users" />
      <Row>
        <Col lg={12}>User</Col>
      </Row>
    </>
  )
}
