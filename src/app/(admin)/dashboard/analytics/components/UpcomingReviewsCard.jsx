import { Card } from 'react-bootstrap'

export default function UpcomingReviewsCard({ reviews }) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header>
        <h5 className="mb-0">Upcoming Reviews (Next 7 Days)</h5>
      </Card.Header>
      <Card.Body>
        {reviews.length === 0 ? (
          <p className="text-muted mb-0">No upcoming reviews</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {reviews.map((review) => (
              <li key={review._id} className="mb-2">
                <strong>
                  {review.employeeId?.firstName} {review.employeeId?.lastName}
                </strong>{' '}
                <span className="text-muted">({review.employeeId?.officialDetails?.department})</span>
                <br />
                <small>
                  <span className="badge bg-warning text-dark me-1">{review.type}</span>
                  Ends on <span className="fw-semibold">{new Date(review.reviewEndDate).toLocaleDateString()}</span>
                </small>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  )
}
