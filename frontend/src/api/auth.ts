export const fetchWithCredentials = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include', 
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};