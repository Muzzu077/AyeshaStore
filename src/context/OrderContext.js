import React, { createContext, useContext, useReducer, useEffect } from 'react';

const OrderContext = createContext();

const orderReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };

    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };

    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, {
    orders: [],
  });

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('ayesha-orders');
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        dispatch({ type: 'SET_ORDERS', payload: parsedOrders });
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ayesha-orders', JSON.stringify(state.orders));
  }, [state.orders]);

  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
  };

  const getOrdersByStore = (store) => {
    return state.orders.filter(order => 
      order.items.some(item => item.store === store)
    );
  };

  const getOrdersByCustomer = (customerEmail) => {
    return state.orders.filter(order => 
      order.customer.email === customerEmail
    );
  };

  const getOrdersByDateRange = (startDate, endDate) => {
    return state.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const getTotalSalesByStore = (store) => {
    const storeOrders = getOrdersByStore(store);
    return storeOrders.reduce((total, order) => {
      const storeItems = order.items.filter(item => item.store === store);
      return total + storeItems.reduce((itemTotal, item) => 
        itemTotal + (item.price * item.quantity), 0
      );
    }, 0);
  };

  const getRecentOrders = (limit = 10) => {
    return state.orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const value = {
    orders: state.orders,
    addOrder,
    updateOrderStatus,
    getOrdersByStore,
    getOrdersByCustomer,
    getOrdersByDateRange,
    getTotalSalesByStore,
    getRecentOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}; 