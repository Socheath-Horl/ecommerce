export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_FILES_PER_REQUEST = 5;

export const FILE_ENTITY_TYPES = ['user', 'avatar', 'product', 'category', 'review'] as const;

export const FOLDER_BY_ENTITY_TYPE: Record<string, string> = {
  user: 'avatars',
  avatar: 'avatars',
  product: 'products',
  category: 'categories',
  review: 'reviews',
};