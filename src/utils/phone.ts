
export function formatPhoneInput(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 11);

    if (digits.length === 0) {
        return '';
    }

    const ddd = digits.slice(0, 2);

    if (digits.length <= 2) {
        return `(${ddd}`;
    }

    const nine = digits.slice(2, 3);

    if (digits.length <= 3) {
        return `(${ddd}) ${nine}`;
    }

    const part1 = digits.slice(3, 7);

    if (digits.length <= 7) {
        return `(${ddd}) ${nine} ${part1}`;
    }

    const part2 = digits.slice(7, 11);

    return `(${ddd}) ${nine} ${part1}-${part2}`;
}

export function maskPhoneDisplay(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.length < 4) {
        return phone;
    }

    const last4 = digits.slice(-4);

    if (digits.length === 11) {
        return `+55 ${digits.slice(0, 2)} 9 ••••-${last4}`;
    }

    if (digits.length === 10) {
        return `+55 ${digits.slice(0, 2)} ••••-${last4}`;
    }

    return `••••-${last4}`;
}
