import { Bot, ExternalLink, Sparkles, Star, User } from 'lucide-react';

const difficultyTone = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700',
};

function renderInlineContent(text) {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={`${part}-${index}`} className="font-semibold text-slate-900">
                    {part.slice(2, -2)}
                </strong>
            );
        }

        return <span key={`${part}-${index}`}>{part}</span>;
    });
}

function formatAssistantMessage(message) {
    return message
        .split('\n')
        .map((line) => line.trimEnd())
        .filter((line, index, lines) => line || (index > 0 && lines[index - 1]))
        .map((line, index) => {
            const normalizedLine = line.trim();
            if (!normalizedLine) {
                return <div key={`space-${index}`} className="h-2" />;
            }

            const isBullet = normalizedLine.startsWith('*');
            const isNumbered = /^\d+\./.test(normalizedLine);

            return (
                <p
                    key={`${normalizedLine}-${index}`}
                    className={`text-sm leading-7 text-slate-600 ${
                        isBullet || isNumbered ? 'pl-3' : ''
                    }`}
                >
                    {renderInlineContent(normalizedLine)}
                </p>
            );
        });
}

function RecommendationCourseCard({ course, index }) {
    const difficultyKey = course.difficulty?.toLowerCase() || 'beginner';
    const difficultyClass =
        difficultyTone[difficultyKey] || 'bg-sky-100 text-sky-700';

    return (
        <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.45)]">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-600">
                        Match {String(index + 1).padStart(2, '0')}
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900">{course.course_name}</h4>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyClass}`}>
                    {course.difficulty || 'N/A'}
                </span>
            </div>

            <div className="flex text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-3 pr-8 min-w-[120px]">
                    <div className="mb-1 text-xs uppercase tracking-[0.24em] text-slate-400">Rating</div>
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {course.rating ?? 'N/A'}
                    </div>
                </div>
            </div>

            <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 transition hover:text-cyan-500"
            >
                Open course
                <ExternalLink className="h-4 w-4" />
            </a>
        </article>
    );
}

function ThinkingBubble() {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-cyan-600 text-white shadow-lg">
                <Bot className="h-5 w-5" />
            </div>

            <div className="max-w-3xl rounded-[1.75rem] rounded-tl-md border border-cyan-100 bg-white/90 px-5 py-4 shadow-[0_20px_60px_-40px_rgba(8,145,178,0.7)] backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Sparkles className="h-4 w-4 text-cyan-500" />
                    Finding the best matches
                </div>
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.3s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.15s]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500" />
                </div>
            </div>
        </div>
    );
}

function UserBubble({ content }) {
    return (
        <div className="flex justify-end">
            <div className="flex max-w-3xl flex-row-reverse items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                    <User className="h-5 w-5" />
                </div>
                <div className="rounded-[1.75rem] rounded-tr-md bg-slate-900 px-5 py-4 text-sm leading-7 text-slate-100 shadow-[0_18px_60px_-38px_rgba(15,23,42,1)]">
                    {content}
                </div>
            </div>
        </div>
    );
}

function AssistantBubble({ entry }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 to-cyan-600 text-white shadow-lg">
                <Bot className="h-5 w-5" />
            </div>

            <div className="w-full max-w-4xl rounded-[1.75rem] rounded-tl-md border border-cyan-100 bg-white/95 px-5 py-4 shadow-[0_20px_70px_-40px_rgba(8,145,178,0.65)] backdrop-blur">
                {entry.error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {entry.error}
                    </div>
                ) : (
                    <>
                        <div className="space-y-1">{formatAssistantMessage(entry.message || '')}</div>

                        {!!entry.courses?.length && (
                            <div className="mt-6 grid gap-4 xl:grid-cols-2">
                                {entry.courses.map((course, index) => (
                                    <RecommendationCourseCard
                                        key={`${course.course_name}-${index}`}
                                        course={course}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function EmptyState({ onSuggestionClick }) {
    const suggestions = [
        'Recommend 3 beginner courses for learning Python for machine learning',
        'Suggest intermediate deep learning courses with strong ratings',
        'Find data science courses for someone who wants practical projects',
    ];

    return (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-8 text-center shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-slate-900 text-white shadow-lg">
                <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">Ask for a learning path</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Describe what you want to learn, your level, or the number of courses you want, and the local model will return curated course matches with a short explanation.
            </p>

            <div className="mt-6 grid gap-3 text-left md:grid-cols-3">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion}
                        type="button"
                        onClick={() => onSuggestionClick(suggestion)}
                        className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-slate-900 hover:shadow-lg"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function RecommendationConversation({ entries, onSuggestionClick }) {
    if (!entries.length) {
        return <EmptyState onSuggestionClick={onSuggestionClick} />;
    }

    return (
        <div className="space-y-6">
            {entries.map((entry) => {
                if (entry.type === 'user') {
                    return <UserBubble key={entry.id} content={entry.content} />;
                }

                if (entry.status === 'thinking') {
                    return <ThinkingBubble key={entry.id} />;
                }

                return <AssistantBubble key={entry.id} entry={entry} />;
            })}
        </div>
    );
}
