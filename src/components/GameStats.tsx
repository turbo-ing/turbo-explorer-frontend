import { Box, Clock, ArrowRight, Fingerprint , Gamepad } from "lucide-react";

type StatCardProps = {
    icon: React.ElementType;
    value: number;
    label: string;
};

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-3 sm:p-6 flex items-center space-x-0 sm:space-x-4 space-y-3 sm:space-y-0 flex-col sm:flex-row border">
            <div className="sm:p-2">
                <Icon className="size-7 sm:size-8 text-stone-600" />
            </div>
            <div className="flex flex-col items-center sm:block space-y-1 sm:space-y-0">
                <div className="text-2xl font-bold">{value}</div>
                <div className="sm:text-lg text-stone-600">{label}</div>
            </div>
        </div>
    );
};

type GameStatsProps = {
    games: { id: number }[];
    totalSessions: number;
    totalInteractions: number;
};

const GameStats: React.FC<GameStatsProps> = ({ games, totalSessions, totalInteractions }) => {
    return (
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
            <StatCard icon={Gamepad} value={games.length} label="Games" />
            <StatCard icon={Clock} value={totalSessions} label="Sessions" />
            <StatCard icon={Fingerprint} value={totalInteractions} label=" Interactions" />
        </div>
    );
};

export default GameStats;