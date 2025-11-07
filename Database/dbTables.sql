USE Clinicdb;

CREATE TABLE IF NOT EXISTS users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Admin','Doctor','Receptionist','Accountant','Lab','Radiologist') NOT NULL,
    linkedDoctorId INT DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -- FOREIGN KEY (linkedDoctorId) REFERENCES doctors(doctorId)
);

CREATE TABLE IF NOT EXISTS doctors (
    doctorId INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialty VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

ALTER TABLE Clinicdb.users
ADD CONSTRAINT fk_users_doctors
FOREIGN KEY (linkedDoctorId)
REFERENCES doctors(doctorId)
ON DELETE SET NULL
ON UPDATE CASCADE;


CREATE TABLE IF NOT EXISTS patients (
    patientId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    gender ENUM('Male','Female','Other'),
    dob DATE,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    address VARCHAR(255),
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS appointments (
    appointmentId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
    notes TEXT,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(patientId),
    FOREIGN KEY (doctorId) REFERENCES doctors(doctorId),
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS medicalRecords (
    recordId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    diagnosis TEXT,
    prescription TEXT,
    attachments JSON,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(patientId),
    FOREIGN KEY (doctorId) REFERENCES doctors(doctorId),
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS labsOrders (
    labOrderId INT AUTO_INCREMENT PRIMARY KEY,
    appointmentId INT NOT NULL,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    lab_name VARCHAR(100) NOT NULL,
    test_details TEXT,
    status ENUM('Ordered','Completed','Cancelled') DEFAULT 'Ordered',
    results JSON,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointmentId) REFERENCES appointments(appointmentId),
    FOREIGN KEY (patientId) REFERENCES patients(patientId),
    FOREIGN KEY (doctorId) REFERENCES doctors(doctorId),
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS medicationsOrders (
    medicationId INT AUTO_INCREMENT PRIMARY KEY,
    appointmentId INT NOT NULL,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    drug_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    notes TEXT,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointmentId) REFERENCES appointments(appointmentId),
    FOREIGN KEY (patientId) REFERENCES patients(patientId),
    FOREIGN KEY (doctorId) REFERENCES doctors(doctorId),
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS radiologyImages (
    imageId INT AUTO_INCREMENT PRIMARY KEY,
    appointmentId INT NOT NULL,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    imageType VARCHAR(50),
    description TEXT,
    file_path VARCHAR(255),
    status ENUM('Pending','Uploaded','Reviewed') DEFAULT 'Pending',
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointmentId) REFERENCES appointments(appointmentId),
    FOREIGN KEY (patientId) REFERENCES patients(patientId),
    FOREIGN KEY (doctorId) REFERENCES doctors(doctorId),
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS insuranceProviders (
    providerId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS patientInsurance (
    patientInsuranceId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    providerId INT NOT NULL,
    policy_number VARCHAR(50) NOT NULL,
    coverage_details TEXT,
    startDate DATE,
    endDate DATE,
    active BOOLEAN DEFAULT TRUE,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(patientId),
    FOREIGN KEY (providerId) REFERENCES insuranceProviders(providerId),
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);

CREATE TABLE IF NOT EXISTS bills (
    billId INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    appointmentId INT,
    amount DECIMAL(10,2) NOT NULL,
    insuranceCoveredAmount DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    taxPercentage DECIMAL(5,2) DEFAULT 0.00,
    totalAmount DECIMAL(10,2) GENERATED ALWAYS AS 
        ((amount - discount - insuranceCoveredAmount) * (1 + taxPercentage/100)) STORED,
    status ENUM('Pending','Paid','Cancelled') DEFAULT 'Pending',
    paymentDate DATETIME,
    createdBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES patients(patientId),
    FOREIGN KEY (appointmentId) REFERENCES appointments(appointmentId),
    FOREIGN KEY (createdBy) REFERENCES users(userId)
);
