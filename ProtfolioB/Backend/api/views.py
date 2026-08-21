import smtplib
from email.message import EmailMessage

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
class ContactCreateView(generics.CreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contact = serializer.save()

        try:
            msg = EmailMessage()

            msg["Subject"] = f"Portfolio Contact : {contact.subject}"
            msg["From"] = settings.EMAIL_HOST_USER
            msg["To"] = settings.EMAIL_HOST_USER
            msg["Reply-To"] = contact.email

            msg.set_content(
                f"""
New Portfolio Contact Message

Name: {contact.name}

Email: {contact.email}

Subject: {contact.subject}

Message:

{contact.message}
"""
            )

            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()

            server.login(
                settings.EMAIL_HOST_USER,
                settings.EMAIL_HOST_PASSWORD,
            )

            server.send_message(msg)
            server.quit()

            return Response(
                {"message": "Message sent successfully."},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            print("Email Error:", str(e))

            return Response(
                {
                    "message": "Message could not be sent.",
                    "error": str(e),
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