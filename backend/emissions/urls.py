from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IndustryViewSet, SectorViewSet, EmissionDataViewSet, ChatViewSet

router = DefaultRouter()
router.register(r'industries', IndustryViewSet)
router.register(r'sectors', SectorViewSet)
router.register(r'data', EmissionDataViewSet)
router.register(r'chat', ChatViewSet, basename='chat')

urlpatterns = [
    path('', include(router.urls)),
]
