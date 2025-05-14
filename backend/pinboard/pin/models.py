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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='pins', on_delete=models.CASCADE)
    board = models.ForeignKey(Board, related_name='pins', on_delete=models.CASCADE)
    picture = models.ForeignKey(Picture, related_name='pinned_on', on_delete=models.CASCADE) # [cite: 3]
    timestamp = models.DateTimeField(auto_now_add=True) # [cite: 32]

    def __str__(self):
        return f"Pin {self.pin_id} by {self.user.username} on {self.board.board_name}"

class Repin(models.Model):
    # Repin is essentially another Pin, but referencing an original Pin's picture.
    # The project description says "does not result in a copy of the picture, but is just a pointer to the picture as it was first pinned" [cite: 30]
    # This suggests a repin should ideally point to the original Picture object.
    # Your schema has 'original_pin_id'.
    repin_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='repins', on_delete=models.CASCADE) # User who repinned
    board = models.ForeignKey(Board, related_name='repins', on_delete=models.CASCADE) # Board where it's repinned
    original_pin = models.ForeignKey(Pin, related_name='times_repinned', on_delete=models.CASCADE) # The pin that was repinned [cite: 4]
    timestamp = models.DateTimeField(auto_now_add=True) # [cite: 32]

    def __str__(self):
        return f"Repin by {self.user.username} of Pin {self.original_pin.pin_id} on {self.board.board_name}"

    @property
    def picture(self): # To easily access the picture of the original pin
        return self.original_pin.picture

class FollowStream(models.Model):
    stream_id = models.AutoField(primary_key=True)
    stream_name = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='follow_streams', on_delete=models.CASCADE) # [cite: 5]
    # The FollowStreamBoard table is a many-to-many relationship.
    # We can define it using ManyToManyField in Django.
    boards = models.ManyToManyField(Board, related_name='followed_by_streams') # [cite: 13]

    def __str__(self):
        return f"{self.stream_name} by {self.user.username}"

# FollowStreamBoard is handled by the ManyToManyField in FollowStream.
# If you needed extra fields on the FollowStreamBoard relationship,
# you'd use a 'through' model.

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

class Comment(models.Model): # Combined CommentPin and CommentRepin
    comment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments_made', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True) # [cite: 32]

    # A comment can be on a Pin or a Repin.
    # "comments about a repinned picture are only associated with the repinned and not the original picture." [cite: 26]
    # We can use a generic foreign key or two separate foreign keys.
    # For simplicity and clarity with your schema, let's use two nullable FKs.
    # Or better, have a "target_content_type" and "target_object_id" for generic relations.
    # Given your schema has CommentPin and CommentRepin, we can infer the target.
    # Let's make one Comment table and link it to either Pin or Repin.

    pin = models.ForeignKey(Pin, related_name='comments', on_delete=models.CASCADE, null=True, blank=True)
    repin = models.ForeignKey(Repin, related_name='comments', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        target = f"Pin {self.pin_id}" if self.pin else f"Repin {self.repin_id}"
        return f"Comment by {self.user.username} on {target}"

    # You'd add a clean method to ensure either pin or repin is set, but not both.
    def clean(self):
        from django.core.exceptions import ValidationError
        if self.pin and self.repin:
            raise ValidationError("Comment cannot be linked to both a Pin and a Repin.")
        if not self.pin and not self.repin:
            raise ValidationError("Comment must be linked to either a Pin or a Repin.")