from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ContactCreateView,
    SkillListView,
    ProjectListView,
    ExperienceListView,
    CertificationListView,
    HeroViewSet,
    AboutViewSet,
    ContactInfoViewSet,
    SkillViewSet,
    ProjectViewSet,
    ExperienceViewSet,
    CertificationViewSet,
)

#  Django REST Framework Router
router = DefaultRouter()
router.register(r'hero', HeroViewSet, basename='hero')
router.register(r'about', AboutViewSet, basename='about')
router.register(r'contact-info', ContactInfoViewSet, basename='contact-info')
router.register(r'skills', SkillViewSet, basename='skills')
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'experience', ExperienceViewSet, basename='experience')
router.register(r'certifications', CertificationViewSet, basename='certifications')
router.register(r'skills-admin', SkillViewSet, basename='skills-admin') 
router.register(r'projects-admin', ProjectViewSet, basename='projects-admin')

urlpatterns = [

    path('', include(router.urls)),

    path("contact/", ContactCreateView.as_view(), name="contact"),
    path("skills-list/", SkillListView.as_view(), name="skills-list"),
    path("projects-list/", ProjectListView.as_view(), name="projects-list"),
    path("experience-list/", ExperienceListView.as_view(), name="experience-list"),
    path("certifications-list/", CertificationListView.as_view(), name="certifications-list"),
]