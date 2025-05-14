from django.contrib import admin
from .models import (
    CustomUser, FriendshipRequest, Friendship, Board, Picture,
    Pin, Repin, FollowStream, Like, Comment
)

class FriendshipRequestAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'status', 'request_time', 'response_time')
    list_filter = ('status', 'request_time')
    search_fields = ('sender__username', 'receiver__username')
    fields = ('sender', 'receiver', 'status', 'response_time')

admin.site.register(CustomUser)  
admin.site.register(FriendshipRequest, FriendshipRequestAdmin)
admin.site.register(Friendship)
admin.site.register(Board)
admin.site.register(Picture)
admin.site.register(Pin)
admin.site.register(Repin)
admin.site.register(FollowStream)
admin.site.register(Like)
admin.site.register(Comment)