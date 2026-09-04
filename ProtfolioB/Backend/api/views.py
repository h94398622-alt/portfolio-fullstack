# import smtplib
# from email.message import EmailMessage
import resend

from django.conf import settings
from rest_framework import generics, status, viewsets
from rest_framework.response import Response


from .models import (
    About,
    Certification,
    Contact,
    ContactInfo,
    Experience,
    Hero,
    Project,
    Skill,
)
from .serializers import (
    AboutSerializer,
    CertificationSerializer,
    ContactInfoSerializer,
    ContactSerializer,
    ExperienceSerializer,
    HeroSerializer,
    ProjectSerializer,
    SkillSerializer,
)



class HeroViewSet(viewsets.ModelViewSet):
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer


class AboutViewSet(viewsets.ModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer


class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer





class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

# Project ViewSet 

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        github = self.request.data.get('github') or self.request.data.get('github_url')
        demo = self.request.data.get('demo') or self.request.data.get('live_url')
        
        serializer.save(
            github_link=github if github else serializer.validated_data.get('github_link'),
            demo_link=demo if demo else serializer.validated_data.get('demo_link')
        )

    def perform_update(self, serializer):
        github = self.request.data.get('github') or self.request.data.get('github_url')
        demo = self.request.data.get('demo') or self.request.data.get('live_url')
        
        kwargs = {}
        if github is not None:
            kwargs['github_link'] = github
        if demo is not None:
            kwargs['demo_link'] = demo
            
        serializer.save(**kwargs)


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer




# Contact API
# Contact API
class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save contact to database
        contact = serializer.save()

        try:
            # Resend API key
            resend.api_key = settings.RESEND_API_KEY

            # Email content
            email_params = {
                "from": settings.RESEND_FROM_EMAIL,
                "to": [settings.RESEND_TO_EMAIL],
                "subject": f"Portfolio Contact: {contact.subject}",
                "reply_to": contact.email,
                "text": f"""
New Portfolio Contact Message

Name: {contact.name}
Email: {contact.email}
Phone: {getattr(contact, "phone", "")}
Subject: {contact.subject}

Message:
{contact.message}
""",
            }

            # Send email using Resend API
            response = resend.Emails.send(email_params)

            print("EMAIL SENT SUCCESSFULLY")
            print("RESEND RESPONSE:", response)

            return Response(
                {
                    "message": "Message sent successfully.",
                    "id": contact.id,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            print("RESEND EMAIL ERROR:", repr(e))

            # Contact is already saved in database
            return Response(
                {
                    "message": "Message saved, but email could not be sent.",
                    "id": contact.id,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

# Skills API
class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


# Projects API
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


# Experience API
class ExperienceListView(generics.ListAPIView):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


# Certification API
class CertificationListView(generics.ListAPIView):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer