import express from 'express';
import bodyParser from 'body-parser';
//import authRoutes from './routes/auth.js';
import doctorsRoutes from './routes/doctors.js';
import patientsRoutes from './routes/patients.js';
import appointmentsRoutes from './routes/appointments.js';
import medicalRecordsRoutes from './routes/medicalrecords.js';
import labsOrdersRoutes from './routes/labsorders.js';
import medicationsRoutes from './routes/medications.js';
import radiologyImagesRoutes from './routes/radiologyimages.js';
import insuranceProvidersRoutes from './routes/insuranceproviders.js';
import patientInsuranceRoutes from './routes/patientinsurance.js';
import billsRoutes from './routes/bills.js';
import usersRoutes from './routes/users.js';

const app = express();
app.use(bodyParser.json());

// Auth routes
//app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/doctors', doctorsRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/medicalrecords', medicalRecordsRoutes);
app.use('/api/labsorders', labsOrdersRoutes);
app.use('/api/medications', medicationsRoutes);
app.use('/api/radiologyimages', radiologyImagesRoutes);
app.use('/api/insuranceproviders', insuranceProvidersRoutes);
app.use('/api/patientinsurance', patientInsuranceRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));