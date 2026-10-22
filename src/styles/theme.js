export const colors = {
  primary: '#4F46E5',        // Modern Indigo
  primaryDark: '#3730A3',
  primaryLight: '#EEF2FF',
  secondary: '#0EA5E9',      // Sky Blue
  accent: '#F59E0B',         // Amber / Gold for stars
  background: '#F8FAFC',     // Clean slate light background
  card: '#FFFFFF',
  text: '#0F172A',           // Dark slate
  textSecondary: '#64748B',  // Muted slate
  textLight: '#94A3B8',
  border: '#E2E8F0',
  error: '#EF4444',          // Vibrant red for validation errors
  errorLight: '#FEE2E2',
  success: '#10B981',        // Emerald green
  successLight: '#D1FAE5',
  starFilled: '#F59E0B',
  starEmpty: '#CBD5E1',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  caption: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.error,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
};
