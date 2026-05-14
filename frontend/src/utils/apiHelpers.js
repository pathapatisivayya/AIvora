/** Django REST Framework paginates lists as `{ results: [...], count }`. */
export function listFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}
