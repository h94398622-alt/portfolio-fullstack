import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";

import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Contact() {
  // Contact Information State
  const [contactInfo, setContactInfo] = useState({
    id: 1,
    email: "",
    phone: "",
    location: "",
    github: "",
    linkedin: "",
    instagram: "",
    whatsapp: "",
  });

  // Admin Auth & Modal States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Admin Login Inputs State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Contact Info Edit Form State
  const [editFormData, setEditFormData] = useState({ ...contactInfo });

  // User Message Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Loading & Snackbar Notifications
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch Contact Info from Backend API on mount
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(
        // "http://127.0.0.1:8000/api/contact-info/",
        "https://portfolio-fullstack-ahz1.onrender.com/api/contact-info/",
      );
      if (response.data) {
        const dataToSet = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (dataToSet) {
          setContactInfo(dataToSet);
          setEditFormData(dataToSet);
        }
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();

    const ADMIN_USERNAME = "hiba_abdul";
    const ADMIN_PASSWORD = "hiba695027";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLockOpen(false);
      setIsAdminLoggedIn(true);
      setUsername("");
      setPassword("");
      setLoginError("");
      setSnackbar({
        open: true,
        message: "Admin logged in successfully!",
        severity: "success",
      });
    } else {
      setLoginError("Invalid Username or Password!");
    }
  };

  // Open Edit Dialog with current data
  const handleOpenEdit = () => {
    setEditFormData({ ...contactInfo });
    setIsEditOpen(true);
  };

  // Save Contact Info Changes (PUT or POST fallback if id doesn't exist)
  const handleSaveContactInfo = async () => {
    try {
      const contactId = contactInfo.id || 1;
      let response;

      try {
        response = await axios.put(
          // `http://127.0.0.1:8000/api/contact-info/${contactId}/`,

          `https://portfolio-fullstack-ahz1.onrender.com/api/contact-info/${contactId}/`,

          editFormData,
        );
      } catch (putError) {
        if (putError.response && putError.response.status === 404) {
          response = await axios.post(
            // `http://127.0.0.1:8000/api/contact-info/`,

            `https://portfolio-fullstack-ahz1.onrender.com/api/contact-info/`,

            editFormData,
          );
        } else {
          throw putError;
        }
      }

      if (response && (response.status === 200 || response.status === 201)) {
        setContactInfo(response.data);
        setEditFormData(response.data);
        setIsEditOpen(false);
        setSnackbar({
          open: true,
          message: "Contact details updated successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error updating contact info:", error);
      setSnackbar({
        open: true,
        message: "Failed to update contact details.",
        severity: "error",
      });
    }
  };

  // Input Change for User Message Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Input Change for Admin Edit Form
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Form Submit Handler for User Message
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        // "http://127.0.0.1:8000/api/contact/",

        "https://portfolio-fullstack-ahz1.onrender.com/api/contact/",

        formData,
      );

      if (response.status === 201 || response.status === 200) {
        setSnackbar({
          open: true,
          message: "Message sent successfully!",
          severity: "success",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbar({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      id="contact"
      sx={{
        py: 10,
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Lock Button & Edit Contact Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 2,
          }}
        >
          {isAdminLoggedIn && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleOpenEdit}
            >
              Edit Contact Info
            </Button>
          )}

          <IconButton
            color={isAdminLoggedIn ? "success" : "primary"}
            onClick={() => setIsLockOpen(true)}
            sx={{
              border: "1px solid",
              borderColor: isAdminLoggedIn ? "success.main" : "primary.main",
              borderRadius: 2,
              p: 1,
            }}
          >
            <LockIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Heading */}
        <Typography
          variant="h3"
          align="center"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          Contact Me
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{
            mb: 7,
            maxWidth: 700,
            mx: "auto",
          }}
        >
          If you have any questions or opportunities, you can contact me through
          the details below.
        </Typography>

        <Grid container spacing={5}>
          {/* LEFT */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight="bold">
                Let’s Connect
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.8,
                }}
              >
                I’m open to internship and full-time opportunities as a Full
                Stack Developer. Feel free to get in touch to discuss potential
                opportunities.
              </Typography>

              {/* EMAIL */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 5,
                  bgcolor: "background.paper",
                  transition: ".35s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 18px 35px rgba(59,130,246,.25)",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon
                    sx={{
                      color: "#EA4335",
                      fontSize: 38,
                    }}
                  />
                  <Box>
                    <Typography fontWeight="bold" fontSize={20}>
                      Email
                    </Typography>
                    <Typography color="text.secondary">
                      {contactInfo.email || "Not provided"}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* PHONE */}
              <Paper
                component="a"
                href={`tel:${contactInfo.phone ? contactInfo.phone.replace(/\s+/g, "") : ""}`}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 5,
                  bgcolor: "background.paper",
                  textDecoration: "none",
                  color: "inherit",
                  transition: ".35s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 18px 35px rgba(34,197,94,.25)",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <PhoneIcon
                    sx={{
                      color: "#22C55E",
                      fontSize: 38,
                    }}
                  />
                  <Box>
                    <Typography fontWeight="bold" fontSize={20}>
                      Phone
                    </Typography>
                    <Typography color="text.secondary">
                      {contactInfo.phone || "Not provided"}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* LOCATION */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 5,
                  bgcolor: "background.paper",
                  transition: ".35s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 18px 35px rgba(239,68,68,.25)",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <LocationOnIcon
                    sx={{
                      color: "#EF4444",
                      fontSize: 38,
                    }}
                  />
                  <Box>
                    <Typography fontWeight="bold" fontSize={20}>
                      Location
                    </Typography>
                    <Typography color="text.secondary">
                      {contactInfo.location || "Not provided"}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* SOCIAL */}
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                {contactInfo.github && (
                  <IconButton
                    href={contactInfo.github}
                    target="_blank"
                    sx={{
                      bgcolor: "#24292e",
                      color: "#fff",
                      width: 58,
                      height: 58,
                      transition: ".3s",
                      "&:hover": {
                        bgcolor: "#000",
                        transform: "translateY(-6px) scale(1.08)",
                      },
                    }}
                  >
                    <FaGithub size={28} />
                  </IconButton>
                )}

                {contactInfo.linkedin && (
                  <IconButton
                    href={contactInfo.linkedin}
                    target="_blank"
                    sx={{
                      bgcolor: "#0A66C2",
                      color: "#fff",
                      width: 58,
                      height: 58,
                      transition: ".3s",
                      "&:hover": {
                        bgcolor: "#004182",
                        transform: "translateY(-6px) scale(1.08)",
                      },
                    }}
                  >
                    <FaLinkedin size={28} />
                  </IconButton>
                )}

                {contactInfo.instagram && (
                  <IconButton
                    href={contactInfo.instagram}
                    target="_blank"
                    sx={{
                      background:
                        "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
                      color: "#fff",
                      width: 58,
                      height: 58,
                      transition: ".3s",
                      "&:hover": {
                        transform: "translateY(-6px) scale(1.08)",
                      },
                    }}
                  >
                    <FaInstagram size={28} />
                  </IconButton>
                )}

                {contactInfo.whatsapp && (
                  <IconButton
                    href={contactInfo.whatsapp}
                    target="_blank"
                    sx={{
                      bgcolor: "#25D366",
                      color: "#fff",
                      width: 58,
                      height: 58,
                      transition: ".3s",
                      "&:hover": {
                        bgcolor: "#1EBE5B",
                        transform: "translateY(-6px) scale(1.08)",
                      },
                    }}
                  >
                    <FaWhatsapp size={28} />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Grid>

          {/* RIGHT (FORM SECTION) */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              component="form"
              onSubmit={handleSubmit}
              elevation={0}
              sx={{
                p: 5,
                borderRadius: 5,
                bgcolor: "background.paper",
                transition: ".35s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(59,130,246,.25)",
                },
              }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  required
                  name="name"
                  label="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  required
                  type="email"
                  name="email"
                  label="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  required
                  name="subject"
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  name="message"
                  label="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.8,
                    fontWeight: "bold",
                    fontSize: 18,
                    borderRadius: 3,
                    textTransform: "none",
                    transition: ".3s",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/*ADMIN AUTH MODAL */}
      <Dialog
        open={isLockOpen}
        onClose={() => setIsLockOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Admin Access
        </DialogTitle>
        <form onSubmit={handleAdminLogin}>
          <DialogContent>
            <Stack spacing={2}>
              {loginError && (
                <Typography color="error" variant="body2" align="center">
                  {loginError}
                </Typography>
              )}
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button onClick={() => setIsLockOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Unlock
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/*  EDIT CONTACT INFO MODAL */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Edit Contact Information
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Email Address"
              name="email"
              fullWidth
              value={editFormData.email}
              onChange={handleEditChange}
            />
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              value={editFormData.phone}
              onChange={handleEditChange}
            />
            <TextField
              label="Location"
              name="location"
              fullWidth
              value={editFormData.location}
              onChange={handleEditChange}
            />
            <TextField
              label="GitHub Profile Link"
              name="github"
              fullWidth
              value={editFormData.github}
              onChange={handleEditChange}
            />
            <TextField
              label="LinkedIn Profile Link"
              name="linkedin"
              fullWidth
              value={editFormData.linkedin}
              onChange={handleEditChange}
            />
            <TextField
              label="Instagram Profile Link"
              name="instagram"
              fullWidth
              value={editFormData.instagram}
              onChange={handleEditChange}
            />
            <TextField
              label="WhatsApp Link"
              name="whatsapp"
              fullWidth
              value={editFormData.whatsapp}
              onChange={handleEditChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveContactInfo}
            variant="contained"
            color="success"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR NOTIFICATION */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Contact;
