import { Row, Col, Breadcrumb } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'

export default function PageHeader({ title, breadcrumbItems = [], rightContent }) {
  return (
    <div className="mb-1">
      <Row className="align-items-center g-2">
        {/* Title */}
        <Col xs={12} md={6} className="order-1 order-md-1">
          <h4 className="mb-0">{title}</h4>
        </Col>

        {/* Right content (filters/buttons) */}
        {rightContent && (
          <Col xs={12} md={6} className="d-flex flex-wrap gap-2 justify-content-md-end order-3 order-md-2">
            {rightContent}
          </Col>
        )}

        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <Col xs={12} className="order-2 order-md-3">
            <Breadcrumb className="flex-wrap mb-0 d-flex align-items-center">
              {breadcrumbItems.map((item, idx) => (
                <span key={idx} className="d-flex align-items-center">
                  <Breadcrumb.Item active={idx === breadcrumbItems.length - 1} href={item.href || '#'}>
                    {item.label}
                  </Breadcrumb.Item>
                  {idx !== breadcrumbItems.length - 1 && <IconifyIcon icon="mdi:chevron-right" width={16} height={16} className="mx-1 text-muted" />}
                </span>
              ))}
            </Breadcrumb>
          </Col>
        )}
      </Row>
    </div>
  )
}
