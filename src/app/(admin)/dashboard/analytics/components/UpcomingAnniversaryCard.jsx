import React from 'react'
import { Card } from 'react-bootstrap'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

const UpcomingAnniversaryCard = ({ anniversaries }) => {
  return (
    <Card className="shadow-sm mb-3 h-100">
      <Card.Header>
        <h5 className="card-title">Upcoming Work Anniversaries</h5>
      </Card.Header>
      <Card.Body>
        <SimpleBar style={{ maxHeight: 310 }}>
          {anniversaries?.length > 0 ? (
            anniversaries?.map((user, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center justify-content-between mb-3 p-2 border-bottom rounded"
                style={{ background: '#f9f9f9' }}>
                <div>
                  <strong className="text-capitalize">{user?.name}</strong>
                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {user?.designation}
                  </div>
                </div>
                <div className="text-end">
                  <div>
                    <span className="badge bg-info text-dark p-2">{user?.joiningDate}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-3">No upcoming anniversaries</div>
          )}
        </SimpleBar>
      </Card.Body>
    </Card>
  )
}

export default UpcomingAnniversaryCard
