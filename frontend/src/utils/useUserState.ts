import { useState, useCallback } from 'react';
import { setAdmin, setAlarm } from 'store/slices/userSlice';
import { useAppDispatch, useAppSelector } from 'store/config';

const useUserState = () => {
    const userState = useAppSelector(state => state.userState);
    const dispatch = useAppDispatch();

    return [];
};

// export default useUserState;

export {};
