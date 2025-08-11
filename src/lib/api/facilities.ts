
import { apiClient } from './client';
import { Facility, Court, SearchFilters, ApiResponse } from '@/types';

export const facilitiesApi = {
  async getFacilities(filters?: SearchFilters): Promise<Facility[]> {
    const response = await apiClient.get<ApiResponse<Facility[]>>('/facilities', {
      params: filters,
    });
    return response.data.data;
  },

  async getFacility(id: string): Promise<Facility> {
    const response = await apiClient.get<ApiResponse<Facility>>(`/facilities/${id}`);
    return response.data.data;
  },

  async getFacilityCourts(facilityId: string): Promise<Court[]> {
    const response = await apiClient.get<ApiResponse<Court[]>>(`/facilities/${facilityId}/courts`);
    return response.data.data;
  },

  async getSportsTypes(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/sports-types');
    return response.data.data;
  },

  async searchFacilities(query: string, filters?: SearchFilters): Promise<Facility[]> {
    const response = await apiClient.get<ApiResponse<Facility[]>>('/facilities/search', {
      params: { q: query, ...filters },
    });
    return response.data.data;
  },

  // Owner APIs
  async createFacility(data: Partial<Facility>): Promise<Facility> {
    const response = await apiClient.post<ApiResponse<Facility>>('/owner/facilities', data);
    return response.data.data;
  },

  async updateFacility(id: string, data: Partial<Facility>): Promise<Facility> {
    const response = await apiClient.put<ApiResponse<Facility>>(`/owner/facilities/${id}`, data);
    return response.data.data;
  },

  async getOwnerFacilities(): Promise<Facility[]> {
    const response = await apiClient.get<ApiResponse<Facility[]>>('/owner/facilities');
    return response.data.data;
  },

  async createCourt(facilityId: string, data: Partial<Court>): Promise<Court> {
    const response = await apiClient.post<ApiResponse<Court>>(`/owner/facilities/${facilityId}/courts`, data);
    return response.data.data;
  },

  async updateCourt(courtId: string, data: Partial<Court>): Promise<Court> {
    const response = await apiClient.put<ApiResponse<Court>>(`/owner/courts/${courtId}`, data);
    return response.data.data;
  },
};
