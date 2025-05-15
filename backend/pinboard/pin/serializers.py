from rest_framework import serializers
from django.contrib.auth.models import User # Assuming default user
from .models import (
    CustomUser, FriendshipRequest, Friendship, Board, Picture,
    Pin, FollowStream, Like, Comment
)

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'date_joined', 'profile_info']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            profile_info=validated_data.get('profile_info', '')
        )


class FriendshipRequestSerializer(serializers.ModelSerializer):
    sender = serializers.HiddenField(default=serializers.CurrentUserDefault())  # 自动设置为当前用户
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    class Meta:
        model = FriendshipRequest
        fields = '__all__'

    def validate_receiver(self, value):
        if not CustomUser.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("Receiver does not exist.")
        return value

class FriendshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer(read_only=True)
    user2 = UserSerializer(read_only=True)
    class Meta:
        model = Friendship
        fields = '__all__'

class PictureSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    image_url = serializers.ImageField(read_only=True, source='image_file') # To show the URL

    class Meta:
        model = Picture
        fields = ['picture_id', 'image_file', 'image_url', 'external_url', 'tags', 'uploaded_by', 'upload_time']
        read_only_fields = ['uploaded_by', 'upload_time'] # Set by server

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['user', 'timestamp']

class PinSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    picture = serializers.PrimaryKeyRelatedField(queryset=Picture.objects.all())
    picture_detail = PictureSerializer(read_only=True, source='picture')
    likes_received = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_repin = serializers.BooleanField(read_only=True)
    origin_pin_detail = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Pin
        fields = [
            'pin_id', 'user', 'board', 'picture', 'picture_detail', 
            'timestamp', 'likes_received', 'comments', 'description', 
            'title', 'is_liked', 'origin_pin', 'is_repin', 'origin_pin_detail'
        ]
        read_only_fields = ['user', 'timestamp', 'is_repin']

    def get_likes_received(self, obj):
        return obj.likes_received.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, pin=obj).exists()
        return False
    
    def get_origin_pin_detail(self, obj):
        """获取原始Pin的详细信息"""
        if obj.origin_pin:
            return {
                'pin_id': obj.origin_pin.pin_id,
                'user': UserSerializer(obj.origin_pin.user).data,
                'title': obj.origin_pin.title,
                'description': obj.origin_pin.description,
                'timestamp': obj.origin_pin.timestamp,
            }
        return None

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    pins = PinSerializer(many=True, read_only=True) # Show pins on this board

    class Meta:
        model = Board
        fields = '__all__'
        read_only_fields = ['owner', 'create_time']


class FollowStreamSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    boards = BoardSerializer(many=True, read_only=True) # Or just board_ids

    class Meta:
        model = FollowStream
        fields = '__all__'
        read_only_fields = ['user']


class LikeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Like
        fields = '__all__'
        read_only_fields = ['user', 'timestamp']