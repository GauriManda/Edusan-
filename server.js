import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import pg from "pg";
import cors from "cors";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(bodyParser.json()); // Parse JSON payloads
app.use(cors()); // Allow cross-origin requests

// Set the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Explicitly set the views folder

// PostgreSQL Database Connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Edusan",
  password: "Database$123",
  port: 5432,
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Database connection error:", err.stack));

// Function to save a member
async function saveMember(data) {
  const query = `
      INSERT INTO members (full_name, email, phone_number, address, occupation, reason, membership_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
  `;
  const values = [
    data.full_name,
    data.email,
    data.phone_number,
    data.address,
    data.occupation,
    data.reason,
    data.membership_type,
  ];

  try {
    const res = await db.query(query, values);
    console.log("Inserted:", res.rows[0]);
    return res.rows[0];
  } catch (err) {
    console.error("Error inserting data:", err.stack);
    throw err; // Re-throw error for further handling
  }
}

// Routes
app.get("/", (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.get("/membership", (req, res) => {
  res.render("membership");
});

// Handle form submission
app.post("/submit-membership", async (req, res) => {
  const formData = req.body; // Capture form data
  console.log("Membership Form Data:", formData);

  try {
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.address ||
      !formData.occupation ||
      !formData.membership_type
    ) {
      return res.status(400).send("All fields are required.");
    }

    const member = await saveMember(formData); // Save data to the database
    res.json({ message: "Membership form submitted successfully!", member });
  } catch (err) {
    console.error("Error saving membership data:", err);
    res.status(500).send("Failed to submit membership form.");
  }
});

app.get("/donation", (req, res) => {
  res.render("donation");
});
app.post("/submit-donation", async (req, res) => {
  const { full_name, email, phone_number, adharnumber, pannumber, amount } =
    req.body;

  console.log("Donation Form Data:", req.body); // Debug: Log incoming data

  // Validate required fields
  if (
    !full_name ||
    !email ||
    !phone_number ||
    !adharnumber ||
    !pannumber ||
    !amount
  ) {
    return res.status(400).send("All fields are required.");
  }

  // Save the donation data to the database
  const query = `
    INSERT INTO donations (full_name, email, phone_number, adharnumber, pannumber, amount)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [
    full_name,
    email,
    phone_number,
    adharnumber,
    pannumber,
    amount,
  ];

  try {
    const result = await db.query(query, values);
    console.log("Donation Saved:", result.rows[0]);
    res.json({
      message: "Donation submitted successfully!",
      donation: result.rows[0],
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Failed to save donation.");
  }
});
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/submit-contact", async (req, res) => {
  const { name, email, phone, address, date, timeSlot, message } = req.body;

  // Validate the fields
  if (!name || !email || !phone || !address || !date || !timeSlot) {
    return res.status(400).send("All fields are required.");
  }

  // Save the contact data to the database
  const query = `
    INSERT INTO contacts (name, email, phone, address, preferred_date, preferred_time_slot, message)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [name, email, phone, address, date, timeSlot, message];

  try {
    const result = await db.query(query, values);
    console.log("Contact Saved:", result.rows[0]);
    res.json({
      message: "Contact form submitted successfully!",
      contact: result.rows[0],
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Failed to save contact information.");
  }
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/department", (req, res) => {
  res.render("department");
});
app.get("/awards", (req, res) => {
  res.render("awards");
});
app.get("/testimonials", (req, res) => {
  res.render("testimonials");
});
app.get("/education", (req, res) => {
  res.render("education");
});
app.get("/explore", (req, res) => {
  res.render("explore");
});
app.get("/health", (req, res) => {
  res.render("health");
});
app.get("/youth", (req, res) => {
  res.render("youth");
});
app.get("/skill", (req, res) => {
  res.render("skill");
});
app.get("/internship", (req, res) => {
  res.render("internship");
});
app.get("/scholarship", (req, res) => {
  res.render("scholarship");
});
app.get("/social", (req, res) => {
  res.render("social");
});
app.get("/photos", (req, res) => {
  res.render("photos");
});
app.get("/media", (req, res) => {
  res.render("media");
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
