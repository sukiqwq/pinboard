# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, BoardViewSet, PictureViewSet, PinViewSet,
    FriendshipRequestViewSet, FollowStreamViewSet, LikeViewSet, SearchViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'boards', BoardViewSet)
router.register(r'pictures', PictureViewSet)
router.register(r'pins', PinViewSet)
router.register(r'friend-requests', FriendshipRequestViewSet)
router.register(r'follow-streams', FollowStreamViewSet)
router.register(r'likes', LikeViewSet)
router.register(r'search', SearchViewSet, basename='search')
# router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]