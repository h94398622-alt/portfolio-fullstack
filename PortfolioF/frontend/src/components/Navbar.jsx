import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Stack,
  Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import API from "../services/api";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Certificates", id: "certifications" },
  { label: "Contact", id: "contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [heroData, setHeroData] = useState({
    name: "Fathima Hiba",
    resumeUrl: "/resume.pdf",
  });

  // Fetch Hero Data directly from Backend API
  const fetchNavbarData = async () => {
    try {
      const response = await API.get("hero/");
      const data = Array.isArray(response.data)
        ? response.data[response.data.length - 1]
        : response.data;
      if (data) {
        setHeroData(data);
      }
    } catch (error) {
      console.error("Error fetching navbar data:", error);
    }
  };

  useEffect(() => {
    fetchNavbarData();

    const handleSync = () => {
      fetchNavbarData();
    };

    window.addEventListener("hero_data_updated", handleSync);
    return () => {
      window.removeEventListener("hero_data_updated", handleSync);
    };
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setOpen(false);
  };

  //  View Resume Handler with Cache Busting
  const handleViewResume = () => {
    const resumeUrl = heroData.resumeUrl || "/resume.pdf";

    if (resumeUrl.startsWith("data:application/pdf")) {
      try {
        const base64Data = resumeUrl.split(",")[1];
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } catch (error) {
        console.error("Error opening PDF: ", error);
      }
    } else {
      const finalResumeUrl = resumeUrl.includes("?")
        ? `${resumeUrl}&t=${new Date().getTime()}`
        : `${resumeUrl}?t=${new Date().getTime()}`;
      window.open(finalResumeUrl, "_blank");
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(15px)",
          bgcolor: "rgba(15,23,42,0.75)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {/* Dynamic Name */}

            <Typography
              variant="h5"
              sx={{
                flexGrow: 1,
                fontFamily: "'Pacifico', cursive",
                fontSize: "1.8rem",
                fontWeight: 400,
                color: "primary.main",
                cursor: "pointer",
              }}
              onClick={() => scrollToSection("home")}
            >
              {heroData.name || "Fathima Hiba"}
            </Typography>

            {/* Desktop Menu */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  color="inherit"
                  sx={{
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* View Only Resume Link */}
              <Button variant="contained" onClick={handleViewResume}>
                Resume
              </Button>
            </Stack>

            {/* Mobile Menu */}
            <IconButton
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 250,
            bgcolor: "#0F172A",
            height: "100%",
          }}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton onClick={() => scrollToSection(item.id)}>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      color: "white",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            <Box sx={{ p: 2 }}>
              {/* View Only Resume Link for Mobile */}
              <Button variant="contained" fullWidth onClick={handleViewResume}>
                Resume
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
