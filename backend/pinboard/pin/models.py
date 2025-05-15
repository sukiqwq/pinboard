from django.db import models
from django.contrib.auth.models import AbstractUser # Import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    # AbstractUser 已经包含了 username, email, password, first_name, last_name, is_staff, is_active, date_joined 等字段
    # 你可以在这里添加额外的字段
    profile_info = models.TextField(blank=True, null=True, verbose_name="个人简介")
    # 如果需要，你还可以添加其他字段，比如头像等
    # profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.username

class FriendshipRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    request_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_friend_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_friend_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    request_time = models.DateTimeField(auto_now_add=True)
    response_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Request from {self.sender.username} to {self.receiver.username} ({self.status})"

class Friendship(models.Model):
    # Django creates an implicit 'id' primary key for each model unless specified otherwise.
    # For a ManyToMany relationship like friendship, Django's ManyToManyField is often better.
    # However, if you need to store extra data about the friendship (like timestamp),
    # a through model is appropriate. Your schema indicates a specific primary key.
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friendships1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friendships2', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user1', 'user2') # Enforces that a pair of users is unique
        # Consider adding a constraint to ensure user1_id < user2_id to avoid duplicate pairs
        # e.g. (1,2) and (2,1) representing the same friendship.
        # This can be done at the database level or in the save method.

    def __str__(self):
        return f"Friendship between {self.user1.username} and {self.user2.username}"

class Board(models.Model):
    board_id = models.AutoField(primary_key=True)
    board_name = models.CharField(max_length=255)
    descriptor = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='boards', on_delete=models.CASCADE) # [cite: 8]
    allow_friends_comment = models.BooleanField(default=True) # [cite: 24]
    create_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.board_name

class Picture(models.Model):
    picture_id = models.AutoField(primary_key=True)
    # Instead of blob_data, we use ImageField to store the image file.
    # 'upload_to' specifies a subdirectory within MEDIA_ROOT.
    image_file = models.ImageField(upload_to='pictures/') # Stores path to image
    # url can be derived from image_file.url attribute at runtime, or store external URL if applicable
    external_url = models.URLField(blank=True, null=True) # If picture is from the web [cite: 3, 29]
    tags = models.CharField(max_length=255, blank=True, null=True) # [cite: 29]
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='uploaded_pictures', on_delete=models.CASCADE)
    upload_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Picture {self.picture_id} by {self.uploaded_by.username}"

class Pin(models.Model):
    pin_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='pins', on_delete=models.CASCADE)
    board = models.ForeignKey(Board, related_name='pins', on_delete=models.CASCADE)
    picture = models.ForeignKey(Picture, related_name='pinned_on', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True) 
    description = models.TextField(blank=True, null=True)
    
    # 新增字段: 如果为None表示这是原创Pin，否则表示这是一个Repin
    origin_pin = models.ForeignKey('self', related_name='repins', on_delete=models.CASCADE, null=True, blank=True)
    
    @property
    def is_repin(self):
        return self.origin_pin is not None
    
    @property
    def original_picture(self):
        """获取原始图片，无论是原创Pin还是Repin"""
        if self.is_repin:
            return self.origin_pin.picture
        return self.picture

    def __str__(self):
        if self.is_repin:
            return f"Repin {self.pin_id} by {self.user.username} of Pin {self.origin_pin.pin_id} on {self.board.board_name}"
        else:
            return f"Pin {self.pin_id} by {self.user.username} on {self.board.board_name}"

class FollowStream(models.Model):
    stream_id = models.AutoField(primary_key=True)
    stream_name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='follow_streams', on_delete=models.CASCADE) # [cite: 5]
    # The FollowStreamBoard table is a many-to-many relationship.
    # We can define it using ManyToManyField in Django.
    boards = models.ManyToManyField(Board, related_name='followed_by_streams') # [cite: 13]

    def __str__(self):
        return f"{self.stream_name} by {self.user.username}"

class Like(models.Model):
    # user_id and pin_id are the primary key according to your schema.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='likes_given', on_delete=models.CASCADE)
    # "When a user likes a picture, this is counted as a like of the original pin of the picture, not of a particular repinning of the picture." [cite: 25]
    pin = models.ForeignKey(Pin, related_name='likes_received', on_delete=models.CASCADE) # Likes are on original Pins [cite: 6]
    timestamp = models.DateTimeField(auto_now_add=True) # [cite: 32]

    class Meta:
        unique_together = ('user', 'pin') # Each user can like a pin only once

    def __str__(self):
        return f"{self.user.username} likes Pin {self.pin.pin_id}"

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments_made', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # 只需要一个 pin 外键，不再需要分开 pin 和 repin
    pin = models.ForeignKey(Pin, related_name='comments', on_delete=models.CASCADE)

    def __str__(self):
        return f"Comment by {self.user.username} on Pin {self.pin.pin_id}"