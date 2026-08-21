import { useState, useEffect } from "react";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Stack,
  Divider,
  Alert,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CodeIcon from "@mui/icons-material/Code";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LockIcon from "@mui/icons-material/Lock";
import API from "../services/api";

function Skills() {
  const [skillsList, setSkillsList] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [openAuthModal, setOpenAuthModal] = useState(false);

  // Authentication Credentials

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [authError, setAuthError] = useState("");

  // New Skill Form State

  const [categoryName, setCategoryName] = useState("");

  const [skillName, setSkillName] = useState("");

  const [skillDesc, setSkillDesc] = useState("");

  const [skillLevel, setSkillLevel] = useState("Advanced");

  const [skillColor, setSkillColor] = useState("#3b82f6");

  const [iconUrl, setIconUrl] = useState("");

  const fetchSkills = async () => {
    try {
      const response = await API.get("skills/");

      const formattedData = formatSkillsData(response.data);

      setSkillsList(formattedData);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const formatSkillsData = (data) => {
    const categoriesMap = {};

    data.forEach((item) => {
      const cat = item.category || "Technical Skills";

      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }

      categoriesMap[cat].push({
        id: item.id,

        name: item.name,

        description: item.description || "Web development & technology",

        level: item.level || "Advanced",

        color: item.color || "#3b82f6",

        iconUrl: item.icon_url || "",
      });
    });

    return Object.keys(categoriesMap).map((cat) => ({
      category: cat,

      items: categoriesMap[cat],
    }));
  };

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

      const reader = new FileReader();

      reader.onloadend = () => {
        setIconUrl(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = async () => {
    if (!categoryName || !skillName) {
      alert("Please enter Category Name and Skill Name!");

      return;
    }

    const newSkillPayload = {
      name: skillName,

      category: categoryName,

      description: skillDesc,

      level: skillLevel,

      color: skillColor,

      icon_url: iconUrl,

      percentage: 90,
    };

    try {
      await API.post("skills-admin/", newSkillPayload);

      fetchSkills();

      setSkillName("");

      setCategoryName("");

      setSkillDesc("");

      setIconUrl("");

      alert("New Skill Added Successfully!");
    } catch (error) {
      alert("Failed to save skill to database!");

      console.error(error);
    }
  };

  const handleDeleteSkill = async (id, nameToDelete) => {
    if (window.confirm(`Delete ${nameToDelete}?`)) {
      try {
        await API.delete(`skills-admin/${id}/`);

        fetchSkills();
      } catch (error) {
        alert("Failed to delete skill!");

        console.error(error);
      }
    }
  };

  const renderSkillIcon = (skill) => {
    if (skill.iconUrl) {
      return (
        <Box
          component="img"
          src={skill.iconUrl}
          alt={skill.name}
          sx={{ width: 46, height: 46, objectFit: "contain" }}
        />
      );
    }

    return <CodeIcon sx={{ fontSize: 46, color: skill.color || "#3b82f6" }} />;
  };

  return (
    <Box
      id="skills"
      sx={{
        py: 10,

        bgcolor: "background.default",

        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Header with Circular Lock Icon Button */}

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
          My Skills
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
          Technologies and tools I’ve learned and worked with throughout my
          training.
        </Typography>

        {skillsList.map((category) => (
          <Box key={category.category} sx={{ mb: 8 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              sx={{ mb: 4 }}
            >
              {category.category}
            </Typography>

            <Grid container spacing={3}>
              {category.items.map((skill) => (
                <Grid
                  key={skill.id || skill.name}
                  size={{
                    xs: 12,

                    sm: 6,

                    md: 3,
                  }}
                >
                  <Card
                    sx={{
                      height: "100%",

                      borderRadius: 4,

                      bgcolor: "background.paper",

                      border: "1px solid rgba(255,255,255,0.08)",

                      transition: "0.35s ease",

                      "&:hover": {
                        transform: "translateY(-10px)",

                        border: `1px solid ${skill.color || "#3b82f6"}`,

                        boxShadow: `0 15px 35px ${skill.color || "#3b82f6"}40`,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 4,

                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 80,

                          height: 80,

                          borderRadius: "50%",

                          bgcolor: "rgba(255,255,255,0.04)",

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "center",

                          mx: "auto",

                          mb: 3,
                        }}
                      >
                        {renderSkillIcon(skill)}
                      </Box>

                      <Typography variant="h6" fontWeight="bold">
                        {skill.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1.5,

                          minHeight: 48,
                        }}
                      >
                        {skill.description}
                      </Typography>

                      <Chip
                        label={skill.level}
                        size="small"
                        sx={{
                          mt: 3,

                          px: 1,

                          fontWeight: 600,

                          bgcolor: skill.color || "#3b82f6",

                          color: "#fff",

                          borderRadius: "20px",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
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

      {/* EDIT MODAL */}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Manage Skills</DialogTitle>

        <DialogContent dividers>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Add New Skill
          </Typography>

          <Stack spacing={2} sx={{ mb: 4 }}>
            <TextField
              label="Category Name"
              placeholder="e.g. Backend Development"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <TextField
              label="Skill Name"
              placeholder="e.g. Python, React"
              fullWidth
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
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

                  "&:hover": {
                    borderStyle: "dashed",
                  },
                }}
              >
                {iconUrl ? "Change Icon Image" : "Upload Skill Icon Image"}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>

              {iconUrl && (
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
                    src={iconUrl}
                    alt="Preview"
                    sx={{ width: 36, height: 36, objectFit: "contain" }}
                  />

                  <Typography variant="caption" color="success.main">
                    Image uploaded successfully!
                  </Typography>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => setIconUrl("")}
                    sx={{ ml: "auto" }}
                  >
                    Remove
                  </Button>
                </Box>
              )}
            </Box>

            <TextField
              label="Description"
              placeholder="Short description"
              fullWidth
              multiline
              rows={2}
              value={skillDesc}
              onChange={(e) => setSkillDesc(e.target.value)}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Level"
                fullWidth
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
              >
                <MenuItem value="Beginner">Beginner</MenuItem>

                <MenuItem value="Intermediate">Intermediate</MenuItem>

                <MenuItem value="Advanced">Advanced</MenuItem>
              </TextField>

              <TextField
                label="Theme Color"
                type="color"
                sx={{ width: 140 }}
                value={skillColor}
                onChange={(e) => setSkillColor(e.target.value)}
              />
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddSkill}
              sx={{ width: 180 }}
            >
              Add Skill
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            Existing Skills
          </Typography>

          {skillsList.map((cat) => (
            <Box key={cat.category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {cat.category}
              </Typography>

              <Stack spacing={1} sx={{ mt: 1 }}>
                {cat.items.map((item) => (
                  <Box
                    key={item.id || item.name}
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
                      <Box sx={{ width: 30, height: 30 }}>
                        {renderSkillIcon(item)}
                      </Box>

                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {item.name} ({item.level})
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>

                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSkill(item.id, item.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Skills;
