# 导入所有模型以便迁移可以检测到它们
from app.models.user import User
from app.models.board import Board
from app.models.picture import Picture
from app.models.pin import Pin, Repin
from app.models.friendship import Friendship, FriendshipRequest
from app.models.comment import CommentPin, CommentRepin
from app.models.like import Like
from app.models.follow import FollowStream, FollowStreamBoard