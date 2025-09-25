import { Card } from 'react-bootstrap'

export default function WelcomeCard() {
  return (
    <>
      {/* Inline styles for the card */}
      <style>
        {`
          .welcome-card {
            background: linear-gradient(135deg, #0d6efd 0%, #4dabf7 100%);
            color: white;
            text-align: center;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .welcome-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
          }
          .welcome-img {
            width: 120px;
            margin-top: 20px;
            border-radius: 50%;
            border: 4px solid white;
            transition: transform 0.3s ease;
          }
          .welcome-img:hover {
            transform: scale(1.05) rotate(3deg);
          }
        `}
      </style>

      <Card className="welcome-card mb-4">
        <Card.Body>
          <h2 className="mb-3">Welcome Back!</h2>
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>
            We’re glad to have you on the team. Have a productive and amazing day!
          </p>
        </Card.Body>
      </Card>
    </>
  )
}
