import toast from 'react-hot-toast';

export const createErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
    style: {
      padding: '20px',
    },
  });
};

export const createSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      padding: '20px',
    },
  });
};
