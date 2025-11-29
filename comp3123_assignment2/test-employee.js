const axios = require('axios');

async function testEmployeeCreation() {
  try {
    // Get token first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@employee-system.com',
      password: 'Admin123!'
    });
    
    const token = loginResponse.data.data.token;
    console.log('Login successful, token received');
    
    // Create FormData
    const FormData = require('form-data');
    const formData = new FormData();
    
    formData.append('firstName', 'John');
    formData.append('lastName', 'Doe');
    formData.append('email', 'john.doe@test.com');
    formData.append('phone', '1234567890');
    formData.append('department', 'Engineering');
    formData.append('position', 'Developer');
    formData.append('salary', '75000');
    formData.append('dateOfJoining', '2023-01-15');
    formData.append('address', JSON.stringify({
      street: '123 Main St',
      city: 'Toronto', 
      province: 'Ontario',
      postalCode: 'M5V 3A8'
    }));
    formData.append('emergencyContact', JSON.stringify({
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '0987654321'
    }));
    
    const response = await axios.post('http://localhost:5000/api/employees', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    });
    
    console.log('Employee created successfully:', response.data);
  } catch (error) {
    console.error('Error details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Data:', error.response?.data);
  }
}

testEmployeeCreation();
