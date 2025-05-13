export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // 今天
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? '刚刚' : `${diffMinutes} 分钟前`;
    }
    
    return `${diffHours} 小时前`;
  } else if (diffDays === 1) {
    // 昨天
    return '昨天';
  } else if (diffDays < 7) {
    // 本周内
    return `${diffDays} 天前`;
  } else if (diffDays < 30) {
    // 本月内
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} 周前`;
  } else if (diffDays < 365) {
    // 今年内
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} 个月前`;
  } else {
    // 超过一年
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};