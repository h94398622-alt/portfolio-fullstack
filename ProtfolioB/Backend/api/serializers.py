from rest_framework import serializers
from .models import (
    Hero,
    About,
    ContactInfo,
    Contact,
    Skill,
    Project,
    Experience,
    Certification,
)


#  Hero Serializer
class HeroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hero
        fields = "__all__"


#  About Serializer
class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = "__all__"


#  ContactInfo Serializer
class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = "__all__"



class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"


#  Project Serializer 
class ProjectSerializer(serializers.ModelSerializer):
    github = serializers.CharField(source='github_link', read_only=True)
    demo = serializers.CharField(source='demo_link', read_only=True)

    class Meta:
        model = Project
        fields = "__all__"


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = "__all__"


#  Certification Serializer
class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = "__all__"