/* 파일 설명: 연락처 아이템 컴포넌트
   - 개별 연락처 정보 표시 및 액션 버튼 제공 */
import React, { useState } from 'react';
import { Contact } from '@/types/phone.types';

interface ContactItemProps {
  contact: Contact;
  onMakeCall: (phoneNumber: string, contactName?: string) => void;
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
  onDeleteContact: (id: string) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  onMakeCall,
  onUpdateContact,
  onDeleteContact,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleMakeCall = () => {
    onMakeCall(contact.phoneNumber, contact.name);
  };

  const handleToggleFavorite = () => {
    onUpdateContact(contact.id, { isFavorite: !contact.isFavorite });
  };

  const handleToggleBlock = () => {
    onUpdateContact(contact.id, { isBlocked: !contact.isBlocked });
  };

  const handleDelete = () => {
    if (window.confirm(`${contact.name} 연락처를 삭제하시겠습니까?`)) {
      onDeleteContact(contact.id);
    }
  };

  const formatLastCallTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInHours < 48) return '어제';
    return date.toLocaleDateString('ko-KR');
  };

  const getRiskLevelColor = (riskLevel: number) => {
    if (riskLevel <= 30) return 'text-green-600 bg-green-100';
    if (riskLevel <= 60) return 'text-yellow-600 bg-yellow-100';
    if (riskLevel <= 80) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        {/* 연락처 정보 */}
        <div className="flex items-center flex-1 min-w-0">
          {/* 아바타 */}
          <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 font-medium text-sm">
                {contact.name.charAt(0)}
              </span>
            )}
          </div>

          {/* 연락처 세부 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {contact.name}
              </h3>
              {contact.isFavorite && (
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
              {contact.isBlocked && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  차단됨
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{contact.phoneNumber}</p>
            {/* 부가 정보(최근 통화/횟수/위험도)는 요청에 따라 숨김 처리 */}
            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleMakeCall}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            title="통화"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="더보기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 액션 메뉴 */}
      {showActions && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                contact.isFavorite
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-yellow-50 dark:hover:bg-gray-700'
              }`}
            >
              {contact.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
            </button>
            <button
              onClick={handleToggleBlock}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                contact.isBlocked
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-red-50 dark:hover:bg-gray-700'
              }`}
            >
              {contact.isBlocked ? '차단 해제' : '차단하기'}
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactItem;
