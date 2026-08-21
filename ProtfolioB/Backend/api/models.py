from django.db import models

# Create your models here.

class Hero(models.Model):
    greeting = models.CharField(max_length=255, default="👋 Hello..., I'm")
    name = models.CharField(max_length=100)
    description = models.TextField()
    profileImg = models.ImageField(upload_to="profile/", blank=True, null=True)
    resumeUrl = models.FileField(upload_to="resumes/", blank=True, null=True)

    def __str__(self):
        return self.name

# 2. ABOUT SECTION MODEL
class About(models.Model):
    subtitle = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    education = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    projects = models.CharField(max_length=50, default="0+")
    technologies = models.CharField(max_length=50, default="0+")
    experience = models.CharField(max_length=50, default="0+")
    certificates = models.CharField(max_length=50, default="0+")

    def __str__(self):
        return self.name or "About Me Details"

# 3. CONTACT INFO MODEL
class ContactInfo(models.Model):
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=200)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    whatsapp = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.email

# Contact Model
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

# SKILL MODEL
class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, default="Technical Skills")
    description = models.TextField(blank=True, null=True)
    level = models.CharField(max_length=50, default="Advanced")
    color = models.CharField(max_length=20, default="#3b82f6")
    icon_url = models.TextField(blank=True, null=True)
    percentage = models.IntegerField(default=90)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=300)
    github_link = models.URLField(blank=True, null=True)
    demo_link = models.URLField(blank=True, null=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)

    @property
    def github(self):
        return self.github_link

    @property
    def demo(self):
        return self.demo_link

    def __str__(self):
        return self.title

# Experience Model
class Experience(models.Model):
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    duration = models.CharField(max_length=100)
    description = models.TextField()
    image = models.TextField(blank=True, null=True)
    technologies = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.company

# Certification Model
class Certification(models.Model):
    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    year = models.CharField(max_length=20)

    def __str__(self):
        return self.title