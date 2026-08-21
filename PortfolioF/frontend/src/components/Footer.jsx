import { Box, Container, Divider, Stack, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "#020617",
        py: 5,
        mt: 5,
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 4 }} />

        <Stack spacing={2} alignItems="center">
          <Typography
            color="text.secondary"
            align="center"
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
              },
              fontWeight: 500,
              letterSpacing: "0.4px",
              lineHeight: 1.5,
              mb: 1,
            }}
          >
            Full Stack Developer | React Developer | Python Developer
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{
              fontSize: {
                xs: "14px",
                sm: "15px",
                md: "16px",
              },
              fontWeight: 400,
            }}
          >
            © 2026 Hiba — Designed & Developed
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
