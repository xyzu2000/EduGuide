import React from 'react';

const SchedulerLegend = () => {
    return (
        <div className="calendar-legend">
            <h2>Legenda funkcjonalności Kalendarza</h2>
            <ul>
                <li>
                    <strong>1. Dodawanie nowych wydarzeń:</strong> Kliknij na wolne miejsce w kalendarzu, aby dodać nowe wydarzenie.
                </li>
                <li>
                    <strong>2. Edycja istniejących wydarzeń:</strong> Kliknij na istniejące wydarzenie w kalendarzu, aby edytować jego nazwę.
                </li>
                <li>
                    <strong>3. Usuwanie wydarzeń:</strong> Kliknij prawym przyciskiem myszy na wydarzenie, aby otworzyć menu kontekstowe i wybrać opcję "Delete".
                </li>
                <li>
                    <strong>4. Automatyczne zapisywanie zmian:</strong> Każda zmiana (dodawanie, edycja, usuwanie) jest automatycznie zapisywana w bazie danych Firebase.
                </li>
                <li>
                    <strong>5. Reaktywne ładowanie danych:</strong> Kalendarz reaguje na zmiany w danych użytkownika w czasie rzeczywistym.
                </li>
                <li>
                    <strong>6. Obsługa użytkowników:</strong> Aplikacja obsługuje wielu użytkowników, każdy z osobnym zestawem wydarzeń.
                </li>
                <li>
                    <strong>7. Interaktywność i przejrzystość:</strong> Kalendarz zapewnia interaktywny interfejs użytkownika, który jest łatwy w obsłudze.
                </li>
                <li>
                    <strong>8. Funkcjonalność kontekstowego menu:</strong> Menu kontekstowe umożliwia szybkie usuwanie wydarzeń bez konieczności otwierania ich szczegółowych widoków.
                </li>
                <li>
                    <strong>9. Integracja z Toasts:</strong> Użytkownik jest informowany o operacjach na wydarzeniach za pomocą komunikatów Toast.
                </li>
                <li>
                    <strong>10. Responsywność i skalowalność:</strong> Aplikacja kalendarza jest responsywna i skalowalna, dostosowując się do różnych rozmiarów ekranu i urządzeń.
                </li>
            </ul>
        </div>
    );
};

export default SchedulerLegend;
