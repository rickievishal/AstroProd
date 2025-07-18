const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/Users');
const Booking = require('./models/Bookings');
const Admin = require('./models/Admin');
const mongoose = require('mongoose');
const Razorpay = require('razorpay');
const Users = require('./models/Users');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

// Create User
app.post('/api/users', async (req, res) => {
  console.log(req.body)
  try {
    const ex_user = await Users.find({email : req.body.email});
     console.log(ex_user)
    if(ex_user){
      console.log(ex_user)
      res.status(200).json(ex_user)
    }
    else{
      const user = await User.create(req.body);
      console.log(user)
      res.status(201).json(user);
    }
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get Single User By Id
app.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ error: 'User not found' });
});

// Update User By Id
app.put('/api/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// Delete User
app.delete('/api/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Create Booking
app.post('/api/bookings', async (req, res) => {
  try {
    console.log(req.body)
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message });
  }
});

// Get All Bookings
app.get('/api/bookings', async (req, res) => {
  console.log(req.body)
  const bookings = await Booking.find();
  res.json(bookings);
});

// Get Single Booking By Id
app.get('/api/bookings/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (booking) res.json(booking);
  else res.status(404).json({ error: 'Booking not found' });
});

// Update Booking By Id
app.put('/api/bookings/:id', async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(booking);
});

// Delete Booking
app.delete('/api/bookings/:id', async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: 'Booking deleted' });
});

// Create Admin
app.post('/api/admins', async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Admins
app.get('/api/admins', async (req, res) => {
  const admins = await Admin.find().populate('bookings');
  res.json(admins);
});

// Get Admin By Id
app.get('/api/admins/:id', async (req, res) => {
  const admin = await Admin.findById(req.params.id).populate('bookings');
  if (admin) res.json(admin);
  else res.status(404).json({ error: 'Admin not found' });
});

// Update Admin
app.put('/api/admins/:id', async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(admin);
});

// Delete Admin
app.delete('/api/admins/:id', async (req, res) => {
  await Admin.findByIdAndDelete(req.params.id);
  res.json({ message: 'Admin deleted' });
});

app.get("/",(req,res) => {
  res.send("hello")
})

const razorpay = new Razorpay({
  key_id: process.env.RAZOR_KEY,
  key_secret: process.env.RAZOR_SECRET,
});
app.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  console.log(amount)
  // const formatedFormData = {
  //   booking_id: formData.bookingId, 
  //   name: formData.name,
  //   email: userInfo.email,
  //   appointment_type: formData.appointmentType,
  //   whatsapp_number: formData.phone,
  //   city: formData.city,
  //   date: formData.pickedDate,
  //   time_slot: formData.timeSlot,
  //   payment_status: formData.paymentStatus 
  // };

  // console.log(formatedFormData, userInfo);

  const options = {
    amount: amount,
    currency: "INR",
    receipt: "order_rcptid_11"
  };

  try {
    // const booking = await Booking.create(formatedFormData);

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating booking or order:", err); // ✅ Debug
    res.status(500).send("Error creating order");
  }
});

app.post("/api/timeBlock",(req,res) => {
  try{

  }
  catch(err) {
    
  }
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
