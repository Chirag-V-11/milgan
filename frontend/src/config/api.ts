export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  if (typeof window !== 'undefined') {
    // If running on a mobile device or other local network device,
    // replace 'localhost' with the current machine's IP/hostname.
    if (envUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      return envUrl.replace('localhost', window.location.hostname);
    }
  }
  return envUrl;
}
