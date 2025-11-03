import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useEffect, useState } from 'react'
import { uploadImage } from "./uploadImage";
import { Link } from "react-router";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuUpload, LuX } from "react-icons/lu";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const App = () => {

  const [GetUsers, setGetUsers] = useState([])
  const [NewUser, setNewUser] = useState({
    name: "",
    age: "",
    job: "",
    workplace: "",
    price: "",
    eddedData: "",
    discription: "",
    Dateofemployment: "",
    image: ""
  })
  const [loader, setloader] = useState(false)
  const [imageUrl, setimageUrl] = useState("")

  useEffect(() => {
    const userRef = ref(database, 'Users');
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      setGetUsers(Object.values(data || {}));
    });
  }, [])


  const handleAddUser = async () => {
    if (!NewUser.name || !NewUser.age || !NewUser.job || !NewUser.workplace || !NewUser.price || !NewUser.eddedData || !NewUser.image || !NewUser.Dateofemployment) {
      alert("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }
    setloader(true)
    const userRef = ref(database, `Users/${NewUser.name}`);
    try {
      // Rasmni SupaBase ga yuklash
      const newImageUrl = await uploadImage(NewUser.image);

      // Rasm URL ni Firebase Realtime Database ga saqlash
      await set(userRef, { ...NewUser, image: newImageUrl, id: GetUsers.length + 1 })
        .then(() => {
          setNewUser({
            name: "",
            age: "",
            job: "",
            workplace: "",
            price: "",
            eddedData: "",
            discription: "",
            Dateofemployment: "",
            image: ""
          });
          setimageUrl("");
          setloader(false)
          alert("Foydalanuvchi muvaffaqiyatli qo'shildi!");
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
      alert("Rasm yuklashda xatolik yuz berdi.");
    }
  }

  const handleUrl = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file);
      setimageUrl(url);
    }
  }

  const clear = () => {
    setNewUser({
      name: "",
      age: "",
      job: "",
      workplace: "",
      price: "",
      eddedData: "",
      discription: "",
      Dateofemployment: "",
      image: ""
    });
    setimageUrl("");
  }


  return (
    <div
      style={{ background: "linear-gradient(125deg, #152034, #1c253c, #152034)", display: "flex", justifyContent: "center", padding: "0 40px" }}
    >
      <div className="w-[850px] flex flex-col items-start gap-7 py-10 text-[#b5c2d2]">
        <div className="w-full flex justify-between items-center">
          <h1 className="flex flex-col gap-1 text-white text-[35px] leading-[30px] font-bold">
            Pro-Teach
            <span className="text-[#a2b5cf] text-[16px] font-normal">
              O'quvchi ma'lumotlarini qo'shish
            </span>
          </h1>
          <Link
            to="/panel"
            style={{ background: "linear-gradient(45deg, #00b9bd, #2981ff)" }}
            className="flex items-center gap-1 text-[13px] rounded-md px-[15px] py-[8px] text-white"
          >
            <MdOutlineRemoveRedEye size={16} />
            <span>
              Ma'lumotlarni ko'rish
            </span>
          </Link>
        </div>
        <div className="w-full flex flex-col gap-5 rounded-xl p-[25px] border-solid border-2 border-[#27354a]">
          <h3 className="text-xl text-white font-semibold">
            Shaxsiy ma'lumotlar
          </h3>
          <div className="w-full grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-x-4 gap-y-3">
            <label className="flex flex-col gap-1 justify-center">
              <span className="text-sm">Ismi</span>
              <input
                className="bg-[#263449] rounded-lg placeholder:text-[#55657e] text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056]"
                value={NewUser.name}
                type="text"
                name="fullName"
                placeholder='Ismi'
                onChange={(e) => setNewUser({ ...NewUser, name: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1 justify-center">
              <span className="text-sm">Yoshi</span>
              <input
                className="bg-[#263449] rounded-lg placeholder:text-[#55657e] text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056]"
                value={NewUser.age}
                type="text"
                name="age"
                placeholder='Yoshi'
                onChange={(e) => setNewUser({ ...NewUser, age: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1 justify-center">
              <span className="text-sm">Yo'nalish</span>
              <input
                className="bg-[#263449] rounded-lg placeholder:text-[#55657e] text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056]"
                value={NewUser.job}
                type="text"
                name='job'
                placeholder="Yo'nalish"
                onChange={(e) => setNewUser({ ...NewUser, job: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1 justify-center">
              <span className="text-sm">Ish joyi</span>
              <input
                className="bg-[#263449] rounded-lg placeholder:text-[#55657e] text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056]"
                value={NewUser.workplace}
                type="text"
                name="work"
                placeholder='Ish joyi'
                onChange={(e) => setNewUser({ ...NewUser, workplace: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1 justify-center">
              <span className="text-sm">Ma'lumot olingan sana</span>
              <input
                className="bg-[#263449] rounded-lg sm:w-full text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056]"
                value={NewUser.Dateofemployment}
                type="date"
                name="work"
                placeholder='Ishga joylashgan sana'
                onChange={(e) => setNewUser({ ...NewUser, Dateofemployment: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1 justify-center">
              <span className="text-sm">Daromadi</span>
              <input
                className="bg-[#263449] rounded-lg placeholder:text-[#55657e] text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056]"
                value={NewUser.price}
                type="text"
                name="price"
                placeholder='Daromadi'
                onChange={(e) => setNewUser({ ...NewUser, price: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1 justify-center md:col-span-1 lg:col-span-2 xl:col-span-2">
              <span className="text-sm">Ishga joylashgan sana</span>
              <input
                className="bg-[#263449] rounded-lg sm:w-full text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056]"
                value={NewUser.eddedData}
                type="date"
                name="addedData"
                placeholder='Ishga joylashdi'
                onChange={(e) => setNewUser({ ...NewUser, eddedData: e.target.value })}
                required
              />
            </label>
            <label className="flex flex-col gap-1 justify-center md:col-span-1 lg:col-span-2 xl:col-span-2">
              <span className="text-sm">Izoh</span>
              <textarea
                className="h-[80px] bg-[#263449] rounded-lg placeholder:text-[#55657e] text-white px-[10px] py-[6px] border-solid border-2 border-[#324056] text-[14px] outline-none focus:ring-2 ring-[#324056] resize-none"
                value={NewUser.discription}
                maxLength={200}
                name="Izoh"
                placeholder='Izoh'
                onChange={(e) => setNewUser({ ...NewUser, discription: e.target.value })}
              >
              </textarea>
            </label>
          </div>
        </div>
        <div className="w-full flex flex-col gap-5 rounded-xl p-[25px] border-solid border-2 border-[#27354a]">
          <h3 className="text-xl text-white font-semibold">
            Media fayllar
          </h3>
          <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-6">

            {/* rasm yuklash */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Rasm</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { setNewUser({ ...NewUser, image: e.target.files[0] }), handleUrl(e) }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-slate-700/30 transition-all"
              >
                {imageUrl ?
                  <div className="relative w-full h-full">
                    <img
                      src={imageUrl || "/vite.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                    >
                      <LuX size={16} onClick={(e) => (e.stopPropagation, setimageUrl(""))} />
                    </button>
                  </div>
                  : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <LuUpload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-400">Rasm yuklash</span>
                    </div>
                  )}
              </label>
            </div>

            {/* video yuklash */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Video</label>
              <input type="file" accept="video/*" className="hidden" id="video-upload" />
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-cyan-500 hover:bg-slate-700/30 transition-all"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <LuUpload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-400">Video yuklash</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-end gap-3">
          <button
            onClick={clear}
            className="px-[12px] py-[8px] text-[14px] border-solid border-2 border-[#30354a] rounded-lg transition hover:bg-slate-800"
          >
            Bekor qilish
          </button>
          <button
            onClick={handleAddUser}
            style={{ background: "linear-gradient(45deg, #00b9bd, #2981ff)" }}
            className="px-[15px] py-[8px] text-[14px] text-white rounded-lg"
            disabled={loader}
          >
            {
              !loader ? "Qo'shish" : "Loading..."
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default App


{/* <div className='modal w-[700px]'>
  <h1 className='modal-title text-[26px] mb-2'>Ma'lumotlar</h1>
  <form>f
    <label className='label'>
      <span>Ismi</span>
      <input className='input' value={NewUser.name} type="text" name="fullName" placeholder='Ismi' onChange={(e) => setNewUser({ ...NewUser, name: e.target.value })} required />
    </label>
    <label className='label'>
      <span>Yoshi</span>
      <input className='input' value={NewUser.age} type="text" name="age" placeholder='Yoshi' onChange={(e) => setNewUser({ ...NewUser, age: e.target.value })} required />
    </label>
    <label className='label'>
      <span>Yo'nalish</span>
      <input className='input' value={NewUser.job} type="text" name='job' placeholder="Yo'nalish" onChange={(e) => setNewUser({ ...NewUser, job: e.target.value })} required />
    </label>
    <label className='label'>
      <span>Ish joyi</span>
      <input className='input' value={NewUser.workplace} type="text" name="work" placeholder='Ish joyi' onChange={(e) => setNewUser({ ...NewUser, workplace: e.target.value })} required />
    </label>
    <label className='label'>
      <span>Ma'lumot olingan sana</span>
      <input className='input' value={NewUser.Dateofemployment} type="text" name="work" placeholder='Ishga joylashgan sana' onChange={(e) => setNewUser({ ...NewUser, Dateofemployment: e.target.value })} required />
    </label>
    < className='modal-inner'>
      <label className='label w-'>
        <span>Daromadi</span>
        <input className='input input-number' value={NewUser.price} type="text" name="price" placeholder='Daromadi' onChange={(e) => setNewUser({ ...NewUser, price: e.target.value })} required />
      </label>
      <label className='label '>
        <span>Ishga joylashgan sana</span>
        <input className='input input-number' value={NewUser.eddedData} type="text" name="addedData" placeholder='Ishga joylashdi' onChange={(e) => setNewUser({ ...NewUser, eddedData: e.target.value })} required />
      </label>
    <label className='label'>
      <span>Izoh</span>
      <textarea className='textarea' value={NewUser.discription} maxLength={200} name="Izoh" placeholder='Izoh' onChange={(e) => setNewUser({ ...NewUser, discription: e.target.value })} ></textarea>
    </label>
  </form>
</div>
<div className='addImg h-[800px] w-[750px]'>
  <div>
    <h2 className="text-[26px] font-semibold">Rasm</h2>
    {
      imageUrl === "" ? (
        <>
          <label htmlFor="file" >
            <div className="uploadImage">
              <FiDownload size={28} />
              Rasm Yuklash
            </div>
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => { setNewUser({ ...NewUser, image: e.target.files[0] }), handleUrl(e) }}
          />
        </>
      ) : (
        <img src={imageUrl} className="image" alt="" />
      )
    }
  </div>
  <div>
    <h2 className="text-[26px] font-semibold">Video</h2>
    <label htmlFor="file" >
      <div className="uploadVideo">
        <FiDownload size={28} />
        Video yuklash
      </div>
    </label>
    <input
      id="file"
      type="file"
      className="hidden"
      onChange={(e) => handleFileUpload(e)}
    />
  </div>
  <button className="add-user" onClick={handleAddUser}>Qo’shish</button>
</div> */}