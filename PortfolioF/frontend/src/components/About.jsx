import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import API from "../services/api";

function About() {
  const [data, setData] = useState({
    subtitle: "",
    bio: "",
    name: "",
    location: "",
    education: "",
    email: "",
    projects: "0+",
    technologies: "0+",
    experience: "0+",
    certificates: "0+",
  });

  // Modals visibility states
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Admin Login Inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Edit Form Inputs
  const [formData, setFormData] = useState(data);

  const fetchAboutData = async () => {
    try {
      const response = await API.get("about/");
      const aboutInfo = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      if (aboutInfo) {
        setData(aboutInfo);
        setFormData(aboutInfo);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === "hiba_abdul" && password === "hiba695027") {
      setIsLockOpen(false);
      setFormData(data);
      setIsEditOpen(true);
      setUsername("");
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Invalid Username or Password!");
    }
  };

  const handleSave = async () => {
    try {
      let response;
      try {
        response = await API.put("about/1/", formData);
      } catch (putError) {
        if (putError.response && putError.response.status === 404) {
          response = await API.post("about/", formData);
        } else {
          throw putError;
        }
      }

      if (response && (response.status === 200 || response.status === 201)) {
        setData(formData);
        setIsEditOpen(false);
        fetchAboutData();
        alert("About section updated successfully!");
      }
    } catch (error) {
      alert("Failed to update about data in database!");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const stats = [
    { title: "Projects", value: data.projects },
    { title: "Technologies", value: data.technologies },
    { title: "Experience", value: data.experience },
    { title: "Certificates", value: data.certificates },
  ];

  return (
    <Box id="about" sx={{ py: 12, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        {/* Top Edit Icon Button Only */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton
            color="primary"
            onClick={() => setIsLockOpen(true)}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: 2,
              p: 1,
            }}
          >
            <LockIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography
          variant="h3"
          align="center"
          color="primary.main"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          About Me
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 8 }}
        >
          {data.subtitle}
        </Typography>

        {/* 2-Column Layout */}
        <Grid container spacing={6} alignItems="center">
          {/* Left Side: Bio & Details */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
              Who am I?
            </Typography>

            <Typography color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
              {data.bio}
            </Typography>

            <Stack spacing={1.5}>
              <Typography>
                <strong>Name :</strong> {data.name}
              </Typography>
              <Typography>
                <strong>Location :</strong> {data.location}
              </Typography>
              <Typography>
                <strong>Education :</strong> {data.education}
              </Typography>
              <Typography>
                <strong>Email :</strong> {data.email}
              </Typography>
            </Stack>
          </Grid>

          {/* Right Side: 2x2 Grid Stats Cards */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Grid container spacing={3}>
              {stats.map((item) => (
                <Grid
                  size={{
                    xs: 6,
                  }}
                  key={item.title}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      py: 5,
                      px: 2,
                      textAlign: "center",
                      borderRadius: 8,
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <Typography
                      variant="h3"
                      color="primary.main"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {item.value}
                    </Typography>

                    <Typography color="text.secondary" variant="body2">
                      {item.title}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

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
                label="Admin Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Admin Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
            <Button onClick={() => setIsLockOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Unlock & Edit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ✏️ 2. EDIT DATA MODAL (AFTER UNLOCK) */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Update About Section
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Subtitle"
              name="subtitle"
              multiline
              rows={2}
              fullWidth
              value={formData.subtitle}
              onChange={handleChange}
            />
            <TextField
              label="Bio / Who am I"
              name="bio"
              multiline
              rows={4}
              fullWidth
              value={formData.bio}
              onChange={handleChange}
            />
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label="Location"
              name="location"
              fullWidth
              value={formData.location}
              onChange={handleChange}
            />
            <TextField
              label="Education"
              name="education"
              fullWidth
              value={formData.education}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
            />

            <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "bold" }}>
              Stats Cards:
            </Typography>
            <Grid container spacing={2}>
              <Grid
                size={{
                  xs: 6,
                }}
              >
                <TextField
                  label="Projects"
                  name="projects"
                  fullWidth
                  value={formData.projects}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                size={{
                  xs: 6,
                }}
              >
                <TextField
                  label="Technologies"
                  name="technologies"
                  fullWidth
                  value={formData.technologies}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                size={{
                  xs: 6,
                }}
              >
                <TextField
                  label="Experience"
                  name="experience"
                  fullWidth
                  value={formData.experience}
                  onChange={handleChange}
                />
              </Grid>
              <Grid
                size={{
                  xs: 6,
                }}
              >
                <TextField
                  label="Certificates"
                  name="certificates"
                  fullWidth
                  value={formData.certificates}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default About;
