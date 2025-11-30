from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FirstContentViewSet, ManagerViewSet, WhyUsViewSet,
    ClientViewSet, FooterViewSet
)

router = DefaultRouter()
router.register(r'first-content', FirstContentViewSet, basename='firstcontent')
router.register(r'managers', ManagerViewSet, basename='manager')
router.register(r'why-us', WhyUsViewSet, basename='whyus')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'footer', FooterViewSet, basename='footer')

urlpatterns = [
    path('api/', include(router.urls)),
]
