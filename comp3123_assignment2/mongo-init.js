// MongoDB initialization script
print('Initializing MongoDB for Employee Management System...');

db = db.getSiblingDB('employee_management');

// Create collections
db.createCollection('users');
db.createCollection('employees');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.employees.createIndex({ "email": 1 }, { unique: true });
db.employees.createIndex({ "department": 1 });
db.employees.createIndex({ "position": 1 });
db.employees.createIndex({ "firstName": 1, "lastName": 1 });

// Insert a sample admin user
db.users.insertOne({
    name: "Admin User",
    email: "admin@employee-system.com",
    password: "$2a$12$.W8TGOi3J5TP1L/MumsZTOtQfDuXUaHIzBRbQ6VphtA4tztpuBeay", // password: Admin123!
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insert a sample regular user
db.users.insertOne({
    name: "John Manager",
    email: "john.manager@employee-system.com",
    password: "$2a$12$OuG63/Q27IW82A8V8Zjdoel5/rFwRLU/q.qKrVBbiK0YNj.gS/A52", // password: Manager123!
    role: "user",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insert demo employee (for testing)
db.employees.insertOne({
    firstName: "Demo",
    lastName: "Employee",
    email: "demo.employee@company.com",
    phone: "+1-555-0123",
    department: "Engineering",
    position: "Software Developer",
    salary: 75000,
    dateOfJoining: new Date("2023-01-15"),
    address: {
        street: "123 Main Street",
        city: "Toronto",
        province: "Ontario",
        postalCode: "M5V 3A8"
    },
    emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "+1-555-0124"
    },
    profilePicture: null,
    isActive: true,
    createdBy: ObjectId(),
    updatedBy: ObjectId(),
    createdAt: new Date(),
    updatedAt: new Date()
});

print('MongoDB initialization completed successfully!');