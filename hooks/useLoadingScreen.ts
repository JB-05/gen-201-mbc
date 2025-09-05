import { useLoading } from '@/providers/LoadingProvider';

export function useLoadingScreen() {
    const { isLoading, setIsLoading } = useLoading();

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return {
        isLoading,
        showLoading,
        hideLoading
    };
}
