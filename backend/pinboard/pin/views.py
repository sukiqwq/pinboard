from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import (
    CustomUser, FriendshipRequest, Friendship, Board, Picture,
    Pin, Repin, FollowStream, Like, Comment
)
from .serializers import (
    UserSerializer, FriendshipRequestSerializer, FriendshipSerializer,
    BoardSerializer, PictureSerializer, PinSerializer, RepinSerializer,
    FollowStreamSerializer, LikeSerializer, CommentSerializer
)
from django.db.models import Q # For complex lookups

# Example: UserViewSet for signup (you'd expand this)
class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all() # 查询 CustomUser
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # 注册时允许任何人

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], url_path='login')
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': '用户名和密码是必填项'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user:
            # 创建或获取用户的 Token
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id, 'username': user.username})
        return Response({'error': '用户名或密码错误'}, status=status.HTTP_401_UNAUTHORIZED)

    # 注册用户的action
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny], url_path='register')
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # CustomUser.objects.create_user 会处理密码哈希
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 获取/更新当前登录用户信息的action
    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated], url_path='me')
    def me(self, request):
        user = request.user # 获取当前登录的用户
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        elif request.method in ['PUT', 'PATCH']:
            # 对于 PUT 和 PATCH，我们允许用户更新他们自己的信息
            # partial=True 允许部分更新 (PATCH)
            serializer = self.get_serializer(user, data=request.data, partial=(request.method == 'PATCH'))
            if serializer.is_valid():
                serializer.save() # UserSerializer 会处理字段的更新，包括 profile_info
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    # 其他 UserViewSet 的方法，例如 list, retrieve, update, destroy
    # 你可能需要调整这些方法的权限，例如：
    def get_permissions(self):
        if self.action == 'register':
            self.permission_classes = [permissions.AllowAny]
        elif self.action == 'me' or self.action == 'retrieve' or self.action == 'list':
            self.permission_classes = [permissions.IsAuthenticatedOrReadOnly] # 允许查看，但只有自己能改 (通过 'me')
        elif self.action in ['update', 'partial_update', 'destroy']:
             # 通常情况下，只有管理员或用户自己才能修改/删除用户账户
             # 这里可以设置为 IsAdminUser 或者自定义权限
            self.permission_classes = [permissions.IsAdminUser] # 示例：只有管理员能直接修改其他用户
        return super().get_permissions()



class BoardViewSet(viewsets.ModelViewSet):
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Basic permission

    def perform_create(self, serializer):
        # Set owner to the currently logged-in user [cite: 21]
        serializer.save(owner=self.request.user)

    # Custom action to get boards for the current user
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_boards(self, request):
        user_boards = Board.objects.filter(owner=request.user)
        serializer = self.get_serializer(user_boards, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def pins(self, request, pk=None):
        try:
            board = self.get_object()  # 获取当前的 Board 对象
            pins = Pin.objects.filter(board=board)  # 查询与该 Board 关联的所有 Pin
            serializer = PinSerializer(pins, many=True)
            return Response(serializer.data)
        except Board.DoesNotExist:
            return Response({"error": "Board not found"}, status=status.HTTP_404_NOT_FOUND)
        
    # 检查当前用户是否关注某个 Board
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def follow_status(self, request, pk=None):
        try:
            board = self.get_object()  # 获取当前的 Board 对象
            is_following = FollowStream.objects.filter(user=request.user, boards=board).exists()
            return Response({"following": is_following}, status=status.HTTP_200_OK)
        except Board.DoesNotExist:
            return Response({"error": "Board not found"}, status=status.HTTP_404_NOT_FOUND)


class PictureViewSet(viewsets.ModelViewSet):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Set uploaded_by to the currently logged-in user [cite: 3]
        serializer.save(uploaded_by=self.request.user)

    # Keyword search for pictures by tags [cite: 27]
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', None)
        if query:
            # Example: simple 'contains' search on tags.
            # For more advanced search, consider Django's search features or dedicated libraries.
            # The project mentions "contain operator" [cite: 53]
            pictures = Picture.objects.filter(tags__icontains=query) # Case-insensitive contains

            # Sorting [cite: 27]
            sort_by = request.query_params.get('sort_by', 'time') # Default sort by time
            if sort_by == 'relevance': # Relevance is tricky without more definition
                pass # Implement relevance sorting if defined
            elif sort_by == 'likes':
                # This requires a more complex query to count likes on pins associated with these pictures
                # and then ordering. For simplicity, we'll order by upload_time here.
                # To sort by likes, you'd typically annotate the queryset.
                pictures = pictures.order_by('-upload_time') # Placeholder
            else: # Default to time (most recent first)
                pictures = pictures.order_by('-upload_time')

            serializer = self.get_serializer(pictures, many=True)
            return Response(serializer.data)
        return Response({"error": "Query parameter 'q' is required for search."}, status=status.HTTP_400_BAD_REQUEST)


class PinViewSet(viewsets.ModelViewSet):
    queryset = Pin.objects.all()
    serializer_class = PinSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Set user to the currently logged-in user [cite: 3]
        # Ensure picture is created or exists before pinning
        serializer.save(user=self.request.user)


class RepinViewSet(viewsets.ModelViewSet):
    queryset = Repin.objects.all()
    serializer_class = RepinSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Set user to the currently logged-in user [cite: 4]
        serializer.save(user=self.request.user)


class FriendshipRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendshipRequest.objects.all()
    serializer_class = FriendshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users should only see requests involving them
        return FriendshipRequest.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        )

    def perform_create(self, serializer):
        # Sender is the current user [cite: 21]
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        friend_request = self.get_object()
        if friend_request.receiver == request.user and friend_request.status == 'pending':
            friend_request.status = 'accepted'
            friend_request.response_time = timezone.now() # from django.utils import timezone
            friend_request.save()
            # Create Friendship record
            Friendship.objects.create(user1=friend_request.sender, user2=friend_request.receiver)
            return Response({'status': 'friend request accepted'})
        return Response({'status': 'failed'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        friend_request = self.get_object()
        if friend_request.receiver == request.user and friend_request.status == 'pending':
            friend_request.status = 'rejected'
            friend_request.response_time = timezone.now()
            friend_request.save()
            return Response({'status': 'friend request rejected'})
        return Response({'status': 'failed'}, status=status.HTTP_400_BAD_REQUEST)


class FollowStreamViewSet(viewsets.ModelViewSet):
    queryset = FollowStream.objects.all()
    serializer_class = FollowStreamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users should only see their own follow streams (private) [cite: 1]
        return FollowStream.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) # [cite: 49]

    @action(detail=True, methods=['get'])
    def pictures(self, request, pk=None): # [cite: 50]
        follow_stream = self.get_object()
        # Get all pins from all boards in this stream
        # This needs to be efficient.
        board_ids = follow_stream.boards.values_list('board_id', flat=True)
        # Get pictures associated with pins on these boards
        # Pins contain pictures and timestamps. Order by pin timestamp.
        pins_in_stream = Pin.objects.filter(board_id__in=board_ids).order_by('-timestamp')
        # We need pictures, not pins directly in the response as per "displays all pictures"
        # However, the order is on the pin.
        # This might be complex if you need unique pictures ordered by their latest pin time in the stream.
        # For simplicity, let's serialize the pins:
        serializer = PinSerializer(pins_in_stream, many=True, context={'request': request})
        return Response(serializer.data)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # User is current user, check if like already exists by this user for this pin
        serializer.save(user=self.request.user) # [cite: 6, 51]


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Set user and check if user is allowed to comment [cite: 6, 24, 51]
        # This logic would be more complex: check board's allow_friends_comment
        # and if the commenter is a friend of the board owner if the setting is restrictive.
        pin_id = serializer.validated_data.get('pin')
        repin_id = serializer.validated_data.get('repin')
        target_object = pin_id or repin_id

        if not target_object:
            return Response({"error": "Comment must be on a pin or repin."}, status=status.HTTP_400_BAD_REQUEST)

        board_owner = None
        allow_friends_to_comment = False

        if pin_id:
            board_owner = pin_id.board.owner
            allow_friends_to_comment = pin_id.board.allow_friends_comment
        elif repin_id:
            board_owner = repin_id.board.owner
            allow_friends_to_comment = repin_id.board.allow_friends_comment

        can_comment = True
        if allow_friends_to_comment is False: # Only owner can comment
            if request.user != board_owner:
                can_comment = False
        elif allow_friends_to_comment is True and request.user != board_owner: # Friends can comment
            # Check if request.user is friends with board_owner
            is_friend = Friendship.objects.filter(
                (Q(user1=request.user, user2=board_owner) | Q(user1=board_owner, user2=request.user))
            ).exists()
            if not is_friend:
                can_comment = False

        if not can_comment:
             return Response({"error": "You are not allowed to comment on this item."}, status=status.HTTP_403_FORBIDDEN)

        serializer.save(user=self.request.user)

# You would also need views for Friendship if you want to list/delete them directly.
# Often friendships are managed through the accept/reject actions on FriendshipRequest.