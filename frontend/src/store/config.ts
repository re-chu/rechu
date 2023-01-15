import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from 'store/slices/userSlice';
import authSlice from 'store/slices/authSlice';
import formSlice from 'store/slices/formSlice';
import { profileApi } from './apis/profileApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
// redux-persist
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['userState', 'authState'], // 유지 할 데이터 정의
    blacklist: [], // 제외 할 데이터를 정의
};

const combinedReducer = combineReducers({
    userState: userSlice.reducer,
    authState: authSlice.reducer,
    formState: formSlice.reducer,
    [profileApi.reducerPath]:profileApi.reducer,

});

const rootReducer = persistReducer(persistConfig, combinedReducer);

const initialState = {};

const store = configureStore({
    // 리덕스 스토어의 rootReducer를 설정.
    // combineReducers 함수를 사용하여 slice reducer들을 병합한 rootReducer를 설정 가능.
    // 단일 함수로 설정한 경우엔 스토어의 rootReducer로 사용됨.
    // slice reducer로 설정한 경우엔 자동으로 combineReducers에 전달하여 rootReducer를 생성.
    reducer: rootReducer,
 

    // Redux DevTools 사용 여부 설정. (기본값은 true)
    devTools: true,

    // 미들웨어를 설정한 경우엔 자동으로 applyMiddleware에 전달.
    // 미들웨어를 설정하지 않은 경우엔 getDefaultMiddleware를 호출.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(profileApi.middleware),

    //리덕스 스토어의 초기값 설정.
    preloadedState: initialState,

    // 사용자 정의 미들웨어를 설정.
    // 콜백 함수로 설정하면 미들웨어 적용 순서를 정의 가능.
    enhancers: defaultEnhancers => [...defaultEnhancers],
});
setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const persistor = persistStore(store);

export default store;

export {useGetProfileQuery} from './apis/profileApi'