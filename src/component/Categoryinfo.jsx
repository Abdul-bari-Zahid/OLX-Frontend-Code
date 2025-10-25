
import React from 'react'
import Mobiles from '../imagesHome/mobile.jpeg'
import Vehicles from '../imagesHome/images.webp'
import PropertyforSale from '../imagesHome/propertyforsale.jpeg'
import PropertyforRent from '../imagesHome/propertyforrent.png'
import ElectronicsHomeAppliances from '../imagesHome/electronic.webp'
import Bikes from '../imagesHome/bike.jpeg'
import BusinessIndustrialAgriculture from '../imagesHome/bussiness.jpeg'
import job from '../imagesHome/job.jpeg'
import Animals from '../imagesHome/cat.jpeg'
import Kids from '../imagesHome/kid.webp'
import Books from '../imagesHome/book.jpeg'
import Beauty from '../imagesHome/beauty.jpeg'
import Furniture from '../imagesHome/ferniture.jpeg'
import Fashion from '../imagesHome/fashion.jpeg'
const categories = [
  { title: "Mobiles", imageURL: Mobiles },
  { title: "Vehicles", imageURL: Vehicles },
  { title: "Property Sale", imageURL: PropertyforSale },
  { title: "Property Rent", imageURL: PropertyforRent },
  { title: "Electronics", imageURL: ElectronicsHomeAppliances },
  { title: "Bikes", imageURL: Bikes },
  { title: "Business & Agriculture", imageURL: BusinessIndustrialAgriculture },
  { title: "Jobs", imageURL: job },
  { title: "Animals", imageURL: Animals },
  { title: "Kids", imageURL: Kids },
  { title: "Books", imageURL: Books },
  { title: "Beauty", imageURL: Beauty },
  { title: "Furniture", imageURL: Furniture },
  { title: "Fashion", imageURL: Fashion },
]


const CategorySection = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-[-20px] mb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
          >
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-sky-100 mb-4 overflow-hidden border-2 border-sky-200 group-hover:scale-110 transition-transform duration-300">
              <img
                src={category.imageURL}
                alt={category.title}
                className="object-cover w-16 h-16"
              />
            </div>
            <p className="text-base font-semibold text-gray-800 mb-1 text-center group-hover:text-blue-600 transition-colors duration-200">
              {category.title}
            </p>
            <button className="text-xs text-blue-500 font-medium underline hover:text-blue-700 transition-colors duration-200">
              View All
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategorySection