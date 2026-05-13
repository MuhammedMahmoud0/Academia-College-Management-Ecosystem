import { SendHorizontal, Sparkles } from 'lucide-react';

export default function RecommendationPromptComposer({
    value,
    onChange,
    onSubmit,
    isLoading,
}) {
    const canSubmit = value.trim() && !isLoading;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!canSubmit) return;
        onSubmit();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (!canSubmit) return;
            onSubmit();
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-slate-200 bg-white/95 p-3 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl"
        >
            <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                <Sparkles className="h-4 w-4 text-cyan-500" />
                AI Course Finder
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <label className="flex-1">
                    <span className="sr-only">Ask for course recommendations</span>
                    <textarea
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for courses like: recommend beginner machine learning courses with Python"
                        rows={3}
                        className="w-full resize-none rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                    />
                </label>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:bg-slate-300 md:min-w-[148px]"
                >
                    {isLoading ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <SendHorizontal className="h-4 w-4" />
                            Send
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
