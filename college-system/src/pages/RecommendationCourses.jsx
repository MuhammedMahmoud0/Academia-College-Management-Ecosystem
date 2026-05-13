import { useEffect, useMemo, useRef, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import RecommendationConversation from '../components/models/recommendation model/RecommendationConversation';
import RecommendationPromptComposer from '../components/models/recommendation model/RecommendationPromptComposer';
import { getCourseRecommendations } from '../services/recommendationCourses';

const createId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export default function RecommendationCourses() {
    const { showNotification } = useNotification();
    const [prompt, setPrompt] = useState('');
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const conversationEndRef = useRef(null);

    const hasConversation = useMemo(() => entries.length > 0, [entries]);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [entries, isLoading]);

    const handleSubmit = async (forcedPrompt) => {
        const nextPrompt = (forcedPrompt ?? prompt).trim();
        if (!nextPrompt || isLoading) return;
        setIsLoading(true);

        const userEntryId = createId();
        const assistantEntryId = createId();

        setEntries((prev) => [
            ...prev,
            { id: userEntryId, type: 'user', content: nextPrompt },
            { id: assistantEntryId, type: 'assistant', status: 'thinking' },
        ]);
        setPrompt('');

        try {
            const data = await getCourseRecommendations(nextPrompt);

            setEntries((prev) =>
                prev.map((entry) =>
                    entry.id === assistantEntryId
                        ? {
                              ...entry,
                              status: 'complete',
                              message:
                                  data.message ||
                                  'I found a few courses that match your request.',
                              courses: data.courses || [],
                          }
                        : entry
                )
            );
            showNotification('Course recommendations are ready.', 'success');
        } catch (error) {
            const isNetworkFailure = error.code === 'ERR_NETWORK' || !error.response;

            setEntries((prev) =>
                prev.map((entry) =>
                    entry.id === assistantEntryId
                        ? {
                              ...entry,
                              status: 'error',
                              error: isNetworkFailure
                                  ? 'The local recommendation model is not responding right now.'
                                  : error.response?.data?.error || 'Failed to fetch recommendations.',
                          }
                        : entry
                )
            );

            if (isNetworkFailure) {
                showNotification('Recommendation model is offline. Please start it and try again.', 'error');
            } else {
                showNotification('Could not fetch course recommendations.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-8xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50 rounded-xl">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-6">Course Recommendation</h1>

                <section className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="flex min-h-[65vh] flex-col">
                        <div className="mb-6 flex-1 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.9)_0%,rgba(255,255,255,0.96)_100%)] p-4 sm:p-6">
                            <RecommendationConversation
                                entries={entries}
                                onSuggestionClick={(suggestion) => {
                                    setPrompt(suggestion);
                                }}
                            />
                            <div ref={conversationEndRef} />
                        </div>

                        <RecommendationPromptComposer
                            value={prompt}
                            onChange={setPrompt}
                            onSubmit={() => handleSubmit()}
                            isLoading={isLoading}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
