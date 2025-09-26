/* 파일 설명: 연락처 탭 컴포넌트
   - 연락처 목록 표시, 검색, 통화 기능 제공 */
import React, { useState, useMemo } from 'react';
import { Contact } from '@/types/phone.types';
import ContactItem from './ContactItem';
import AddContactModal from './AddContactModal';

interface ContactsTabProps {
  contacts: Contact[];
  searchQuery: string;
  onMakeCall: (phoneNumber: string, contactName?: string) => void;
  onAddContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateContact: (id: string, updates: Partial<Contact>) => void;
  onDeleteContact: (id: string) => void;
}

const ContactsTab: React.FC<ContactsTabProps> = ({
  contacts,
  searchQuery,
  onMakeCall,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'lastCall' | 'callCount'>('name');

  // 연락처 필터링 및 정렬
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts.filter(contact => {
      const query = searchQuery.toLowerCase();
      return (
        contact.name.toLowerCase().includes(query) ||
        contact.phoneNumber.includes(query) ||
        contact.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastCall':
          if (!a.lastCallTime && !b.lastCallTime) return 0;
          if (!a.lastCallTime) return 1;
          if (!b.lastCallTime) return -1;
          return b.lastCallTime.getTime() - a.lastCallTime.getTime();
        case 'callCount':
          return b.callCount - a.callCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [contacts, searchQuery, sortBy]);

  // 즐겨찾기 연락처
  const favoriteContacts = filteredAndSortedContacts.filter(contact => contact.isFavorite);
  const regularContacts = filteredAndSortedContacts.filter(contact => !contact.isFavorite);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* 툴바 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="name">이름순</option>
            <option value="lastCall">최근 통화순</option>
            <option value="callCount">통화 횟수순</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <span className="mr-2 flex items-center">
            <img src="/images/Add User(light).png" alt="add" className="w-4 h-4 dark:hidden brightness-0 invert" />
            <img src="/images/Add User(dark).png" alt="add" className="w-4 h-4 hidden dark:block brightness-0 invert" />
          </span>
          연락처 추가
        </button>
      </div>

      {/* 연락처 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium mb-2">연락처가 없습니다</p>
            <p className="text-sm text-center">
              {searchQuery ? '검색 결과가 없습니다' : '새 연락처를 추가해보세요'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* 즐겨찾기 섹션 */}
            {favoriteContacts.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  즐겨찾기
                </div>
                {favoriteContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    onMakeCall={onMakeCall}
                    onUpdateContact={onUpdateContact}
                    onDeleteContact={onDeleteContact}
                  />
                ))}
              </div>
            )}

            {/* 일반 연락처 섹션 */}
            {regularContacts.length > 0 && (
              <div>
                {favoriteContacts.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    모든 연락처
                  </div>
                )}
                {regularContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    onMakeCall={onMakeCall}
                    onUpdateContact={onUpdateContact}
                    onDeleteContact={onDeleteContact}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 연락처 추가 모달 */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddContact}
        />
      )}
    </div>
  );
};

export default ContactsTab;
