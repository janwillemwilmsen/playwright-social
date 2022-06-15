module.exports = {
    content: [
        './public/*.{html,js}',
    ],
    safelist: [
        'flex',
        'flex-row',
        'flex-1',
        'flex-none',
        'w-40',
        'w-10',
        'w-20',
        'w-24',
        'w-28',
        'w-14',
        'text-blue-500',
        'text-md',
        'line-clamp-1',
        'line-clamp-2',
        'line-clamp-3',
        'uppercase',
        'inline-block',
        'bg-white',
        'rounded-md',
        'underline',
        'no-underline',
        'hidden',
        'z-40',
        'z-30',
        'px-2',
        'mx-2',

    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
    ],

}