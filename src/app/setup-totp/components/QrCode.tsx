import { JSX, useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
    secret?: string;
};

export default function QrCode({
    secret = "This is a secret",
}: Props): JSX.Element {
    const [qr, setQr] = useState<string>("");
    useEffect(() => {
        if (!secret) return;
        QRCode.toDataURL(secret).then(setQr).catch(console.error);
    }, [secret]);

    return (
        <>{qr && <img src={qr} alt="Qr" className="w-[12rem] h-[12rem]" />}</>
    );
}
