import React, { createContext, useContext, useReducer, useEffect } from 'react';

const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'REGISTER_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
        currentUser: action.payload,
      };

    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: action.payload,
      };

    case 'LOGOUT_USER':
      return {
        ...state,
        currentUser: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: action.payload,
      };

    case 'ADD_ADDRESS':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          addresses: [...(state.currentUser.addresses || []), action.payload],
        },
        users: state.users.map(user =>
          user.id === state.currentUser.id
            ? { ...user, addresses: [...(user.addresses || []), action.payload] }
            : user
        ),
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    users: [],
    currentUser: null,
  });

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('ayesha-users');
    const savedCurrentUser = localStorage.getItem('ayesha-current-user');
    
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        dispatch({ type: 'SET_USERS', payload: parsedUsers });
      } catch (error) {
        console.error('Error loading users from localStorage:', error);
      }
    }
    
    if (savedCurrentUser) {
      try {
        const parsedCurrentUser = JSON.parse(savedCurrentUser);
        dispatch({ type: 'LOGIN_USER', payload: parsedCurrentUser });
      } catch (error) {
        console.error('Error loading current user from localStorage:', error);
      }
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ayesha-users', JSON.stringify(state.users));
  }, [state.users]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('ayesha-current-user', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('ayesha-current-user');
    }
  }, [state.currentUser]);

  const registerUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      addresses: [],
      orders: [],
    };
    dispatch({ type: 'REGISTER_USER', payload: newUser });
    return newUser;
  };

  const loginUser = (email, password) => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      dispatch({ type: 'LOGIN_USER', payload: user });
      return { success: true, user };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logoutUser = () => {
    dispatch({ type: 'LOGOUT_USER' });
  };

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const addAddress = (address) => {
    const newAddress = {
      id: Date.now().toString(),
      ...address,
    };
    dispatch({ type: 'ADD_ADDRESS', payload: newAddress });
  };

  const isAuthenticated = () => {
    return state.currentUser !== null;
  };

  const value = {
    users: state.users,
    currentUser: state.currentUser,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    addAddress,
    isAuthenticated,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 