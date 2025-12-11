from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AboutViewSet,
    GalleryViewSet,
    EmployeeViewSet,
    HonerViewSet,
    ServicesViewSet,
)

router = DefaultRouter()
router.register(r'about', AboutViewSet, basename='about')
router.register(r'gallery', GalleryViewSet, basename='gallery')
router.register(r'employee', EmployeeViewSet, basename='employee')
router.register(r'honer', HonerViewSet, basename='honer')
router.register(r'services', ServicesViewSet, basename='services')

urlpatterns = [
    path('api/', include(router.urls)),
]
