from rest_framework import viewsets

from .models import FirstContent, Manager, WhyUs, Client, Footer
from .serializers import (
    FirstContentSerializer, ManagerSerializer, WhyUsSerializer,
    ClientSerializer, FooterSerializer
)


class FirstContentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FirstContentSerializer

    def get_queryset(self):
        # اگر چیزی نبود، queryset خالی بده
        qs = FirstContent.objects.filter(is_active=True).order_by('-id')
        last_obj = qs.first()
        if last_obj:
            return FirstContent.objects.filter(pk=last_obj.pk)
        return FirstContent.objects.none()


class ManagerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ManagerSerializer

    def get_queryset(self):
        # اگر چیزی نبود، queryset خالی بده
        qs = Manager.objects.filter(is_active=True).order_by('-id')
        last_obj = qs.first()
        if last_obj:
            return Manager.objects.filter(pk=last_obj.pk)
        return Manager.objects.none()


class WhyUsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = WhyUs.objects.filter(is_active=True)
    serializer_class = WhyUsSerializer


class ClientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Client.objects.filter(is_active=True)
    serializer_class = ClientSerializer


class FooterViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FooterSerializer

    def get_queryset(self):
        qs = Footer.objects.filter(is_active=True).order_by('-id')
        last_obj = qs.first()
        if last_obj:
            return Footer.objects.filter(pk=last_obj.pk)
        return Footer.objects.none()
