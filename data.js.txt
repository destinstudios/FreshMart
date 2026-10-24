import { db, isFirebaseConfigured } from "./firebase.js";
let fs;
if (isFirebaseConfigured) fs = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");
const DEMO = {
  store: { name:"FreshMart", tagline:"Your Neighbourhood General Store", description:"Your local stop for everyday groceries, snacks and household essentials.", phone:"", whatsapp:"", address:"Add your store address in admin settings", hours:"Add opening hours in admin settings", mapsEmbedUrl:"" },
  categories: [
    {id:"groceries",name:"Groceries & Staples",icon:"🌾",active:true,order:1},{id:"snacks",name:"Snacks & Beverages",icon:"🍿",active:true,order:2},{id:"dairy",name:"Dairy Products",icon:"🥛",active:true,order:3},{id:"personal",name:"Personal Care",icon:"🧴",active:true,order:4},{id:"household",name:"Household Essentials",icon:"🧽",active:true,order:5},{id:"produce",name:"Fresh Produce",icon:"🥬",active:true,order:6}
  ],
  products: [
    {id:"demo-salt",name:"Tata Salt",price:20,unit:"packet",categoryId:"groceries",description:"Everyday table salt",imageUrl:"",isPopular:false,isActive:true,availabilityStatus:"In stock"},
    {id:"demo-milk",name:"Amul Milk",price:56,unit:"litre",categoryId:"dairy",description:"Milk",imageUrl:"",isPopular:true,isActive:true,availabilityStatus:"In stock"},
    {id:"demo-maggi",name:"Maggi Noodles",price:12,unit:"packet",categoryId:"snacks",description:"Instant noodles",imageUrl:"",isPopular:true,isActive:true,availabilityStatus:"In stock"},
    {id:"demo-oil",name:"Sunflower Oil",price:145,unit:"litre",categoryId:"groceries",description:"Cooking oil",imageUrl:"",isPopular:false,isActive:true,availabilityStatus:"In stock"},
    {id:"demo-biscuits",name:"Biscuits",price:10,unit:"packet",categoryId:"snacks",description:"Biscuits",imageUrl:"",isPopular:false,isActive:true,availabilityStatus:"In stock"},
    {id:"demo-shampoo",name:"Shampoo",price:85,unit:"bottle",categoryId:"personal",description:"Personal care",imageUrl:"",isPopular:false,isActive:true,availabilityStatus:"In stock"},
    {id:"demo-soap",name:"Bathing Soap",price:35,unit:"piece",categoryId:"personal",description:"Daily care",imageUrl:"",isPopular:false,isActive:true,availabilityStatus:"In stock"},
    {id:"demo-tomato",name:"Tomato",price:28,unit:"kg",categoryId:"produce",description:"Daily rate example",imageUrl:"",isPopular:false,isActive:true,availabilityStatus:"In stock"}
  ],
  rates: [
    {id:"demo-rate-tomato",productName:"Tomato",price:28,unit:"kg",previousPrice:null,isActive:true,updatedAt:null},
    {id:"demo-rate-onion",productName:"Onion",price:42,unit:"kg",previousPrice:null,isActive:true,updatedAt:null},
    {id:"demo-rate-potato",productName:"Potato",price:22,unit:"kg",previousPrice:null,isActive:true,updatedAt:null}
  ],
  pages: {heroHeading:"Your Neighbourhood General Store",heroDescription:"Daily essentials, popular products and updated prices — all in one place.",aboutText:"We help our neighbourhood find everyday essentials in one convenient local store.",footerDescription:"Your neighbourhood source for daily essentials."}
};
const clone = x => JSON.parse(JSON.stringify(x));
export const demoData = DEMO;
export async function list(collectionName, includeInactive=false) {
  if (!isFirebaseConfigured) return clone(DEMO[collectionName] || []);
  let queryRef = fs.collection(db, collectionName);
  // Public catalogue queries must match Firestore Rules; Rules are not post-query filters.
  if (!includeInactive && collectionName === "products") queryRef = fs.query(queryRef, fs.where("isActive", "==", true));
  if (!includeInactive && collectionName === "rates") queryRef = fs.query(queryRef, fs.where("isActive", "==", true));
  if (!includeInactive && collectionName === "categories") queryRef = fs.query(queryRef, fs.where("active", "==", true));
  const snap = await fs.getDocs(queryRef);
  let rows = snap.docs.map(d=>({id:d.id,...d.data()}));
  if (!includeInactive && ["products","categories","rates"].includes(collectionName)) rows=rows.filter(x=>x.isActive!==false && x.active!==false);
  return rows;
}
export async function getStore() {
  if (!isFirebaseConfigured) return clone(DEMO.store);
  const snap=await fs.getDoc(fs.doc(db,"settings","store"));
  return snap.exists()?snap.data():clone(DEMO.store);
}
export async function getPages() {
  if (!isFirebaseConfigured) return clone(DEMO.pages);
  const snap=await fs.getDoc(fs.doc(db,"settings","pages"));
  return snap.exists()?snap.data():clone(DEMO.pages);
}
export async function saveRecord(collectionName,id,data) {
  if (!isFirebaseConfigured) throw new Error("Demo mode is read-only. Configure Firebase to save changes.");
  const ref=id?fs.doc(db,collectionName,id):fs.doc(fs.collection(db,collectionName));
  await fs.setDoc(ref,{...data,updatedAt:fs.serverTimestamp()}, {merge:true}); return ref.id;
}
export async function deleteRecord(collectionName,id) {
  if (!isFirebaseConfigured) throw new Error("Demo mode is read-only. Configure Firebase to delete records.");
  await fs.deleteDoc(fs.doc(db,collectionName,id));
}
export async function saveSetting(id,data) {
  if (!isFirebaseConfigured) throw new Error("Demo mode is read-only. Configure Firebase to save changes.");
  await fs.setDoc(fs.doc(db,"settings",id),{...data,updatedAt:fs.serverTimestamp()},{merge:true});
}
export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(price)||0);
}
export function safeDate(value) {
  if (!value) return "Demo data";
  try { const d=value.toDate?value.toDate():new Date(value); return Number.isNaN(d.getTime())?"Date unavailable":d.toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}); } catch { return "Date unavailable"; }
}
