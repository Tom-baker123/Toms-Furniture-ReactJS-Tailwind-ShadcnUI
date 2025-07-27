import { useCallback } from "react";

const useApiFetch = (setLoading, setError, setState) => {
    const fetchData = useCallback(
        async (apiFunc, setterKey, params = undefined, postProcess) => {
            setLoading(true);
            setError(null);
            try {
                const response = params !== undefined ? await apiFunc(params) : await apiFunc();
                const value = postProcess ? postProcess(response) : response;
                setState((prev) => ({ ...prev, [setterKey]: value }));
                return value;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setError, setState]
    );
    return fetchData;
};

export default useApiFetch;
