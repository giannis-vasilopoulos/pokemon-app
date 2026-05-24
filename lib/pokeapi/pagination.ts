import { PAGE_SIZE } from '../constants';

export function paginateList<T>(items: T[], offset: number, limit = PAGE_SIZE) {
  return {
    items: items.slice(offset, offset + limit),
    total: items.length,
    hasNext: offset + limit < items.length,
    hasPrev: offset > 0,
  };
}
