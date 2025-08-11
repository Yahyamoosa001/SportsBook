
import { apiClient } from './client';
import { Booking, ApiResponse } from '@/types';

export const bookingsApi = {
  async createBooking(data: Partial<Booking>): Promise<Booking> {
    const response = await apiClient.post<ApiResponse<Booking>>('/user/bookings', data);
    return response.data.data;
  },

  async getUserBookings(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/user/bookings');
    return response.data.data;
  },

  async getBooking(id: string): Promise<Booking> {
    const response = await apiClient.get<ApiResponse<Booking>>(`/user/bookings/${id}`);
    return response.data.data;
  },

  async cancelBooking(id: string): Promise<void> {
    await apiClient.put(`/user/bookings/${id}/cancel`);
  },

  async getOwnerBookings(): Promise<Booking[]> {
    const response = await apiClient.get<ApiResponse<Booking[]>>('/owner/bookings');
    return response.data.data;
  },

  async updateBookingStatus(id: string, status: string): Promise<void> {
    await apiClient.put(`/owner/bookings/${id}/status`, { status });
  },

  async getAvailability(courtId: string, date: string): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(`/courts/${courtId}/availability`, {
      params: { date },
    });
    return response.data.data;
  },
};
