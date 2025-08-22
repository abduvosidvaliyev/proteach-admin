import React from 'react'
import { FaInstagram } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { MdKeyboardBackspace } from "react-icons/md";
import './navbar.css'
import { useNavigate } from 'react-router';

function Navbar({ scrollToRef }) {
    const navigate = useNavigate()

    const handleScrollLink = () => {
        if (scrollToRef && scrollToRef.current) {
            scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <navbar className={'navbar w-full max-w-[1480px] m-auto flex items-center justify-between py-[17px] px-[20px] rounded-lg border border-solid border-gray-300'}>
            <div>
                <MdKeyboardBackspace onClick={() => navigate("/")} className='text-[34px] cursor-pointer' />
            </div>
            <ul className='flex items-center gap-[20px] text-[#717070] '>
                <li>
                    <a className='text-xl hover:text-[#000]' href="#">Bosh sahifa</a>
                </li>
                <li>
                    <a className='text-xl hover:text-[#000]' href="#" onClick={handleScrollLink}>Natijalar</a>
                </li>
                <li>
                    <a className='text-xl hover:text-[#000]' href="#">Kurslar</a>
                </li>
            </ul>
            <div className='flex items-center justify-center gap-[12px]'>
                <a href="https://www.instagram.com/proteachuz/" className='w-[40px] h-[40px] circle'>
                    <FaInstagram />
                </a>
                <a href="tel:+998917382266" className='w-[40px] h-[40px] circle'>
                    <IoCallOutline />
                </a>
            </div>
        </navbar>
    )
}

export default Navbar