const FormData = require('form-data');
const fetch = require('node-fetch');

async function testEmployeeCreation() {
  try {
    // Get token first
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@employee-system.com',
        password: 'Admin123!'
      })
    });
    
    const loginData = await loginResponse.json();
    const token = loginData.data.token;
    console.log('✅ Login successful');
    
    // Create FormData exactly like the frontend does
    const formData = new FormData();
    
    formData.append('firstName', 'John');
    formData.append('lastName', 'Doe');
    formData.append('email', `test.employee.${Date.now()}@example.com`);
    formData.append('phone', '1234567890');
    formData.append('department', 'Engineering');
    formData.append('position', 'Software Developer');
    formData.append('salary', '75000');
    formData.append('dateOfJoining', '2023-01-15');
    formData.append('address', JSON.stringify({
      street: '123 Test Street',
      city: 'Toronto',
      province: 'Ontario',
      postalCode: 'M5V 3A8'
    }));
    formData.append('emergencyContact', JSON.stringify({
      name: 'Emergency Contact',
      relationship: 'Friend',
      phone: '0987654321'
    }));
    
    console.log('📤 Sending employee creation request...');
    
    const response = await fetch('http://localhost:5000/api/employees', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ Employee created successfully!');
      console.log('Response:', responseData);
    } else {
      console.log('❌ Employee creation failed');
      console.log('Status:', response.status);
      console.log('Response:', responseData);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEmployeeCreation();