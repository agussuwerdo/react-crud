import { Item } from './Item';

export interface PaginatedResponse {
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  items: Item[];
}
