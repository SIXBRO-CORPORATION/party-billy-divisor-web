import type { CollaboratorSuggestion } from '../../hooks/useRecentCollaborators.ts';
import { Avatar } from '../ui/Avatar.tsx';
import { PlusIcon } from '../ui/icons.tsx';

interface PeopleSuggestionsProps {
    suggestions: CollaboratorSuggestion[];
    isLoading: boolean;
    onAdd: (name: string) => void;
}

export default function PeopleSuggestions({ suggestions, isLoading, onAdd }: PeopleSuggestionsProps) {
    return (
        <aside className="people-suggestions" aria-labelledby="people-suggestions-title">
            <h2 id="people-suggestions-title" className="newbill-h2">
                Sugestões
            </h2>

            <p className="people-suggestions-subtitle">Gente que já dividiu conta com você.</p>

            <div className="people-suggestions-list">
                {isLoading && suggestions.length === 0 && (
                    <p className="people-suggestions-empty">Procurando pessoas conhecidas…</p>
                )}

                {!isLoading && suggestions.length === 0 && (
                    <p className="people-suggestions-empty">
                        As pessoas que você adicionar aqui vão aparecer como sugestão na próxima
                        conta.
                    </p>
                )}

                {suggestions.map((suggestion, index) => (
                    <div className="people-suggestion" key={`${suggestion.name}-${index}`}>
                        <Avatar label={suggestion.name} index={index} size="sm" />

                        <div className="people-suggestion-info">
                            <strong>{suggestion.name}</strong>
                            <span>Estava em “{suggestion.billTitle}”</span>
                        </div>

                        <button
                            type="button"
                            className="people-suggestion-add"
                            aria-label={`Adicionar ${suggestion.name}`}
                            onClick={() => onAdd(suggestion.name)}
                        >
                            <PlusIcon size={18} strokeWidth={2.8} />
                        </button>
                    </div>
                ))}
            </div>
        </aside>
    );
}
