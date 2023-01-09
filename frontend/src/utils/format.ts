// 폰 번호 형식 자동 포맷
export function formatPhoneNumber(phoneNumber: string) {
    const formattedPhoneNumber = phoneNumber
        .replace(/[^0-9]/g, '')
        .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
        .replace(/(-{1,2})$/g, '');
    return formattedPhoneNumber;
}

export function formatTimeToAMPM(date: Date) {
    return new Date(date).toLocaleString('ko-KR', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
}

// ~초 전, ~분 전, ~일 전 등 상황에 맞게 수정
export function calcElapsed(date: Date | undefined) {
    const time = new Date(String(date)).getTime();

    const elapsedSec = (Date.now() - time) / 1000;
    if (elapsedSec >= 60) {
        const elapsedMin = elapsedSec / 60;
        if (elapsedMin >= 60) {
            const elapsedHour = elapsedMin / 60;
            if (elapsedHour >= 24) {
                const elapsedDay = elapsedHour / 24;
                return Math.floor(elapsedDay) + '일';
            } else {
                return Math.floor(elapsedHour) + '시간';
            }
        } else {
            return Math.floor(elapsedMin) + '분';
        }
    } else {
        return Math.floor(elapsedSec) + '초';
    }
}
