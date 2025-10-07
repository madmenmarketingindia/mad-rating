import React, { useState } from 'react'
import { Modal, Button, Form, Badge } from 'react-bootstrap'

const ClosureModal = ({ emp }) => {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    resignationDate: '',
    lastWorkingDay: '',
    noticePeriodDays: 60,
    reasonForSeparation: '',
  })

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    // ✅ Here you can make your API call (e.g., axios.post('/api/closure', formData))
    handleClose()
  }

  return (
    <>
      {/* Trigger Button */}
      <td>
        <Badge bg="danger" className="cursor-pointer" style={{ fontSize: '14px', padding: '8px 12px' }} onClick={handleShow}>
          Initiate Closure
        </Badge>
      </td>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Initiate Closure for {emp?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Resignation Date</Form.Label>
              <Form.Control type="date" name="resignationDate" value={formData.resignationDate} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Working Day</Form.Label>
              <Form.Control type="date" name="lastWorkingDay" value={formData.lastWorkingDay} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notice Period Days</Form.Label>
              <Form.Control type="number" name="noticePeriodDays" value={formData.noticePeriodDays} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Separation</Form.Label>
              <Form.Select name="reasonForSeparation" value={formData.reasonForSeparation} onChange={handleChange}>
                <option value="">Select Reason</option>
                <option value="Resignation">Resignation</option>
                <option value="Termination">Termination</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ClosureModal
