import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBoards } from '../../services/boardService';
import { uploadPicture, createPin, createRepin } from '../../services/pinService';
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

const UploadOptions = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
`;

const UploadTab = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  border-bottom: 3px solid ${props => props.active ? '#e60023' : 'transparent'};
  color: ${props => props.active ? '#e60023' : '#666'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #e60023;
  }
`;

const UrlInput = styled.div`
  margin-bottom: 1.5rem;
`;

const UrlButton = styled.button`
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  cursor: pointer;
  
  &:hover {
    background-color: #ddd;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CreatePin = (props) => {
  const location = useLocation();
  const { isRepin, originPin } = location.state || {}; // 获取传递的参数
  console.log('isRepin:', isRepin, 'originPin:', originPin); // 调试输出
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    boardId: '',
    tags: isRepin && originPin ? originPin.picture_detail.tags : '', // 如果是转存，使用原始 Pin 的标签
    description: '',
    title: '',
    imageUrl: '' // 新增：URL上传的图片地址
  });
  const [previewUrl, setPreviewUrl] = useState(isRepin && originPin ? originPin.picture_detail?.image_url : null);
  const [imageFile, setImageFile] = useState(isRepin ? null : null); // 如果是 repin，不允许上传新图片
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 新增：上传方式选择
  const [uploadMethod, setUploadMethod] = useState('local'); // 'local' or 'url'
  const [fetchingUrl, setFetchingUrl] = useState(false);

  const { boardId, tags, description, title, imageUrl } = formData;

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
        console.error('Failed to fetch boards:', err);
        setError('Unable to load your boards. Please try again later.');
      }
    };

    fetchBoards();
  }, [currentUser, props.originPin]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // 验证文件类型
      if (!file.type.match('image.*')) {
        setError('Please upload an image file.');
        return;
      }

      // 文件大小限制 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size cannot exceed 10MB.');
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
  
  // 处理URL图片预览
  const handleFetchImageUrl = () => {
    if (!imageUrl.trim()) {
      setError('Please enter a valid image URL');
      return;
    }
    
    setFetchingUrl(true);
    setError('');
    
    // 创建一个Image对象来测试URL是否有效
    const img = new Image();
    img.onload = () => {
      setPreviewUrl(imageUrl);
      setFetchingUrl(false);
    };
    img.onerror = () => {
      setError('Failed to load image from URL. Please check the URL and try again.');
      setFetchingUrl(false);
    };
    img.src = imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!boardId) {
      setError('Please select a board.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (isRepin && originPin) {
        // Repin 操作
        const repinData = {
          board: boardId,
          origin_pin: originPin.pin_id,
          title: title,
          description: description,
        };

        const repinResponse = await createRepin(repinData);
        navigate(`/pin/${repinResponse.data.pin_id}`);
      } else {
        // 创建新 Pin 操作
        if (uploadMethod === 'local' && !imageFile) {
          setError('Please select an image to upload.');
          setLoading(false);
          return;
        }
        
        if (uploadMethod === 'url' && !previewUrl) {
          setError('Please enter a valid image URL and fetch the image.');
          setLoading(false);
          return;
        }

        // 1. 上传图片
        const formData = new FormData();
        
        if (uploadMethod === 'local') {
          formData.append('image_file', imageFile);
        } else {
          formData.append('external_url', imageUrl);
        }
        
        formData.append('tags', tags); // 使用用户输入的标签

        const pictureResponse = await uploadPicture(formData);
        const pictureId = pictureResponse.data.picture_id;

        // 2. 创建 Pin
        const pinData = {
          board: boardId,
          picture: pictureId,
          title,
          description,
        };

        const pinResponse = await createPin(pinData);

        // 3. 重定向到新创建的图钉
        navigate(`/pin/${pinResponse.data.pin_id}`);
      }
    } catch (err) {
      console.error('Operation failed:', err);
      setError(err.response?.data?.message || 'Operation failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatePinContainer>
      <Title>Create New Pin</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {isRepin && originPin && (
        <div style={{ marginBottom: '1rem', textAlign: 'center', color: '#666' }}>
          Repinning pin: <strong>{originPin.title}</strong>
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <FormRow>
          <FormColumn>
            {!isRepin && (
              <UploadOptions>
                <UploadTab 
                  active={uploadMethod === 'local'} 
                  onClick={() => setUploadMethod('local')}
                  type="button"
                >
                  Upload Image
                </UploadTab>
                <UploadTab 
                  active={uploadMethod === 'url'} 
                  onClick={() => setUploadMethod('url')}
                  type="button"
                >
                  Image URL
                </UploadTab>
              </UploadOptions>
            )}
            
            {previewUrl ? (
              <ImagePreview>
                <img src={previewUrl} alt="Preview" />
              </ImagePreview>
            ) : (
              !isRepin && (
                uploadMethod === 'local' ? (
                  <UploadArea onClick={() => document.getElementById('image-upload').click()}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
                    </svg>
                    <p>Click to select an image</p>
                    <p>or drag and drop an image here</p>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isRepin} // 禁用上传功能
                    />
                  </UploadArea>
                ) : (
                  <UrlInput>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      value={imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                    <UrlButton 
                      type="button" 
                      onClick={handleFetchImageUrl}
                      disabled={fetchingUrl || !imageUrl.trim()}
                    >
                      {fetchingUrl ? 'Fetching...' : 'Fetch Image'}
                    </UrlButton>
                  </UrlInput>
                )
              )
            )}

            {previewUrl && !isRepin && (
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setImageFile(null);
                    if (uploadMethod === 'url') {
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: '#e60023', cursor: 'pointer' }}
                >
                  Change Image
                </button>
              </div>
            )}
          </FormColumn>

          <FormColumn>
            <FormGroup>
              <Label htmlFor="boardId">Select Board</Label>
              {boards.length > 0 ? (
                <Select
                  id="boardId"
                  name="boardId"
                  value={boardId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Board --</option>
                  {boards.map(board => (
                    <option key={board.board_id} value={board.board_id}>
                      {board.board_name}
                    </option>
                  ))}
                </Select>
              ) : (
                <>
                  <p>You haven't created any boards yet.</p>
                  <BoardLink href="/board/create">Create your first board</BoardLink>
                </>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={handleChange}
                placeholder="Enter pin title"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="tags">Tags (separated by commas)</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                value={tags}
                onChange={handleChange}
                placeholder="e.g., food, dessert, chocolate"
                disabled={isRepin} // 如果是转存，禁用标签输入框
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Description (optional)</Label>
              <TextArea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                placeholder="Add a description about this image..."
              />
            </FormGroup>
          </FormColumn>
        </FormRow>

        <Button 
          type="submit" 
          disabled={
            loading || 
            (!isRepin && uploadMethod === 'local' && !imageFile) || 
            (!isRepin && uploadMethod === 'url' && !previewUrl) || 
            !boardId
          }
        >
          {loading ? 'Creating...' : 'Create Pin'}
        </Button>
      </Form>
    </CreatePinContainer>
  );
};

export default CreatePin;