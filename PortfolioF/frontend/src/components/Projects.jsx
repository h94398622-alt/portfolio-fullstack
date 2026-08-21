import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LaunchIcon from "@mui/icons-material/Launch";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import API from "../services/api";

function Projects() {
  const [projectsList, setProjectsList] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  // Authentication States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // New Project Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [github, setGithub] = useState("");
  const [demo, setDemo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await API.get("projects/");
      const formatted = response.data.map((item) => {
        let rawImage = item.image || item.image_url || item.photo || "";
        let finalImageUrl = "";

        if (rawImage) {
          if (
            rawImage.startsWith("http://") ||
            rawImage.startsWith("https://")
          ) {
            finalImageUrl = rawImage;
          } else {
            const baseURL = API.defaults.baseURL
              ? API.defaults.baseURL.replace("/api/", "")
              : "http://127.0.0.1:8000";
            finalImageUrl =
              baseURL + (rawImage.startsWith("/") ? rawImage : "/" + rawImage);
          }
        }

        return {
          ...item,
          techStack:
            typeof (item.technologies || item.tech_stack) === "string"
              ? (item.technologies || item.tech_stack)
                  .split(",")
                  .map((t) => t.trim())
              : item.technologies || item.tech_stack || [],
          image: finalImageUrl,

          github: item.github_url || item.github || item.git_url || "",
          demo: item.live_url || item.demo || item.live_demo || "",
        };
      });
      setProjectsList(formatted);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenEdit = () => {
    setAuthError("");
    setUsername("");
    setPassword("");
    setOpenAuthModal(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "hiba_abdul" && password === "hiba695027") {
      setOpenAuthModal(false);
      setOpenModal(true);
      setAuthError("");
    } else {
      setAuthError("Invalid Username or Password!");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please select an image smaller than 2MB!");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async () => {
    if (!title || !description) {
      alert("Please fill in Title and Description!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("technologies", techStackInput);

    if (github) {
      formData.append("github_url", github);
      formData.append("github", github);
    }
    if (demo) {
      formData.append("live_url", demo);
      formData.append("demo", demo);
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await API.post("projects-admin/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchProjects();
      setTitle("");
      setDescription("");
      setTechStackInput("");
      setGithub("");
      setDemo("");
      setImageUrl("");
      setImageFile(null);
      alert("New Project Added Successfully!");
    } catch (error) {
      console.error("Django Error Response:", error.response?.data);
      const errorMsg = error.response?.data
        ? JSON.stringify(error.response.data)
        : "Failed to save project to database!";
      alert(errorMsg);
    }
  };

  const handleDeleteProject = async (id, projectTitle) => {
    if (window.confirm(`Delete project "${projectTitle}"?`)) {
      try {
        await API.delete(`projects-admin/${id}/`);
        fetchProjects();
      } catch (error) {
        alert("Failed to delete project!");
        console.error(error);
      }
    }
  };

  const handleOpenLink = (url) => {
    if (!url || url.trim() === "") {
      alert("Link is not available for this project!");
      return;
    }
    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      id="projects"
      sx={{
        py: 10,
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Lock Icon Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton
            onClick={handleOpenEdit}
            sx={{
              color: "#3b82f6",
              border: "1px solid #3b82f6",
              p: 1.2,
              "&:hover": {
                bgcolor: "rgba(59, 130, 246, 0.1)",
                border: "1px solid #3b82f6",
              },
            }}
          >
            <LockIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>

        {/* Section Title */}
        <Typography
          variant="h3"
          align="center"
          color="primary"
          fontWeight="bold"
          gutterBottom
        >
          My Projects
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 7, maxWidth: 700, mx: "auto" }}
        >
          Some of the projects I’ve built throughout my learning and development
          journey.
        </Typography>

        {/* Grid corrected with size prop for MUI */}
        <Grid container spacing={4}>
          {projectsList.map((project) => (
            <Grid
              key={project.id || project.title}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "0.35s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    border: "1px solid #3b82f6",
                    boxShadow: "0 15px 35px rgba(59, 130, 246, 0.2)",
                  },
                }}
              >
                {/* Project Image */}
                {project.image ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                    sx={{ objectFit: "cover", width: "100%" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                    }}
                  >
                    No Image Available
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {project.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, minHeight: 60 }}
                  >
                    {project.description}
                  </Typography>

                  {/* Tech Stack Chips Wrapped Correctly into Multiple Rows */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      overflow: "hidden",
                    }}
                  >
                    {project.techStack?.map((tech, index) => (
                      <Chip
                        key={index}
                        label={tech}
                        size="small"
                        sx={{
                          bgcolor: "rgba(59, 130, 246, 0.1)",
                          color: "#3b82f6",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>

                {/* GitHub & Demo Buttons */}
                <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<GitHubIcon />}
                    onClick={() => handleOpenLink(project.github)}
                    variant="contained"
                    sx={{
                      flex: 1,
                      bgcolor: "#3b82f6",
                      "&:hover": { bgcolor: "#2563eb" },
                    }}
                  >
                    GitHub
                  </Button>
                  <Button
                    size="small"
                    startIcon={<LaunchIcon />}
                    onClick={() => handleOpenLink(project.demo)}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      borderColor: "rgba(255,255,255,0.23)",
                      color: "text.primary",
                    }}
                  >
                    Demo
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* AUTHENTICATION MODAL */}
      <Dialog
        open={openAuthModal}
        onClose={() => setOpenAuthModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={handleLogin}>
          <DialogTitle
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <LockIcon color="primary" /> Admin Access
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {authError && <Alert severity="error">{authError}</Alert>}
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
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenAuthModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Login
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* MANAGE PROJECTS MODAL */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Manage Projects</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Add New Project
          </Typography>
          <Stack spacing={2} sx={{ mb: 4 }}>
            <TextField
              label="Project Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Tech Stack (Comma separated)"
              placeholder="React, Material UI, Python, FastAPI"
              fullWidth
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
            />
            <TextField
              label="GitHub URL"
              fullWidth
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
            <TextField
              label="Live Demo URL"
              fullWidth
              value={demo}
              onChange={(e) => setDemo(e.target.value)}
            />

            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderStyle: "dashed",
                  color: "text.primary",
                  borderColor: "rgba(255, 255, 255, 0.23)",
                }}
              >
                {imageUrl
                  ? "Change Project Image"
                  : "Upload Project Banner Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {imageUrl && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 1.5,
                    p: 1,
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={imageUrl}
                    alt="Preview"
                    sx={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                  <Typography variant="caption" color="success.main">
                    Image uploaded successfully!
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      setImageUrl("");
                      setImageFile(null);
                    }}
                    sx={{ ml: "auto" }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddProject}
              sx={{ width: 180 }}
            >
              Add Project
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Existing Projects
          </Typography>

          <Stack spacing={1}>
            {projectsList.map((item) => (
              <Box
                key={item.id || item.title}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  bgcolor: "rgba(255,255,255,0.03)",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.title}
                    sx={{
                      width: 50,
                      height: 35,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.techStack?.join(", ")}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteProject(item.id, item.title)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Projects;
