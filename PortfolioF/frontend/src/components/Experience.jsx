import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import API from "../services/api";

//  ADMIN CREDENTIALS
const ADMIN_USERNAME = "hiba_abdul";
const ADMIN_PASSWORD = "hiba695027";

function Experience() {
  const [experienceList, setExperienceList] = useState([]);

  // Modals visibility states
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Admin Auth States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Form State for Add / Edit
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
    image: "",
    technologies: "",
  });

  const [imageFileName, setImageFileName] = useState("");

  const fetchExperiences = async () => {
    try {
      const response = await API.get("experience/");
      setExperienceList(response.data);
    } catch (error) {
      console.error("Error fetching experience data:", error);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Admin Login Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLockOpen(false);
      setIsAdminLoggedIn(true);
      setUsername("");
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Invalid Username or Password!");
    }
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image Upload Handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Form Modal for Adding
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      role: "",
      company: "",
      duration: "",
      description: "",
      image: "",
      technologies: "",
    });
    setImageFileName("");
    setIsFormOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      role: item.role,
      company: item.company,
      duration: item.duration,
      description: item.description,
      image: item.image || "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(", ")
        : item.technologies || "",
    });
    setImageFileName("");
    setIsFormOpen(true);
  };

  // Save Experience
  const handleSave = async () => {
    const techArray =
      typeof formData.technologies === "string"
        ? formData.technologies
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech !== "")
        : formData.technologies;

    const payload = {
      ...formData,
      technologies: techArray,
    };

    try {
      if (editingId !== null) {
        // Edit / Update API call
        await API.put(`experience/${editingId}/`, payload);
      } else {
        // Add / Create API call
        await API.post("experience/", payload);
      }
      setIsFormOpen(false);
      fetchExperiences();
    } catch (error) {
      console.error("Error saving experience:", error);
    }
  };

  // Delete Experience Item via Django API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await API.delete(`experience/${id}/`);
        fetchExperiences();
      } catch (error) {
        console.error("Error deleting experience:", error);
      }
    }
  };

  return (
    <Box
      id="experience"
      sx={{
        py: 10,
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Lock Button & Add Experience Button */}
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
              startIcon={<AddIcon />}
              onClick={handleOpenAdd}
            >
              Add Experience
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

        <Typography
          variant="h3"
          align="center"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          Experience
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
          A glimpse into my internship experience and practical learning journey
          in full-stack web development.
        </Typography>

        <Grid container spacing={4}>
          {experienceList.map((item) => (
            <Grid key={item.id} size={{ xs: 12 }}>
              <Card
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 5,
                  overflow: "hidden",
                  transition: "0.35s",
                  border: "1px solid rgba(255,255,255,0.08)",
                  position: "relative",

                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 45px rgba(59,130,246,.25)",
                  },
                }}
              >
                {/* Admin Action Buttons (Edit & Delete) */}
                {isAdminLoggedIn && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 15,
                      right: 15,
                      zIndex: 10,
                      display: "flex",
                      gap: 1,
                      bgcolor: "rgba(0,0,0,0.6)",
                      p: 0.5,
                      borderRadius: 2,
                    }}
                  >
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4} alignItems="center">
                    {/* Left Image */}
                    <Grid size={{ xs: 12, md: 3 }}>
                      <Box
                        component="img"
                        src={
                          item.image ||
                          "https://via.placeholder.com/220?text=No+Image"
                        }
                        alt={item.role}
                        sx={{
                          width: "100%",
                          maxWidth: 220,
                          height: 220,
                          borderRadius: 4,
                          objectFit: "cover",
                          display: "block",
                          mx: "auto",
                          border: "3px solid",
                          borderColor: "primary.main",
                        }}
                      />
                    </Grid>

                    {/* Right Content */}
                    <Grid size={{ xs: 12, md: 9 }}>
                      <Typography variant="h4" fontWeight="bold">
                        {item.role}
                      </Typography>

                      <Typography
                        color="primary"
                        fontWeight={600}
                        sx={{ mt: 1, fontSize: "1.1rem" }}
                      >
                        {item.duration} • {item.company}
                      </Typography>

                      <Typography color="text.secondary" sx={{ mt: 2 }}>
                        {item.description}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mt: 3 }}
                      >
                        {item.technologies &&
                          (Array.isArray(item.technologies)
                            ? item.technologies
                            : typeof item.technologies === "string"
                              ? item.technologies.split(",")
                              : []
                          ).map((tech) => (
                            <Chip
                              key={tech.trim()}
                              label={tech.trim()}
                              color="primary"
                              variant="outlined"
                              sx={{ borderRadius: 10, fontWeight: 600 }}
                            />
                          ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/*  ADMIN AUTH MODAL */}
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

      {/* ✏️ 2. ADD / EDIT EXPERIENCE MODAL */}
      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingId ? "Edit Experience" : "Add New Experience"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Role / Title"
              name="role"
              fullWidth
              value={formData.role}
              onChange={handleChange}
            />
            <TextField
              label="Company Name"
              name="company"
              fullWidth
              value={formData.company}
              onChange={handleChange}
            />
            <TextField
              label="Duration (e.g. Aug 2025 - Apr 2026)"
              name="duration"
              fullWidth
              value={formData.duration}
              onChange={handleChange}
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />
            <TextField
              label="Technologies (Comma Separated e.g. React, Python, Django)"
              name="technologies"
              fullWidth
              value={formData.technologies}
              onChange={handleChange}
            />

            {/* Image Upload Box */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Company Logo / Experience Image:
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {/* Attached Image Preview */}
              {formData.image && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: 1.5,
                    p: 1.5,
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 2,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Avatar
                    src={formData.image}
                    alt="Preview"
                    variant="rounded"
                    sx={{ width: 45, height: 45 }}
                  />
                  <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      noWrap
                      color="text.primary"
                    >
                      {imageFileName || "Selected Image"}
                    </Typography>
                    <Chip
                      icon={<CheckCircleIcon style={{ fontSize: 14 }} />}
                      label="Attached"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ height: 20, fontSize: 10, mt: 0.5 }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      setFormData({ ...formData, image: "" });
                      setImageFileName("");
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            {editingId ? "Save Changes" : "Add Experience"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Experience;
