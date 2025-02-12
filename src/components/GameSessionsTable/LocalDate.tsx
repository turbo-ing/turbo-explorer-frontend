"use client";
export default function LocalDate(date: Date) {
    return <>{date.toLocaleString('en-UK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })}</>;
}