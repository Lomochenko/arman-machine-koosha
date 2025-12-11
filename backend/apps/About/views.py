from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import About, Gallery, Employee, Honer, Services
from .serializers import (
    AboutSerializer,
    GallerySerializer,
    EmployeeSerializer,
    HonerSerializer,
    ServicesSerializer,
)


class AboutViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = About.objects.filter(is_active=True)
    serializer_class = AboutSerializer


class GalleryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Gallery.objects.filter(is_active=True)
    serializer_class = GallerySerializer


class EmployeeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.filter(is_active=True)
    serializer_class = EmployeeSerializer


class HonerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Honer.objects.filter(is_active=True)
    serializer_class = HonerSerializer


class ServicesViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Services.objects.filter(is_active=True)
    serializer_class = ServicesSerializer
