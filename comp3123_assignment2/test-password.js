const bcrypt = require('bcryptjs');

// Test password hash verification
async function testPasswordHash() {
    const password = 'Admin123!';
    const hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3jp3/6B3H6';
    
    console.log('Testing password:', password);
    console.log('Against hash:', hash);
    
    try {
        const isValid = await bcrypt.compare(password, hash);
        console.log('Password valid:', isValid);
    } catch (error) {
        console.error('Error:', error);
    }
}

testPasswordHash();