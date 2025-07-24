import React from 'react'
import { PiArrowDownRightBold } from "react-icons/pi";
import "./Hero.css"

function Hero({scrollToRef}) {

  const handleScroll = () => {
    if (scrollToRef && scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='hero w-full max-w-[1500px] m-auto text-center mt-[50px]'>
        <h4 className='hero-title'>Zamonaviy kasblarni professionallardan o’rganing</h4>
        <h1 className='hero-text'>Nazariy emas, amaliy natija- <br />O‘quvchilarimiz allaqachon <br /> <span className='text-[#FBA406]'><i>daromadga</i> </span> chiqqan!</h1>
        <p className='hero-info'>O‘quvchilarimiz oyiga o’rtacha 300$+ daromad qilishmoqda!</p>
        <button className='button-hero' onClick={handleScroll}>Natijalarni ko‘rish <PiArrowDownRightBold className='hero-icon'/></button>
    </div>
  )
}
  
export default Hero