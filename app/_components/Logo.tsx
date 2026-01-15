import Image from "next/image";
import Link from "next/link";
import logo from "@/public/imgs/prepstation.png";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src={logo}
        quality={80}
        height={42}
        loading="eager"
        alt="PrepStation logo"
      />
    </Link>
  );
}
