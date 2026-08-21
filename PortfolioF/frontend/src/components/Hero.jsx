import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { TypeAnimation } from "react-type-animation";
import API from "../services/api";

// Default Initial Data
const initialHeroData = {
  greeting: "👋 Hello..., I'm",
  name: "Fathima Hiba",
  description:
    "Passionate Full Stack Developer specializing in React.js and Python. I build responsive, modern and user-friendly web applications with clean UI, scalable backend architecture and high performance.",
  profileImg: "/profile.png",
  resumeUrl: "/resume.pdf",
};

//  ADMIN CREDENTIALS
const ADMIN_USERNAME = "hiba_abdul";
const ADMIN_PASSWORD = "hiba695027";

function Hero() {
  const [heroData, setHeroData] = useState(initialHeroData);

  // Modal Visibility States
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Admin Auth Inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Form State
  const [formData, setFormData] = useState(initialHeroData);

  // Raw Files for Backend FormData
  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  // File Names Preview State
  const [profileFileName, setProfileFileName] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");

  // Fetch Hero Data from Django Backend on Mount & Polling/Sync
  useEffect(() => {
    fetchHeroData();

    const handleStorageChange = (e) => {
      if (e.key === "portfolio_hero_data" && e.newValue) {
        try {
          const parsedData = JSON.parse(e.newValue);
          setHeroData(parsedData);
          setFormData(parsedData);
        } catch (err) {
          console.error("Error parsing storage data:", err);
        }
      }
    };

    const handleCustomUpdate = () => {
      fetchHeroData();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("hero_data_updated", handleCustomUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("hero_data_updated", handleCustomUpdate);
    };
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await API.get("hero/");
      if (response.data) {
        const data = Array.isArray(response.data)
          ? response.data[response.data.length - 1]
          : response.data;
        if (data && (data.name || data.greeting)) {
          setHeroData(data);
          setFormData(data);
          localStorage.setItem("portfolio_hero_data", JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error("Error fetching hero data from backend:", error);
      const saved = localStorage.getItem("portfolio_hero_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        setHeroData(parsed);
        setFormData(parsed);
      }
    }
  };

  // Contact Scroll Functionality
  const handleContactClick = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Admin Login Handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLockOpen(false);
      setFormData(heroData);
      setIsEditOpen(true);
      setUsername("");
      setPassword("");
      setLoginError("");
    } else {
      setLoginError("Invalid Username or Password!");
    }
  };

  // Save Data permanently (Backend Sync + Local Storage)
  const handleSave = async () => {
    try {
      const dataToSend = new FormData();
      dataToSend.append("greeting", formData.greeting);
      dataToSend.append("name", formData.name);
      dataToSend.append("description", formData.description);

      if (profileFile) {
        dataToSend.append("profileImg", profileFile);
      }
      if (resumeFile) {
        dataToSend.append("resumeUrl", resumeFile);
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let response;
      if (heroData && heroData.id) {
        response = await API.put(`hero/${heroData.id}/`, dataToSend, config);
      } else {
        const listRes = await API.get("hero/");
        const existingData = Array.isArray(listRes.data)
          ? listRes.data[0]
          : listRes.data;

        if (existingData && existingData.id) {
          response = await API.put(
            `hero/${existingData.id}/`,
            dataToSend,
            config,
          );
        } else {
          response = await API.post("hero/", dataToSend, config);
        }
      }

      if (response && response.data) {
        const updatedData = response.data;
        setHeroData(updatedData);
        setFormData(updatedData);
        localStorage.setItem(
          "portfolio_hero_data",
          JSON.stringify(updatedData),
        );
      }

      window.dispatchEvent(new Event("hero_data_updated"));
      window.dispatchEvent(new Event("storage"));
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error saving hero data to backend:", error);
      setHeroData(formData);
      localStorage.setItem("portfolio_hero_data", JSON.stringify(formData));
      window.dispatchEvent(new Event("hero_data_updated"));
      window.dispatchEvent(new Event("storage"));
      setIsEditOpen(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Handle File Attachment (Profile Image & Resume)
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (fieldName === "profileImg") {
        setProfileFile(file);
        setProfileFileName(file.name);
      }
      if (fieldName === "resumeUrl") {
        setResumeFile(file);
        setResumeFileName(file.name);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Force Download Resume Handler (Ensures direct download instead of view)
  const handleDownloadResume = async () => {
    const resumeUrl = heroData.resumeUrl || "/resume.pdf";

    if (
      resumeUrl.startsWith("data:application/pdf") ||
      resumeUrl.startsWith("data:")
    ) {
      try {
        const arr = resumeUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "Fathima_Hiba_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Download error:", error);
      }
    } else {
      try {
        // Fetch URL as blob to force download and avoid browser viewer
        const response = await fetch(resumeUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "Fathima_Hiba_Resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        // Fallback if CORS or network blocks fetch
        const link = document.createElement("a");
        link.href = resumeUrl;
        link.download = "Fathima_Hiba_Resume.pdf";
        link.setAttribute("download", "Fathima_Hiba_Resume.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <Box
      id="home"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        pt: 10,
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Lock Button for Admin */}
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

        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          spacing={8}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left Content */}
          <Box flex={1}>
            <Typography
              variant="body1"
              color="primary.main"
              sx={{ mb: 2, fontWeight: 600 }}
            >
              {heroData.greeting}
            </Typography>

            {/* Dynamic Name with Canva Style Font */}
            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontFamily: "'Pacifico', cursive",
                fontSize: "3.8rem",
                fontWeight: 400,
                color: "wite",
                cursor: "pointer",
              }}
              onClick={() => scrollToSection("home")}
            >
              {heroData.name}
            </Typography>

            <TypeAnimation
              sequence={[
                "Frontend Developer",
                2000,
                "React Developer",
                2000,
                "Python Developer",
                2000,
                "Backend Developer",
                2000,
                "Full Stack Developer",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              style={{
                fontSize: "2rem",
                color: "#3B82F6",
                fontWeight: 600,
              }}
            />

            <Typography
              sx={{
                mt: 4,
                color: "text.secondary",
                lineHeight: 1.8,
                maxWidth: 550,
              }}
            >
              {heroData.description}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 5 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleDownloadResume}
              >
                Download Resume
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={handleContactClick}
              >
                Contact Me
              </Button>
            </Stack>
          </Box>

          {/* Right Content */}
          <Box flex={1} display="flex" justifyContent="center">
            <Avatar
              src={heroData.profileImg}
              alt={heroData.name}
              sx={{
                width: {
                  xs: 250,
                  md: 350,
                },
                height: {
                  xs: 250,
                  md: 350,
                },
                border: "6px solid",
                borderColor: "primary.main",
                boxShadow: "0 0 40px rgba(59,130,246,.4)",
              }}
            />
          </Box>
        </Stack>
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

      {/*  EDIT HERO DATA MODAL WITH FILE ATTACHMENT */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Update Hero Section
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Greeting Text"
              name="greeting"
              fullWidth
              value={formData.greeting}
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
              label="Description"
              name="description"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />

            {/* Profile Image File Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Profile Image:
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Attach / Choose Profile Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "profileImg")}
                />
              </Button>

              {formData.profileImg && (
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
                    src={formData.profileImg}
                    alt="Preview"
                    sx={{ width: 45, height: 45 }}
                  />
                  <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      noWrap
                      color="text.primary"
                    >
                      {profileFileName || "Selected Profile Photo"}
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
                      setFormData({ ...formData, profileImg: "" });
                      setProfileFile(null);
                      setProfileFileName("");
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/*  Resume File Upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Resume File:
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Attach / Choose Resume (PDF)
                <input
                  type="file"
                  hidden
                  accept=".pdf,application/pdf"
                  onChange={(e) => handleFileUpload(e, "resumeUrl")}
                />
              </Button>

              {formData.resumeUrl && (
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
                  <PictureAsPdfIcon color="error" sx={{ fontSize: 36 }} />
                  <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      noWrap
                      color="text.primary"
                    >
                      {resumeFileName || "Attached_Resume.pdf"}
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
                      setFormData({ ...formData, resumeUrl: "" });
                      setResumeFile(null);
                      setResumeFileName("");
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
          <Button onClick={() => setIsEditOpen(false)}>Cancel / Close</Button>
          <Button onClick={handleSave} variant="contained" color="success">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Hero;
