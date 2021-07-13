export const TOBIIEVENTS = {
    'tobii.point':'tobii.point',
    'tobii.enter':'tobii.enter',
    'tobii.stay':'tobii.stay',
    'tobii.out':'tobii.out',
    'tobii.longout':'tobii.longout'
} as const

export type TobiiEvent = keyof typeof TOBIIEVENTS;