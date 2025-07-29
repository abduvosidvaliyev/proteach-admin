import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, set, get, remove } from "firebase/database";
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/navbar/navbar";
import Hero from "./components/hero/Hero";
import { MdMonetizationOn } from "react-icons/md";
import { FaArrowUp } from "react-icons/fa6";
import { TbTargetArrow } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import "./User.css"
import { FaCamera, FaPen } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { FiDownload } from "react-icons/fi";
import { uploadImage } from "../uploadImage";
import { supabase } from "../supabaseClient";

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
    const [Loader, setLoader] = useState(true)
    const cardSectionRef = useRef(null)
    const cardSectionRefLink = useRef(null)
    const [openInput, setOpenInput] = useState("")
    const [UserIndex, setUserIndex] = useState({
        name: "",
        age: "",
        job: "",
        workplace: "",
        price: "",
        eddedData: "",
        discription: "",
        Dateofemployment: "",
        image: "",
        originalName : ""
    })
    const [FIle, setFIle] = useState(null)
    const [Link, setLink] = useState("")
    const [OpenSideBar, setOpenSideBar] = useState(false)
    const [UserName, setUserName] = useState("")


    useEffect(() => {
        const ArrayRef = ref(database, "Users");

        onValue(ArrayRef, (snapshot) => {
            const data = snapshot.val();
            setGetArray(Object.values(data || {}));
        });
    }, []);

    const handleOpenSidebar = (name) => {
        const user = GetArray.find(item => item.name === name)
        if (user) {
            setUserIndex(user);
            setUserName(user?.name);
        }

        setOpenSideBar(true);
    }

    const handleSave = async () => {
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
                await supabase.storage.from('project007').remove([filePath]);
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
                                {(
                                    <div className="relative overflow-hidden h-[300px] rounded-xl">
                                        <img src={Link === "" ? UserIndex.image : Link} className="image w-full h-full" alt="" />
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
                                )}
                            </div>
                            <button onClick={handleSave} className="self-end bg-yellow-500 px-4 py-2 rounded-md text-white">
                                Saqlash
                            </button>
                        </div>
                    </div>
                )
            }

            <div>
                <Navbar />
                <Hero scrollToRef={cardSectionRef} />
                <h1 id="natija" className="text-center pt-20 text-3xl font-semibold text-[#000000]">-BITIRUVCHILAR-</h1>

                <div className="flex flex-col w-full items-center px-4 py-5 pt-10">
                    {
                        GetArray.length > 0 ? (
                            GetArray.sort((a, b) => a.id - b.id)
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className={`w-full sm:w-[620px] ${index % 2 === 0 ? "self-start ml-[40px]" : "self-end"} mb-10 `}
                                    >
                                        <div ref={cardSectionRef} className="flex flex-col sm:flex-row w-full max-w-[550px] h-[520px] sm:w-[620px] border border-[#E8E8E8] rounded-[12px] p-3 gap-3">
                                            <img
                                                className="w-full max-w-[280px] sm:w-[320px]sm:h-[450px] object-cover rounded-[12px]"
                                                src={item.image}
                                                alt="User"
                                            />
                                            <div className="flex flex-col text-center justify-between w-full max-w-[280px] relative">
                                                <GoPencil
                                                    className="absolute -right-1 top-1 text-yellow-600 cursor-pointer"
                                                    onClick={() => handleOpenSidebar(item.name)}
                                                    size={17}
                                                />
                                                <div className="flex flex-col gap-1 sm:h-[360px] h-auto mt-3 sm:mt-0 px-2">
                                                    <h2 className="text-2xl font-semibold capitalize">{item.name}</h2>

                                                    <span className="flex gap-2 justify-center text-[16px] pt-[10px]">
                                                        <h3><i>{item.age} yosh</i></h3> /
                                                        <h3><i>{item.job}</i></h3>
                                                    </span>

                                                    <p className="text-center sm:text-left break-words whitespace-pre-line text-[#717070]">
                                                        {item.discription}
                                                    </p>

                                                    <div className="mt-4 space-y-2 text-left sm:text-left sm:px-0 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <FaLocationDot className="text-[20px] flex self-start" />
                                                            <h1 className="text-[16px] font-bold">
                                                                Ish Joyi: <span className="font-normal">{item.workplace}</span>
                                                            </h1>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MdMonetizationOn className="text-[20px] flex self-start" />
                                                            <h1 className="font-bold">
                                                                Daromadi: <span className="font-normal">{item.price}</span>
                                                            </h1>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <TbTargetArrow className="text-[18px] flex self-start" />
                                                            <h1 className="font-bold">
                                                                Ishga kirdi: <span className="font-normal">{item.eddedData}</span>
                                                            </h1>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <HiMiniCalendarDateRange className="text-[22px] flex self-start" />
                                                            <h1 className="text-[16px] font-bold">
                                                                Ma'lumot olingan sana: <span className="font-normal">{item.Dateofemployment}</span>
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="w-[190px] h-[40px] text-[13px] font-normal leading-[32px] rounded-[24px] bg-[#FFC865] font-['Krona_One'] flex items-center justify-center gap-2 mt-6 mx-auto cursor-pointer">
                                                    Bog’lanish <FaArrowUp className="w-[20px] h-[20px] bg-white p-[3px] text-[12px] rounded-full" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <h1>Ma'lumot yuklanmoqda!</h1>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default App;