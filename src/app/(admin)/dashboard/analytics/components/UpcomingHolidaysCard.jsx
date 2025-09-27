import { Card } from 'react-bootstrap'

export default function UpcomingHolidaysCard({ holidays }) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Header>
        <h5 className="mb-0">Holidays This Month</h5>
      </Card.Header>
      <Card.Body>
        {holidays?.length === 0 ? (
          <p className="text-muted mb-0">No holidays this month</p>
        ) : (
          <ul className="list-unstyled mb-0">
            {holidays?.map((holiday) => (
              <li key={holiday._id} className="mb-2">
                <strong className="text-capitalize">{holiday.name}</strong>
                <br />
                <small>
                  {new Date(holiday.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  ({holiday.day})
                </small>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  )
}
