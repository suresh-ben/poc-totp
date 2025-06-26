import { JSX } from "react";

export default function Loader(): JSX.Element {
    return (
        <div className="fixed w-full h-screen flex justify-center items-center z-50 top-0 left-0">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
    );
}
