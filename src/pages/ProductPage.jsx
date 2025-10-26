// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { API } from '../App';
// import { toast } from 'react-toastify';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!id) {
//       setError('No product ID provided');
//       setLoading(false);
//       return;
//     }
    
//     const fetchProduct = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         // Try the public product endpoint
//         const res = await axios.get(`${API}/api/pb/user/product/${id}`);
        
//         if (res.data) {
//           console.log('Product loaded successfully:', id);
//           setProduct(res.data);
          
//           // Load related products
//           const relatedRes = await axios.get(`${API}/api/user/products`);
//           const productsData = relatedRes.data;
//           const productsArray = Array.isArray(productsData) ? productsData : 
//                               (productsData.products || []);
//           setProducts(productsArray);
//         } else {
//           setError('Product not found');
//         }
//       } catch (err) {
//         console.error('Failed to load product:', err);
//         setError(err.response?.data?.message || 'Could not load the product');
//         toast.error('Error loading product details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//     (async () => {
//       try {
//         const res = await axios.get(final);
//         setProduct(res.data);
//       } catch (err) {
//         console.error('Error loading product', final, err?.response?.status, err?.response?.data || err.message);
//         // try fallback path (non-pb) in case backend routes differ
//         try {
//           const alt = `${API}/api/user/product/${id}`;
//           const r2 = await axios.get(alt);
//           setProduct(r2.data);
//         } catch (err2) {
//           console.error('Fallback product fetch failed', err2?.response?.status, err2?.response?.data || err2.message);
//           setProduct(null);
//         }
//       }

//       // Related products: fetch public products (non-pb)
//       try {
//         const rel = await axios.get(`${API}/api/user/products`);
//         const arr = Array.isArray(rel.data) ? rel.data : (rel.data.products || []);
//         setProducts(arr);
//       } catch (err) {
//         console.error('Error loading related products', err?.response?.status, err?.response?.data || err.message);
//         setProducts([]);
//       }
//     })();
//   }, [slug]);

//   // slider index for product images
//   const [currentIndex, setCurrentIndex] = useState(0);
//   useEffect(() => {
//     // reset slider when product changes
//     setCurrentIndex(0);
//   }, [product]);

//   const handleNumber = (e) => {
//     if (!show) {
//       e.target.textContent = product?.number || 'N/A';
//       e.target.disabled = false;
//       setShow(true);
//     } else {
//       e.target.textContent = 'Show phone number';
//       e.target.disabled = false;
//       setShow(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4">
//         <div className="text-center py-10">
//           <div className="mb-4">Loading product details...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="container mx-auto px-4">
//         <div className="text-center py-10">
//           <div className="text-red-600 mb-4">{error || 'Product not found'}</div>
//           <Link to="/" className="text-blue-600 hover:underline">
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   // Related products: same category, exclude current product
//   const related = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);

//   return (
//     <div className="bg-gray-50 min-h-screen pb-10">
//       <div className="container mx-auto flex flex-col lg:flex-row gap-8 pt-8">
    
//         <div className="flex-1">
           
//           {/* Image slider */}
//           <div className="bg-white rounded-lg shadow p-4 mb-4">
//             <div className="relative flex items-center justify-center">
//               <button
//                 onClick={() => setCurrentIndex(i => (i - 1 + (product.images?.length || 1)) % (product.images?.length || 1))}
//                 className="absolute left-2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white"
//                 aria-label="previous"
//               >
//                 ‹
//               </button>

//               <div className="w-full flex items-center justify-center">
//                 <img
//                   src={
//                     product.images && product.images.length
//                       ? `${API.replace("/api", "")}/${product.images[currentIndex]}`
//                       : "/no-image.jpg"
//                   }
//                   alt={product.title}
//                   className="h-96 object-contain rounded"
//                 />
//               </div>

//               <button
//                 onClick={() => setCurrentIndex(i => (i + 1) % (product.images?.length || 1))}
//                 className="absolute right-2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white"
//                 aria-label="next"
//               >
//                 ›
//               </button>
//             </div>

//             {/* Thumbnails */}
//             {product.images && product.images.length > 0 && (
//               <div className="mt-4 flex items-center gap-2 overflow-x-auto py-2">
//                 {product.images.map((img, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentIndex(idx)}
//                     className={`flex-none rounded overflow-hidden border ${idx === currentIndex ? 'border-blue-600' : 'border-gray-200'}`}
//                     style={{ width: 96, height: 64 }}
//                   >
//                     <img src={`${API.replace("/api", "")}/${img}`} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
           
//           <div className="bg-white rounded-lg shadow p-6 mb-4">
//             <p className="text-2xl font-bold text-blue-700 mb-2">Rs {product.price}</p>
//             <h1 className="text-xl font-semibold mb-2">{product.title}</h1>
//             <div className="flex items-center text-gray-500 text-sm mb-2">
//               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z" />
//               </svg>
//               {product.location}
//             </div>
//             <div className="text-xs text-gray-400">{product.time}</div>
//           </div>
           
//           <div className="bg-white rounded-lg shadow p-6 mb-4">
//             <h2 className="text-lg font-bold mb-3">Details</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
//               <div className="font-semibold text-gray-600">Category:</div>
//               <div className="col-span-1 md:col-span-2">{product.category}</div>
//               <div className="font-semibold text-gray-600">Location:</div>
//               <div className="col-span-1 md:col-span-2">{product.location}</div>
//               <div className="font-semibold text-gray-600">Ad ID:</div>
//               <div className="col-span-1 md:col-span-2">{product._id}</div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-bold mb-3">Description</h2>
//             <p className="text-gray-700">
//               {product.title} <br />
//               Location: {product.location} <br />
//               {product.description}
//             </p>
//           </div>
//         </div>
         
//         <div className="w-full lg:w-80 flex-shrink-0">
//           <div className="bg-white rounded-lg shadow p-6 mb-4">
//             <div className="flex items-center mb-4">
//               <img
//                 src="https://avatars.githubusercontent.com/u/1?v=4"
//                 alt="User"
//                 className="w-12 h-12 rounded-full border mr-3"
//               />
//               <div>
//                 <div className="font-semibold">Posted by {product.Posted}</div>
//                 <div className="text-xs text-gray-500">Member Since 2025</div>
//               </div>
//             </div>
//             <button className="w-full bg-green-600 text-white py-2 rounded font-semibold mb-2 hover:bg-green-700" onClick={(e) => handleNumber(e)}>
//               Show phone number
//             </button>
//             <button
//             className="w-full border py-2 rounded font-semibold mb-2 hover:bg-gray-100"
//             onClick={() =>
//               navigate("/messages", {
//                 state: { product },
//               })
//             }
//           >
//             Chat
//           </button>
//             <div className="text-xs text-gray-400 mt-2">Ad ID: {product._id}</div>
//           </div>
//         </div>
//       </div>

       
//       <div className="container mx-auto mt-10">
//         <h2 className="text-lg font-bold mb-4">Related ads</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {related.map(r => (
//             <Link
//               key={r._id}
//               to={`/product/${r._id}`}
//               className="block"
//             >
//               <div className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition">
//                 <img
//                   src={
//                     r.images?.[0]
//                       ? `${API.replace("/api", "")}/${r.images[0]}`
//                       : "/no-image.jpg"
//                   }
//                   className="h-40 w-full object-cover rounded mb-2"
//                 />
//                 <p className="text-blue-700 font-bold">Rs {r.price}</p>
//                 <div className="font-semibold">{r.title}</div>
//                 <div className="text-xs text-gray-500">{r.location}</div>
//                 <div className="text-xs text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
    
//       <div className="container mx-auto mt-10">
//         <h2 className="text-lg font-bold mb-2">Your safety matters to us!</h2>
//         <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
//           <li>Only meet in public / crowded places such as metro stations and malls.</li>
//           <li>Never go alone to meet a buyer / seller; always take someone with you.</li>
//           <li>Check and inspect the product properly before purchasing it.</li>
//           <li>Never pay / transfer any money in advance before inspecting the product.</li>
//         </ul>
//       </div>
      
//     </div>
//   )
// }

// export default ProductDetails


import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch single product
        const res = await axios.get(`${API}/api/products/${id}`);
        setProduct(res.data);

        // Fetch related products
        const relatedRes = await axios.get(`${API}/api/user/products`);
        const data = Array.isArray(relatedRes.data)
          ? relatedRes.data
          : relatedRes.data.products || [];
        setProducts(data);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err.response?.data?.message || 'Could not load product');
        toast.error('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [product]);

  const handleNumber = (e) => {
    if (!show) {
      e.target.textContent = product?.number || 'N/A';
      setShow(true);
    } else {
      e.target.textContent = 'Show phone number';
      setShow(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 text-center py-10">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 text-center py-10">
        <div className="text-red-600 mb-4">{error || 'Product not found'}</div>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 pt-8">

        {/* Left side (Images + Details) */}
        <div className="flex-1">
          {/* Image Slider */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="relative flex items-center justify-center">
              <button
                onClick={() =>
                  setCurrentIndex(i =>
                    (i - 1 + (product.images?.length || 1)) %
                    (product.images?.length || 1)
                  )
                }
                className="absolute left-2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              >
                ‹
              </button>

              <img
                src={
                  product.images?.length
                    ? `${API.replace('/api', '')}/${product.images[currentIndex]}`
                    : '/no-image.jpg'
                }
                alt={product.title}
                className="h-96 object-contain rounded"
              />

              <button
                onClick={() =>
                  setCurrentIndex(i =>
                    (i + 1) % (product.images?.length || 1)
                  )
                }
                className="absolute right-2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              >
                ›
              </button>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`rounded overflow-hidden border ${
                      idx === currentIndex ? 'border-blue-600' : 'border-gray-200'
                    }`}
                    style={{ width: 96, height: 64 }}
                  >
                    <img
                      src={`${API.replace('/api', '')}/${img}`}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <p className="text-2xl font-bold text-blue-700 mb-2">Rs {product.price}</p>
            <h1 className="text-xl font-semibold mb-2">{product.title}</h1>
            <div className="text-gray-500 text-sm mb-2">{product.location}</div>
            <div className="text-xs text-gray-400">{product.time}</div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h2 className="text-lg font-bold mb-3">Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div className="font-semibold text-gray-600">Category:</div>
              <div className="font-semibold text-gray-600">Ad ID:</div>
              <div className="font-semibold text-gray-600">Location:</div>
              <div>{product.category}</div>
               <div>{product._id}</div>
              <div>{product.location}</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-3">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>

        {/* Right Side (Seller Info) */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <div className="flex items-center mb-4">
              <img
                src="https://avatars.githubusercontent.com/u/1?v=4"
                alt="User"
                className="w-12 h-12 rounded-full border mr-3"
              />
              <div>
                <div className="font-semibold">Posted by {product.Posted}</div>
                <div className="text-xs text-gray-500">Member Since 2025</div>
              </div>
            </div>
            <button
              className="w-full bg-green-600 text-white py-2 rounded font-semibold mb-2 hover:bg-green-700"
              onClick={handleNumber}
            >
              Show phone number
            </button>
            <button
              className="w-full border py-2 rounded font-semibold mb-2 hover:bg-gray-100"
              onClick={() => navigate('/messages', { state: { product } })}
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="container mx-auto mt-10">
        <h2 className="text-lg font-bold mb-4">Related ads</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {related.map(r => (
            <Link key={r._id} to={`/product/${r._id}`} className="block">
              <div className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition">
                <img
                  src={
                    r.images?.[0]
                      ? `${API.replace('/api', '')}/${r.images[0]}`
                      : '/no-image.jpg'
                  }
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <p className="text-blue-700 font-bold">Rs {r.price}</p>
                <div className="font-semibold">{r.title}</div>
                <div className="text-xs text-gray-500">{r.location}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
