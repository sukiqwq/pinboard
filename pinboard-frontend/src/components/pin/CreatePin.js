import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBoards } from '../../services/boardService';
import { uploadPicture, createPin } from '../../services/pinService';
import styled from 'styled-components';

const CreatePinContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
  }
`;

const FormColumn = styled.div`
  flex: 1;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #e60023;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    border-color: #e60023;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: #e60023;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #e60023;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  align-self: center;
  
  &:hover {
    background-color: #ad081b;
  }
  
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e60023;
  margin-bottom: 1rem;
  text-align: center;
`;

const ImagePreview = styled.div`
  margin-bottom: 1.5rem;
  border-radius: 16px;
  overflow: hidden;
  max-width: 100%;
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
  }
`;

const UploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: #e60023;
  }
  
  input {
    display: none;
  }
  
  svg {
    margin-bottom: 1rem;
    color: #888;
  }
  
  p {
    margin: 0;
    color: #666;
  }
`;

const BoardLink = styled.a`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #0066cc;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CreatePin = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    boardId: '',
    tags: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { boardId, tags, description } = formData;

  // 获取用户的面板列表
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await getBoards(currentUser.user_id);
        setBoards(response.data);

        // 如果有面板，默认选择第一个
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, boardId: response.data[0].board_id }));
        }
      } catch (err) {
        console.error('获取面板失败:', err);
        setError('无法加载您的面板，请稍后再试');
      }
    };

    fetchBoards();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // 验证文件类型
      if (!file.type.match('image.*')) {
        setError('请上传图片文件');
        return;
      }

      // 文件大小限制 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('图片大小不能超过10MB');
        return;
      }

      setImageFile(file);

      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setError('请选择一张图片上传');
      return;
    }

    if (!boardId) {
      setError('请选择一个面板');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // 1. 上传图片
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('tags', tags);

      const pictureResponse = await uploadPicture(formData);
      const pictureId = pictureResponse.data.picture_id;

      // 2. 创建Pin
      const pinData = {
        board: boardId,
        picture: pictureId,
        description
      };

      const pinResponse = await createPin(pinData);

      // 3. 重定向到新创建的图钉
      navigate(`/pin/${pinResponse.data.pin_id}`);
    } catch (err) {
      console.error('创建图钉失败:', err);
      setError(err.response?.data?.message || '创建图钉失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatePinContainer>
      <Title>创建新图钉</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <FormRow>
          <FormColumn>
            {previewUrl ? (
              <ImagePreview>
                <img src={previewUrl} alt="预览" />
              </ImagePreview>
            ) : (
              <UploadArea onClick={() => document.getElementById('image-upload').click()}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                </svg>
                <p>点击选择一张图片</p>
                <p>或拖放图片到这里</p>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </UploadArea>
            )}

            {previewUrl && (
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageFile(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#e60023', cursor: 'pointer' }}
                >
                  更换图片
                </button>
              </div>
            )}
          </FormColumn>

          <FormColumn>
            <FormGroup>
              <Label htmlFor="boardId">选择面板</Label>
              {boards.length > 0 ? (
                <Select
                  id="boardId"
                  name="boardId"
                  value={boardId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- 选择面板 --</option>
                  {boards.map(board => (
                    <option key={board.board_id} value={board.board_id}>
                      {board.board_name}
                    </option>
                  ))}
                </Select>
              ) : (
                <>
                  <p>您还没有创建任何面板</p>
                  <BoardLink href="/board/create">创建第一个面板</BoardLink>
                </>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tags">标签 (使用逗号分隔)</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={tags}
                onChange={handleChange}
                placeholder="例如: 美食,甜点,巧克力"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">描述 (可选)</Label>
              <TextArea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                placeholder="添加一些关于这张图片的描述..."
              />
            </FormGroup>
          </FormColumn>
        </FormRow>

        <Button type="submit" disabled={loading || !imageFile || !boardId}>
          {loading ? '创建中...' : '创建图钉'}
        </Button>
      </Form>
    </CreatePinContainer>
  );
};

export default CreatePin;