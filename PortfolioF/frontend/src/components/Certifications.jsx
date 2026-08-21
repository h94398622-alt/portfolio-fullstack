import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";

import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

//  ADMIN CREDENTIALS
const ADMIN_USERNAME = "hiba_abdul";
const ADMIN_PASSWORD = "hiba695027";

const API_URL = "http://127.0.0.1:8000/api/certifications/";

function Certifications() {
  const [certificationsList, setCertificationsList] = useState([]);

  // Modal Visibility States
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
    title: "",
    organization: "",
    year: "",
  });

  //  Fetch Certifications from Django Backend on Load
  const fetchCertifications = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCertificationsList(data);
    } catch (error) {
      console.error("Error fetching certifications:", error);
    }
  };

  useEffect(() => {
    fetchCertifications();
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

  // Input Field Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open Form Modal for Adding
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      organization: "",
      year: "",
    });
    setIsFormOpen(true);
  };

  // Open Form Modal for Editing
  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      organization: item.organization,
      year: item.year,
    });
    setIsFormOpen(true);
  };

  //  Save Certification (POST for Add, PUT for Edit) to Backend
  const handleSave = async () => {
    try {
      if (editingId !== null) {
        await fetch(`${API_URL}${editingId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      setIsFormOpen(false);
      fetchCertifications();
    } catch (error) {
      console.error("Error saving certification:", error);
    }
  };

  //  Delete Certification (DELETE) from Backend
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      try {
        await fetch(`${API_URL}${id}/`, {
          method: "DELETE",
        });
        fetchCertifications();
      } catch (error) {
        console.error("Error deleting certification:", error);
      }
    }
  };

  return (
    <Box
      id="certifications"
      sx={{
        py: 10,
        bgcolor: "background.paper",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Admin Controls */}
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
              Add Certification
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
          Certifications
        </Typography>

        <Typography align="center" color="text.secondary" sx={{ mb: 6 }}>
          Certificates that represent my learning and growth in Full Stack
          Development.
        </Typography>

        <Grid container spacing={4} sx={{ justifyContent: "center" }}>
          {certificationsList.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No certifications added yet. Click the lock icon to login as
                admin and add new certifications.
              </Typography>
            </Grid>
          ) : (
            certificationsList.map((item) => (
              <Grid
                item
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: "60px",
                    textAlign: "center",
                    width: "830px",
                    height: "270px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: ".3s",
                    position: "relative",
                    boxShadow: 3,
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Admin Action Buttons */}
                  {isAdminLoggedIn && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        zIndex: 10,
                        display: "flex",
                        gap: 0.5,
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

                  <CardContent
                    sx={{
                      p: "0 !important",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <WorkspacePremiumIcon
                      color="primary"
                      sx={{
                        fontSize: 55,
                        mb: 2,
                      }}
                    />

                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {item.title}
                    </Typography>

                    <Typography color="text.secondary">
                      {item.organization}
                    </Typography>

                    <Typography color="primary" sx={{ mt: 2 }} fontWeight={600}>
                      {item.year}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
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

      {/* ADD / EDIT CERTIFICATION MODAL */}
      <Dialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingId ? "Edit Certification" : "Add Certification"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Certification Title"
              name="title"
              fullWidth
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              label="Organization (e.g. Udemy, Coursera)"
              name="organization"
              fullWidth
              value={formData.organization}
              onChange={handleChange}
            />
            <TextField
              label="Year (e.g. 2025)"
              name="year"
              fullWidth
              value={formData.year}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsFormOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            {editingId ? "Save Changes" : "Add Certification"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Certifications;
