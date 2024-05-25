import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  // ログインページの場合はヘッダーを表示しない
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header>
      {/* ヘッダーのコンテンツ */}
      <h1>ヘッダータイトル</h1>
    </header>
  );
};

export default Header;