import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import API from 'utils/api'
const token=localStorage.getItem('accessToken')


const profileApi=createApi({
  reducerPath:'profile',
  baseQuery:fetchBaseQuery({
    baseUrl:`${API.BASE_URL}`,
    prepareHeaders:(header)=>{
      header.set('authorization',`Bearer ${token}`)
      return header
    }
  }),
  endpoints(builder){
    return {
      getProfile:builder.query({
        query:(user)=>{
          console.log('Test:',user)
          return{
            url:'/users/individuals',
            method:'GET',
          }
        }
      })
    }
  }
})

export const {useGetProfileQuery}=profileApi

export {profileApi}