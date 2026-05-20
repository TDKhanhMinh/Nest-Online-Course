export const formatDateTime = (dateString: string, format?: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(format || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};