import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialForklifts } from '../data/initialData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Product state
  const [forklifts, setForklifts] = useState(initialForklifts);
  const [selectedForklift, setSelectedForklift] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [showPerPage, setShowPerPage] = useState(12);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Edit/Create state
  const [isEditing, setIsEditing] = useState(false);
  const [editingForklift, setEditingForklift] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, currentPageNum]);

  // Navigation functions
  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    setSelectedForklift(null);
    setSelectedCategory('all');
    setSelectedBrand('all');
    setCurrentPageNum(1);
    setSearchQuery('');
  };

  // Authentication functions
  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'Virgil1973') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('home');
  };

  // Filter and sort functions
  const filterAndSortForklifts = () => {
    let filtered = [...forklifts];

    if (searchQuery) {
      filtered = filtered.filter(f => 
        f.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(f => f.brand === selectedBrand);
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.model.localeCompare(b.model));
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  };

  // CRUD Functions
  const handleCreateForklift = () => {
    const newForklift = {
      id: Math.max(...forklifts.map(f => f.id)) + 1,
      sku: "",
      brand: "Toyota",
      model: "",
      type: "Electric",
      category: "electric",
      capacity: "",
      lift: "",
      price: 0,
      priceFormatted: "€0",
      hirePrice: "€0/week",
      status: "In Stock",
      featured: false,
      image: "https://images.unsplash.com/photo-1581092160607-ee22df5ddc37?w=600&h=400&fit=crop",
      features: [],
      description: "",
      specs: {}
    };
    setEditingForklift(newForklift);
    setIsEditing(true);
    setCurrentPage('admin-edit');
  };

  const handleDeleteForklift = (id) => {
    setForklifts(forklifts.filter(f => f.id !== id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleSaveForklift = (forkliftData) => {
    const formattedPrice = `€${forkliftData.price.toLocaleString()}`;
    const updatedForklift = {
      ...forkliftData,
      priceFormatted: formattedPrice
    };

    if (forkliftData.id && forklifts.find(f => f.id === forkliftData.id)) {
      setForklifts(forklifts.map(f => f.id === forkliftData.id ? updatedForklift : f));
    } else {
      setForklifts([...forklifts, updatedForklift]);
    }
    
    setIsEditing(false);
    setEditingForklift(null);
    setCurrentPage('admin');
  };

  // Pagination
  const filteredForklifts = filterAndSortForklifts();
  const totalPages = Math.ceil(filteredForklifts.length / showPerPage);
  const startIdx = (currentPageNum - 1) * showPerPage;
  const paginatedForklifts = filteredForklifts.slice(startIdx, startIdx + showPerPage);

  const value = {
    // State
    currentPage,
    isMenuOpen,
    forklifts,
    selectedForklift,
    selectedCategory,
    selectedBrand,
    sortBy,
    viewMode,
    showPerPage,
    currentPageNum,
    searchQuery,
    isAuthenticated,
    showLoginModal,
    isEditing,
    editingForklift,
    showDeleteConfirm,
    deleteId,
    filteredForklifts,
    paginatedForklifts,
    totalPages,
    
    // Setters
    setCurrentPage,
    setIsMenuOpen,
    setForklifts,
    setSelectedForklift,
    setSelectedCategory,
    setSelectedBrand,
    setSortBy,
    setViewMode,
    setShowPerPage,
    setCurrentPageNum,
    setSearchQuery,
    setIsAuthenticated,
    setShowLoginModal,
    setIsEditing,
    setEditingForklift,
    setShowDeleteConfirm,
    setDeleteId,
    
    // Functions
    navigateTo,
    handleLogin,
    handleLogout,
    handleCreateForklift,
    handleDeleteForklift,
    handleSaveForklift,
    filterAndSortForklifts
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};