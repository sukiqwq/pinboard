import os
from dotenv import load_dotenv

# 加载.env文件中的环境变量
load_dotenv()

class Config:
    # 密钥配置
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key'
    
    # 数据库配置
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///pinboard.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # 上传文件配置
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/static/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB最大文件限制
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}