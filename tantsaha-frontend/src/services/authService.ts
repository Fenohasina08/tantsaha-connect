import api from './api';

export const loginUser = async (telephone: string) => {
  // Cette ligne appelle ton auth.controller.ts côté backend
  const response = await api.post('/auth/login', { telephone });
  return response.data; 
};