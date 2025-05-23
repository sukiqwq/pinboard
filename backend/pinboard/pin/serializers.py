from rest_framework import serializers, viewsets
from django.contrib.auth.models import User # Assuming default user
from .models import (
    CustomUser, FriendshipRequest, Friendship, Board, Picture,
    Pin, FollowStream, Like, Comment
)
from django.db.models import Q

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    is_friend = serializers.SerializerMethodField()
    board_count = serializers.SerializerMethodField()
    pin_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'date_joined', 'profile_info', 'is_friend', 'board_count', 'pin_count']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def get_is_friend(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # 检查好友关系
            is_friend = Friendship.objects.filter(
                (Q(user1=request.user, user2=obj) | Q(user1=obj, user2=request.user))
            ).exists()
            return is_friend
        return False

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            profile_info=validated_data.get('profile_info', '')
        )
    
    def get_board_count(self, obj):
        return Board.objects.filter(owner=obj).count()
    def get_pin_count(self, obj):
        return Pin.objects.filter(user=obj).count()


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
    image_url = serializers.SerializerMethodField()  # 使用 SerializerMethodField 动态生成完整 URL

    class Meta:
        model = Picture
        fields = ['picture_id', 'image_file', 'image_url', 'external_url', 'tags', 'uploaded_by', 'upload_time']
        read_only_fields = ['uploaded_by', 'upload_time']  # Set by server
        extra_kwargs = {
            'image_file': {'required': False},  # 使图片文件字段为可选
            'external_url': {'required': False}  # 使外部URL字段为可选
        }

    def get_image_url(self, obj):
        """
        返回完整的图片 URL - 如果有external_url，优先使用它
        """
        request = self.context.get('request')  # 从上下文中获取 request

        # 如果存在外部URL，直接返回
        if obj.external_url:
            return obj.external_url

        # 否则返回上传的图片文件URL
        if obj.image_file and request:
            return request.build_absolute_uri(obj.image_file.url)  # 构建完整的 URL
        elif obj.image_file:
            return obj.image_file.url  # 如果没有 request，返回相对路径

        return None  # 如果没有图片，返回None

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
        target_pin = obj.origin_pin if obj.is_repin else obj
        return target_pin.likes_received.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # 如果是 repin，检查原始 Pin 的点赞情况
            target_pin = obj.origin_pin if obj.is_repin else obj
            return Like.objects.filter(user=request.user, pin=target_pin).exists()
        return False

    def get_origin_pin_detail(self, obj):
        """获取原始Pin的详细信息"""
        if obj.origin_pin:
            try:
                # 尝试访问origin_pin的属性，如果Pin已被删除将引发异常
                origin_pin_id = obj.origin_pin.pin_id
                origin_pin_user = obj.origin_pin.user

                # 如果能够访问，返回详细信息
                return {
                    'pin_id': origin_pin_id,
                    'user': UserSerializer(origin_pin_user).data,
                    'title': obj.origin_pin.title,
                    'description': obj.origin_pin.description,
                    'timestamp': obj.origin_pin.timestamp,
                }
            except Pin.DoesNotExist:
                # 原始Pin已被删除
                return None
            except Exception as e:
                # 其他异常情况（如数据库一致性问题）
                print(f"Error accessing origin_pin details: {str(e)}")
                return None
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