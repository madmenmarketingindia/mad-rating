import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Card, CardBody, Col, Row } from 'react-bootstrap'

const StatCard = ({ count, title }) => {
  return (
    <Card>
      <CardBody>
        <Row>
          <Col xs={6} className="text-start">
            <p className="mb-0 text-capitalize">{title}</p>
            <h3 className="text-dark mt-2 mb-0 text-truncate">{count}</h3>
          </Col>
          <Col xs={6}></Col>
        </Row>
      </CardBody>
    </Card>
  )
}

const Stats1 = ({ data, title }) => {
  // data is your full response object
  const totalEmployees = data?.length || 0

  return (
    <Row>
      <Col md={12} xl={12}>
        <StatCard count={totalEmployees} title={title} />
      </Col>
    </Row>
  )
}

export default Stats1
