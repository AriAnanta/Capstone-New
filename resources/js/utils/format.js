import dayjs from 'dayjs';

export const formatDate = (date, fallback = '-') => {
    if (!date) return fallback;
    return dayjs(date).format('DD MMM YYYY');
};

export const formatStatus = (status) => status?.replace('_', ' ').toUpperCase();
