import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  setModalState,
  addNotification,
  removeNotification,
  clearNotifications,
  setPagination,
  setSearch,
  clearSearch,
  selectNotifications,
  selectPagination,
  selectSearch,
} from "./slices/uiSlice";

/**
 * Custom hook for typed dispatch
 * Provides type-safe dispatch function
 */
export const useAppDispatch = useDispatch;

/**
 * Custom hook for typed selector
 * Provides type-safe selector function
 */
export const useAppSelector = useSelector;

/**
 * Custom hook for creating memoized selectors
 * Optimizes performance by preventing unnecessary re-renders
 */
export const useMemoizedSelector = (selector, equalityFn) => {
  return useSelector(selector, equalityFn);
};

/**
 * Custom hook for handling async operations with loading states
 * Provides loading, error, and success states for async operations
 */
export const useAsyncOperation = (asyncThunk, options = {}) => {
  const dispatch = useAppDispatch();

  const execute = useCallback(
    async (params) => {
      try {
        const result = await dispatch(asyncThunk(params)).unwrap();
        if (options.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      } catch (error) {
        if (options.onError) {
          options.onError(error);
        }
        throw error;
      }
    },
    [dispatch, asyncThunk, options]
  );

  return { execute };
};

/**
 * Custom hook for managing modal states
 * Provides centralized modal management
 */
export const useModal = (modalName) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals[modalName]);

  const open = useCallback(() => {
    dispatch(setModalState({ modalName, isOpen: true }));
  }, [dispatch, modalName]);

  const close = useCallback(() => {
    dispatch(setModalState({ modalName, isOpen: false }));
  }, [dispatch, modalName]);

  const toggle = useCallback(() => {
    dispatch(setModalState({ modalName, isOpen: !isOpen }));
  }, [dispatch, modalName, isOpen]);

  return { isOpen, open, close, toggle };
};

/**
 * Custom hook for managing notifications
 * Provides centralized notification management
 */
export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  const addNotification = useCallback(
    (notification) => {
      dispatch(addNotification(notification));
    },
    [dispatch]
  );

  const removeNotification = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
};

/**
 * Custom hook for managing search and filters
 * Provides centralized search and filter management
 */
export const useSearchAndFilters = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);

  const setSearchQuery = useCallback(
    (query) => {
      dispatch(setSearch({ query }));
    },
    [dispatch]
  );

  const setFilters = useCallback(
    (filters) => {
      dispatch(setSearch({ filters }));
    },
    [dispatch]
  );

  const setSorting = useCallback(
    (sortBy, sortOrder) => {
      dispatch(setSearch({ sortBy, sortOrder }));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  return {
    search,
    setSearchQuery,
    setFilters,
    setSorting,
    clearAll,
  };
};

/**
 * Custom hook for managing pagination
 * Provides centralized pagination management
 */
export const usePagination = () => {
  const dispatch = useAppDispatch();
  const pagination = useAppSelector(selectPagination);

  const setPage = useCallback(
    (page) => {
      dispatch(setPagination({ currentPage: page }));
    },
    [dispatch]
  );

  const setPageSize = useCallback(
    (pageSize) => {
      dispatch(setPagination({ pageSize, currentPage: 1 }));
    },
    [dispatch]
  );

  const setTotalItems = useCallback(
    (totalItems) => {
      dispatch(setPagination({ totalItems }));
    },
    [dispatch]
  );

  const nextPage = useCallback(() => {
    const nextPageNum = pagination.currentPage + 1;
    const maxPage = Math.ceil(pagination.totalItems / pagination.pageSize);
    if (nextPageNum <= maxPage) {
      dispatch(setPagination({ currentPage: nextPageNum }));
    }
  }, [
    dispatch,
    pagination.currentPage,
    pagination.totalItems,
    pagination.pageSize,
  ]);

  const prevPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      dispatch(setPagination({ currentPage: pagination.currentPage - 1 }));
    }
  }, [dispatch, pagination.currentPage]);

  return {
    pagination,
    setPage,
    setPageSize,
    setTotalItems,
    nextPage,
    prevPage,
  };
};
