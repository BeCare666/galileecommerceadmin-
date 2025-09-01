import React, { useEffect, useState } from 'react';

type Country = {
    id: number;
    name: string;
    code: string; // code ISO2, ex: "BJ"
};

interface CountrySelectProps {
    value?: number;
    onChange?: (value: number) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCountries() {
            try {
                const res = await fetch('http://127.0.0.1:5000/api/countries');
                const data = await res.json();
                setCountries(data);
            } catch (error) {
                console.error('Erreur de chargement des pays:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCountries();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <select
                    value={value ?? ''}
                    onChange={(e) => onChange?.(parseInt(e.target.value))}
                    className="px-4 h-12 flex items-center rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 px-3 py-2 border rounded bg-gray-100 border border-border-base focus:shadow focus:bg-light focus:border-accent"
                >
                    <option value="">Choose product countrie</option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name} ({country.code})
                        </option>
                    ))}
                </select>
            )}

            {/* Affichage drapeau à côté si un pays est sélectionné */}
            {value && (
                <div className="mt-2 flex items-center gap-2">
                    <img
                        src={`https://flagcdn.com/48x36/${getCountryCode(value, countries)}.png`}
                        alt="drapeau"
                        className="w-6 h-auto"
                    />
                    <span>
                        {countries.find((c) => c.id === value)?.name}
                    </span>
                </div>
            )}
        </div>
    );
};

// Fonction pour retrouver le code d’un pays à partir de son ID
function getCountryCode(id: number, countries: Country[]): string {
    const c = countries.find((c) => c.id === id);
    return c?.code?.toLowerCase() ?? '';
}

export default CountrySelect;
