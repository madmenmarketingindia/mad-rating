import { Card, Badge } from 'react-bootstrap'

export default function EmployeeDisciplinaryCard({ actions }) {
  if (!actions || actions.length === 0) return null

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header className="fw-bold text-danger">⚠️ Disciplinary Actions</Card.Header>
      <Card.Body>
        {actions.map((action) => (
          <div key={action._id} className="mb-2 border-bottom pb-2">
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <strong>Type:</strong> {action.type}
              </span>
              <Badge bg={action.status === 'Active' ? 'danger' : 'secondary'}>{action.status}</Badge>
            </div>
            <div>
              <strong>Reason:</strong> {action.reason}
            </div>
            {action.reviewPeriodDays > 0 && <small className="text-muted">Review Period: {action.reviewPeriodDays} days</small>}
            <div>
              <small className="text-muted">Date: {new Date(action.date).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  )
}
