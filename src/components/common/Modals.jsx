import React from 'react';
import { useApp } from '../../context/AppContext';
import LoginModal from '../auth/LoginModal';
import DeleteConfirmModal from './DeleteConfirmModal';

const Modals = () => {
  const { showLoginModal, showDeleteConfirm } = useApp();
  
  return (
    <>
      {showLoginModal && <LoginModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
    </>
  );
};

export default Modals;