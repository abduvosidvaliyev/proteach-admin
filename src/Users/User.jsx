import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, get, remove } from "firebase/database";
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar/navbar";
import "./components/hero/Hero.css";
import "./User.css"
import { FaCalendarAlt, FaCamera, FaChevronRight, FaInstagram, FaPen, FaPhone } from "react-icons/fa";
import { uploadImage } from "../uploadImage";
import { supabase } from "../supabaseClient";
import ParticlesBackground from "../ParticlesBackground"
import { IoLocation } from "react-icons/io5";
import { BsCreditCardFill } from "react-icons/bs";
import { PiArrowDownRightBold } from "react-icons/pi";
import { MdLocationPin } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { onValueData } from "../Firebase/FirebaseData"


const firebaseConfig = {
    apiKey: "AIzaSyCmB2bXTAyxXVEvumcTE97RpYKMKu94LBA",
    authDomain: "proteach-card.firebaseapp.com",
    databaseURL: "https://proteach-card-default-rtdb.firebaseio.com",
    projectId: "proteach-card",
    storageBucket: "proteach-card.firebasestorage.app",
    messagingSenderId: "848976516816",
    appId: "1:848976516816:web:3088b2817e732a57bff0d5",
    measurementId: "G-LWNLCB13Q6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const App = () => {
    const [GetArray, setGetArray] = useState([]);
    const [UserIndex, setUserIndex] = useState({})
    const [FIle, setFIle] = useState(null)
    const [Link, setLink] = useState("")
    const [OpenSideBar, setOpenSideBar] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [UserName, setUserName] = useState("")


    useEffect(() => {
        onValueData("Users", (data) => {
            setGetArray(Object.values(data || {}));
        });
    }, []);

    const handleOpenSidebar = (name) => {
        const user = GetArray.find(item => item.name === name)
        if (user) {
            setUserIndex(user);
            setUserName(user.name);
            setOpenSideBar(true);
        } else {
            alert("Foydalanuvchi topilmadi!");
            return;
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        let newImageUrl = "";

        if (
            !UserIndex.name ||
            !UserIndex.job ||
            !UserIndex.age ||
            !UserIndex.price ||
            !UserIndex.eddedData ||
            !UserIndex.workplace ||
            !UserIndex.Dateofemployment
        ) {
            alert("Ma'lumotni to'ldiring");
            return;
        }

        try {
            // eski user'ni olish
            const oldUserRef = ref(database, `Users/${UserName}`);
            const oldSnapshot = await get(oldUserRef);
            const oldData = oldSnapshot.val();
            const oldImageUrl = oldData?.image;
            const originalName = oldData?.name;

            const userRef = ref(database, `Users/${originalName}`);

            // eski rasmni o‘chirish
            if (oldImageUrl?.includes("supabase.co")) {
                const filePath = oldImageUrl.split('/').pop().split('?')[0];
                await supabase.storage.from('User_Images').remove([filePath]);
            }

            // yangi rasmni yuklash
            if (FIle) {
                newImageUrl = await uploadImage(FIle);
            }

            const updatedUser = {
                ...UserIndex,
                image: newImageUrl || oldImageUrl || ""
            };

            // agar name o‘zgargan bo‘lsa — eski foydalanuvchini o‘chirish
            if (originalName !== UserIndex.name) {
                await remove(userRef);
            }

            // yangi userni saqlash
            const newUserRef = ref(database, `Users/${UserIndex.name}`);
            await set(newUserRef, updatedUser);

            setUserIndex(updatedUser);
            setIsLoading(false)
            setOpenSideBar(false);
            alert("Ma'lumot yangilandi!");

        } catch (error) {
            console.error("Xatolik:", error);
            alert("Xatolik yuz berdi.");
        }
    };

    const handleChengeImg = (e) => {
        const file = e.target.files[0];
        setFIle(file)
        if (file) {
            const url = URL.createObjectURL(file);
            setLink(url);
        }
    }

    return (
        <>


            {
                OpenSideBar && (
                    <div className="w-full h-screen absolute">
                        <div className="w-full h-full fixed top-0 left-0 bg-black/50 backdrop-blur-[2px] z-20" onClick={() => setOpenSideBar(false)}></div>
                        <div className="w-[400px] bg-white h-full fixed right-0 top-0 z-30 flex flex-col py-6 px-5 pb-6 gap-5 overflow-auto">
                            <h3 className="text-lg font-semibold ">
                                Ma'lumotlarni tahrirlash
                            </h3>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name">
                                    Ismi:
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Ism"
                                    value={UserIndex.name}
                                    onChange={(e) => setUserIndex({ ...UserIndex, name: e.target.value, originalName: e.target.value })}
                                    className="w-full border-2 border-gray-300 rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="age">
                                    Yoshi:
                                </label>
                                <input
                                    id="age"
                                    type="text"
                                    placeholder="Yosh"
                                    value={UserIndex.age}
                                    onChange={(e) => setUserIndex({ ...UserIndex, age: e.target.value })}
                                    className="w-full border-2 border-gray-300 rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="job">
                                    Kasbi:
                                </label>
                                <input
                                    id="job"
                                    type="text"
                                    placeholder="Kasb"
                                    value={UserIndex.job}
                                    className="w-full border-2 border-gray-300 rounded-md p-2 text-sm"
                                    onChange={(e) => setUserIndex({ ...UserIndex, job: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="workPlace">
                                    Ish joyi:
                                </label>
                                <input
                                    id="workPlace"
                                    type="text"
                                    placeholder="Ish joyi"
                                    value={UserIndex.workplace}
                                    className="w-full border-2 border-gray-300 rounded-md p-2 text-sm"
                                    onChange={(e) => setUserIndex({ ...UserIndex, workplace: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="amount">
                                    Daromadi:
                                </label>
                                <input
                                    id="amount"
                                    type="text"
                                    placeholder="Daromadi"
                                    value={UserIndex.price}
                                    onChange={(e) => setUserIndex({ ...UserIndex, price: e.target.value })}
                                    className="w-full border-2 border-gray-300 rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="addWork">
                                    Ishga kirdi:
                                </label>
                                <input
                                    id="addWork"
                                    type="text"
                                    placeholder="Ishga kirdi"
                                    value={UserIndex.eddedData}
                                    onChange={(e) => setUserIndex({ ...UserIndex, eddedData: e.target.value })}
                                    className="w-full border-2 border-gray-300 rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="qwerty">
                                    Ishga joylashgan sana:
                                </label>
                                <input
                                    id="qwerty"
                                    type="text"
                                    placeholder="Ishga joylashgan sana"
                                    value={UserIndex.Dateofemployment}
                                    onChange={(e) => setUserIndex({ ...UserIndex, Dateofemployment: e.target.value })}
                                    className="w-full border-2 border-gray-300 rounded-md p-2 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="decription">
                                    Ma'lumot:
                                </label>
                                <textarea
                                    id="decription"
                                    type="text"
                                    placeholder="Ma'lumot"
                                    value={UserIndex.discription}
                                    onChange={(e) => setUserIndex({ ...UserIndex, discription: e.target.value })}
                                    className="w-full h-[150px] border-2 border-gray-300 rounded-md p-2 text-sm resize-none"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="relative overflow-hidden h-[300px] rounded-xl">
                                    <img src={Link === "" ? UserIndex.image : Link} className="image user-card-img h-full" alt="" />
                                    <label className="chenge transition-all cursor-pointer flex justify-center items-center absolute w-full bg-black/50 h-3/6 rounded-lg -bottom-full" htmlFor="file">
                                        <FaCamera className="text-white" size={25} />
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleChengeImg(e)}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className={`self-end bg-[#fdb407] px-4 py-2 rounded-md text-white ${isLoading ? "cursor-not-allowed bg-[#fdb407]/80" : ""}`}
                            >
                                {
                                    isLoading ? "Loading..." : "Saqlash"
                                }
                            </button>
                        </div>
                    </div>
                )
            }

            <div className="px-[60px] pt-5">
                <Navbar />
                <div className='hero flex items-center flex-col mt-5'>
                    <h4 className='text-lg border border-solid px-8 py-3 rounded-full border-gray-500'>Zamonaviy kasblarni professionallardan o’rganing</h4>
                    <h1 className='hero-text montserrat'>Nazariy emas, amaliy natija- <br />O‘quvchilarimiz allaqachon <br /> <span className='text-[#FBA406] font-semibold text-shadow'><i>daromadga</i> </span> chiqqan!</h1>
                    <p className='hero-info poppins'>O‘quvchilarimiz oyiga o’rtacha 300$+ daromad qilishmoqda!</p>
                    <a href="#natija">
                        <button className='button-hero'>Natijalarni ko‘rish <PiArrowDownRightBold className='hero-icon' /></button>
                    </a>
                </div>

                <div className="flex flex-col w-full h-auto pt-10 pb-[80px] relative items-center">
                    <h1 id="natija" className="z-10 text-center pb-[50px] text-3xl font-medium text-[#000000] max-sm:mb-[0px] mb-[100px] krona">-BITIRUVCHILAR-</h1>
                    <ParticlesBackground />
                    {
                        GetArray.length > 0 ? (
                            GetArray.sort((a, b) => a.id - b.id)
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-col sm:flex-row w-[600px] shadow-lg rounded-xl bg-white p-3 gap-3 z-10 ${index % 2 === 0 ? "xl:self-start" : "xl:self-end"} lg:-mt-[50px] max-lg:mt-10 hover:-translate-y-3 transition-all relative`}
                                        style={{
                                            border: "2px solid #E5E5E5",
                                        }}
                                    >
                                        <FaPen className="text-[#FBA406] cursor-pointer absolute right-3" onClick={() => handleOpenSidebar(item.name)} />
                                        <img
                                            className="user-card-img w-full max-w-[280px] sm:w-[320px] sm:h-[450px] object-cover rounded-[12px]"
                                            src={item.image}
                                            alt="User"
                                        />
                                        <div className="flex flex-col items-center justify-between w-full max-w-[280px] monospace">
                                            <div className="flex flex-col items-start justify-start gap-7">
                                                {/* Ism */}
                                                <h1 className="text-3xl font-semibold tracking-wide">
                                                    {item.name}
                                                </h1>

                                                {/* Yosh va Kasb */}
                                                <div className="flex gap-1 items-center text-xl font-[600] tracking-wide">
                                                    <span>{item.age} yosh</span>
                                                    <span>|</span>
                                                    <span>{item.job}</span>
                                                </div>

                                                {/* Ish joyi */}
                                                <div className="grid grid-cols-[auto,1fr] gap-2 items-start">
                                                    <span className="flex items-center gap-2 text-xl font-[600] whitespace-nowrap">
                                                        <IoLocation />
                                                        Ish joyi:
                                                    </span>
                                                    <span className="text-xl font-[400] tracking-wide break-words">
                                                        {item.workplace}
                                                    </span>
                                                </div>

                                                {/* Daromad */}
                                                <div className="grid grid-cols-[auto,1fr] gap-2 items-start">
                                                    <span className="flex items-center gap-2 text-xl font-[600] whitespace-nowrap">
                                                        <BsCreditCardFill />
                                                        Daromadi:
                                                    </span>
                                                    <span className="text-xl font-[400] tracking-wide break-words">
                                                        {item.price}
                                                    </span>
                                                </div>

                                                {/* Kirdi */}
                                                <div className="grid grid-cols-[auto,1fr] gap-2 items-start">
                                                    <span className="flex items-center gap-2 text-xl font-[600] whitespace-nowrap">
                                                        <i className="fa-solid fa-arrows-down-to-people text-base"></i>
                                                        Kirdi:
                                                    </span>
                                                    <span className="text-xl font-[400] tracking-wide break-words">
                                                        {item.eddedData}
                                                    </span>
                                                </div>

                                                {/* Ma'lumot sanasi */}
                                                <div className="grid grid-cols-[auto,1fr] gap-2 items-start">
                                                    <span className="flex items-center gap-2 text-xl font-[600] whitespace-nowrap">
                                                        <FaCalendarAlt />
                                                        Ma'lumot sanasi:
                                                    </span>
                                                    <span className="text-xl font-[400] tracking-wide break-words">
                                                        {item.Dateofemployment}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Bog‘lanish tugmasi */}
                                            <a
                                                href="tel:+998916994104"
                                                className="w-[190px] h-[40px] text-[13px] font-normal leading-[32px] rounded-[24px] bg-[#ffb938] font-['Krona_One'] flex items-center justify-center gap-2 mt-6 mx-auto cursor-pointer krona"
                                            >
                                                Bog’lanish{" "}
                                                <PiArrowDownRightBold className="w-5 h-5 bg-white p-[2px] text-[12px] rounded-full" />
                                            </a>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <h1 className="w-full text-center">Ma'lumot yuklanmoqda!</h1>
                        )
                    }
                </div>
            </div>
            <div className="w-full h-[400px] bg-[#1C1525] px-[150px] py-[50px] flex justify-start items-start gap-[40px] montserrat">
                <div className="flex flex-col items-start justify-start gap-5 text-[#DFDFDF] w-[300px]">
                    <h3 className="text-[30px] text-white ">
                        Biz haqimizda
                    </h3>
                    <p className="leading-[28px] text-[17px] font-normal">
                        "Pro Teach" o'quv markazi <a href="https://it-park.uz/" target="_blank" className="text-[#7EBA27]">IT Park</a> ga qarashli markaz bo'lib, 2021-yildan beri o'z mijozlariga sifatli ta'lim xizmatlari ko'rsatib kelmoqda.
                    </p>
                </div>
                <div className="flex flex-col items-start justify-start gap-5 text-[#DFDFDF] w-[300px]">
                    <h3 className="text-[30px] text-white ">
                        Xizmatlar
                    </h3>
                    <div className="flex flex-col gap-7 justify-start items-start">
                        <h3 className="flex gap-2 items-center hover:text-[#1057bd] cursor-pointer transition-all">
                            <FaChevronRight size={15} />
                            <span className="text-[17px] font-normal">Web dasturlash</span>
                        </h3>
                        <h3 className="flex gap-2 items-center hover:text-[#1057bd] cursor-pointer transition-all">
                            <FaChevronRight size={15} />
                            <span className="text-[17px] font-normal">Grafik dizayn</span>
                        </h3>
                        <h3 className="flex gap-2 items-center hover:text-[#1057bd] cursor-pointer transition-all">
                            <FaChevronRight size={15} />
                            <span className="text-[17px] font-normal">Kompyuter savodxonlik</span>
                        </h3>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start gap-5 text-[#DFDFDF] w-[250px]">
                    <h3 className="text-[30px] text-white ">
                        Kontakt
                    </h3>
                    <div className="flex flex-col gap-7 justify-start items-start">
                        <a href="https://maps.google.com/maps?q=40.535083,70.925986&ll=40.535083,70.925986&z=16" target="_blank" className="flex gap-2 items-start hover:text-[#1057bd] cursor-pointer transition-all leading-[28px]">
                            <MdLocationPin size={25} />
                            Farg'ona Qo'qon shahar Istiqlol ko'chasi
                        </a>
                        <h3 className="flex gap-2 items-center hover:text-[#1057bd] cursor-pointer transition-all">
                            <FaPhone size={20} />
                            <span className="text-[17px] font-normal">+998 91 699 41 04</span>
                        </h3>
                        <h3 className="flex gap-2 items-center hover:text-[#1057bd] cursor-pointer transition-all">
                            <HiOutlineMail size={20} />
                            <span className="text-[17px] font-normal">info@proteach.com</span>
                        </h3>
                        <a href="https://www.instagram.com/proteachuz/" target="_blank" className="flex gap-2 items-center hover:text-[#1057bd] cursor-pointer transition-all">
                            <FaInstagram size={20} />
                            <span className="text-[17px] font-normal">proteachuz</span>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;