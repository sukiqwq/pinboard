from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.utils import timezone
from .models import (
    CustomUser, FriendshipRequest, Friendship, Board, Picture,
    Pin, FollowStream, Like, Comment
)
from .serializers import (
    UserSerializer, FriendshipRequestSerializer, FriendshipSerializer,
    BoardSerializer, PictureSerializer, PinSerializer,
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

    # 获取用户信息的action
    @action(detail=False, methods=['get'], url_path='by-username/(?P<username>[^/.]+)')
    def get_by_username(self, request, username=None):
        try:
            user = CustomUser.objects.get(username=username)
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # 获取用户拥有的board的信息的action
    @action(detail=True, methods=['get'], url_path='boards')
    def get_user_boards(self, request, pk=None):
        try:
            user = self.get_object()
            boards = Board.objects.filter(owner=user)
            serializer = BoardSerializer(boards, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 获取用户的pin的action
    @action(detail=True, methods=['get'], url_path='pins')
    def get_user_pins(self, request, pk=None):
        try:
            user = self.get_object()
            pins = Pin.objects.filter(user=user)
            serializer = PinSerializer(pins, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

    @action(detail=True, methods=['get'], url_path='friends')
    def get_friends(self, request, pk=None):
        """获取用户的好友列表"""
        try:
            user = self.get_object()

            # 查找该用户参与的所有好友关系
            # Friendship 表中记录了 user1 和 user2 之间的好友关系
            # 需要查找所有 user1=user 或 user2=user 的记录
            friendships = Friendship.objects.filter(
                Q(user1=user) | Q(user2=user)
            )

            # 提取好友用户对象
            friends = []
            for friendship in friendships:
                friend = friendship.user2 if friendship.user1 == user else friendship.user1
                friends.append(friend)

            serializer = UserSerializer(friends, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticatedOrReadOnly], url_path='pins')
    def pins(self, request, pk=None):
        try:
            board = self.get_object()  # 获取当前的 Board 对象
            pins = Pin.objects.filter(board=board)  # 查询与该 Board 关联的所有 Pin
            serializer = PinSerializer(pins, many=True, context={'request': request})
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

    @action(detail=True, methods=['delete'], url_path='unfollow', permission_classes=[permissions.IsAuthenticated])
    def unfollow_board(self, request, pk=None):
        try:
            board = self.get_object()  # 获取面板对象
            user = request.user
            follow_streams = FollowStream.objects.filter(user=user)
            removed = False
            for stream in follow_streams:
                if board in stream.boards.all():
                    stream.boards.remove(board)
                    removed = True
            if removed:
                return Response({"message": "Board unfollowed successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"message": "You were not following this board"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error unfollowing board: {str(e)}")
            return Response(
                {"error": "Failed to unfollow board. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PictureViewSet(viewsets.ModelViewSet):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # 处理图片上传 - 可以是文件上传或URL
        external_url = self.request.data.get('external_url')

        if external_url:
            # 如果提供了外部URL，使用URL保存图片
            serializer.save(
                uploaded_by=self.request.user,
                external_url=external_url
            )
        else:
            # 默认情况，使用上传的文件
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

    def get_serializer_context(self):
        # 将 request 添加到序列化器上下文
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        # Set user to the currently logged-in user [cite: 3]
        # Ensure picture is created or exists before pinning
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'], url_path='get-comments', permission_classes=[permissions.AllowAny])
    def get_comments(self, request, pk=None):
        try:
            pin = self.get_object()  # 获取当前的 Pin 对象
            comments = Comment.objects.filter(pin=pin).order_by('-timestamp')  # 按时间倒序排列
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Pin.DoesNotExist:
            return Response({"error": "Pin not found"}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['post'], url_path='create-comments', permission_classes=[permissions.IsAuthenticated])
    def create_comment(self, request, pk=None):
        try:
            pin = self.get_object()  # 获取当前的 Pin 对象
            content = request.data.get('content')  # 获取评论内容
            allow_friends_comment = pin.board.allow_friends_comment  # 获取 Board 的设置

           # 检查是否仅允许好友评论
            if allow_friends_comment:
                is_friend = Friendship.objects.filter(user1=request.user, user2=pin.user).exists()
                is_owner = pin.board.owner == request.user  # 检查当前用户是否是 Board 的 owner
                if not (is_friend or is_owner):
                    return Response({"error": "You are not allowed to comment on this pin. Only friends are allowed to comment on this board."}, status=status.HTTP_403_FORBIDDEN)

            if not content:
                return Response({"error": "Content is required."}, status=status.HTTP_400_BAD_REQUEST)

            # 创建评论
            comment = Comment.objects.create(
                user=request.user,
                pin=pin,
                content=content
            )

            # 序列化并返回新创建的评论
            serializer = CommentSerializer(comment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Pin.DoesNotExist:
            return Response({"error": "Pin not found."}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['post'], url_path='like', permission_classes=[permissions.IsAuthenticated])
    def like_pin(self, request, pk=None):   
        try:
            pin = self.get_object()  # 获取当前的 Pin 对象
            # 获取原始pin对象
            if pin.origin_pin:
                pin = pin.origin_pin  # 如果是 Repin，获取原始 Pin 对象
            user = request.user

            # 检查用户是否已经喜欢过这个 Pin
            if Like.objects.filter(user=user, pin=pin).exists():
                return Response({"error": "You have already liked this pin."}, status=status.HTTP_400_BAD_REQUEST)

            # 创建新的 Like 对象
            like = Like.objects.create(user=user, pin=pin)

            # 序列化并返回新创建的 Like
            serializer = LikeSerializer(like)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Pin.DoesNotExist:
            return Response({"error": "Pin not found."}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['post'], url_path='unlike', permission_classes=[permissions.IsAuthenticated])
    def unlike_pin(self, request, pk=None):
        try:
            pin = self.get_object()  # 获取当前的 Pin 对象
            # 获取原始pin对象
            if pin.origin_pin:
                pin = pin.origin_pin  # 如果是 Repin，获取原始 Pin 对象
            user = request.user

            # 检查用户是否已经喜欢过这个 Pin
            like = Like.objects.filter(user=user, pin=pin)
            if not like.exists():
                return Response({"error": "You have not liked this pin."}, status=status.HTTP_400_BAD_REQUEST)

            # 删除 Like 对象
            like.delete()

            return Response({"message": "Like removed successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Pin.DoesNotExist:
            return Response({"error": "Pin not found."}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['post'], url_path='repin', permission_classes=[permissions.IsAuthenticated])
    def repin(self, request, pk=None):
        try:
            board = request.data.get('board')  # 获取要添加到的 Board ID
            # 获取当前的 Pin 对象
            pin = self.get_object()
            origin_pin = pin.origin_pin if pin.is_repin else pin  # 获取原始 Pin 对象

            # 检查用户是否尝试转存自己的 Pin
            if origin_pin.user == request.user:
                return Response({"error": "You cannot repin your own pin."}, status=status.HTTP_400_BAD_REQUEST)

            # 创建一个新的 Pin，设置 origin_pin 为当前 Pin
            repin = Pin.objects.create(
                user=request.user,
                origin_pin=origin_pin,  # 设置原始 Pin
                picture=pin.picture,  # 继承原始 Pin 的图片
                title=request.data.get('title', pin.title),  # 使用新的标题
                description=request.data.get('description', pin.description),  # 使用新的描述
                board=Board.objects.get(board_id=board) if board else pin.board,  # 设置 Board
            )

            # 序列化并返回新创建的 Repin
            serializer = PinSerializer(repin)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Pin.DoesNotExist:
            return Response({"error": "Pin not found."}, status=status.HTTP_404_NOT_FOUND)
        

class FriendshipRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendshipRequest.objects.all()
    serializer_class = FriendshipRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users should only see requests involving them
        queryset = FriendshipRequest.objects.filter(
            Q(sender=self.request.user) | Q(receiver=self.request.user)
        )
        return queryset
    
    @action(detail=False, methods=['get'], url_path='list-requests', permission_classes=[permissions.IsAuthenticated])
    def list_requests(self, request):
        # 获取当前用户是接收者的请求
        received_requests = FriendshipRequest.objects.filter(receiver=request.user, status='pending')
        received_serializer = FriendshipRequestSerializer(received_requests, many=True)

        # 获取当前用户是发送者的请求
        sent_requests = FriendshipRequest.objects.filter(sender=request.user)
        sent_serializer = FriendshipRequestSerializer(sent_requests, many=True)

        # 返回分开的数据
        return Response({
            "received": received_serializer.data,
            "sent": sent_serializer.data
        })

    def perform_create(self, serializer):
        # Sender is the current user [cite: 21]
        receiver_id = self.request.data.get('receiver')
        if not receiver_id:
            return Response({"error": "Receiver ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        if receiver_id == self.request.user.id:
            return Response({"error": "You cannot send a friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            receiver = CustomUser.objects.get(id=receiver_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Receiver does not exist."}, status=status.HTTP_404_NOT_FOUND)

        serializer.save(sender=self.request.user, receiver=receiver)

    @action(detail=True, methods=['post'], url_path='accept', permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        friend_request = self.get_object()
        current_user = self.request.user  # 自动获取当前登录用户

        if friend_request.receiver == current_user and friend_request.status == 'pending':
            friend_request.status = 'accepted'
            friend_request.response_time = timezone.now()  # from django.utils import timezone
            friend_request.save()

            # 创建 Friendship 记录
            Friendship.objects.create(user1=friend_request.sender, user2=friend_request.receiver)

            return Response({'status': 'friend request accepted'})
        return Response({'status': 'failed'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='reject', permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        friend_request = self.get_object()
        current_user = self.request.user  # 自动获取当前登录用户

        if friend_request.receiver == current_user and friend_request.status == 'pending':
            friend_request.status = 'rejected'
            friend_request.response_time = timezone.now()  # from django.utils import timezone
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

    @action(detail=True, methods=['get', 'post'], url_path='boards')
    def handle_boards(self, request, pk=None):
        stream = self.get_object()
        # if method is GET, return the content list as response
        if request.method == 'GET':
            # 获取面板列表
            boards = stream.boards.all()
            serializer = BoardSerializer(boards, many=True)
            return Response(serializer.data)
        # else add board in stream and return the response
        elif request.method == 'POST':
            # 添加面板
            try:
                board_id = request.data.get('board_id')
                if not board_id:
                    return Response({"error": "board_id is required"},
                                    status=status.HTTP_400_BAD_REQUEST)
                try:
                    board = Board.objects.get(board_id=board_id)
                except Board.DoesNotExist:
                    return Response({"error": "Board not found"},
                                    status=status.HTTP_404_NOT_FOUND)

                if board in stream.boards.all():
                    return Response({"message": "Board is already in this stream"},
                                    status=status.HTTP_200_OK)

                stream.boards.add(board)
                response_data = {
                    "message": "Board added to stream successfully",
                    "stream_id": stream.stream_id,
                    "stream_name": stream.stream_name,
                    "board": {
                        "board_id": board.board_id,
                        "board_name": board.board_name
                    }
                }
                return Response(response_data, status=status.HTTP_200_OK)
            except Exception as e:
                print(f"Error adding board to stream: {str(e)}")
                return Response({
                    "error": "Failed to add board to stream. Please try again later."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'], url_path='boards/(?P<board_id>[^/.]+)')
    def remove_board(self, request, pk=None, board_id=None):
        try:
            stream = self.get_object()
            # 验证用户权限 - 只有流的所有者可以移除面板
            if stream.user != request.user:
                return Response(
                    {"error": "You do not have permission to modify this stream"},
                    status=status.HTTP_403_FORBIDDEN
                )
            try:
                board = Board.objects.get(board_id=board_id)
            except Board.DoesNotExist:
                return Response(
                    {"error": "Board not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            # 检查面板是否在流中
            if board not in stream.boards.all():
                return Response(
                    {"error": "Board is not in this stream"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # 从流中移除面板
            stream.boards.remove(board)
            return Response(
                {"message": "Board removed from stream successfully"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            # 记录错误并返回
            print(f"Error removing board from stream: {str(e)}")
            return Response(
                {"error": "Failed to remove board from stream"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

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

        # 保存评论
        serializer.save(user=self.request.user)

    def get_comments(self, request, pk=None):
        # 获取特定 Pin 的所有评论
        pin = self.get_object()
        comments = Comment.objects.filter(pin=pin).order_by('-timestamp')
        serializer = self.get_serializer(comments, many=True)
        return Response(serializer.data)


class SearchViewSet(viewsets.ViewSet):
    """
    搜索 API，支持 Pins、Boards、Users 和 Tags 的分页搜索
    """

    @action(detail=False, methods=['get'], url_path='pins')
    def search_pins(self, request):
        from django.db.models import Count  # 在方法内导入Count

        query = request.query_params.get('q', '').strip()
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))
        sort_by = request.query_params.get('sort_by', 'timestamp')

        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 搜索 Pin（通过标题或图片标签）
        pins = Pin.objects.filter(
            Q(picture__tags__icontains=query) | Q(title__icontains=query)
        ).distinct()

        # 添加排序逻辑
        if sort_by == 'likes':
            # 按点赞数量排序（从高到低）
            # 使用 annotate 来计算每个 Pin 的点赞数量
            pins = pins.annotate(likes_count=Count('likes_received')).order_by('-likes_count')
        elif sort_by == 'comments':
            # 按评论数量排序
            pins = pins.annotate(comments_count=Count('comments')).order_by('-comments_count')
        elif sort_by == 'repins':
            # 按转存次数排序
            pins = pins.annotate(repin_count=Count('repins')).order_by('-repin_count')
        else:  # 默认按时间排序
            pins = pins.order_by('-timestamp')

        # 分页
        start = (page - 1) * limit
        end = start + limit
        serializer = PinSerializer(pins[start:end], many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='boards')
    def search_boards(self, request):
        query = request.query_params.get('q', '').strip()
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))

        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 搜索 Board
        boards = Board.objects.filter(
            Q(board_name__icontains=query) | Q(descriptor__icontains=query)  # 使用正确的字段名称
        )

        # 分页
        start = (page - 1) * limit
        end = start + limit
        serializer = BoardSerializer(boards[start:end], many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='users')
    def search_users(self, request):
        query = request.query_params.get('q', '').strip()
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))

        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 搜索用户
        users = CustomUser.objects.filter(username__icontains=query)

        # 分页
        start = (page - 1) * limit
        end = start + limit
        serializer = UserSerializer(users[start:end], many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='tags')
    def search_tags(self, request):
        from django.db.models import Count  # 在方法内导入Count

        query = request.query_params.get('q', '').strip()
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 20))
        sort_by = request.query_params.get('sort_by', 'timestamp')

        if not query:
            return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 搜索 Tags（通过图片的 tag）
        pins = Pin.objects.filter(picture__tags__icontains=query).distinct()

        # 添加排序逻辑
        if sort_by == 'likes':
            # 按点赞数量排序（从高到低）
            pins = pins.annotate(likes_count=Count('likes_received')).order_by('-likes_count')
        elif sort_by == 'comments':
            # 按评论数量排序
            pins = pins.annotate(comments_count=Count('comments')).order_by('-comments_count')
        elif sort_by == 'repins':
            # 按转存次数排序
            pins = pins.annotate(repin_count=Count('repins')).order_by('-repin_count')
        else:  # 默认按时间排序
            pins = pins.order_by('-timestamp')

        # 分页
        start = (page - 1) * limit
        end = start + limit
        serializer = PinSerializer(pins[start:end], many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
# You would also need views for Friendship if you want to list/delete them directly.
# Often friendships are managed through the accept/reject actions on FriendshipRequest.