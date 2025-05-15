import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, MoreHorizontal, ArrowLeft, BookmarkPlus, Send, Repeat } from 'lucide-react';
import { getPin, getComments, addComment, likePin, unlikePin, createRepin } from '../../services/pinService';
import { UserAvatar } from '../common/Navbar.styles';

// 格式化日期时间的辅助函数
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function PinDetail() {
  const { pinId } = useParams(); // 使用 useParams 获取 URL 参数
  const navigate = useNavigate();
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // 获取Pin详情
  useEffect(() => {
    const fetchPinData = async () => {
      try {
        setLoading(true);
        const response = await getPin(pinId);
        setPin(response.data);
        console.log('Pin详情:', response.data);
        setIsLiked(response.data.is_liked || false);
        setLoading(false);
      } catch (err) {
        console.error('获取Pin详情失败:', err);
        setError('获取Pin详情失败');
        setLoading(false);
      }
    };

    if (pinId) {
      fetchPinData();
    }
  }, [pinId]);

  // 获取评论
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(pinId);
        setComments(response.data);
      } catch (err) {
        console.error('获取评论失败:', err);
      }
    };

    if (pinId) {
      fetchComments();
    }
  }, [pinId]);

  // 处理点赞
  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePin(pinId);
        setPin(prev => ({
          ...prev,
          likes_received: (prev.likes_received || 0) - 1
        }));
      } else {
        await likePin(pinId);
        setPin(prev => ({
          ...prev,
          likes_received: (prev.likes_received || 0) + 1
        }));
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('点赞操作失败:', err);
    }
  };

  const handleRepin = () => {
    if (!window.confirm('确定要转存这个图钉吗？')) {
      return; // 如果用户取消，则直接返回
    }

    // 跳转到 CreatePin 页面，并传递 isRepin 和 originPin 信息
    navigate('/pin/create', {
      state: {
        isRepin: true,
        originPin: pin, // 将当前 Pin 的信息传递过去
      },
    });
  };

  // 提交评论
  const handleCommentSubmit = async () => {
    if (commentText.trim() && !submittingComment) {
      try {
        setSubmittingComment(true);
        const response = await addComment({ pinId, content: commentText });

        // 添加新评论到列表
        setComments(prev => [...prev, response.data]);

        // 更新评论计数
        setPin(prev => ({
          ...prev,
          comments_count: (prev.comments_count || 0) + 1
        }));

        setCommentText('');
      } catch (err) {
        console.error('添加评论失败:', err);
      } finally {
        setSubmittingComment(false);
      }
    }
  };

  const handleGoBack = () => {
    // 在实际应用中，这里应该使用路由导航返回
    window.history.back();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-10 bg-white px-4 py-2 flex items-center justify-between shadow-sm">
        <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} />
        </button>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Share2 size={24} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">加载中...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-red-500">{error}</div>
        </div>
      ) : pin ? (
        <div className="flex flex-col md:flex-row max-w-6xl mx-auto w-full bg-white shadow-md">
          {/* 详情部分 */}
          <div className="md:w-1/3 flex flex-col">
            {/* Pin信息 */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={pin.picture_detail?.image_url || pin.picture_detail?.image_file}
                    alt={pin.user?.username || '用户'}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{pin.user?.username || '未知用户'}</span>
                </div>
                <button
                  className={`p-2 rounded-full hover:bg-gray-100`}
                  onClick={handleRepin}
                >
                  <Repeat size={24} />
                </button>
              </div>

              {/* 如果是转存的 Pin，显示小字说明和跳转链接 */}
              {pin.is_repin && pin.origin_pin_detail && (
                <div className="text-sm text-gray-500 mb-4">
                  此图钉是repin, 点赞会点到原始pin上{' '}
                  <a
                    href={`/pin/${pin.origin_pin_detail.pin_id}`}
                    className="text-blue-500 hover:underline"
                  >
                    原始pin
                  </a>
                </div>
              )}

              <h1 className="text-xl font-bold mb-2">{pin.title}</h1>
              <p className="text-gray-700 mb-4">{pin.description}</p>
              {pin.tags && pin.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {pin.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center space-x-1"
                  onClick={handleLike}
                >
                  <Heart size={20} fill={isLiked ? "red" : "none"} color={isLiked ? "red" : "currentColor"} />
                  <span>{pin.likes_received || 0}</span>
                </button>
              </div>
            </div>

            {/* 评论区域 */}
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="font-medium mb-4">评论</h2>
              <div className="space-y-4">
                {comments.length > 0 ? comments.map(comment => (
                  <div key={comment.id} className="flex space-x-2">
                    {/* 用户头像 */}
                    {/* 用户信息和评论内容 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.user?.username || '未知用户'}</span>
                        <span className="text-xs text-gray-500">{formatDateTime(comment.timestamp)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-500 text-center py-4">暂无评论</p>
                )}
              </div>
            </div>

            {/* 评论输入框 */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <UserAvatar>
                  {pin.user.username.charAt(0).toUpperCase()}
                </UserAvatar>
                <input
                  type="text"
                  placeholder="添加评论..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCommentSubmit();
                    }
                  }}
                  disabled={submittingComment}
                />
                <button
                  onClick={handleCommentSubmit}
                  className={`p-2 text-blue-500 hover:bg-blue-50 rounded-full ${submittingComment ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={submittingComment}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}