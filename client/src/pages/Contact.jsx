import { Container, Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { Person, Envelope } from "react-bootstrap-icons"; // icons import
import "./Contact.css";
import Footer from "../components/Footer";

export const Contact = () => {
  return (
    <>
    <section className="contact-section py-5">
      <Container>
        <Row className="align-items-center">
          {/* Left Side Image */}
          <Col md={6} className="d-none d-md-block">
            <div className="contact-image">
              <img
                src="/Images/registeration.jpg"
                alt="contact us"
                className="img-fluid rounded shadow"
              />
            </div>
          </Col>

          {/* Right Side Form */}
          <Col md={6}>
            <Card className="contact-card p-4 shadow">
              <h2 className="text-center mb-4">Send Us a Message</h2>
              <Form>
                {/* User Name */}
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>User Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Person />
                    </InputGroup.Text>
                    <Form.Control type="text" placeholder="Enter your name" />
                  </InputGroup>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Envelope />
                    </InputGroup.Text>
                    <Form.Control type="email" placeholder="Enter your email" />
                  </InputGroup>
                </Form.Group>

                {/* Message */}
                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Write your message..."
                  />
                </Form.Group>

                {/* Button - Left aligned */}
                <div className="text-start">
                  <Button variant="primary" type="submit" className="send-btn">
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
     {/* Footer */}
      <Footer />
    </>
  );
};

export default Contact;
