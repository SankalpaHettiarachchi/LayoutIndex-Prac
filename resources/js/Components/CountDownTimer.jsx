import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default function CountdownTimer({ targetTime }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = dayjs();
            const end = dayjs(targetTime);
            const diff = end.diff(now);

            if (diff <= 0) {
                setTimeLeft('Sending...');
                clearInterval(interval);
                return;
            }

            const d = dayjs.duration(diff);

            const formatted = `${d.hours().toString().padStart(2, '0')}:${d.minutes().toString().padStart(2, '0')}:${d.seconds().toString().padStart(2, '0')}`;
            setTimeLeft(formatted);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return <span>{timeLeft}</span>;
}
