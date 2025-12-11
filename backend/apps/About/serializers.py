from rest_framework import serializers
from .models import About, Gallery, Employee, Honer, Services


class AboutSerializer(serializers.ModelSerializer):
    class Meta:
        model = About
        fields = ['title_fa', 'title_en', 'photo', 'description_fa', 'description_en']


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['title', 'photo']


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['title_fa', 'title_en', 'photo', 'rule_fa', 'rule_en', 'description_fa', 'description_en']


class HonerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Honer
        fields = ['title_fa', 'title_en', 'award_fa', 'award_en', 'year_fa', 'year_en']


class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = ['title_fa', 'title_en', 'description_fa', 'description_en']
