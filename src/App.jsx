import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue, push, remove } from "firebase/database";
import React, { useEffect, useState } from 'react'
import './App.css'
import { FiDownload } from "react-icons/fi";
import { uploadImage } from "./uploadImage";
import { Link } from "react-router";

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

  return (
    <div className='App container'>
      <div className="title mt-6">
        <h1 className="app-heading text-[30px]">Yangi o’quvchi qo’shish</h1>
        <Link to="/panel" className="button">
          Ma'lumotlarni ko'rish
        </Link>
      </div>
      <div className='Admin-panel '>
        <div className='modal'>
          <h1 className='modal-title text-[26px] mb-2'>Ma'lumotlar</h1>
          <form>
            <label className='label'>
              <span>Ismi</span>
              <input className='input' value={NewUser.name} type="text" name="fullName" placeholder='Ismi' onChange={(e) => setNewUser({ ...NewUser, name: e.target.value })} required />
            </label>
            <label className='label'>
              <span>Yoshi</span>
              <input className='input' value={NewUser.age} type="text" name="age" placeholder='Yoshi' onChange={(e) => setNewUser({ ...NewUser, age: e.target.value })} required />
            </label>
            <label className='label'>
              <span>Yunalish</span>
              <input className='input' value={NewUser.job} type="text" name='job' placeholder='Yunalish' onChange={(e) => setNewUser({ ...NewUser, job: e.target.value })} required />
            </label>
            <label className='label'>
              <span>Ish joyi</span>
              <input className='input' value={NewUser.workplace} type="text" name="work" placeholder='Ish joyi' onChange={(e) => setNewUser({ ...NewUser, workplace: e.target.value })} required />
            </label>
            <label className='label'>
              <span>Ishga joylashgan sana</span>
              <input className='input' value={NewUser.Dateofemployment} type="text" name="work" placeholder='Ishga joylashgan sana' onChange={(e) => setNewUser({ ...NewUser, Dateofemployment: e.target.value })} required />
            </label>
            <div className='modal-inner'>
              <label className='label w-'>
                <span>Daromadi</span>
                <input className='input input-number' value={NewUser.price} type="text" name="price" placeholder='Daromadi' onChange={(e) => setNewUser({ ...NewUser, price: e.target.value })} required />
              </label>
              <label className='label '>
                <span>Ishga joylashdi</span>
                <input className='input input-number' value={NewUser.eddedData} type="text" name="addedData" placeholder='Ishga joylashdi' onChange={(e) => setNewUser({ ...NewUser, eddedData: e.target.value })} required />
              </label>
            </div>
            <label className='label'>
              <span>Izoh</span>
              <textarea className='textarea' value={NewUser.discription} maxLength={200} name="Izoh" placeholder='Izoh' onChange={(e) => setNewUser({ ...NewUser, discription: e.target.value })} ></textarea>
            </label>
          </form>
        </div>
        <div className='addImg h-[800px]'>
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
        </div>
      </div>
    </div>
  )
}

export default App