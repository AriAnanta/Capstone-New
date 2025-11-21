import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, unwrapData } from '@/api/client';
import { mockDocuments, mockPerkaras, mockPublicDecisions } from '@/api/mocks';

const withFallback = async (promise, fallback) => {
    try {
        const response = await promise;
        return unwrapData(response);
    } catch (error) {
        console.warn('Falling back to mock data', error.message);
        return fallback;
    }
};

const serializeParams = (params) => JSON.stringify(params ?? {});

export const usePerkaras = (params = undefined) =>
    useQuery({
        queryKey: ['perkaras', serializeParams(params)],
        queryFn: () => withFallback(apiClient.get('/perkaras', { params }), mockPerkaras),
    });

export const useDocuments = (params = undefined) =>
    useQuery({
        queryKey: ['documents', serializeParams(params)],
        queryFn: () => withFallback(apiClient.get('/documents', { params }), mockDocuments),
    });

export const usePublicDecisions = (params = undefined) =>
    useQuery({
        queryKey: ['public-decisions', serializeParams(params)],
        queryFn: () => withFallback(apiClient.get('/public/putusan', { params }), mockPublicDecisions),
    });

export const useDocument = (documentId) =>
    useQuery({
        enabled: Boolean(documentId),
        queryKey: ['document', documentId],
        queryFn: () => withFallback(apiClient.get(`/documents/${documentId}`), mockDocuments[0]),
    });

export const useCreatePerkara = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => apiClient.post('/perkaras', payload).then(unwrapData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['perkaras'] });
        },
    });
};

export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ dokumen, metadata = {}, tags = [], ...fields }) => {
            const formData = new FormData();

            Object.entries(fields).forEach(([key, value]) => {
                if (value === undefined || value === null) return;
                formData.append(key, value);
            });

            if (dokumen) {
                formData.append('dokumen', dokumen);
            }

            Object.entries(metadata).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '') return;
                formData.append(`metadata[${key}]`, value);
            });

            tags.filter(Boolean).forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });

            return apiClient
                .post('/documents', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then(unwrapData);
        },
        onSuccess: (document) => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            if (document?.id) {
                queryClient.setQueryData(['document', document.id], document);
            }
        },
    });
};

export const useManualSummary = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload) => apiClient.post(`/documents/${documentId}/summaries`, payload).then(unwrapData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document', documentId] });
        },
    });
};

export const useReprocessDocument = (documentId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload = {}) =>
            apiClient
                .patch(`/documents/${documentId}`, {
                    reprocess: true,
                    ...payload,
                })
                .then(unwrapData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['document', documentId] });
        },
    });
};
