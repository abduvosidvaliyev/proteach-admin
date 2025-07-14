import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue, push, remove } from "firebase/database";
import React, { useEffect, useState } from 'react'
import './App.css'
import { FiDownload } from "react-icons/fi";
import { uploadImage } from "./uploadImage";

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
    if (!NewUser.name || !NewUser.age || !NewUser.job || !NewUser.workplace || !NewUser.price || !NewUser.eddedData || !NewUser.image) {
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
      <h1 className="app-heading">Yangi o’quvchi qo’shish</h1>
      <div className='Admin-panel '>
        <div className='modal'>
          <h1 className='modal-title'>Ma'lumotlar</h1>
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
            <labe className='label'>
              <span>Ish joyi</span>
              <input className='input' value={NewUser.workplace} type="text" name="work" placeholder='Ish Joyi' onChange={(e) => setNewUser({ ...NewUser, workplace: e.target.value })} required />
            </labe>
            <div className='modal-inner'>
              <label className='label'>
                <span>Daromadi</span>
                <input className='input input-number' value={NewUser.price} type="text" name="price" placeholder='Daromadi' onChange={(e) => setNewUser({ ...NewUser, price: e.target.value })} required />
              </label>
              <label className='label'>
                <span>Ishga joylashdi</span>
                <input className='input input-number' value={NewUser.eddedData} type="text" name="addedData" placeholder='Ishga joylashdi' onChange={(e) => setNewUser({ ...NewUser, eddedData: e.target.value })} required />
              </label>
            </div>
            <label className='label'>
              <span>Izoh</span>
              <textarea className='textarea' value={NewUser.discription} maxLength={180} name="Izoh" placeholder='Izoh' onChange={(e) => setNewUser({ ...NewUser, discription: e.target.value })} ></textarea>
            </label>
          </form>
        </div>
        <div className='addImg'>
          <div>
            <h2>Rasm</h2>
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
                    onChange={(e) => { setNewUser({...NewUser, image: e.target.files[0]}), handleUrl(e) }}
                  />
                </>
              ) : (
                <img src={imageUrl} className="image" alt="" />
              )
            }
          </div>
          <div>
            <h2>Video</h2>
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




// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);

//   // Fayllar ro‘yxatini serverdan olish
//   const fetchFiles = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/files");
//       setFiles(res.data);
//     } catch (err) {
//       console.error("Fayllarni olishda xatolik:", err);
//     }
//   };

//   // Fayl yuklash
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       await axios.post("http://localhost:5000/upload", formData);
//       setFile(null); // inputni tozalash
//       fetchFiles(); // yangi ro‘yxatni yuklash
//     } catch (err) {
//       console.error("Yuklashda xatolik:", err);
//     }
//   };

//   // Fayl o‘chirish
//   const handleDelete = async (filename) => {
//     try {
//       await axios.delete(`http://localhost:5000/delete/${filename}`);
//       fetchFiles(); // ro‘yxatni yangilash
//     } catch (err) {
//       console.error("O‘chirishda xatolik:", err);
//     }
//   };

//   // Komponent yuklanganda fayllarni olish
//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   return (
//     <div className="container" style={{ maxWidth: "600px", margin: "50px auto" }}>
//       <h2>📤 Fayl yuklash (Storj)</h2>
//       <form onSubmit={handleUpload}>
//         <input
//           type="file"
//           onChange={(e) => setFile(e.target.files[0])}
//           required
//         />
//         <button type="submit">Yuklash</button>
//       </form>

//       <hr />

//       <h3>📁 Yuklangan fayllar:</h3>
//       <ul>
//         {files.map((filename, index) => (
//           <li key={index} style={{ marginBottom: "5px" }}>
//             {filename}
//             <button
//               onClick={() => handleDelete(filename)}
//               style={{ marginLeft: "10px", color: "red" }}
//             >
//               O‘chirish
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;
