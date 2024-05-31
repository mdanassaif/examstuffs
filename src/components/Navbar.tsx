import Image from 'next/image';
import React from 'react';
import Link from 'next/link'; // Import Link component for routing
import LogoStuffs from '../../public/images/logo.png';

const Navbar = () => {
  return (
    <nav className="p-4">
      <div className="mx-auto flex justify-between items-center">
        <Link href="/"> {/* Link to the homepage */}
          <Image
            width={60}
            height={60}
            src={LogoStuffs}
            alt="Company Logo" // Descriptive alt text
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
