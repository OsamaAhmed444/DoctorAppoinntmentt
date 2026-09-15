import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import connectDB from "./config/db.js";
import User from "./models/UserSchema.js";
import Doctor from "./models/DoctorSchema.js";
import Departments from "./models/Departments.js";
import Appointment from "./models/AppointmentSchema.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    await Appointment.deleteMany({});
    await Doctor.deleteMany({});
    await Departments.deleteMany({});

    await User.deleteMany({
      email: {
        $in: [
          "admin@example.com",
          "user@example.com"
        ]
      }
    });

    const departments = await Departments.insertMany([
      {
        name: "Pediatrics",
        description:
          "Medical care and treatment for infants, children and adolescents.",
        image:
          "Gemini_Generated_Image_vmeyu4vmeyu4vmey.jpg"
      },
      {
        name: "Cardiology",
        description:
          "Specialized medical care for heart and cardiovascular conditions.",
        image:
          "Gemini_Generated_Image_thrm8fthrm8fthrm.jpg"
      },
      {
        name: "Ophthalmology",
        description:
          "Medical care and treatment for eye diseases, vision problems and other eye conditions.",
        image:
          "Gemini_Generated_Image_d2z0ed2z0ed2z0ed.jpg"
      },
      {
        name: "Surgery",
        description:
          "Specialized medical care involving surgical procedures for the treatment of injuries, diseases and conditions that require operative intervention.",
        image: "gg.jpg"
      },
      {
        name: "Internal Medicine",
        description:
          "Specialized medical care for the diagnosis, treatment and prevention of diseases affecting the internal organs and overall health.",
        image:
          "Gemini_Generated_Image_57zukd57zukd57zu (1).jpg"
      },
      {
        name: "Dermatology",
        description:
          "Medical diagnosis and treatment of skin, hair and nail conditions.",
        image:
          "Gemini_Generated_Image_87whxq87whxq87wh.jpg"
      }
    ]);

    const pediatrics = departments.find(
      (department) => department.name === "Pediatrics"
    );

    const cardiology = departments.find(
      (department) => department.name === "Cardiology"
    );

    const ophthalmology = departments.find(
      (department) => department.name === "Ophthalmology"
    );

    const surgery = departments.find(
      (department) => department.name === "Surgery"
    );

    const internalMedicine = departments.find(
      (department) => department.name === "Internal Medicine"
    );

    const dermatology = departments.find(
      (department) => department.name === "Dermatology"
    );

    const doctors = await Doctor.insertMany([
      {
        name: "Dr. Magdi Yacoub",
        department: cardiology._id,
        image: "19_2022-637943436110845149-84.jpg",
        description:
          "A world-renowned Egyptian-British cardiac surgeon and pioneer in heart surgery, known for his outstanding contributions to cardiovascular medicine and patient care.",
        experienceYears: 60
      },
      {
        name: "Dr. Diaa El-Awady",
        department: internalMedicine._id,
        image:
          "Gemini_Generated_Image_kab2jokab2jokab2-800x447.jpg",
        description:
          "Experienced physician providing comprehensive medical care, diagnosis and treatment with a focus on patient health and long-term follow-up.",
        experienceYears: 25
      },
      {
        name: "Dr. Ahmed Hassan",
        department: surgery._id,
        image:
          "16d879afda1770f45ac4e131f824d413-h_l.jpg",
        description:
          "Experienced surgeon specializing in the diagnosis and surgical treatment of a wide range of medical conditions.",
        experienceYears: 14
      },
      {
        name: "Dr. Mohamed Ali",
        department: cardiology._id,
        image:
          "19_2023-638302209285708818-570.jpg",
        description:
          "Cardiology specialist providing comprehensive heart care, cardiovascular diagnosis and regular patient follow-up.",
        experienceYears: 10
      },
      {
        name: "Dr. Sara Mohamed",
        department: pediatrics._id,
        image: "1-rotated.jpg",
        description:
          "Pediatrician specialized in child healthcare, diagnosis and treatment, with a focus on children's development and well-being.",
        experienceYears: 8
      },
      {
        name: "Dr. Omar Khaled",
        department: ophthalmology._id,
        image:
          "avatars-000016514252-eiw046-t500x500.jpg",
        description:
          "Ophthalmologist specialized in the diagnosis and treatment of eye diseases and vision-related conditions.",
        experienceYears: 11
      },
      {
        name: "Dr. Nour Ahmed",
        department: dermatology._id,
        image:
          "ea95d115-0e52-45e3-af47-0a70ea588e1b.jpg",
        description:
          "Dermatologist specialized in the diagnosis and treatment of skin, hair and nail conditions.",
        experienceYears: 7
      }
    ]);

    const magdiYacoub = doctors.find(
      (doctor) => doctor.name === "Dr. Magdi Yacoub"
    );

    const diaaElAwady = doctors.find(
      (doctor) => doctor.name === "Dr. Diaa El-Awady"
    );

    const ahmedHassan = doctors.find(
      (doctor) => doctor.name === "Dr. Ahmed Hassan"
    );

    const mohamedAli = doctors.find(
      (doctor) => doctor.name === "Dr. Mohamed Ali"
    );

    const saraMohamed = doctors.find(
      (doctor) => doctor.name === "Dr. Sara Mohamed"
    );

    const omarKhaled = doctors.find(
      (doctor) => doctor.name === "Dr. Omar Khaled"
    );

    const nourAhmed = doctors.find(
      (doctor) => doctor.name === "Dr. Nour Ahmed"
    );

    const adminPassword = await bcrypt.hash(
      "Admin123",
      10
    );

    const userPassword = await bcrypt.hash(
      "User123",
      10
    );

    const users = await User.insertMany([
      {
        name: "System Admin",
        email: "admin@example.com",
        password: adminPassword,
        role: "admin"
      },
      {
        name: "Test User",
        email: "user@example.com",
        password: userPassword,
        role: "user"
      }
    ]);

    const testUser = users.find(
      (user) => user.email === "user@example.com"
    );

    await Appointment.insertMany([
      {
        user: testUser._id,
        doctor: magdiYacoub._id,
        date: new Date("2026-09-18T10:00:00"),
        reason:
          "Regular cardiovascular check-up and follow-up."
      },
      {
        user: testUser._id,
        doctor: diaaElAwady._id,
        date: new Date("2026-09-20T11:30:00"),
        reason:
          "General medical consultation and health evaluation."
      },
      {
        user: testUser._id,
        doctor: ahmedHassan._id,
        date: new Date("2026-09-22T14:00:00"),
        reason:
          "Consultation regarding a condition requiring surgical evaluation."
      },
      {
        user: testUser._id,
        doctor: mohamedAli._id,
        date: new Date("2026-09-25T09:30:00"),
        reason:
          "Heart health consultation and routine cardiovascular examination."
      },
      {
        user: testUser._id,
        doctor: saraMohamed._id,
        date: new Date("2026-09-28T12:00:00"),
        reason:
          "Pediatric consultation and general health assessment."
      },
      {
        user: testUser._id,
        doctor: omarKhaled._id,
        date: new Date("2026-10-02T13:30:00"),
        reason:
          "Eye examination and vision-related consultation."
      },
      {
        user: testUser._id,
        doctor: nourAhmed._id,
        date: new Date("2026-10-05T15:00:00"),
        reason:
          "Dermatology consultation regarding a skin condition."
      }
    ]);

    console.log("Database seeded successfully");
    console.log(`Departments created: ${departments.length}`);
    console.log(`Doctors created: ${doctors.length}`);
    console.log("Demo users created: 2");
    console.log("Appointments created: 7");

    console.log("Admin:");
    console.log("Email: admin@example.com");
    console.log("Password: Admin123");

    console.log("User:");
    console.log("Email: user@example.com");
    console.log("Password: User123");

    console.log("Appointments:");
    console.log("7 test appointments created for Test User");

  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

seedDatabase();