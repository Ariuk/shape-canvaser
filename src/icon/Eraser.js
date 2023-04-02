export default function Eraser({ color = '#000000', width = 32, height = 32 }) {
    return (
        <svg fill={color} width={width} height={height} viewBox="-5.5 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.125 13.781l7.938-7.938c0.719-0.719 1.813-0.719 2.531 0l7.688 7.688c0.719 0.719 0.719 1.844 0 2.563l-7.938 7.938c-2.813 2.813-7.375 2.813-10.219 0-2.813-2.813-2.813-7.438 0-10.25zM11.063 22.75l-7.656-7.688c-2.125 2.125-2.125 5.563 0 7.688s5.531 2.125 7.656 0z"></path>
        </svg>
    );
};
