import React, { Component } from 'react';
import axios from 'axios';
import { ListGroup, Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

class PersonList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    try {
      this.setState({ loading: true, error: null });
      const response = await axios.get('https://randomuser.me/api/?results=10');
      this.setState({ 
        users: response.data.results, 
        loading: false 
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      this.setState({ 
        error: 'Failed to fetch users. Please try again later.', 
        loading: false 
      });
    }
  };

  render() {
    const { users, loading, error } = this.state;

    if (loading) {
      return (
        <Container className="text-center mt-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading users...</p>
        </Container>
      );
    }

    if (error) {
      return (
        <Container className="mt-5">
          <Alert variant="danger">
            {error}
          </Alert>
        </Container>
      );
    }

    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header as="h2" className="text-center bg-primary text-white">
                Random Users List
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {users.map((user, index) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center">
                      <img
                        src={user.picture.thumbnail}
                        alt={`${user.name.first} ${user.name.last}`}
                        className="rounded-circle me-3"
                        width="50"
                        height="50"
                      />
                      <div>
                        <h6 className="mb-1">
                          {user.name.title} {user.name.first} {user.name.last}
                        </h6>
                        <small className="text-muted">
                          {user.email}
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PersonList;